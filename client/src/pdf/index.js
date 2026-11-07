import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";
import { t } from "../i18n";
import {
  resizeChartForPDF,
  setChartsResponsive,
  initChartData,
} from "../utils/charts";
import {
  formatDateToLocaleDateString,
  capitalize_words,
  replaceAll,
  range,
  sortBy,
} from "../utils/format";
import {
  headers,
  cupDictToArray,
  sortDict,
  calculateBiggestFishes,
  calculateBiggestAmounts,
} from "../utils/results";

// jspdf-autotable 5 no longer patches jsPDF on import
applyPlugin(jsPDF);

export function addTitle(doc, title, cup, time) {
  doc.setFontSize(24);
  doc.text(10, 10, title, { align: "left" });
  doc.setFontSize(14);
  let y = 20;
  if (cup) {
    doc.text(10, 20, cup, { align: "left" });
    y = 30;
  }

  doc.text(10, y, time, { align: "left" });
  doc.line(0, y + 5, 400, y + 5);
}

export function openPdfOnNewTab(doc, fileName) {
  // https://stackoverflow.com/questions/17739816/how-to-open-generated-pdf-using-jspdf-in-new-window
  // Save the pdf
  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(doc.output("blob"), fileName);
  } else {
    // For other browsers:
    window.open(
      URL.createObjectURL(doc.output("blob")),
      "_blank",
      "height=auto,width=auto,scrollbars=yes,location=yes",
    );

    // For Firefox it is necessary to delay revoking the ObjectURL
    setTimeout(() => {
      window.URL.revokeObjectURL(doc.output("bloburl"));
    }, 100);
  }
}

// Convert the charts and the tables to pdf
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
      let columnText = header.text;
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
    /* eslint-disable no-unused-vars */
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
    /* eslint-enable no-unused-vars */
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

