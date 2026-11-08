import { t } from "../i18n";
import { replaceAll } from "../utils/format";
import {
  createPdfDoc,
  addTitle,
  addSectionTitle,
  addAutoTable,
  addFooter,
  openPdfOnNewTab,
} from "./helpers";
import {
  competitionHeading,
  columnsNormalPoints,
  rowsNormalPoints,
  columnsNormalFishes,
  rowsNormalFishes,
  columnsTeam,
  rowsTeam,
  columnsBiggestFishes,
  rowsBiggestFishes,
  columnsBiggestAmounts,
  rowsBiggestAmounts,
  renderTableSection,
  renderStatsSection,
  computeBiggest,
  optionLabel,
} from "./sections";

function finish(doc, title, fileName) {
  addFooter(doc, title);
  openPdfOnNewTab(doc, fileName);
}

export async function saveAsPDF(
  competition_type,
  table_id,
  orientation = "portrait",
  competition,
  signees,
  selected_normal,
  selected_biggest_fish,
  selected_biggest_amount,
  normal_points,
  normal_weights,
  biggest_fishes_results,
  biggest_amounts_results,
  team_results,
  fish_names,
) {
  const doc = await createPdfDoc(orientation);
  const { title, time, year } = competitionHeading(competition);
  let columns = [];
  let rows = [];
  let pdf_competition_type = replaceAll(String(competition_type), " ", "");

  addTitle(doc, title, competition.cup_name, time);

  if (table_id === "#normal-table") {
    pdf_competition_type = `${replaceAll(t("normal-comp"), " ", "")}${selected_normal}`;
    if (selected_normal === "points") {
      columns = columnsNormalPoints(competition);
      rows = rowsNormalPoints(normal_points, competition);
    } else if (selected_normal === "fishes") {
      columns = columnsNormalFishes(fish_names);
      rows = rowsNormalFishes(normal_weights, competition);
    } else if (selected_normal === "signees-signed") {
      columns = [
        t("boat-number"),
        t("captain-name"),
        t("temp-captain-name"),
        t("locality"),
        t("starting-place"),
      ];
      if (competition.isTeamCompetition) columns.push(t("team"));
      rows = signees.map((b) => {
        const row = [
          `(${b.boat_number})`,
          b.captain_name,
          b.temp_captain_name,
          b.locality,
          b.starting_place,
        ];
        if (competition.isTeamCompetition) row.push(b.team);
        return row;
      });
    }
  } else if (table_id === "#team-table") {
    pdf_competition_type = t("team-comp");
    columns = columnsTeam();
    rows = rowsTeam(team_results);
  } else if (table_id === "#biggest-fishes-table") {
    pdf_competition_type = `${replaceAll(t("biggest-fishes"), " ", "")}${optionLabel(selected_biggest_fish)}`;
    if (
      selected_biggest_fish === "all" ||
      selected_biggest_fish === "winners"
    ) {
      columns = columnsBiggestFishes(selected_biggest_fish);
      rows = rowsBiggestFishes(biggest_fishes_results, selected_biggest_fish);
    } else {
      columns = [
        t("placement"),
        t("boat-number"),
        t("captain-name"),
        `${t("weight")} (g)`,
      ];
      rows = biggest_fishes_results.map((f) => [
        `${f.placement}.`,
        `(${f.boat_number})`,
        f.captain_name,
        f.weight.toLocaleString(),
      ]);
    }
  } else if (table_id === "#biggest-amounts-table") {
    pdf_competition_type = `${replaceAll(t("biggest-amounts"), " ", "")}${optionLabel(selected_biggest_amount)}`;
    if (
      selected_biggest_amount === "all" ||
      selected_biggest_amount === "winners"
    ) {
      columns = columnsBiggestAmounts(selected_biggest_amount);
      rows = rowsBiggestAmounts(biggest_amounts_results);
    } else {
      columns = [
        t("placement"),
        t("boat-number"),
        t("captain-name"),
        `${t("weight")} (g)`,
      ];
      rows = biggest_amounts_results.map((f) => [
        `${f.placement}.`,
        `(${f.boat_number})`,
        f.captain_name,
        f.weight.toLocaleString(),
      ]);
    }
  }

  const startY = addSectionTitle(doc, competition_type, 48);
  addAutoTable(doc, { head: [columns], body: rows, startY: startY + 2 });
  finish(
    doc,
    title,
    `${year}_${replaceAll(competition.name, " ", "")}_${pdf_competition_type}.pdf`,
  );
}

