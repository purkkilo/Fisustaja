import i18n, { t } from "../i18n";
import { formatDateToLocaleDateString } from "../utils/format";
import {
  calculateBiggestAmounts,
  calculateBiggestFishes,
} from "../utils/results";
import { captureChartsForPDF, setChartsResponsive } from "../utils/charts";
import { chartRows, statsSummary } from "../utils/competitionStats";
import {
  addTitle,
  addSectionTitle,
  addAutoTable,
  addChartFrame,
  addStatTiles,
  PDF,
} from "./helpers";

export function competitionHeading(competition) {
  const title = `${competition.name}`;
  const start = formatDateToLocaleDateString(competition.start_date);
  const end = formatDateToLocaleDateString(competition.end_date);
  const date = start === end ? String(start) : `${start} - ${end}`;
  const time = `${date}, ${t("timer.at")} ${competition.start_time} - ${
    competition.end_time
  }`;
  return { title, time, year: new Date(competition.start_date).getFullYear() };
}

/** Start a content page with header + section title. Returns table startY. */
export function beginSection(doc, { title, cup, time, heading, newPage }) {
  if (newPage) doc.addPage();
  const y = addTitle(doc, title, cup, time);
  return addSectionTitle(doc, heading, y);
}

export function columnsNormalPoints(competition) {
  const columns = [
    t("placement"),
    t("boat-number-short"),
    t("captain-name"),
    t("temp-captain-name"),
    t("locality"),
    `${t("result")} (p)`,
  ];
  if (competition.isCupCompetition) columns.push("Cup (p)");
  return columns;
}

export function rowsNormalPoints(normal_points, competition) {
  return normal_points.map((b) => {
    const row = [
      `${b.placement}.`,
      `(${b.boat_number})`,
      b.captain_name,
      b.temp_captain_name,
      b.locality,
      b.total_points.toLocaleString(),
    ];
    if (competition.isCupCompetition) row.push(b.cup_points_total);
    return row;
  });
}

export function columnsNormalFishes(fish_names) {
  return [
    t("placement"),
    t("boat-number-short"),
    t("captain-name"),
    ...fish_names.map((name) => `${name} (g)`),
    `${t("result")} (p)`,
  ];
}

export function rowsNormalFishes(normal_weights, competition) {
  return normal_weights.map((b) => {
    const row = [`${b.placement}.`, `(${b.boat_number})`, b.captain_name];
    competition.fishes.forEach((f) => {
      const fish = b.fishes.find((item) => item.id === f.id);
      row.push(fish ? fish.weights.toLocaleString() : "-");
    });
    row.push(b.total_points.toLocaleString());
    return row;
  });
}

export function columnsTeam() {
  return [
    t("placement"),
    t("team"),
    `${t("member")} 1`,
    `${t("member")} 2`,
    `${t("member")} 3`,
    `${t("result")} (p)`,
  ];
}

export function rowsTeam(team_results) {
  return team_results.map((b) => [
    `${b.placement}.`,
    b.team,
    b.captain_name_1 ?? "",
    b.captain_name_2 ?? "",
    b.captain_name_3 ?? "",
    b.total_points.toLocaleString(),
  ]);
}

export function columnsBiggestFishes(mode = "all") {
  if (mode === "winners") {
    return [
      t("fish"),
      t("boat-number"),
      t("captain-name"),
      `${t("weight")} (g)`,
    ];
  }
  return [
    t("placement"),
    t("boat-number"),
    t("captain-name"),
    t("fish"),
    `${t("weight")} (g)`,
  ];
}

export function rowsBiggestFishes(results, mode = "all") {
  if (mode === "winners") {
    return results.map((f) => [
      f.name,
      `(${f.boat_number})`,
      f.captain_name,
      f.weight.toLocaleString(),
    ]);
  }
  return results.map((f) => [
    `${f.placement}.`,
    `(${f.boat_number})`,
    f.captain_name,
    f.name,
    f.weight.toLocaleString(),
  ]);
}

export function columnsBiggestAmounts(mode = "all") {
  if (mode === "winners") {
    return [
      t("fish"),
      t("boat-number"),
      t("captain-name"),
      `${t("weight")} (g)`,
    ];
  }
  return [t("fish"), t("boat-number"), t("captain-name"), `${t("weight")} (g)`];
}

export function rowsBiggestAmounts(results) {
  return results.map((f) => [
    f.name,
    `(${f.boat_number})`,
    f.captain_name,
    f.weight.toLocaleString(),
  ]);
}

export function renderTableSection(
  doc,
  { title, cup, time, heading, columns, rows, newPage = false },
) {
  if (!rows?.length) return null;
  const startY = beginSection(doc, { title, cup, time, heading, newPage });
  addAutoTable(doc, { head: [columns], body: rows, startY: startY + 3 });
  return doc.lastAutoTable.finalY;
}

