// Chart.js configurations for the statistics charts. Pure: data in, a
// { type, data, options } object out. Colours come from `palette`
// (see useChartPalette) so light and dark mode each get their own steps.
//
// Mark rules: thin bars with 4 px rounded ends, a 2 px surface-coloured gap
// between stacked segments, 2 px lines with 8 px markers, quiet grid lines.

const fmt = (value, lang, digits = 0) =>
  Number(value).toLocaleString(lang, { maximumFractionDigits: digits });

const BAR = { borderRadius: 4, borderSkipped: "start", maxBarThickness: 26 };

function stackedSegment(color, palette) {
  return {
    backgroundColor: color,
    borderColor: palette.surface,
    borderWidth: 2,
    borderSkipped: false,
    maxBarThickness: 26,
  };
}

/** Points per species as horizontal bars, weight and multiplier in the tooltip. */
export function speciesChart(species, { palette, t, lang }) {
  return {
    type: "bar",
    data: {
      labels: species.map((s) => `${s.name} ×${fmt(s.multiplier, lang, 2)}`),
      datasets: [
        {
          label: t("points"),
          data: species.map((s) => s.points),
          backgroundColor: species.map((s) => s.color || palette.primary),
          ...BAR,
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          title: { display: true, text: t("points") },
        },
        y: { grid: { display: false } },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const s = species[ctx.dataIndex];
              return `${fmt(s.points, lang)} p · ${fmt(s.weight / 1000, lang, 2)} kg`;
            },
          },
        },
      },
    },
  };
}

/** Top boats as horizontal stacked bars: points by species. */
export function topBoatsChart({ boats, species }, { palette, t, lang }) {
  return {
    type: "bar",
    data: {
      labels: boats.map((b) => b.label),
      datasets: species.map((s) => ({
        label: s.name,
        data: s.data,
        ...stackedSegment(s.color || palette.primary, palette),
      })),
    },
    options: {
      indexAxis: "y",
      scales: {
        x: {
          stacked: true,
          beginAtZero: true,
          title: { display: true, text: t("points") },
        },
        y: { stacked: true, grid: { display: false } },
      },
      plugins: {
        legend: { position: "top", labels: { boxWidth: 12, boxHeight: 12 } },
        tooltip: {
          mode: "index",
          axis: "y",
          intersect: false,
          filter: (item) => item.raw > 0,
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${fmt(ctx.raw, lang)} p`,
            footer: (items) =>
              items.length
                ? `${t("total-big")}: ${fmt(boats[items[0].dataIndex].total, lang)} p`
                : "",
          },
        },
      },
    },
  };
}

/** How many boats scored how much; boats without a catch in their own bar. */
export function pointsSpreadChart(bins, { palette, t, lang }) {
  return {
    type: "bar",
    data: {
      labels: bins.map((b) =>
        b.to === 0
          ? t("stats-page.no-catch")
          : `${fmt(b.from, lang)}–${fmt(b.to, lang)}`,
      ),
      datasets: [
        {
          label: t("stats-page.boats"),
          data: bins.map((b) => b.count),
          // the "no catch" bar is grey: it is not a points range
          backgroundColor: bins.map((b) =>
            b.to === 0 ? palette.muted : palette.primary,
          ),
          ...BAR,
          maxBarThickness: 48,
        },
      ],
    },
    options: {
      scales: {
        x: {
          grid: { display: false },
          title: { display: true, text: t("points") },
        },
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
          title: { display: true, text: t("stats-page.boats") },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.raw} ${t("stats-page.boats")}`,
          },
        },
      },
    },
  };
}