export async function saveStatsAsPDF(
  _competition_type,
  orientation = "portrait",
  competition,
  signees,
  hasGottenFishCount,
) {
  const doc = await createPdfDoc(orientation);
  const { title, time, year } = competitionHeading(competition);
  renderStatsSection(doc, {
    title,
    cup: competition.cup_name,
    time,
    competition,
    signees,
    hasGottenFishCount,
  });
  finish(
    doc,
    title,
    `${year}_${replaceAll(competition.name, " ", "")}_${replaceAll(t("statistics"), " ", "")}.pdf`,
  );
}

export async function saveAllAsPDF(
  tab,
  orientation = "portrait",
  text,
  snackbar,
  selected_fish,
  selected_amount,
  selected_print,
  competition,
  signees,
  hasGottenFishCount,
  biggest_fishes,
  biggest_amounts,
  normal_points,
  normal_weights,
  team_results,
  fish_names,
) {
  const doc = await createPdfDoc(orientation);
  const { title, time, year } = competitionHeading(competition);
  const cup = competition.cup_name;
  let pageStarted = false;
  let chartsLoaded = true;

  const needPage = () => {
    const was = pageStarted;
    pageStarted = true;
    return was;
  };

  if (selected_print.includes("normal")) {
    renderTableSection(doc, {
      title,
      cup,
      time,
      heading: `${t("normal-results")} (${t("fishes")})`,
      columns: columnsNormalFishes(fish_names),
      rows: rowsNormalFishes(normal_weights, competition),
      newPage: needPage(),
    });
    renderTableSection(doc, {
      title,
      cup,
      time,
      heading: `${t("normal-results")} (${t("points")})`,
      columns: columnsNormalPoints(competition),
      rows: rowsNormalPoints(normal_points, competition),
      newPage: true,
    });
  }

  if (competition.isTeamCompetition && selected_print.includes("team")) {
    renderTableSection(doc, {
      title,
      cup,
      time,
      heading: t("team-results"),
      columns: columnsTeam(),
      rows: rowsTeam(team_results),
      newPage: needPage(),
    });
  }

  if (selected_print.includes("all_biggest")) {
    const { fishes, amounts, label } = computeBiggest(
      biggest_fishes,
      biggest_amounts,
      fish_names,
      "all",
      "all",
    );
    let y = null;
    if (fishes.length) {
      y = renderTableSection(doc, {
        title,
        cup,
        time,
        heading: `${t("biggest-fishes")} (${label})`,
        columns: columnsBiggestFishes("all"),
        rows: rowsBiggestFishes(fishes, "all"),
        newPage: needPage(),
      });
    }
    if (amounts.length) {
      if (y == null) {
        renderTableSection(doc, {
          title,
          cup,
          time,
          heading: `${t("biggest-amounts")} (${label})`,
          columns: columnsBiggestAmounts("all"),
          rows: rowsBiggestAmounts(amounts),
          newPage: needPage(),
        });
      } else {
        addSectionTitle(doc, `${t("biggest-amounts")} (${label})`, y + 16);
        addAutoTable(doc, {
          head: [columnsBiggestAmounts("all")],
          body: rowsBiggestAmounts(amounts),
          startY: y + 22,
        });
      }
    }
  }

  if (selected_print.includes("biggest_fishes")) {
    let first = true;
    for (const fish of ["winners", ...fish_names]) {
      const { fishes } = computeBiggest(
        biggest_fishes,
        biggest_amounts,
        fish_names,
        fish,
        selected_amount,
      );
      if (!fishes.length) continue;
      const winnerMode = fish === "winners";
      renderTableSection(doc, {
        title,
        cup,
        time,
        heading: `${t("biggest-fishes")} (${optionLabel(fish)})`,
        columns: winnerMode
          ? columnsBiggestFishes("winners")
          : [
              t("placement"),
              t("boat-number"),
              t("captain-name"),
              `${t("weight")} (g)`,
            ],
        rows: winnerMode
          ? rowsBiggestFishes(fishes, "winners")
          : fishes.map((f) => [
              `${f.placement}.`,
              `(${f.boat_number})`,
              f.captain_name,
              f.weight.toLocaleString(),
            ]),
        newPage: first ? needPage() : true,
      });
      first = false;
    }
  }

  if (selected_print.includes("biggest_amounts")) {
    let first = true;
    for (const fish of ["winners", ...fish_names]) {
      const { amounts } = computeBiggest(
        biggest_fishes,
        biggest_amounts,
        fish_names,
        selected_fish,
        fish,
      );
      if (!amounts.length) continue;
      const cols =
        fish === "winners"
          ? columnsBiggestAmounts("winners")
          : [
              t("placement"),
              t("boat-number"),
              t("captain-name"),
              `${t("weight")} (g)`,
            ];
      const body =
        fish === "winners" || fish === "all"
          ? rowsBiggestAmounts(amounts)
          : amounts.map((f) => [
              `${f.placement}.`,
              `(${f.boat_number})`,
              f.captain_name,
              f.weight.toLocaleString(),
            ]);
      renderTableSection(doc, {
        title,
        cup,
        time,
        heading: `${t("biggest-amounts")} (${optionLabel(fish)})`,
        columns: cols,
        rows: body,
        newPage: first ? needPage() : true,
      });
      first = false;
    }
  }

  if (selected_print.includes("biggest_winners")) {
    const { fishes, amounts } = computeBiggest(
      biggest_fishes,
      biggest_amounts,
      fish_names,
      "winners",
      "winners",
    );
    let y = null;
    if (fishes.length) {
      y = renderTableSection(doc, {
        title,
        cup,
        time,
        heading: `${t("biggest-fishes")} (${t("winners")})`,
        columns: columnsBiggestFishes("winners"),
        rows: rowsBiggestFishes(fishes, "winners"),
        newPage: needPage(),
      });
    }
    if (amounts.length) {
      if (y == null) {
        renderTableSection(doc, {
          title,
          cup,
          time,
          heading: `${t("biggest-amounts")} (${t("winners")})`,
          columns: columnsBiggestAmounts("winners"),
          rows: rowsBiggestAmounts(amounts),
          newPage: needPage(),
        });
      } else {
        addSectionTitle(doc, `${t("biggest-amounts")} (${t("winners")})`, y + 16);
        addAutoTable(doc, {
          head: [columnsBiggestAmounts("winners")],
          body: rowsBiggestAmounts(amounts),
          startY: y + 22,
        });
      }
    }
  }

  if (selected_print.includes("stats")) {
    chartsLoaded = renderStatsSection(doc, {
      title,
      cup,
      time,
      competition,
      signees,
      hasGottenFishCount,
      newPage: needPage(),
    });
  }

  if (!pageStarted) {
    addTitle(doc, title, cup, time);
  }

  finish(
    doc,
    title,
    `${year}_${replaceAll(competition.name, " ", "")}${t("results")}.pdf`,
  );

  return {
    tab,
    text: chartsLoaded ? text : t("errors.charts-missing"),
    snackbar: chartsLoaded ? snackbar : true,
  };
}
