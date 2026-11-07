import { jsPDF } from "jspdf";
import { t } from "../i18n";
import {
  formatDateToLocaleDateString,
  capitalize_words,
  replaceAll,
  range,
  sortBy,
} from "../utils/format";
import { cupDictToArray } from "../utils/results";
import { openPdfOnNewTab } from "./helpers";

export function saveCupAsPDF(
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
  // Format dates for easier reding
  // PDF creation
  let doc = new jsPDF({
    orientation: isLandscape ? "landscape" : "portrait",
  });

  // Title
  const title = `${cup.name} (${cup.year})`;
  let sub_title;
  let columns = [];
  let rows;
  let startY;
  // Find last competition from the array which has finished
  let temp_array = [...competitions];
  var index = temp_array
    .slice()
    .reverse()
    .findIndex((competition) => competition.isFinished === true);
  var count = temp_array.length - 1;
  var finalIndex = index >= 0 ? count - index : index;
  const last_competition = temp_array[finalIndex]
    ? temp_array[finalIndex]
    : null;
  let last_competition_string = "";
  let start_date = new Date();
  if (last_competition) {
    last_competition_string = `${last_competition.name} (${last_competition.locality})`;
    start_date = last_competition.start_date;
  }
  const formatted_date = formatDateToLocaleDateString(start_date);

  doc.setFontSize(24);
  doc.text(13, 15, title, { align: "left" });
  doc.line(0, 20, 400, 20);
  doc.setFontSize(14);
  // Table, based on given table_id, and table title based on competition_type
  let finished_competitions = 0;
  let unfinished_competitions = 0;
  competitions.forEach((competition) => {
    competition.isFinished
      ? finished_competitions++
      : unfinished_competitions++;
  });
  if (table_title === "Tulokset") {
    if (unfinished_competitions === 0 || !showUnfinishedCompetitions) {
      sub_title = `${t("results")} ${formatted_date}`;
    } else {
      sub_title = `${t(
        "situation",
      )} ${formatted_date}, ${last_competition_string}  (${unfinished_competitions} ${t(
        "comp.count",
      )} ${t("not-finished")} )`;
    }
    doc.text(13, 30, sub_title, { align: "left" });
    if (showInfoInPdf) {
      doc.text(
        13,
        40,
        `${t("results")} (${selectedCompetitions}/${
          competitions.length
        } ${t("comp.count")} ${t("taken-into-account")})`,
        { align: "left" },
      );
    }

    headers.forEach((header) => {
      let columnText = header.title ?? header.text;
      if (header.translate) columnText = t(columnText);

      columns.push(columnText);
    });
    rows = cupDictToArray(results, competitions, "cup_total_points");
    startY = 45;
  } else {
    if (unfinished_competitions === 0) {
      sub_title = `${t("cup.to")} ${t("signees-signed")}`;
    } else {
      sub_title = `${t("cup.to")} ${t(
        "signees-signed",
      )} ${formatted_date} ${last_competition_string}`;
    }
    doc.text(13, 30, sub_title, { align: "left" });
    doc.setFontSize(8);

    columns = [
      t("boat-number"),
      t("captain-name"),
      t("temp-captain-name"),
      t("locality"),
    ];
    signees = cup.signees.sort(sortBy("boat_number", true));
    rows = cupDictToArray(signees, competitions, "signees");
    // Just add some empty rows for new signees
    if (rows.length) {
      let last_number = Number(rows[rows.length - 1][0]) + 1;
      for (let i of range(last_number, last_number + 30)) {
        rows.push([i, "", "", ""]);
      }
    } else {
      // If no signees, just add 20 empty rows
      for (let i of range(1, 20)) {
        rows.push([i, "", "", ""]);
        doc.text(13, 35, t("cup.in") + " " + t("comp-overview.no-signees"), {
          align: "left",
        });
      }
    }
    startY = 37;
  }

  doc.autoTable({
    head: [columns],
    body: rows,
    styles: {
      overflow: "linebreak",
      halign: "justify",
      fontSize: "8",
      lineColor: 100,
      lineWidth: 0.25,
    },
    columnStyles: { text: { cellwidth: "auto" } },
    headStyles: { text: { cellwidth: "wrap" } },
    theme: "striped",
    pageBreak: "auto",
    tableWidth: "auto",
    startY: startY,
    margin: { top: 20 },
  });
  const fileName = `${cup.year}_${replaceAll("Cup", " ", "")}_${replaceAll(
    capitalize_words(table_title),
    " ",
    "",
  )}.pdf`;
  openPdfOnNewTab(doc, fileName);
}
