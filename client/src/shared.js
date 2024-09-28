import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";

export function addTitle(doc, title, cup, time) {
  doc.setFontSize(24);
  doc.text(10, 10, title, { align: "left" });
  doc.setFontSize(14);
  doc.text(10, 20, cup, { align: "left" });
  doc.text(10, 30, time, { align: "left" });
  doc.line(0, 35, 400, 35);
}

export function cupDictToArray(results, competitions, type) {
  const arr = [];
  let boat_number = 1;
  let missing_numbers = false;
  results.forEach((boat) => {
    let values = [];
    if (type === "cup_total_points") {
      values[0] = `${boat.final_placement}.`;
      values[1] = `(${boat.boat_number})`;
      values[2] = `${boat.captain_name}`;
      values[3] = `${boat.locality}`;
      let counter = 4;
      competitions.forEach((competition) => {
        if (boat.cup_results[competition.key_name]) {
          values[counter] = `${
            boat.cup_results[competition.key_name].points
          }p (${boat.cup_results[competition.key_name].placement}.)`;
        } else {
          values[counter] = "-";
        }
        counter++;
      });
      values[counter] = `${boat.cup_results["total"]}p`;
    }

    if (type === "signees") {
      if (boat.boat_number > boat_number) {
        // values[0] is bigger than the next boat_number should be, so there is a gap
        missing_numbers = true;
        for (let i of range(boat_number, boat.boat_number)) {
          // When the i reaches the value boat_number should be, add the next real row
          if (i === boat.boat_number) {
            values[0] = String(boat.boat_number);
            values[1] = boat.captain_name;
            values[2] = boat.temp_captain_name;
            values[3] = boat.locality;
            missing_numbers = false;
            // Else just push empty rows until then
          } else {
            boat_number++;
            arr.push([String(i) + "*", "", "", ""]);
          }
        }
      } else {
        values[0] = String(boat.boat_number);
        values[1] = boat.captain_name;
        values[2] = boat.temp_captain_name;
        values[3] = boat.locality;
      }
    }

    // If there are gaps in boat_numbers --> 1, 2, 4, 5, 7, etc.
    if (!missing_numbers) {
      boat_number++;
    }
    arr.push(values);
  });

  return arr;
}