// Convert the charts and the tables to pdf
export function saveAsPDF(
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
  // Format dates for easier reding
  let temp_start_date = formatDateToLocaleDateString(competition.start_date);
  let temp_end_date = formatDateToLocaleDateString(competition.end_date);
  let rows = [];
  let columns;
  let pdf_competition_type;
  // PDF creation
  let doc = new jsPDF({ orientation: orientation });
  // Title
  const title = `${competition.name}`;
  const date =
    temp_start_date === temp_end_date
      ? String(temp_start_date)
      : `${temp_start_date} - ${temp_end_date}`;
  const time = `${date}, ${t("timer.at")} ${competition.start_time} - ${
    competition.end_time
  }`;
  addTitle(doc, title, competition.cup_name, time);
  doc.setFontSize(20);

  if (table_id === "#normal-table") {
    pdf_competition_type = `${replaceAll(
      t("normal-comp"),
      " ",
      "",
    )}${selected_normal}`;
    // Other tables are generated in code so no need to wait for rendering to html
    if (selected_normal === "points") {
      columns = [
        t("placement"),
        t("boat-number-short"),
        t("captain-name"),
        t("temp-captain-name"),
        t("locality"),
        t("result") + " (p)",
      ];

      if (competition.isCupCompetition) {
        columns.push("Cup (p)");
      }
      // Format so that autotable understands (arrays in arrays);
      normal_points.forEach((b, i) => {
        rows[i] = [
          b.placement + ".",
          "(" + b.boat_number + ")",
          b.captain_name,
          b.temp_captain_name,
          b.locality,
          b.total_points.toLocaleString(),
        ];
        if (competition.isCupCompetition) {
          rows[i].push(b.cup_points_total);
        }
      });
    }
    if (selected_normal === "fishes") {
      columns = [t("placement"), t("boat-number-short"), t("captain-name")];
      // Get fish names for columns
      fish_names.forEach((name) => {
        columns.push(name + " (g)");
      });
      columns.push(t("result") + " (p)");
      // Format dictionary/json to format that autotable understands (arrays in arrays);
      normal_weights.forEach((b, i) => {
        let r = [];
        r = [b.placement + ".", "(" + b.boat_number + ")", b.captain_name];
        competition.fishes.forEach((f) => {
          let fish = b.fishes.find((fish) => fish.id === f.id);
          if (fish) {
            r.push(fish.weights.toLocaleString());
          } else {
            r.push("-");
          }
        });
        r.push(b.total_points.toLocaleString());
        rows[i] = r;
      });
    }
    if (selected_normal === "signees-signed") {
      columns = [
        t("boat-number"),
        t("captain-name"),
        t("temp-captain-name"),
        t("locality"),
        t("starting-place"),
      ];
      if (competition.isTeamCompetition) {
        columns.push(t("team"));
      }
      // Format dictionary/json to format that autotable understands (arrays in arrays);
      signees.forEach((b, i) => {
        rows[i] = [
          "(" + b.boat_number + ")",
          b.captain_name,
          b.temp_captain_name,
          b.locality,
          b.starting_place,
        ];
      });
    }
  }

  if (table_id === "#team-table") {
    pdf_competition_type = t("team-comp");
    // Other tables are generated in code so no need to wait for rendering to html
    columns = [
      t("placement"),
      t("team"),
      t("member") + " 1",
      t("member") + " 2",
      t("member") + " 3",
      t("result") + " (p)",
    ];
    // Format dictionary/json to format that autotable understands (arrays in arrays);
    rows = [];
    team_results.forEach((b, i) => {
      rows[i] = [
        b.placement,
        b.team,
        b.captain_name_1,
        b.captain_name_1,
        b.captain_name_1,
        b.total_points.toLocaleString(),
      ];
    });
  }

  if (table_id === "#biggest-fishes-table") {
    pdf_competition_type = `${replaceAll(t("biggest-fishes"), " ", "")}${
      selected_biggest_fish === "all" || selected_biggest_fish === "winners"
        ? t(selected_biggest_fish)
        : selected_biggest_fish
    }`;

    if (selected_biggest_fish === "winners") {
      columns = [
        t("fish"),
        t("boat-number"),
        t("captain-name"),
        t("weight") + " (g)",
      ];
      biggest_fishes_results.forEach((f, i) => {
        rows[i] = [
          f.name,
          "(" + f.boat_number + ")",
          f.captain_name,
          f.weight.toLocaleString(),
        ];
      });
    } else if (selected_biggest_fish === "all") {
      columns = [
        t("placement"),
        t("boat-number"),
        t("captain-name"),
        t("fish"),
        t("weight") + " (g)",
      ];
      biggest_fishes_results.forEach((f, i) => {
        rows[i] = [
          f.placement + ".",
          "(" + f.boat_number + ")",
          f.captain_name,
          f.name,
          f.weight.toLocaleString(),
        ];
      });
    } else {
      columns = [
        t("placement"),
        t("boat-number"),
        t("captain-name"),
        t("weight") + " (g)",
      ];
      biggest_fishes_results.forEach((f, i) => {
        rows[i] = [
          f.placement + ".",
          "(" + f.boat_number + ")",
          f.captain_name,
          f.weight.toLocaleString(),
        ];
      });
    }
  }

  if (table_id === "#biggest-amounts-table") {
    pdf_competition_type = `${replaceAll(t("biggest-amounts"), " ", "")}${
      selected_biggest_amount === "all" || selected_biggest_amount === "winners"
        ? t(selected_biggest_amount)
        : selected_biggest_amount
    }`;

    if (selected_biggest_amount === "winners") {
      columns = [
        t("fish"),
        t("boat-number"),
        t("captain-name"),
        t("weight") + " (g)",
      ];
      biggest_amounts_results.forEach((f, i) => {
        rows[i] = [
          f.name,
          "(" + f.boat_number + ")",
          f.captain_name,
          f.weight.toLocaleString(),
        ];
      });
    } else if (selected_biggest_amount === "all") {
      columns = [
        t("placement"),
        t("boat-number"),
        t("captain-name"),
        t("fish"),
        t("weight") + " (g)",
      ];
      biggest_amounts_results.forEach((f, i) => {
        rows[i] = [
          f.placement + ".",
          "(" + f.boat_number + ")",
          f.captain_name,
          f.name,
          f.weight.toLocaleString(),
        ];
      });
    } else {
      columns = [
        t("placement"),
        t("boat-number"),
        t("captain-name"),
        t("weight") + " (g)",
      ];
      biggest_amounts_results.forEach((f, i) => {
        rows[i] = [
          f.placement + ".",
          "(" + f.boat_number + ")",
          f.captain_name,
          f.weight.toLocaleString(),
        ];
      });
    }
  }

  // Table, based on given table_id, and table title based on competition_type
  //doc.text(100, 50, competition_type, { align: "left" });
  doc.text(competition_type, doc.internal.pageSize.getWidth() / 2, 50, {
    align: "center",
  });
  doc.autoTable({
    head: [columns],
    body: rows,
    styles: {
      overflow: "linebreak",
      cellWidth: "wrap",
      rowPageBreak: "avoid",
      halign: "justify",
      fontSize: "8",
      lineColor: 100,
      lineWidth: 0.25,
    },
    columnStyles: { text: { cellwidth: "auto" } },
    theme: "striped",
    pageBreak: "auto",
    tableWidth: "auto",
    startY: 55,
    margin: { top: 20 },
  });
  // Save the pdf
  const fileName = `${new Date(
    competition.start_date,
  ).getFullYear()}_${replaceAll(
    competition.name,
    " ",
    "",
  )}_${pdf_competition_type}.pdf`;
  openPdfOnNewTab(doc, fileName);
  // Set charts to be responsive again
}

