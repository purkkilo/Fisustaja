import { t } from "../i18n";
import {
  formatDateToLocaleDateString,
  capitalize_words,
  replaceAll,
  range,
  sortBy,
} from "../utils/format";
import { cupDictToArray } from "../utils/results";
import {
  createPdfDoc,
  addTitle,
  addAutoTable,
  addFooter,
  openPdfOnNewTab,
} from "./helpers";

export async function saveCupAsPDF(
  table_title,
  isLandscape,
  cup,
  competitions,
  showUnfinishedCompetitions,
  showInfoInPdf,
  selectedCompetitions,
  headers,
  results,
  signees,
) {
  const doc = await createPdfDoc(isLandscape ? "landscape" : "portrait");

  const title = `${cup.name} (${cup.year})`;
  let sub_title;
  let columns = [];
  let rows;

  const temp_array = [...competitions];
  const index = temp_array
    .slice()
    .reverse()
    .findIndex((competition) => competition.isFinished === true);
  const count = temp_array.length - 1;
  const finalIndex = index >= 0 ? count - index : index;
  const last_competition = temp_array[finalIndex] || null;
  let last_competition_string = "";
  let start_date = new Date();
  if (last_competition) {
    last_competition_string = `${last_competition.name} (${last_competition.locality})`;
    start_date = last_competition.start_date;
  }
  const formatted_date = formatDateToLocaleDateString(start_date);

  let unfinished_competitions = 0;
  competitions.forEach((competition) => {
    if (!competition.isFinished) unfinished_competitions++;
  });

  const isResults =
    table_title === "Tulokset" || table_title === t("results");

  if (isResults) {
    if (unfinished_competitions === 0 || !showUnfinishedCompetitions) {
      sub_title = `${t("results")} · ${formatted_date}`;
    } else {
      sub_title = `${t(
        "situation",
      )} · ${formatted_date} · ${last_competition_string} (${unfinished_competitions} ${t(
        "comp.count",
      )} ${t("not-finished")})`;
    }
    if (showInfoInPdf) {
      sub_title += ` · ${selectedCompetitions}/${competitions.length} ${t(
        "comp.count",
      )} ${t("taken-into-account")}`;
    }

    headers.forEach((header) => {
      let columnText = header.title ?? header.text;
      if (header.translate) columnText = t(columnText);
      columns.push(columnText);
    });
    rows = cupDictToArray(results, competitions, "cup_total_points");
  } else {
    if (unfinished_competitions === 0) {
      sub_title = `${t("cup.to")} ${t("signees-signed")}`;
    } else {
      sub_title = `${t("cup.to")} ${t(
        "signees-signed",
      )} · ${formatted_date} · ${last_competition_string}`;
    }

    columns = [
      t("boat-number"),
      t("captain-name"),
      t("temp-captain-name"),
      t("locality"),
    ];
    signees = cup.signees.sort(sortBy("boat_number", true));
    rows = cupDictToArray(signees, competitions, "signees");
    if (rows.length) {
      const last_number = Number(rows[rows.length - 1][0]) + 1;
      for (const i of range(last_number, last_number + 30)) {
        rows.push([i, "", "", ""]);
      }
    } else {
      for (const i of range(1, 20)) {
        rows.push([i, "", "", ""]);
      }
    }
  }

  const startY = addTitle(doc, title, sub_title, null);
  addAutoTable(doc, {
    head: [columns],
    body: rows,
    startY,
  });

  addFooter(doc, title);
  openPdfOnNewTab(
    doc,
    `${cup.year}_Cup_${replaceAll(capitalize_words(table_title), " ", "")}.pdf`,
  );
}