// Capitalize all the words in given string. Takes account all the characters like "-", "'" etc.
export function capitalize_words(str) {
  return str.replace(
    /(?:^|\s|['`‘’.-])[^\x60^\x7B-\xDF](?!(\s|$))/g,
    function (txt) {
      return txt.toUpperCase();
    }
  );
}

export function replaceAllChars(text, obj) {
  return [...text]
    .map((each) => {
      for (const o in obj) {
        each == o ? (each = obj[o]) : o;
      }
      return each;
    })
    .join("");
}

// For naming the pdf, replace certain characters
export function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

// Returns date in format dd/mm/yyyy as string
export function formatDate(start_date) {
  start_date = moment(start_date);
  let formatted_date = `${start_date.date()}.${
    start_date.month() + 1
  }.${start_date.year()}`;

  return formatted_date;
}
// Convert the charts and the tables to pdf
export function saveAsPDF(
  competition_type,
  table_id,
  orientation = "portrait"
) {
  // Format dates for easier reding
  let temp_start_date = formatDate(this.competition.start_date);
  let temp_end_date = formatDate(this.competition.end_date);
  let rows = [];
  let columns;
  let pdf_competition_type;
  // PDF creation
  let doc = new jsPDF({ orientation: orientation });
  // Title
  const title = `${this.competition.name}`;
  const date =
    temp_start_date === temp_end_date
      ? String(temp_start_date)
      : `${temp_start_date} - ${temp_end_date}`;
  const time = `${date}, Klo. ${this.competition.start_time} - ${this.competition.end_time}`;
  addTitle(doc, title, this.competition.cup_name, time);
  doc.setFontSize(20);

  if (table_id === "#normal-table") {
    pdf_competition_type = `Normaalikilpailu${this.selected_normal}`;
    // Other tables are generated in code so no need to wait for rendering to html
    if (this.selected_normal === "Pisteet") {
      columns = [
        "Sijoitus",
        "Nro.",
        "Kippari",
        "Varakippari",
        "Paikkakunta",
        "Tulos (p)",
        "Cup (p)",
      ];
      // Format dictionary/json to format that autotable understands (arrays in arrays);
      this.normal_points.forEach((b, i) => {
        rows[i] = [
          b.placement + ".",
          "(" + b.boat_number + ")",
          b.captain_name,
          b.temp_captain_name,
          b.locality,
          b.total_points.toLocaleString(),
          b.cup_points_total,
        ];
      });
    }
    if (this.selected_normal === "Kalat") {
      columns = ["Sijoitus", "Nro.", "Kippari"];
      // Get fish names for columns
      this.table_fish_names.forEach((name) => {
        columns.push(name + " (g)");
      });
      columns.push("Tulos (p)");
      // Format dictionary/json to format that autotable understands (arrays in arrays);
      this.normal_weights.forEach((b, i) => {
        let r = [];
        r = [b.placement + ".", "(" + b.boat_number + ")", b.captain_name];
        this.table_fish_names.forEach((name) => {
          r.push(b[name].toLocaleString());
        });
        r.push(b.total_points.toLocaleString());
        rows[i] = r;
      });
    }
    if (this.selected_normal === "Ilmoittautuneet") {
      columns = [
        "Kilp. numero",
        "Kippari",
        "Varakippari",
        "Paikkakunta",
        "Lähtöpaikka",
      ];
      if (this.isTeamCompetition) {
        columns.push("Tiimi");
      }
      // Format dictionary/json to format that autotable understands (arrays in arrays);
      this.$store.getters.getSignees.forEach((b, i) => {
        rows[i] = [
          "(" + b.boat_number + ")",
          b.captain_name,
          b.temp_captain,
          b.locality,
          b.starting_place,
        ];
      });
    }
  }

  if (table_id === "#team-table") {
    pdf_competition_type = `Tiimikilpailu`;
    // Other tables are generated in code so no need to wait for rendering to html
    columns = [
      "Sijoitus",
      "Tiimi",
      "Jäsen 1",
      "Jäsen 2",
      "Jäsen 3",
      "Pisteet (p)",
    ];
    // Format dictionary/json to format that autotable understands (arrays in arrays);
    rows = [];
    this.team_results.forEach((b, i) => {
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
    pdf_competition_type = `SuurimmatKalat${this.selected_biggest_fish}`;

    if (this.selected_biggest_fish === "Voittajat") {
      columns = ["Kalalaji", "Veneen nro", "Kippari", "Paino (g)"];
      this.biggest_fishes_results.forEach((f, i) => {
        rows[i] = [
          f.name,
          "(" + f.boat_number + ")",
          f.captain_name,
          f.weight.toLocaleString(),
        ];
      });
    } else if (this.selected_biggest_fish === "Kaikki") {
      columns = ["Sijoitus", "Veneen nro", "Kippari", "Kala", "Paino (g)"];
      this.biggest_fishes_results.forEach((f, i) => {
        rows[i] = [
          f.placement + ".",
          "(" + f.boat_number + ")",
          f.captain_name,
          f.name,
          f.weight.toLocaleString(),
        ];
      });
    } else {
      columns = ["Sijoitus", "Veneen nro", "Kippari", "Paino (g)"];
      this.biggest_fishes_results.forEach((f, i) => {
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
    pdf_competition_type = `SuurimmatSaaliit${this.selected_biggest_amount}`;

    if (this.selected_biggest_amount === "Voittajat") {
      columns = ["Kalalaji", "Veneen nro", "Kippari", "Paino (g)"];
      this.biggest_amounts_results.forEach((f, i) => {
        rows[i] = [
          f.name,
          "(" + f.boat_number + ")",
          f.captain_name,
          f.weight.toLocaleString(),
        ];
      });
    } else if (this.selected_biggest_amount === "Kaikki") {
      columns = ["Sijoitus", "Veneen nro", "Kippari", "Kala", "Paino (g)"];
      this.biggest_amounts_results.forEach((f, i) => {
        rows[i] = [
          f.placement + ".",
          "(" + f.boat_number + ")",
          f.captain_name,
          f.name,
          f.weight.toLocaleString(),
        ];
      });
    } else {
      columns = ["Sijoitus", "Veneen nro", "Kippari", "Paino (g)"];
      this.biggest_amounts_results.forEach((f, i) => {
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
  const fileName = `${this.$moment(
    this.competition.start_date
  ).year()}_${this.replaceAll(
    this.competition.name,
    " ",
    ""
  )}_${pdf_competition_type}.pdf`;
  openPdfOnNewTab(doc, fileName);
  // Set charts to be responsive again
}

export function saveStatsAsPDF(competition_type, orientation = "portrait") {
  resizeChartForPDF();
  // Format dates for easier reding
  let temp_start_date = formatDate(this.competition.start_date);
  let temp_end_date = formatDate(this.competition.end_date);

  let doc = new jsPDF({ orientation: orientation });

  // Title
  const title = `${this.competition.name}`;
  const date =
    temp_start_date === temp_end_date
      ? String(temp_start_date)
      : `${temp_start_date} - ${temp_end_date}`;
  const time = `${date}, Klo. ${this.competition.start_time} - ${this.competition.end_time}`;
  addTitle(doc, title, this.competition.cup_name, time);
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

  doc.text(
    "Kalalajien määritykset",
    doc.internal.pageSize.getWidth() / 2,
    145,
    { align: "center" }
  );
  // Generate table
  let rows = [];

  this.competition.fishes.forEach((f, i) => {
    rows[i] = [
      f.name,
      "x " + f.multiplier,
      f.minsize + " cm",
      Math.round((f.weights / 1000 + Number.EPSILON) * 100) / 100 + " kg",
    ];
  });
  let temp =
    Math.round((this.competition.total_weights / 1000 + Number.EPSILON) * 100) /
    100;
  let total_amount = temp.toLocaleString() + " kg";
  rows.push(["Yhteensä", "", "", total_amount]);
  let columns = ["Kalalaji", "Kerroin", "Alamitta", "Saalista saatu"];
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
    "Yleisiä tilastoja",
    doc.internal.pageSize.getWidth() / 2,
    doc.autoTable.previous.finalY + 20,
    {
      align: "center",
    }
  );

  columns = ["", ""];
  rows = [
    ["Cup pistekerroin", `x ${this.competition.cup_points_multiplier}`],
    ["Ilmoittautuneita yhteensä", `${this.signees.length} kpl`],
    [
      "Saalista saaneita",
      `${
        Math.round(
          (this.hasGottenFishCount / this.signees.length) * 100 * 100
        ) / 100
      } % (${this.hasGottenFishCount}/${this.signees.length})`,
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
    startY: doc.autoTable.previous.finalY + 25,
  });

  // Save the pdf
  const fileName = `${this.$moment(
    this.competition.start_date
  ).year()}_${this.replaceAll(
    this.competition.name,
    " ",
    ""
  )}_${this.replaceAll(this.capitalize_words(competition_type), " ", "")}.pdf`;
  openPdfOnNewTab(doc, fileName);
  // Set charts to be responsive again
  setChartsResponsive();
}
// Saves all the chosen tables to pdf
export function saveAllAsPDF(tab, orientation = "portrait") {
  let current_tab = tab;
  let charts_loaded = true;
  let temp_selected_biggest_fish = this.selected_biggest_fish;
  let temp_selected_biggest_amount = this.selected_biggest_amount;
  let temp_selected_normal = this.selected_normal;
  // Format dates for easier reding
  let temp_start_date = formatDate(this.competition.start_date);
  let temp_end_date = formatDate(this.competition.end_date);
  let year = this.$moment(this.competition.start_date).year();

  let doc = new jsPDF({ orientation: orientation });

  // Title
  const title = `${this.competition.name}`;
  const date =
    temp_start_date === temp_end_date
      ? String(temp_start_date)
      : `${temp_start_date} - ${temp_end_date}`;
  const time = `${date}, Klo. ${this.competition.start_time} - ${this.competition.end_time}`;
  addTitle(doc, title, this.competition.cup_name, time);
  doc.setFontSize(18);
  // start_coord needed to keep track of y coordinates for tables (if there are no results -> no table drawn to pdf -> varying coordinates)
  let start_coord;
  let rows = [];
  let columns;
  //Normaalikilpailu (Pisteet), saved to pdf if it's inclued in this.selected_print array
  if (this.selected_print.includes("normal")) {
    //Normaalikilpailu (Kalat)
    columns = ["Sijoitus", "Nro.", "Kippari"];
    // Get fish names for columns
    this.table_fish_names.forEach((name) => {
      columns.push(name + " (g)");
    });
    columns.push("Tulos (p)");

    this.normal_weights.forEach((b, i) => {
      let r = [];
      r = [b.placement + ".", "(" + b.boat_number + ")", b.captain_name];

      this.table_fish_names.forEach((name) => {
        r.push(b[name].toLocaleString());
      });
      r.push(b.total_points.toLocaleString());
      rows[i] = r;
    });

    doc.text(
      "Normaalikilpailun tulokset (Kalat)",
      doc.internal.pageSize.getWidth() / 2,
      50,
      {
        align: "center",
      }
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
    addTitle(doc, title, this.competition.cup_name, time);
    doc.setFontSize(18);
    columns = [
      "Sijoitus",
      "Nro.",
      "Kippari",
      "Varakippari",
      "Paikkakunta",
      "Tulos (p)",
      "Cup (p)",
    ];
    // Format dictionary/json to format that autotable understands (arrays in arrays);
    rows = [];
    this.normal_points.forEach((b, i) => {
      rows[i] = [
        b.placement + ".",
        "(" + b.boat_number + ")",
        b.captain_name,
        b.temp_captain_name,
        b.locality,
        b.total_points.toLocaleString(),
        b.cup_points_total,
      ];
    });
    doc.text(
      "Normaalikilpailun tulokset (Pisteet)",
      doc.internal.pageSize.getWidth() / 2,
      50,
      {
        align: "center",
      }
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

  // Tiimikilpailu, drawn to pdf if it exists and , if it's inclued in this.selected_print array
  if (this.isTeamCompetition && this.selected_print.includes("team")) {
    // If there is "Normaalikilpailun tulokset" selected also, start from new page
    if (this.selected_print.includes("normal")) {
      doc.addPage();
    }
    addTitle(doc, title, this.competition.cup_name, time);
    doc.setFontSize(18);
    doc.text(100, 50, "Tiimikilpailun tulokset", { align: "center" });
    // Add results, if there are any
    if (this.team_results.length) {
      // Other tables are generated in code so no need to wait for rendering to html
      columns = [
        "Sijoitus",
        "Tiimi",
        "Jäsen 1",
        "Jäsen 2",
        "Jäsen 3",
        "Pisteet (p)",
      ];
      // Format dictionary/json to format that autotable understands (arrays in arrays);
      rows = [];
      this.team_results.forEach((b, i) => {
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

  // Suurimmat kalat/kalasaaliit (Kaikki) to pdf if it's inclued in this.selected_print array
  if (this.selected_print.includes("all_biggest")) {
    // If there is content before, start from new page
    if (
      this.selected_print.includes("normal") ||
      this.selected_print.includes("team")
    ) {
      doc.addPage();
    }
    // Suurimmat Kalat  (Kaikki)
    // Select these for calculations
    this.selected_biggest_fish = this.selected_biggest_amount = "Kaikki";
    columns = ["Sijoitus", "Veneen nro", "Kippari", "Kala", "Paino (g)"];

    // If there are any results, add title
    if (
      this.biggest_fishes_results.length ||
      this.biggest_amounts_results.length
    ) {
      addTitle(doc, title, this.competition.cup_name, time);
      doc.setFontSize(18);
    }

    // If there are biggest fishes
    if (this.biggest_fishes_results.length) {
      rows = [];
      this.biggest_fishes_results.forEach((f, i) => {
        rows[i] = [
          f.placement + ".",
          "(" + f.boat_number + ")",
          f.captain_name,
          f.name,
          f.weight.toLocaleString(),
        ];
      });
      doc.text(
        "Suurimmat kalat" + ` (${this.selected_biggest_fish})`,
        doc.internal.pageSize.getWidth() / 2,
        50,
        { align: "center" }
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
      start_coord = doc.autoTable.previous.finalY + 25;
    } else {
      // If no biggest fishes, biggest amounts table starts from 50 instead
      start_coord = 50;
    }

    //Suurimmat kalasaaliit (Kaikki)
    // If there are any amounts --> if someone has gotten any fish
    if (this.biggest_amounts_results.length) {
      rows = [];
      this.biggest_amounts_results.forEach((f, i) => {
        rows[i] = [
          f.placement + ".",
          "(" + f.boat_number + ")",
          f.captain_name,
          f.name,
          f.weight.toLocaleString(),
        ];
      });
      doc.text(
        "Suurimmat kalasaaliit" + ` (${this.selected_biggest_fish})`,
        doc.internal.pageSize.getWidth() / 2,
        start_coord,
        { align: "center" }
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

  //"Suurimmat kalat" to pdf if it's inclued in this.selected_print array
  if (this.selected_print.includes("biggest_fishes")) {
    // If there is content before, start from new page
    if (
      this.selected_print.includes("normal") ||
      this.selected_print.includes("team") ||
      this.selected_print.includes("all_biggest")
    ) {
      doc.addPage();
    }
    let counter = 0;
    // For each fish, generate tables for "Suurimmat Kalat (Kala)" and "Suurimmat Kalasaaliit (Kala)"
    this.table_fish_names.forEach((name) => {
      // Same process as above, but for every fish instead of only winners
      this.selected_biggest_fish = name;
      start_coord = 10;

      if (this.biggest_fishes_results.length) {
        // So it doesn't add unnecessary page on the first loop
        if (counter > 0) {
          doc.addPage();
        }
        addTitle(doc, title, this.competition.cup_name, time);
        doc.setFontSize(18);
        start_coord = 50;

        columns = ["Sijoitus", "Veneen nro", "Kippari", "Paino  (g)"];
        rows = [];
        this.biggest_fishes_results.forEach((f, i) => {
          rows[i] = [
            f.placement + ".",
            "(" + f.boat_number + ")",
            f.captain_name,
            f.weight.toLocaleString(),
          ];
        });

        doc.text(
          "Suurimmat kalat" + ` (${name})`,
          doc.internal.pageSize.getWidth() / 2,
          start_coord,
          {
            align: "center",
          }
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

  // Suurimmat kalasaaliit to pdf if it's inclued in this.selected_print array
  if (this.selected_print.includes("biggest_amounts")) {
    // If there is content before, start from new page
    if (
      this.selected_print.includes("normal") ||
      this.selected_print.includes("team") ||
      this.selected_print.includes("biggest_fishes") ||
      this.selected_print.includes("all_biggest")
    ) {
      doc.addPage();
    }
    let counter = 0;
    columns = ["Sijoitus", "Veneen nro", "Kippari", "Paino (g)"];
    this.table_fish_names.forEach((name) => {
      this.selected_biggest_amount = name;
      start_coord = 10;

      if (this.biggest_amounts[name].length) {
        // So it doesn't add unnecessary page on the first loop
        if (counter > 0) {
          doc.addPage();
        }
        addTitle(doc, title, this.competition.cup_name, time);
        doc.setFontSize(18);
        start_coord = 50;
        rows = [];

        let last_weight = -1;
        let last_placement = -1;
        let placement = 1;
        this.biggest_amounts[name].sort((a, b) => b.weight - a.weight);
        this.biggest_amounts[name].forEach((f, i) => {
          // no placements on some amounts??? TODO FIX. Quick fix for now
          if (!f.placement) {
            if (f.weight === last_weight) {
              f.placement = last_placement;
            } else {
              f.placement = last_placement = placement;
              last_weight = f.weight;
            }
          }
          rows[i] = [
            f.placement + ".",
            "(" + f.boat_number + ")",
            f.captain_name,
            f.weight.toLocaleString(),
          ];
          placement++;
        });

        doc.text(
          "Suurimmat kalasaaliit" + ` (${name})`,
          doc.internal.pageSize.getWidth() / 2,
          start_coord,
          {
            align: "center",
          }
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

  // "Suurimmat Kalat (Voittajat) / Suurimmat kalasaaliit (Voittajat)"" to pdf if it's inclued in this.selected_print array
  if (this.selected_print.includes("biggest_winners")) {
    // If there is content before, start from new page
    if (
      this.selected_print.includes("normal") ||
      this.selected_print.includes("team") ||
      this.selected_print.includes("biggest_fishes") ||
      this.selected_print.includes("biggest_amounts") ||
      this.selected_print.includes("all_biggest")
    ) {
      doc.addPage();
    }
    // Suurimmat Kalat  (Voittajat)
    // Select these for calculations
    this.selected_biggest_fish = this.selected_biggest_amount = "Voittajat";

    this.biggest_fishes_results = [];
    this.table_fish_names.forEach((n) => {
      let temp_fishes = this.biggest_fishes.filter((f) => f.name === n);
      if (temp_fishes.length) {
        this.biggest_fishes_results.push(
          temp_fishes.sort((a, b) => b.weight - a.weight)[0]
        );
      }
    });

    columns = ["Kalalaji", "Veneen nro", "Kippari", "Paino (g)"];

    // If there are any results, add title
    if (
      this.biggest_fishes_results.length ||
      this.biggest_amounts_results.length
    ) {
      addTitle(doc, title, this.competition.cup_name, time);
      doc.setFontSize(18);
    }

    // If there are biggest fishes
    if (this.biggest_fishes_results.length) {
      rows = [];
      this.biggest_fishes_results.forEach((f, i) => {
        rows[i] = [
          f.name,
          "(" + f.boat_number + ")",
          f.captain_name,
          f.weight.toLocaleString(),
        ];
      });
      doc.text(
        "Suurimmat kalat" + ` (${this.selected_biggest_fish})`,
        doc.internal.pageSize.getWidth() / 2,
        50,
        { align: "center" }
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
      start_coord = doc.autoTable.previous.finalY + 25;
    } else {
      // If no biggest fishes, biggest amounts table starts from 50 instead
      start_coord = 50;
    }

    //Suurimmat kalasaaliit (Voittajat)
    // If there are any amounts --> if someone has gotten any fish
    this.biggest_amounts_results = [];
    this.biggest_amounts_results = this.sortDict(this.biggest_amounts);
    if (this.biggest_amounts_results.length) {
      rows = [];
      this.biggest_amounts_results.forEach((f, i) => {
        rows[i] = [
          f.name,
          "(" + f.boat_number + ")",
          f.captain_name,
          f.weight.toLocaleString(),
        ];
      });
      doc.text(
        "Suurimmat kalasaaliit" + ` (${this.selected_biggest_fish})`,
        doc.internal.pageSize.getWidth() / 2,
        start_coord,
        { align: "center" }
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
  // "Tilastoja" to pdf if it's inclued in this.selected_print array
  if (this.selected_print.includes("stats")) {
    // If there is content before, start from new page
    if (
      this.selected_print.includes("normal") ||
      this.selected_print.includes("team") ||
      this.selected_print.includes("biggest_fishes") ||
      this.selected_print.includes("biggest_amounts") ||
      this.selected_print.includes("biggest_winners")
    ) {
      doc.addPage();
    }
    resizeChartForPDF();
    addTitle(doc, title, this.competition.cup_name, time);
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
      this.tab = "stats";
      // Try again after 1 sec
      setTimeout(() => this.saveAllAsPDF(current_tab), 1000);
    }
    doc.text(
      "Kalalajien määritykset",
      doc.internal.pageSize.getWidth() / 2,
      165,
      { align: "center" }
    );

    columns = ["Kalalaji", "Kerroin", "Alamitta", "Saalista saatu"];
    // Table generated straight from html
    rows = [];
    this.competition.fishes.forEach((f, i) => {
      rows[i] = [
        f.name,
        "x " + f.multiplier,
        f.minsize + " cm",
        Math.round((f.weights / 1000 + Number.EPSILON) * 100) / 100 + " kg",
      ];
    });
    let temp =
      Math.round(
        (this.competition.total_weights / 1000 + Number.EPSILON) * 100
      ) / 100;
    let total_amount = temp.toLocaleString() + " kg";
    rows.push(["Yhteensä", "", "", total_amount]);

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
      doc.autoTable.previous.finalY + 20,
      {
        align: "center",
      }
    );
    // Generate table
    columns = ["", ""];
    rows = [
      ["Cup pistekerroin", `x ${this.competition.cup_points_multiplier}`],
      ["Ilmoittautuneita yhteensä", `${this.signees.length} kpl`],
      [
        "Saalista saaneita",
        `${
          Math.round(
            (this.hasGottenFishCount / this.signees.length) * 100 * 100
          ) / 100
        } % (${this.hasGottenFishCount}/${this.signees.length})`,
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
      startY: doc.autoTable.previous.finalY + 25,
    });
    // Set charts to be responsive again
    setChartsResponsive();
  }

  // Reset variables
  this.selected_biggest_fish = temp_selected_biggest_fish;
  this.selected_biggest_amount = temp_selected_biggest_amount;
  this.selected_normal = temp_selected_normal;
  initChartData;

  // Save to pdf
  if (charts_loaded) {
    this.tab = current_tab;
    const fileName = `${year}_${this.replaceAll(
      this.competition.name,
      " ",
      ""
    )}Tulokset.pdf`;
    openPdfOnNewTab(doc, fileName);
  } else {
    this.text = "Kaaviot ei ruudulla, yritetään uudelleen...";
    this.snackbar = true;
  }
}

export function resizeChartForPDF() {
  const Chart = require("chart.js");
  for (var id in Chart.instances) {
    let chart = Chart.instances[id];
    // Resize charts to fit pdf nicely
    chart.canvas.parentNode.style.height = "400px";
    chart.canvas.parentNode.style.width = "800px";
    chart.resize();
  }
}

export function setChartsResponsive() {
  const Chart = require("chart.js");
  for (var id in Chart.instances) {
    let chart = Chart.instances[id];
    // Resize charts back to original width
    chart.canvas.parentNode.style.height = "";
    chart.canvas.parentNode.style.width = "";
    chart.resize();
  }
}

// Custom range function for for loop, with recursion which is more efficient
export function* range(start, end) {
  yield start;
  if (start === end) return;
  yield* range(start + 1, end);
}

export function getColor(placement) {
  if (placement === 1) return "yellow";
  else if (placement > 1 && placement <= 10) return "green";
  else return "orange";
}

export function getMultiplierColor(multiplier) {
  if (multiplier > 1) return "red";
  if (multiplier === 1) return "green";
  else return "grey";
}

export function getColorPoints(points) {
  if (points > 5) return "primary darken-2";
  else return "red";
}

// Parse data, define charts, draw them
export function initChartData(
  weights,
  fishNames,
  signeesWithPoints,
  totalSignees
) {
  let temp_weights = [];
  let colors = [];

  // Get fish weights, and color from array for fishesChart
  weights.forEach((fish) => {
    temp_weights.push(fish.weights);
    colors.push(fish.color);
  });

  const fishes_chart_data = {
    labels: fishNames,
    datasets: [
      {
        label: "Paino",
        backgroundColor: colors,
        data: temp_weights, // Weights
      },
    ],
  };

  const signee_chart_data = {
    labels: ["Kyllä", "Ei saalista"],
    datasets: [
      {
        label: "Lukumäärä",
        backgroundColor: ["#7fbf7f", "#ff7f7f"],
        data: [signeesWithPoints, totalSignees - signeesWithPoints], // Data
      },
    ],
  };

  return {
    fishes_chart: { title: "Kaloja saatu yhteensä", data: fishes_chart_data },
    signee_chart: { title: "Saalista saaneita", data: signee_chart_data },
  };
}

// Sorts the dictionary based on weights
export function sortDict(fishes) {
  if (fishes) {
    let all_results = [];
    let temp_results = [];
    this.table_fish_names.forEach((name) => {
      // If fish name is not "Voittajat"
      if (name !== "Voittajat") {
        // For every fish name, sort the array
        if (fishes[name]) {
          temp_results = fishes[name].sort(function compare(a, b) {
            return parseInt(b.weight) - parseInt(a.weight);
          });
          fishes[name] = temp_results.filter((result) => result.weight > 0);
          // Now it's sorted so first element is fine for "voittajat" table
          if (fishes[name].length) {
            all_results.push({
              name: name,
              boat_number: temp_results[0].boat_number,
              captain_name: temp_results[0].captain_name,
              weight: temp_results[0].weight.toLocaleString(),
            });
          }
        }
      }
    });

    return fishes, all_results;
  } else {
    return {}, [];
  }
}

/**
 * HSV to RGB color conversion
 *
 * H runs from 0 to 360 degrees
 * S and V run from 0 to 100
 *
 * Ported from the excellent java algorithm by Eugene Vishnevsky at:
 * http://www.cs.rit.edu/~ncs/color/t_convert.html
 */
export function HSVtoRGB(h, s, v) {
  var r, g, b;
  var i;
  var f, p, q, t;

  // Make sure our arguments stay in-range
  h = Math.max(0, Math.min(360, h));
  s = Math.max(0, Math.min(100, s));
  v = Math.max(0, Math.min(100, v));

  s /= 100;
  v /= 100;

  if (s == 0) {
    // Achromatic (grey)
    r = g = b = v;
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  h /= 60; // sector 0 to 5
  i = Math.floor(h);
  f = h - i; // factorial part of h
  p = v * (1 - s);
  q = v * (1 - s * f);
  t = v * (1 - s * (1 - f));

  switch (i) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;

    case 1:
      r = q;
      g = v;
      b = p;
      break;

    case 2:
      r = p;
      g = v;
      b = t;
      break;

    case 3:
      r = p;
      g = q;
      b = v;
      break;

    case 4:
      r = t;
      g = p;
      b = v;
      break;

    default:
      // case 5:
      r = v;
      g = p;
      b = q;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function getRandomColors(totalNumber) {
  var i = 360 / (totalNumber - 1); // distribute the colors evenly on the hue range
  var colors = []; // hold the generated colors
  const max = 90;
  const min = 50;
  for (var x = 0; x < totalNumber; x++) {
    let s = Math.floor(Math.random() * (max - min)) + min;
    let v = Math.floor(Math.random() * (max - min)) + min;
    const rgb = this.HSVtoRGB(i * x, s, v);
    colors.push(`rgb(${rgb.r},${rgb.g},${rgb.b})`); // you can also alternate the saturation and value for even more contrast between the colors
  }
  return colors;
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
      "height=auto,width=auto,scrollbars=yes,location=yes"
    );

    // For Firefox it is necessary to delay revoking the ObjectURL
    setTimeout(() => {
      window.URL.revokeObjectURL(doc.output("bloburl"));
    }, 100);
  }
}

export function sortBy(field, isAscending) {
  return function (a, b) {
    if (isAscending) {
      return (b[field] < a[field]) - (b[field] > a[field]);
    } else {
      return (b[field] > a[field]) - (b[field] < a[field]);
    }
  };
}

export function getMultiplierTextColor(multiplier) {
  if (multiplier === 1) return "green";
  else if (multiplier > 1 && multiplier < 25) return "orange";
  else return "red";
}

export function competitionToResults(competition) {
  const results = [];
  competition.normal_weights.forEach((e) => {
    let b = competition.normal_points.find(
      (boat) => boat.boat_number === e.boat_number
    );
    let result = {
      boat_number: e.boat_number,
      captain_name: e.captain_name,
      crew: [b.temp_captain_name],
      fishes: [],
      competition_id: competition._id.$oid,
      createdAt: new Date(),
    };
    competition.fishes.forEach((f) => {
      result.fishes.push({
        name: f.name,
        weight: e[f.name],
      });
    });
    results.push(result);
  });
  return results;
}

export function competitionToFishes(competition) {
  const fishes = [];
  for (const [key, value] of Object.entries(competition.biggest_fishes)) {
    value.forEach((f) => {
      fishes.push({
        boat_number: f.boat_number,
        captain_name: f.captain_name,
        fish: key,
        weight: f.weight,
        competition_id: competition._id.$oid,
        createdAt: new Date(),
      });
    });
  }
  return fishes;
}

// "Normaalikilpailu" results
export function calculateNormalResults(competition) {
  const placement_points = competition.cup_placement_points;
  let cup_placement_points = placement_points[0];
  const cup_participation_points = competition.cup_participation_points;
  let last_points = -1;
  let last_placement = -1;

  let placement = 1;
  let cup_points_total = 0;
  let normal_points = [];
  let normal_weights = [];
  let signees = competition.signees.filter((signee) => signee.returned == true);
  // TODO calculate total points from signee.fishes
  /*
      signees = signees.sort(function compare(a, b) {
        return parseInt(b.total_points) - parseInt(a.total_points);
      });
*/
  // For every signee, calculate their cup points and placing
  //TODO rework the structure, seems more complex than it should be
  // Placements and points now saved in every competition to cup_placement_points_array, based on placement fetch from there?
  signees.forEach((signee, index) => {
    // If competitor has same points as last competitor
    if (signee.total_points == last_points) {
      placement = last_placement;
    }
    // If no tie, add tied_competitors to placement, to give correct placement to next not tied competitor
    else {
      placement = index + 1;
      last_points = signee.total_points;
      last_placement = signee.placement;
    }

    // Find the placement points according to the placement
    let p = placement_points.find((e) => e.placement === placement);
    // If placement isn't found (placement > than provided placements), or points = 0 (no points from competition)
    if (!p || signee.total_points === 0) {
      cup_placement_points = 0;
    } else {
      cup_placement_points = p.points * competition.cup_points_multiplier;
    }
    // Calculate total cup points, cup points multiplier only scales the placement points
    cup_points_total = cup_placement_points + cup_participation_points;
    //For showing cup points, "Pisteet" on v-select
    normal_points.push({
      placement: placement,
      boat_number: signee.boat_number,
      captain_name: signee.captain_name,
      temp_captain_name: signee.temp_captain_name,
      locality: signee.locality,
      total_points: signee.total_points.toLocaleString(),
      cup_placement_points: cup_placement_points,
      cup_participation_points: cup_participation_points,
      cup_points_total: cup_points_total,
    });

    //For showing fish weights, "Kalat" on v-select
    let temp_dict = {};
    temp_dict.placement = placement;
    temp_dict.boat_number = signee.boat_number;
    temp_dict.captain_name = signee.captain_name;

    // For each fish, get the weight and fish name
    signee.weights.forEach((weights) => {
      let name = weights.name;
      let weight = weights.weights;
      temp_dict[name] = weight;
    });
    temp_dict.total_points = signee.total_points;
    normal_weights.push(temp_dict);
    last_points = signee.total_points;
  });

  let output = {
    normal_points: normal_points,
    normal_weights: normal_weights,
  };

  return output;
}

export function calculateTeamResults(competition) {
  let signees = competition.signees;
  var team_names = [];
  let team_results = [];
  // Get all the team names
  signees.forEach((signee) => {
    if (signee.team !== "-" && signee.team !== null) {
      team_names.push(signee.team);
    }
  });
  // Only unique ones needed
  team_names = [...new Set(team_names)];

  // Get all the members of each team and add up their points
  team_names.forEach((team_name) => {
    let team = signees.filter((signee) => signee.team == team_name);
    let team_points = 0;
    let members = [];

    team.forEach((member) => {
      members.push(member.captain_name);
      team_points += member.total_points;
    });

    // If there aren't 3 members in a team, add "-"'s as members for nicer looking table
    if (members.length === 1) {
      members.push("-");
      members.push("-");
    }
    if (members.length === 2) {
      members.push("-");
    }
    team_results.push({
      name: team_name,
      captain_name_1: members[0],
      captain_name_2: members[1],
      captain_name_3: members[2],
      points: team_points.toLocaleString(),
    });
  });

  return team_results;
}

export default {
  setChartsResponsive,
  resizeChartForPDF,
  saveAllAsPDF,
  saveStatsAsPDF,
  saveAsPDF,
  cupDictToArray,
  capitalize_words,
  replaceAll,
  formatDate,
  range,
  getMultiplierColor,
  getMultiplierTextColor,
  getColorPoints,
  getColor,
  initChartData,
  sortDict,
  HSVtoRGB,
  getRandomColors,
  openPdfOnNewTab,
  sortBy,
  replaceAllChars,
  competitionToResults,
  competitionToFishes,
};