/** Every biggest-fish weight as a dot on its species' row; the record is larger. */
export function biggestFishChart(groups, { palette, t, lang }) {
  const names = groups.map((g) => g.name);
  return {
    type: "scatter",
    data: {
      datasets: groups.map((g) => ({
        label: g.name,
        data: g.fishes.map((f) => ({ x: f.weight, y: g.name, fish: f })),
        backgroundColor: g.color || palette.primary,
        borderColor: palette.surface,
        borderWidth: 2,
        pointRadius: g.fishes.map((f) => (f.record ? 8 : 5)),
        pointHoverRadius: g.fishes.map((f) => (f.record ? 10 : 7)),
        // a bigger hit area than the dot
        pointHitRadius: 10,
      })),
    },
    options: {
      scales: {
        x: {
          beginAtZero: true,
          title: { display: true, text: `${t("weight")} (g)` },
        },
        y: {
          type: "category",
          labels: names,
          offset: true,
          grid: { display: false },
        },
      },
      plugins: {
        // the species name is on the axis: no legend needed
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const f = ctx.raw.fish;
              const record = f.record ? ` · ${t("stats-page.record")}` : "";
              return `${fmt(f.weight, lang)} g · ${f.captain_name} (${f.boat_number})${record}`;
            },
          },
        },
      },
    },
  };
}

/** Cumulative kilograms over the day, on a real time axis. */
export function catchTimelineChart(points, { palette, t, lang }) {
  const time = (ms) =>
    new Date(ms).toLocaleTimeString(lang, {
      hour: "2-digit",
      minute: "2-digit",
    });
  return {
    type: "line",
    data: {
      datasets: [
        {
          label: t("stats-page.catch-so-far"),
          data: points.map((p) => ({
            x: p.time.getTime(),
            y: p.kg,
            boats: p.boats,
          })),
          borderColor: palette.primary,
          backgroundColor: palette.primary,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHitRadius: 10,
          stepped: "before",
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "linear",
          ticks: { callback: (value) => time(value), maxTicksLimit: 8 },
          title: { display: true, text: t("stats-page.time") },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: "kg" },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => time(items[0].raw.x),
            label: (ctx) =>
              `${fmt(ctx.raw.y, lang, 2)} kg · ${ctx.raw.boats} ${t("stats-page.boats")}`,
          },
        },
      },
    },
  };
}

/** Running cup points of the top boats, one line each. */
export function standingsRaceChart({ labels, boats }, { palette, lang }) {
  return {
    type: "line",
    data: {
      labels,
      datasets: boats.map((b, i) => ({
        label: b.label,
        data: b.data,
        // colour follows the boat's final rank order, never cycled
        borderColor: palette.series[i],
        backgroundColor: palette.series[i],
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHitRadius: 10,
        pointBorderColor: palette.surface,
        pointBorderWidth: 2,
      })),
    },
    options: {
      interaction: { mode: "index", intersect: false },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, title: { display: true, text: "Cup (p)" } },
      },
      plugins: {
        legend: { position: "top", labels: { boxWidth: 12, boxHeight: 12 } },
        tooltip: {
          itemSort: (a, b) => b.raw - a.raw,
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${fmt(ctx.raw, lang)} p`,
          },
        },
      },
    },
  };
}

/** Kilograms per competition, stacked by species. */
export function catchByCompetitionChart(
  { labels, species },
  { palette, t, lang },
) {
  return {
    type: "bar",
    data: {
      labels,
      datasets: species.map((s) => ({
        label: s.name,
        data: s.data,
        ...stackedSegment(s.color || palette.primary, palette),
      })),
    },
    options: {
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: {
          stacked: true,
          beginAtZero: true,
          title: { display: true, text: "kg" },
        },
      },
      plugins: {
        legend: { position: "top", labels: { boxWidth: 12, boxHeight: 12 } },
        tooltip: {
          mode: "index",
          intersect: false,
          filter: (item) => item.raw > 0,
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${fmt(ctx.raw, lang, 2)} kg`,
            footer: (items) =>
              `${t("total-big")}: ${fmt(
                items.reduce((sum, i) => sum + i.raw, 0),
                lang,
                2,
              )} kg`,
          },
        },
      },
    },
  };
}
