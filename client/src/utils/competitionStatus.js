// Competition status, phase and countdown helpers shared by the dashboard
// and the competition header. Pure functions: pass `now` in tests.

const DAY_MS = 24 * 60 * 60 * 1000;

/** "before" | "running" | "ended" by the competition's start and end time. */
export function competitionPhase(competition, now = new Date()) {
  const start = new Date(competition.start_date);
  const end = new Date(competition.end_date);
  if (now < start) return "before";
  if (now <= end) return "running";
  return "ended";
}

/**
 * Status shown as a chip. `color` is a theme colour: the step colours
 * signing / weighing / results, or "grey" for an unfinished competition.
 * @returns {{ key: string, label: string, color: string }}
 */
export function competitionStatus(competition, now = new Date()) {
  const status = (key, color) => ({ key, label: `comp-status.${key}`, color });
  if (competition.isFinished || competition.state === "ended") {
    return status("finished", "results");
  }
  if (competition.state === "weighting") return status("weighing", "weighing");
  if (competition.state === "all-finished") {
    return status("all-returned", "weighing");
  }
  const phase = competitionPhase(competition, now);
  if (competition.state === "not-finished" || phase === "ended") {
    return status("unfinished", "grey");
  }
  if (phase === "running") return status("running", "weighing");
  return status("upcoming", "signing");
}

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * The competition to show as "today" on the dashboard: one that is running,
 * or one that starts or ends today and isn't finished (weighing often goes
 * on after the end time). Running ones and ones being weighed come first.
 */
export function pickTodaysCompetition(competitions, now = new Date()) {
  const rank = (c) => {
    if (competitionPhase(c, now) === "running") return 0;
    if (c.state === "weighting" || c.state === "all-finished") return 1;
    return 2;
  };
  const candidates = (competitions || []).filter((c) => {
    if (c.isFinished || c.state === "ended") return false;
    const start = new Date(c.start_date);
    const end = new Date(c.end_date);
    return (
      competitionPhase(c, now) === "running" ||
      sameDay(start, now) ||
      sameDay(end, now)
    );
  });
  candidates.sort(
    (a, b) =>
      rank(a) - rank(b) || new Date(a.start_date) - new Date(b.start_date),
  );
  return candidates[0] ?? null;
}

/** The next competition that hasn't started yet, or null. */
export function nextCompetition(competitions, now = new Date()) {
  return (
    (competitions || [])
      .filter((c) => new Date(c.start_date) > now)
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))[0] ??
    null
  );
}

/**
 * Countdown text: "1:42" (h:mm), or "3 pv 4:05" when over a day.
 * Rounds up to the next minute so "0:00" only shows when time is up.
 */
export function formatRemaining(ms, dayUnit = "pv") {
  const minutes = Math.max(0, Math.ceil(ms / 60000));
  const days = Math.floor(minutes / (DAY_MS / 60000));
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = String(minutes % 60).padStart(2, "0");
  return days ? `${days} ${dayUnit} ${hours}:${mins}` : `${hours}:${mins}`;
}

/**
 * What the countdown shows for a competition at `now`.
 * @returns {{ phase, labelKey, text }} text is empty once it has ended
 */
export function competitionClock(competition, now = new Date(), dayUnit) {
  const phase = competitionPhase(competition, now);
  if (phase === "before") {
    return {
      phase,
      labelKey: "timer.to-start",
      text: formatRemaining(new Date(competition.start_date) - now, dayUnit),
    };
  }
  if (phase === "running") {
    return {
      phase,
      labelKey: "timer.comp-left",
      text: formatRemaining(new Date(competition.end_date) - now, dayUnit),
    };
  }
  return { phase, labelKey: "timer.comp-ended", text: "" };
}