export function fishSpecsRows(competition) {
  const rows = competition.fishes.map((f) => [
    f.name,
    `x ${f.multiplier}`,
    `${f.minsize} cm`,
    `${Math.round((f.weights / 1000 + Number.EPSILON) * 100) / 100} kg`,
  ]);
  const total =
    Math.round((competition.total_weights / 1000 + Number.EPSILON) * 100) / 100;
  rows.push([t("total-big"), "", "", `${total.toLocaleString()} kg`]);
  return rows;
}

/** Charts of the statistics view, in PDF order. Missing ones are skipped. */
const STATS_CHARTS = [
  { id: "species_chart", title: "stats-page.species" },
  { id: "top_boats_chart", title: "stats-page.top-boats" },
  { id: "points_spread_chart", title: "stats-page.spread" },
  { id: "biggest_fish_chart", title: "stats-page.biggest" },
  { id: "catch_timeline_chart", title: "stats-page.timeline", wide: true },
];

/**
 * Stats page: number tiles, every chart that is on screen, fish specs.
 * @returns {boolean} whether the charts were captured
 */
export function renderStatsSection(
  doc,
  {
    title,
    cup,
    time,
    competition,
    signees,
    hasGottenFishCount,
    newPage = false,
  },
) {
  if (newPage) doc.addPage();
  // the header is taller when there is a cup line: start below it
  const contentTop = addTitle(doc, title, cup, time);
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const bottom = pageH - 18; // footer
  const contentW = pageW - PDF.marginX * 2;
  const gap = 8;
  const titleH = 7;
  const boxW = (contentW - gap) / 2;
  const boxH = Math.min(boxW * 0.78, 78);
  const wideH = 58;
  // CSS pixels per mm when capturing: the charts' 12 px text becomes ~8.5 pt
  const PX = 4;

  const lang = i18n.global.locale.value === "fi" ? "fi-FI" : "en-GB";
  const tiles = statsSummary(
    competition,
    signees,
    hasGottenFishCount,
    lang,
  ).map((tile) => ({ ...tile, label: t(tile.label) }));
  let y = addStatTiles(doc, tiles, contentTop - 4) + 10;

  // capture every chart at the shape it gets on the page
  const images = captureChartsForPDF(
    STATS_CHARTS.map((c) => ({
      id: c.id,
      width: (c.wide ? contentW : boxW) * PX,
      height: (c.wide ? wideH : boxH) * PX,
    })),
  );
  const present = STATS_CHARTS.filter((c) => images[c.id]);

  const newPageIfNeeded = (height) => {
    if (y + height <= bottom) return;
    doc.addPage();
    y = addTitle(doc, title, cup, time) - 4;
  };

  for (const row of chartRows(present)) {
    const h = row[0].wide ? wideH : boxH;
    newPageIfNeeded(titleH + h + 4);
    row.forEach((chart, i) => {
      const w = chart.wide ? contentW : boxW;
      const x = PDF.marginX + i * (boxW + gap);
      doc.setFont(PDF.font, "bold");
      doc.setFontSize(9.5);
      doc.text(doc.splitTextToSize(t(chart.title), w)[0], x, y + 3);
      doc.setFont(PDF.font, "normal");
      addChartFrame(doc, x + 3, y + titleH + 3, w - 6, h - 6);
      doc.addImage(images[chart.id], "PNG", x, y + titleH, w, h);
    });
    y += titleH + h + 10;
  }

  newPageIfNeeded(40);
  const specsY = addSectionTitle(doc, t("fish-specs"), y + 2);
  const specsHead = [
    t("fish"),
    t("multiplier"),
    t("min-size"),
    t("comp-overview.gotten-fish"),
  ];
  const specsBody = fishSpecsRows(competition);
  addAutoTable(doc, {
    head: [specsHead],
    body: specsBody,
    startY: specsY,
    didParseCell(data) {
      // Bold the totals row
      if (data.section === "body" && data.row.index === specsBody.length - 1) {
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  setChartsResponsive();
  // the first two are always on screen when there is a catch
  return !!(images.species_chart && images.top_boats_chart);
}

export function optionLabel(item) {
  return item === "all" || item === "winners" ? t(item) : item;
}

export function computeBiggest(
  biggest_fishes,
  biggest_amounts,
  fish_names,
  selected_fish,
  selected_amount,
) {
  return {
    fishes: calculateBiggestFishes(biggest_fishes, fish_names, selected_fish)
      .results,
    amounts: calculateBiggestAmounts(
      biggest_amounts,
      selected_amount,
      fish_names,
    ).results,
    label: optionLabel(selected_fish),
  };
}

export { PDF };