export function saveStatsAsPDF(
  competition_type,
  orientation = "portrait",
  competition,
  signees,
  hasGottenFishCount,
) {
  resizeChartForPDF();
  // Format dates for easier reding
  let temp_start_date = formatDateToLocaleDateString(competition.start_date);
  let temp_end_date = formatDateToLocaleDateString(competition.end_date);

  let doc = new jsPDF({ orientation: orientation });

  // Title
  const title = `${competition.name}`;
  const date =
    temp_start_date === temp_end_date
      ? String(temp_start_date)
      : `${temp_start_date} - ${temp_end_date}`;
  const time = `${date}, ${t("timer.at")} ${competition.start_time} - ${
    competition.end_time
  }`;
  addTitle(doc, title, competition.cup_name, time);
  doc.setFontSize(18);

  // "Tilastot"
  // Resize charts to be better looking on a pdf
  var fishesImg = document
    .getElementById("fishes_chart")
    .toDataURL("image/png", 1.0);
  var signeeImg = document
    .getElementById("signee_chart")
    .toDataURL("image/png", 1.0);

  if (orientation === "landscape") {
    doc.addImage(fishesImg, "PNG", 50, 40, 90, 90);
    doc.addImage(signeeImg, "PNG", 160, 40, 90, 90);
  } else {
    doc.addImage(fishesImg, "PNG", 10, 40, 90, 90);
    doc.addImage(signeeImg, "PNG", 110, 40, 90, 90);
  }

  doc.text(t("fish-specs"), doc.internal.pageSize.getWidth() / 2, 145, {
    align: "center",
  });
  // Generate table
  let rows = [];

  competition.fishes.forEach((f, i) => {
    rows[i] = [
      f.name,
      "x " + f.multiplier,
      f.minsize + " cm",
      Math.round((f.weights / 1000 + Number.EPSILON) * 100) / 100 + " kg",
    ];
  });
  let temp =
    Math.round((competition.total_weights / 1000 + Number.EPSILON) * 100) / 100;
  let total_amount = temp.toLocaleString() + " kg";
  rows.push([t("total-big"), "", "", total_amount]);
  let columns = [
    t("fish"),
    t("multiplier"),
    t("min-size"),
    t("comp-overview.gotten-fish"),
  ];
  doc.autoTable({
    head: [columns],
    body: rows,
    styles: {
      overflow: "linebreak",
      cellWidth: "wrap",
      rowPageBreak: "avoid",
      halign: "justify",
      fontSize: "8",
      lineColor: 100,
      lineWidth: 0.25,
    },
    columnStyles: { cellwidth: "auto" },
    theme: "striped",
    pageBreak: "auto",
    tableWidth: "auto",
    startY: 150,
    margin: { top: 20 },
  });

  doc.text(
    t("general-statistics"),
    doc.internal.pageSize.getWidth() / 2,
    doc.lastAutoTable.finalY + 20,
    {
      align: "center",
    },
  );

  columns = ["", ""];
  rows = [
    [`Cup ${t("multiplier")} `, `x ${competition.cup_points_multiplier}`],
    [`${t("signees")} ${t("total")}`, `${signees.length} kpl`],
    [
      t("comp-overview.gotten-fish"),
      `${
        Math.round((hasGottenFishCount / signees.length) * 100 * 100) / 100
      } % (${hasGottenFishCount}/${signees.length})`,
    ],
  ];
  doc.autoTable({
    head: [columns],
    body: rows,
    styles: {
      overflow: "linebreak",
      cellWidth: "wrap",
      rowPageBreak: "avoid",
      halign: "justify",
      fontSize: "8",
      lineColor: 100,
      lineWidth: 0.25,
    },
    columnStyles: { text: { cellwidth: "auto" } },
    theme: "striped",
    pageBreak: "auto",
    tableWidth: "auto",
    margin: { top: 20 },
    startY: doc.lastAutoTable.finalY + 25,
  });

  // Save the pdf
  const fileName = `${new Date(
    competition.start_date,
  ).getFullYear()}_${replaceAll(competition.name, " ", "")}_${replaceAll(
    capitalize_words(competition_type),
    " ",
    "",
  )}.pdf`;
  openPdfOnNewTab(doc, fileName);
  // Set charts to be responsive again
  setChartsResponsive();
}

