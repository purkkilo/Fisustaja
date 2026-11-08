import { t } from "../i18n";
import { formatDateToLocaleDateString } from "../utils/format";
import {
  calculateBiggestAmounts,
  calculateBiggestFishes,
} from "../utils/results";
import { captureChartsForPDF, setChartsResponsive } from "../utils/charts";
import {
  addTitle,
  addSectionTitle,
  addAutoTable,
  addChartFrame,
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
    const row = [
      `${b.placement}.`,
      `(${b.boat_number})`,
      b.captain_name,
    ];
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
    return [t("fish"), t("boat-number"), t("captain-name"), `${t("weight")} (g)`];
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
    return [t("fish"), t("boat-number"), t("captain-name"), `${t("weight")} (g)`];
  }
  return [
    t("fish"),
    t("boat-number"),
    t("captain-name"),
    `${t("weight")} (g)`,
  ];
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

export function generalStatsRows(competition, signees, hasGottenFishCount) {
  return [
    [`Cup ${t("multiplier")}`, `x ${competition.cup_points_multiplier}`],
    [`${t("signees")} ${t("total")}`, `${signees.length}`],
    [
      t("comp-overview.gotten-fish"),
      `${
        Math.round((hasGottenFishCount / signees.length) * 100 * 100) / 100
      } % (${hasGottenFishCount}/${signees.length})`,
    ],
  ];
}

/**
 * Stats page: charts (if mounted) + fish specs + general stats.
 * @returns {boolean} whether charts were captured
 */
export function renderStatsSection(
  doc,
  { title, cup, time, competition, signees, hasGottenFishCount, newPage = false },
) {
  if (newPage) doc.addPage();
  addTitle(doc, title, cup, time);

  const charts = captureChartsForPDF(["fishes_chart", "signee_chart"]);
  const fishesImg = charts.fishes_chart;
  const signeeImg = charts.signee_chart;
  const landscape = doc.internal.pageSize.getWidth() > 500;
  let chartsOk = !!(fishesImg && signeeImg);

  if (chartsOk) {
    const size = landscape ? 95 : 88;
    const gap = 12;
    const pageW = doc.internal.pageSize.getWidth();
    const totalW = size * 2 + gap;
    const left = (pageW - totalW) / 2;
    const top = 42;
    addChartFrame(doc, left, top, size, size);
    addChartFrame(doc, left + size + gap, top, size, size);
    doc.addImage(fishesImg, "PNG", left, top, size, size);
    doc.addImage(signeeImg, "PNG", left + size + gap, top, size, size);
  }

  const specsY = chartsOk ? 148 : 48;
  addSectionTitle(doc, t("fish-specs"), specsY);
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
    startY: specsY + 5,
    didParseCell(data) {
      // Bold the totals row
      if (
        data.section === "body" &&
        data.row.index === specsBody.length - 1
      ) {
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  addSectionTitle(
    doc,
    t("general-statistics"),
    doc.lastAutoTable.finalY + 14,
  );
  addAutoTable(doc, {
    head: [[t("overview-page.details"), ""]],
    body: generalStatsRows(competition, signees, hasGottenFishCount),
    startY: doc.lastAutoTable.finalY + 18,
    showHead: false,
    columnStyles: {
      0: { cellWidth: 90, fontStyle: "bold", textColor: PDF.muted },
      1: { halign: "right" },
    },
  });

  setChartsResponsive();
  return chartsOk;
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