// Saves all the chosen tables to pdf
export function saveAllAsPDF(
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
  let current_tab = tab;
  let charts_loaded = true;

  // Format dates for easier reding
  let temp_start_date = formatDateToLocaleDateString(competition.start_date);
  let temp_end_date = formatDateToLocaleDateString(competition.end_date);
  let year = new Date(competition.start_date).getFullYear();

  let doc = new jsPDF({ orientation: orientation });

  // Title
  const title = `${competition.name}`;
  const date =
    temp_start_date === temp_end_date
      ? String(temp_start_date)
      : `${temp_start_date} - ${temp_end_date}`;
  const time = `${date}, ${t("timer.at")} ${competition.start_time} - ${
    competition.end_time
  }`;
  addTitle(doc, title, competition.cup_name, time);
  doc.setFontSize(18);
  // start_coord needed to keep track of y coordinates for tables (if there are no results -> no table drawn to pdf -> varying coordinates)
  let start_coord;
  let rows = [];
  let columns = [];
  let biggest_fishes_results = [];
  let biggest_amounts_results = [];

  //Normaalikilpailu (Pisteet), saved to pdf if it's inclued in selected_print array
  if (selected_print.includes("normal")) {
    //Normaalikilpailu (Kalat)
    columns = [t("placement"), t("boat-number-short"), t("captain-name")];
    // Get fish names for columns
    fish_names.forEach((name) => {
      columns.push(name + " (g)");
    });
    columns.push(t("result") + " (p)");

    normal_weights.forEach((b, i) => {
      let r = [];
      r = [b.placement + ".", "(" + b.boat_number + ")", b.captain_name];
      competition.fishes.forEach((f) => {
        let fish = b.fishes.find((fish) => fish.id === f.id);
        if (fish) {
          r.push(fish.weights.toLocaleString());
        } else {
          r.push("-");
        }
      });
      r.push(b.total_points.toLocaleString());
      rows[i] = r;
    });

    doc.text(
      `${t("normal-results")} (${t("fishes")})`,
      doc.internal.pageSize.getWidth() / 2,
      50,
      {
        align: "center",
      },
    );
    // Table generated in code
    doc.autoTable({
      head: [columns],
      body: rows,
      styles: {
        overflow: "linebreak",
        cellWidth: "wrap",
        rowPageBreak: "avoid",
        halign: "justify",
        fontSize: "8",
        lineColor: 100,
        lineWidth: 0.25,
      },
      columnStyles: { text: { cellwidth: "auto" } },
      theme: "striped",
      pageBreak: "auto",
      tableWidth: "auto",
      margin: { top: 20 },
      startY: 60,
    });

    // Other tables are generated in code so no need to wait for rendering to html
    doc.addPage();
    addTitle(doc, title, competition.cup_name, time);
    doc.setFontSize(18);
    columns = [
      t("placement"),
      t("boat-number-short"),
      t("captain-name"),
      t("temp-captain-name"),
      t("locality"),
      t("result") + " (p)",
    ];
    if (competition.isCupCompetition) {
      columns.push("Cup (p)");
    }
    // Format dictionary/json to format that autotable understands (arrays in arrays);
    rows = [];
    normal_points.forEach((b, i) => {
      rows[i] = [
        b.placement + ".",
        "(" + b.boat_number + ")",
        b.captain_name,
        b.temp_captain_name,
        b.locality,
        b.total_points.toLocaleString(),
      ];
      if (competition.isCupCompetition) {
        rows[i].push(b.cup_points_total);
      }
    });
    doc.text(
      `${t("normal-results")} (${t("points")})`,
      doc.internal.pageSize.getWidth() / 2,
      50,
      {
        align: "center",
      },
    );
    // Table generated in code
    doc.autoTable({
      head: [columns],
      body: rows,
      styles: {
        overflow: "linebreak",
        cellWidth: "wrap",
        rowPageBreak: "avoid",
        halign: "justify",
        fontSize: "8",
        lineColor: 100,
        lineWidth: 0.25,
      },
      columnStyles: { text: { cellwidth: "auto" } },
      theme: "striped",
      pageBreak: "auto",
      tableWidth: "auto",
      margin: { top: 20 },
      startY: 60,
    });
  }

  // Tiimikilpailu, drawn to pdf if it exists and , if it's inclued in selected_print array
  if (competition.isTeamCompetition && selected_print.includes("team")) {
    // If there is "Normaalikilpailun tulokset" selected also, start from new page
    if (selected_print.includes("normal")) {
      doc.addPage();
    }
    addTitle(doc, title, competition.cup_name, time);
    doc.setFontSize(18);
    doc.text(100, 50, t("team-results"), { align: "center" });
    // Add results, if there are any
    if (team_results.length) {
      // Other tables are generated in code so no need to wait for rendering to html
      columns = [
        t("placement"),
        t("team"),
        t("member") + " 1",
        t("member") + " 2",
        t("member") + " 3",
        t("result") + " (p)",
      ];
      // Format dictionary/json to format that autotable understands (arrays in arrays);
      rows = [];
      team_results.forEach((b, i) => {
        rows[i] = [
          b.placement + ".",
          b.team,
          b.captain_name_1,
          b.captain_name_1,
          b.captain_name_1,
          b.total_points.toLocaleString(),
        ];
      });
      doc.autoTable({
        head: [columns],
        body: rows,
        styles: {
          overflow: "linebreak",
          cellWidth: "wrap",
          rowPageBreak: "avoid",
          halign: "justify",
          fontSize: "8",
          lineColor: 100,
          lineWidth: 0.25,
        },
        columnStyles: { text: { cellwidth: "auto" } },
        theme: "striped",
        pageBreak: "auto",
        tableWidth: "auto",
        margin: { top: 20 },
        startY: 55,
      });
    }
  }

  // Suurimmat kalat/kalasaaliit (Kaikki) to pdf if it's inclued in selected_print array
  if (selected_print.includes("all_biggest")) {
    // If there is content before, start from new page
    if (selected_print.includes("normal") || selected_print.includes("team")) {
      doc.addPage();
    }
    // Suurimmat Kalat  (Kaikki)
    // Select these for calculations
    selected_fish = selected_amount = "all";
    biggest_fishes_results = calculateBiggestFishes(
      biggest_fishes,
      fish_names,
      selected_fish,
    ).results;

    biggest_amounts_results = calculateBiggestAmounts(
      biggest_amounts,
      selected_amount,
      fish_names,
    ).results;

    let selected =
      selected_fish === "all" || selected_fish === "winners"
        ? t(selected_fish)
        : selected_fish;

    columns = [
      t("placement"),
      t("boat-number"),
      t("captain-name"),
      t("fish"),
      t("weight") + " (g)",
    ];

    // If there are any results, add title
    if (biggest_fishes_results.length || biggest_amounts_results.length) {
      addTitle(doc, title, competition.cup_name, time);
      doc.setFontSize(18);
    }

    // If there are biggest fishes
    if (biggest_fishes_results.length) {
      rows = [];
      biggest_fishes_results.forEach((f, i) => {
        rows[i] = [
          f.placement + ".",
          "(" + f.boat_number + ")",
          f.captain_name,
          f.name,
          f.weight.toLocaleString(),
        ];
      });
      doc.text(
        `${t("biggest-fishes")} (${selected})`,
        doc.internal.pageSize.getWidth() / 2,
        50,
        { align: "center" },
      );
      // Table generated in code
      doc.autoTable({
        head: [columns],
        body: rows,
        styles: {
          overflow: "linebreak",
          cellWidth: "wrap",
          rowPageBreak: "avoid",
          halign: "justify",
          fontSize: "8",
          lineColor: 100,
          lineWidth: 0.25,
        },
        columnStyles: { cellwidth: "auto" },
        theme: "striped",
        pageBreak: "auto",
        tableWidth: "auto",
        margin: { top: 20 },
        startY: 55,
      });
      // Keep track of y coordinate
      start_coord = doc.lastAutoTable.finalY + 25;
    } else {
      // If no biggest fishes, biggest amounts table starts from 50 instead
      start_coord = 50;
    }

    //Suurimmat kalasaaliit (Kaikki)
    // If there are any amounts --> if someone has gotten any fish
    if (biggest_amounts_results.length) {
      rows = [];

      biggest_amounts_results.forEach((f, i) => {
        rows[i] = [
          f.placement + ".",
          "(" + f.boat_number + ")",
          f.captain_name,
          f.name,
          f.weight.toLocaleString(),
        ];
      });
      doc.text(
        `${t("biggest-amounts")} (${selected})`,
        doc.internal.pageSize.getWidth() / 2,
        start_coord,
        { align: "center" },
      );
      // Table generated in code
      doc.autoTable({
        head: [columns],
        body: rows,
        styles: {
          overflow: "linebreak",
          cellWidth: "wrap",
          rowPageBreak: "avoid",
          halign: "justify",
          fontSize: "8",
          lineColor: 100,
          lineWidth: 0.25,
        },
        columnStyles: { text: { cellwidth: "auto" } },
        theme: "striped",
        pageBreak: "auto",
        tableWidth: "auto",
        margin: { top: 20 },
        startY: start_coord + 5,
      });
    }
  }

  //"Suurimmat kalat" to pdf if it's inclued in selected_print array
  if (selected_print.includes("biggest_fishes")) {
    // If there is content before, start from new page
    if (
      selected_print.includes("normal") ||
      selected_print.includes("team") ||
      selected_print.includes("all_biggest")
    ) {
      doc.addPage();
    }
    let counter = 0;
    // For each fish, generate tables for "Suurimmat Kalat (Kala)" and "Suurimmat Kalasaaliit (Kala)"
    fish_names.forEach((name) => {
      // Same process as above, but for every fish instead of only winners
      selected_fish = name;
      biggest_fishes_results = calculateBiggestFishes(
        biggest_fishes,
        fish_names,
        selected_fish,
      ).results;

      start_coord = 10;

      if (biggest_fishes_results.length) {
        // So it doesn't add unnecessary page on the first loop
        if (counter > 0) {
          doc.addPage();
        }
        addTitle(doc, title, competition.cup_name, time);
        doc.setFontSize(18);
        start_coord = 50;
        columns = [
          t("placement"),
          t("boat-number"),
          t("captain-name"),
          t("weight") + " (g)",
        ];
        rows = [];
        biggest_fishes_results.forEach((f, i) => {
          rows[i] = [
            f.placement + ".",
            "(" + f.boat_number + ")",
            f.captain_name,
            f.weight.toLocaleString(),
          ];
        });

        doc.text(
          `${t("biggest-fishes")} (${name})`,
          doc.internal.pageSize.getWidth() / 2,
          start_coord,
          {
            align: "center",
          },
        );

        doc.autoTable({
          head: [columns],
          body: rows,
          styles: {
            overflow: "linebreak",
            cellWidth: "wrap",
            rowPageBreak: "avoid",
            halign: "justify",
            fontSize: "8",
            lineColor: 100,
            lineWidth: 0.25,
          },
          columnStyles: { text: { cellwidth: "auto" } },
          theme: "striped",
          pageBreak: "auto",
          tableWidth: "auto",
          margin: { top: 20 },
          startY: start_coord + 5,
        });
        counter++;
      }
    });
  }

  // Suurimmat kalasaaliit to pdf if it's inclued in selected_print array
  if (selected_print.includes("biggest_amounts")) {
    // If there is content before, start from new page
    if (
      selected_print.includes("normal") ||
      selected_print.includes("team") ||
      selected_print.includes("biggest_fishes") ||
      selected_print.includes("all_biggest")
    ) {
      doc.addPage();
    }
    let counter = 0;

    columns = [
      t("placement"),
      t("boat-number"),
      t("captain-name"),
      t("weight") + " (g)",
    ];

    fish_names.forEach((name) => {
      start_coord = 10;

      if (biggest_amounts[name]) {
        // So it doesn't add unnecessary page on the first loop
        if (counter > 0) {
          doc.addPage();
        }
        addTitle(doc, title, competition.cup_name, time);
        doc.setFontSize(18);
        start_coord = 50;
        rows = [];
        let last_placement = 1;
        let last_weight = 0;
        let placement = 1;
        biggest_amounts[name].sort((a, b) => b.weight - a.weight);
        biggest_amounts[name].forEach((f, i) => {
          if (f.weight === last_weight) {
            placement = last_placement;
          } else {
            placement = i + 1;
          }
          rows[i] = [
            placement + ".",
            "(" + f.boat_number + ")",
            f.captain_name,
            f.weight.toLocaleString(),
          ];
          last_placement = placement;
          last_weight = f.weight;
        });

        doc.text(
          `${t("biggest-amounts")} (${name})`,
          doc.internal.pageSize.getWidth() / 2,
          start_coord,
          {
            align: "center",
          },
        );

        doc.autoTable({
          head: [columns],
          body: rows,
          styles: {
            overflow: "linebreak",
            cellWidth: "wrap",
            rowPageBreak: "avoid",
            halign: "justify",
            fontSize: "8",
            lineColor: 100,
            lineWidth: 0.25,
          },
          columnStyles: { text: { cellwidth: "auto" } },
          theme: "striped",
          pageBreak: "auto",
          tableWidth: "auto",
          startY: start_coord + 5,
        });
        counter++;
      }
    });
  }

  // "Suurimmat Kalat (Voittajat) / Suurimmat kalasaaliit (Voittajat)"" to pdf if it's inclued in selected_print array
  if (selected_print.includes("biggest_winners")) {
    // If there is content before, start from new page
    if (
      selected_print.includes("normal") ||
      selected_print.includes("team") ||
      selected_print.includes("biggest_fishes") ||
      selected_print.includes("biggest_amounts") ||
      selected_print.includes("all_biggest")
    ) {
      doc.addPage();
    }
    // Suurimmat Kalat  (Voittajat)
    // Select these for calculations
    selected_fish = selected_amount = "winners";
    biggest_amounts_results = calculateBiggestAmounts(
      biggest_amounts,
      selected_amount,
      fish_names,
    ).results;
    biggest_fishes_results = [];
    fish_names.forEach((n) => {
      let fish = competition.fishes.find((f) => f.name === n);
      let temp_fishes = biggest_fishes.filter((f) => f.fish_id === fish.id);
      if (temp_fishes.length) {
        biggest_fishes_results.push(
          temp_fishes.sort((a, b) => b.weight - a.weight)[0],
        );
      }
    });

    columns = [
      t("fish"),
      t("boat-number"),
      t("captain-name"),
      t("weight") + " (g)",
    ];
    // If there are any results, add title
    if (biggest_fishes_results.length || biggest_amounts_results.length) {
      addTitle(doc, title, competition.cup_name, time);
      doc.setFontSize(18);
    }

    // If there are biggest fishes
    if (biggest_fishes_results.length) {
      rows = [];
      biggest_fishes_results.forEach((f, i) => {
        rows[i] = [
          f.name,
          "(" + f.boat_number + ")",
          f.captain_name,
          f.weight.toLocaleString(),
        ];
      });
      doc.text(
        `${t("biggest-fishes")} (${t(selected_fish)})`,
        doc.internal.pageSize.getWidth() / 2,
        50,
        { align: "center" },
      );
      // Table generated in code
      doc.autoTable({
        head: [columns],
        body: rows,
        styles: {
          overflow: "linebreak",
          cellWidth: "wrap",
          rowPageBreak: "avoid",
          halign: "justify",
          fontSize: "8",
          lineColor: 100,
          lineWidth: 0.25,
        },
        columnStyles: { cellwidth: "auto" },
        theme: "striped",
        pageBreak: "auto",
        tableWidth: "auto",
        margin: { top: 20 },
        startY: 55,
      });
      // Keep track of y coordinate
      start_coord = doc.lastAutoTable.finalY + 25;
    } else {
      // If no biggest fishes, biggest amounts table starts from 50 instead
      start_coord = 50;
    }

    //Suurimmat kalasaaliit (Voittajat)
    // If there are any amounts --> if someone has gotten any fish
    biggest_amounts_results = [];
    biggest_amounts_results = sortDict(biggest_amounts, fish_names);
    if (biggest_amounts_results.length) {
      rows = [];
      biggest_amounts_results.forEach((f, i) => {
        rows[i] = [
          f.name,
          "(" + f.boat_number + ")",
          f.captain_name,
          f.weight.toLocaleString(),
        ];
      });

      doc.text(
        `${t("biggest-amounts")} (${t(selected_fish)})`,
        doc.internal.pageSize.getWidth() / 2,
        start_coord,
        { align: "center" },
      );
      // Table generated in code
      doc.autoTable({
        head: [columns],
        body: rows,
        styles: {
          overflow: "linebreak",
          cellWidth: "wrap",
          rowPageBreak: "avoid",
          halign: "justify",
          fontSize: "8",
          lineColor: 100,
          lineWidth: 0.25,
        },
        columnStyles: { text: { cellwidth: "auto" } },
        theme: "striped",
        pageBreak: "auto",
        tableWidth: "auto",
        margin: { top: 20 },
        startY: start_coord + 5,
      });
    }
  }
  // "Tilastoja" to pdf if it's inclued in selected_print array
  if (selected_print.includes("stats")) {
    // If there is content before, start from new page
    if (
      selected_print.includes("normal") ||
      selected_print.includes("team") ||
      selected_print.includes("biggest_fishes") ||
      selected_print.includes("biggest_amounts") ||
      selected_print.includes("biggest_winners")
    ) {
      doc.addPage();
    }
    resizeChartForPDF();
    addTitle(doc, title, competition.cup_name, time);
    doc.setFontSize(18);
    // "Tilastot"
    // Resize charts to be better looking on a pdf
    var fishesImg = document
      .getElementById("fishes_chart")
      .toDataURL("image/png", 1.0);
    var signeeImg = document
      .getElementById("signee_chart")
      .toDataURL("image/png", 1.0);
    try {
      if (orientation === "landscape") {
        doc.addImage(fishesImg, "PNG", 50, 40, 90, 90);
        doc.addImage(signeeImg, "PNG", 160, 40, 90, 90);
      } else {
        doc.addImage(fishesImg, "PNG", 10, 40, 90, 90);
        doc.addImage(signeeImg, "PNG", 110, 40, 90, 90);
      }
    } catch (err) {
      charts_loaded = false;
      tab = "stats";
      // Try again after 1 sec
      setTimeout(() => saveAllAsPDF(current_tab), 1000);
    }
    doc.text(t("fish-specs"), doc.internal.pageSize.getWidth() / 2, 165, {
      align: "center",
    });

    columns = [
      t("fish"),
      t("multiplier"),
      t("min-size"),
      t("comp-overview.gotten-amount"),
    ];
    // Table generated straight from html
    rows = [];
    competition.fishes.forEach((f, i) => {
      rows[i] = [
        f.name,
        "x " + f.multiplier,
        f.minsize + " cm",
        Math.round((f.weights / 1000 + Number.EPSILON) * 100) / 100 + " kg",
      ];
    });
    let temp =
      Math.round((competition.total_weights / 1000 + Number.EPSILON) * 100) /
      100;
    let total_amount = temp.toLocaleString() + " kg";
    rows.push([t("total-big"), "", "", total_amount]);

    doc.autoTable({
      head: [columns],
      body: rows,
      styles: {
        overflow: "linebreak",
        cellWidth: "wrap",
        rowPageBreak: "avoid",
        halign: "justify",
        fontSize: "8",
        lineColor: 100,
        lineWidth: 0.25,
      },
      columnStyles: { text: { cellwidth: "auto" } },
      theme: "striped",
      pageBreak: "auto",
      tableWidth: "auto",
      startY: 170,
      margin: { top: 20 },
    });

    doc.text(
      "Yleisiä tilastoja",
      doc.internal.pageSize.getWidth() / 2,
      doc.lastAutoTable.finalY + 20,
      {
        align: "center",
      },
    );
    // Generate table
    columns = ["", ""];
    rows = [
      [`Cup ${t("multiplier")} `, `x ${competition.cup_points_multiplier}`],
      [`${t("signees")} ${t("total")}`, `${signees.length} kpl`],
      [
        t("comp-overview.gotten-fish"),
        `${
          Math.round((hasGottenFishCount / signees.length) * 100 * 100) / 100
        } % (${hasGottenFishCount}/${signees.length})`,
      ],
    ];
    doc.autoTable({
      head: [columns],
      body: rows,
      styles: {
        overflow: "linebreak",
        cellWidth: "wrap",
        rowPageBreak: "avoid",
        halign: "justify",
        fontSize: "8",
        lineColor: 100,
        lineWidth: 0.25,
      },
      columnStyles: { text: { cellwidth: "auto" } },
      theme: "striped",
      pageBreak: "auto",
      tableWidth: "auto",
      margin: { top: 20 },
      startY: doc.lastAutoTable.finalY + 25,
    });
    // Set charts to be responsive again
    setChartsResponsive();
  }

  initChartData(
    competition.fishes,
    fish_names,
    hasGottenFishCount,
    signees.length,
  );

  // Save to pdf
  if (charts_loaded) {
    tab = current_tab;
    const fileName = `${year}_${replaceAll(competition.name, " ", "")}${t(
      "results",
    )}.pdf`;
    openPdfOnNewTab(doc, fileName);
  } else {
    text = t("errors.charts-missing");
    snackbar = true;
  }

  return { tab, text, snackbar };
}
