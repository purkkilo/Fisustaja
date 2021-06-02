import jsPDF from "jspdf";
import "jspdf-autotable";
import M from "materialize-css";
// Parses dictionary/json to array, for pdf autotables
function dictToArray(dict, type) {
  const temp_arr = Object.entries(dict);
  const arr = [];
  temp_arr.forEach((element) => {
    let values = Object.values(element[1]);
    // Normaalikilpailu, pisteet
    if (type === 1) {
      values[0] = String(values[0]) + ".";
      values[1] = "(" + String(values[1]) + ")";
      values[5] = values[5].toLocaleString() + " p";
    }
    // Normaalikilpailu, kalat
    if (type === 2) {
      values[0] = String(values[0]) + ".";
      values[1] = "(" + String(values[1]) + ")";
      for (let i of range(3, values.length - 2)) {
        if (parseInt(values[i]) > 0) {
          values[i] = values[i].toLocaleString() + " g";
        } else {
          values[i] = "-";
        }
      }
      values[values.length - 1] =
        values[values.length - 1].toLocaleString() + " p";
    }
    // Suurimmat kalat, suurimmat kalasaaliit
    if (type === 3) {
      let temp_placement = values[3];
      let temp_bnumber = values[0];
      let temp_captain = values[1];
      let temp_points = values[2].toLocaleString() + " g";
      values[0] = String(temp_placement) + ".";
      values[1] = "(" + String(temp_bnumber) + ")";
      values[2] = temp_captain;
      values[3] = temp_points;
    }
    //Voittajat
    if (type === 4) {
      values[1] = "(" + String(values[1]) + ")";
      values[3] = values[values.length - 1].toLocaleString() + " g";
    }
    //Tiimikilpailu
    if (type === 5) {
      let place = values[5];
      let team = values[0];
      let captain_1 = values[1];
      let captain_2 = values[2];
      let captain_3 = values[3];
      let points = values[4];
      values[0] = String(place) + ".";
      values[1] = team;
      values[2] = captain_1;
      values[3] = captain_2;
      values[4] = captain_3;
      values[5] = points.toLocaleString() + " p";
    }
    //Normaalikilpailu, Ilmoittautuneet
    if (type === 6) {
      let b_number = values[1];
      let captain = values[3];
      let temp_captain = values[4];
      let startin_place = values[2];
      let locality = values[5];
      let team = values[6];
      values[0] = "(" + String(b_number) + ")";
      values[1] = captain;
      values[2] = temp_captain;
      values[3] = startin_place;
      values[4] = locality;
      values[5] = team;
    }
    //Kalalajien info
    if (type === 7) {
      let fish_name = values[0];
      let fish_multiplier = values[1];
      let fish_minsize = values[2];
      let fish_weights = values[3];
      values[0] = fish_name;
      values[1] = "x " + String(fish_multiplier);
      values[2] = fish_minsize;
      values[3] =
        String(Math.round((fish_weights / 1000 + Number.EPSILON) * 100) / 100) +
        " kg";
    }
    arr.push(values);
  });
  return arr;
}

// Capitalize all the words in given string. Takes account all the characters like "-", "'" etc.
function capitalize_words(str) {
  return str.replace(/(?:^|\s|['`‘’.-])[^\x60^\x7B-\xDF](?!(\s|$))/g, function(
    txt
  ) {
    return txt.toUpperCase();
  });
}

// For naming the pdf, replace certain characters
function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

// Returns date in format dd/mm/yyyy as string
function formatDate(start_date) {
  start_date = this.$moment(start_date);
  let formatted_date = `${start_date.date()}.${start_date.month() +
    1}.${start_date.year()}`;

  return formatted_date;
}
// Convert the charts and the tables to pdf
function saveAsPDF(competition_type, table_id) {
  this.onbeforeprint();
  // Format dates for easier reding
  let temp_start_date = this.formatDate(this.competition.start_date);
  let temp_end_date = this.formatDate(this.competition.end_date);
  let rows;
  let columns;
  let pdf_competition_type;
  // PDF creation
  let doc = new jsPDF();
  // Title
  const title = `${this.competition.name}`;
  const date =
    temp_start_date === temp_end_date
      ? String(temp_start_date)
      : `${temp_start_date} - ${temp_end_date}`;
  const time = `${date}, Klo. ${this.competition.start_time} - ${this.competition.end_time}`;
  doc.setFontSize(24);
  doc.text(10, 10, title, { align: "left" });
  doc.setFontSize(14);
  doc.text(10, 20, this.competition.cup_name, { align: "left" });
  doc.text(10, 30, time, { align: "left" });
  doc.line(0, 35, 400, 35);
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
        "Tulos",
        "Sij. pisteet",
        "Osal. pisteet",
        "Yht.",
      ];
      // Format dictionary/json to format that autotable understands (arrays in arrays);
      rows = this.dictToArray(this.normal_points, 1);
    }
    if (this.selected_normal === "Kalat") {
      columns = ["Sijoitus", "Nro.", "Kippari"];
      // Get fish names for columns
      this.table_fish_names.forEach((name) => {
        columns.push(name);
      });
      columns.push("Tulos");
      // Format dictionary/json to format that autotable understands (arrays in arrays);
      rows = this.dictToArray(this.normal_weights, 2);
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
      rows = this.dictToArray(this.$store.getters.getSignees, 6);
    }
  }

  if (table_id === "#team-table") {
    pdf_competition_type = `Tiimikilpailu`;
    // Other tables are generated in code so no need to wait for rendering to html
    columns = ["Sijoitus", "Tiimi", "Jäsen 1", "Jäsen 2", "Jäsen 3", "Pisteet"];
    // Format dictionary/json to format that autotable understands (arrays in arrays);
    rows = this.dictToArray(this.team_results, 5);
  }

  if (table_id === "#biggest-fishes-table") {
    pdf_competition_type = `SuurimmatKalat${this.selected_biggest_fish}`;

    if (this.selected_biggest_fish === "Voittajat") {
      columns = ["Kalalaji", "Veneen nro", "Kippari", "Paino"];
      rows = this.dictToArray(this.biggest_fishes_results, 4);
    } else {
      columns = ["Sijoitus", "Veneen nro", "Kippari", "Paino"];
      rows = this.dictToArray(this.biggest_fishes_results, 3);
    }
  }

  if (table_id === "#biggest-amounts-table") {
    pdf_competition_type = `SuurimmatSaaliit${this.selected_biggest_amount}`;

    if (this.selected_biggest_amount === "Voittajat") {
      columns = ["Kalalaji", "Veneen nro", "Kippari", "Paino"];
      rows = this.dictToArray(this.biggest_amounts_results, 4);
    } else {
      columns = ["Sijoitus", "Veneen nro", "Kippari", "Paino"];
      rows = this.dictToArray(this.biggest_amounts_results, 3);
    }
  }

  // Table, based on given table_id, and table title based on competition_type
  doc.text(100, 50, competition_type, { align: "center" });
  doc.autoTable({
    head: [columns],
    body: rows,
    styles: {
      overflow: "linebreak",
      cellWidth: "wrap",
      rowPageBreak: "avoid",
      halign: "justify",
      fontSize: "8",
      lineColor: "100",
      lineWidth: ".25",
    },
    columnStyles: { text: { cellwidth: "auto" } },
    theme: "striped",
    pageBreak: "auto",
    tableWidth: "auto",
    startY: 55,
    margin: { top: 20 },
  });
  // Save the pdf
  doc.save(
    `${this.$moment(this.competition.start_date).year()}_${this.replaceAll(
      this.competition.name,
      " ",
      ""
    )}_${pdf_competition_type}.pdf`
  );
  // Set charts to be responsive again
  this.onafterprint();
}

function saveStatsAsPDF(competition_type) {
  this.onbeforeprint();
  // Format dates for easier reding
  let temp_start_date = this.formatDate(this.competition.start_date);
  let temp_end_date = this.formatDate(this.competition.end_date);

  let doc = new jsPDF();

  // Title
  const title = `${this.competition.name}`;
  const date =
    temp_start_date === temp_end_date
      ? String(temp_start_date)
      : `${temp_start_date} - ${temp_end_date}`;
  const time = `${date}, Klo. ${this.competition.start_time} - ${this.competition.end_time}`;
  doc.setFontSize(24);
  doc.text(10, 10, title, { align: "left" });
  doc.setFontSize(14);
  doc.text(10, 20, this.competition.cup_name, { align: "left" });
  doc.text(10, 30, time, { align: "left" });
  doc.line(0, 35, 400, 35);
  doc.setFontSize(18);

  // "Tilastot"
  // Resize charts to be better looking on a pdf
  var fishesImg = document
    .getElementById("fishes_chart")
    .toDataURL("image/png", 1.0);
  var signeeImg = document
    .getElementById("signee_chart")
    .toDataURL("image/png", 1.0);
  doc.addImage(fishesImg, "PNG", -30, 40, 180, 90);
  doc.addImage(signeeImg, "PNG", 70, 40, 180, 90);
  doc.text(100, 145, "Kalalajien määritykset", { align: "center" });
  // Generate table
  let rows = this.dictToArray(this.calculated_fish_weights, 7);
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
      lineColor: "100",
      lineWidth: ".25",
    },
    columnStyles: { text: { cellwidth: "auto" } },
    theme: "striped",
    pageBreak: "auto",
    tableWidth: "auto",
    startY: 150,
    margin: { top: 20 },
  });

  doc.text(100, doc.autoTable.previous.finalY + 20, "Yleisiä tilastoja", {
    align: "center",
  });

  columns = ["", ""];
  rows = [
    ["Cup pistekerroin", `x ${this.competition.cup_points_multiplier}`],
    ["Ilmoittautuneita yhteensä", `${this.signees.length} kpl`],
    [
      "Saalista saaneita",
      `${Math.round(
        (this.$store.getters.getPointSignees.length /
          this.competition.signees.length) *
          100 *
          100
      ) / 100} % (${this.$store.getters.getPointSignees.length}/${
        this.signees.length
      })`,
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
      lineColor: "100",
      lineWidth: ".25",
    },
    columnStyles: { text: { cellwidth: "auto" } },
    theme: "striped",
    pageBreak: "auto",
    tableWidth: "auto",
    margin: { top: 20 },
    startY: doc.autoTable.previous.finalY + 25,
  });

  // Save to pdf
  doc.save(
    `${this.$moment(this.competition.start_date).year()}_${this.replaceAll(
      this.competition.name,
      " ",
      ""
    )}_${this.replaceAll(this.capitalize_words(competition_type), " ", "")}.pdf`
  );

  // Set charts to be responsive again
  this.onafterprint();
}
// Saves all the chosen tables to pdf
function saveAllAsPDF(tab) {
  this.onbeforeprint();
  let current_tab = tab;
  let charts_loaded = true;
  let temp_selected_biggest_fish = this.selected_biggest_fish;
  let temp_selected_biggest_amount = this.selected_biggest_amount;
  let temp_selected_normal = this.selected_normal;
  // Format dates for easier reding
  let temp_start_date = this.formatDate(this.competition.start_date);
  let temp_end_date = this.formatDate(this.competition.end_date);
  let year = this.$moment(this.competition.start_date).year();

  let doc = new jsPDF();

  // Title
  const title = `${this.competition.name}`;
  const date =
    temp_start_date === temp_end_date
      ? String(temp_start_date)
      : `${temp_start_date} - ${temp_end_date}`;
  const time = `${date}, Klo. ${this.competition.start_time} - ${this.competition.end_time}`;
  doc.setFontSize(24);
  doc.text(10, 10, title, { align: "left" });
  doc.setFontSize(14);
  doc.text(10, 20, this.competition.cup_name, { align: "left" });
  doc.text(10, 30, time, { align: "left" });
  doc.line(0, 35, 400, 35);
  doc.setFontSize(18);
  // start_coord needed to keep track of y coordinates for tables (if there are no results -> no table drawn to pdf -> varying coordinates)
  let start_coord;
  let rows;
  let columns;
  //Normaalikilpailu (Pisteet), saved to pdf if it's inclued in this.selected_print array
  if (this.selected_print.includes("normal")) {
    // Other tables are generated in code so no need to wait for rendering to html
    columns = [
      "Sijoitus",
      "Nro.",
      "Kippari",
      "Varakippari",
      "Paikkakunta",
      "Tulos",
      "Sij. pisteet",
      "Osal. pisteet",
      "Yht.",
    ];
    // Format dictionary/json to format that autotable understands (arrays in arrays);
    rows = this.dictToArray(this.normal_points, 1);
    doc.text(100, 50, "Normaalikilpailun tulokset (Pisteet)", {
      align: "center",
    });
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
        lineColor: "100",
        lineWidth: ".25",
      },
      columnStyles: { text: { cellwidth: "auto" } },
      theme: "striped",
      pageBreak: "auto",
      tableWidth: "auto",
      startY: 55,
      margin: { top: 20 },
    });

    //Normaalikilpailu (Kalat)
    doc.addPage();
    columns = ["Sijoitus", "Nro.", "Kippari"];
    // Get fish names for columns
    this.table_fish_names.forEach((name) => {
      columns.push(name);
    });
    columns.push("Tulos");

    rows = this.dictToArray(this.normal_weights, 2);
    doc.text(100, 10, "Normaalikilpailun tulokset (Kalat)", {
      align: "center",
    });
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
        lineColor: "100",
        lineWidth: ".25",
      },
      columnStyles: { text: { cellwidth: "auto" } },
      theme: "striped",
      pageBreak: "auto",
      tableWidth: "auto",
      margin: { top: 20 },
      startY: 20,
    });
  }

  // Tiimikilpailu, drawn to pdf if it exists and , if it's inclued in this.selected_print array
  if (this.isTeamCompetition && this.selected_print.includes("team")) {
    // If there is "Normaalikilpailun tulokset" selected also, start from new page
    if (this.selected_print.includes("normal")) {
      doc.addPage();
    }
    doc.setFontSize(24);
    doc.text(10, 10, title, { align: "left" });
    doc.setFontSize(14);
    doc.text(10, 20, this.competition.cup_name, { align: "left" });
    doc.text(10, 30, time, { align: "left" });
    doc.line(0, 35, 400, 35);
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
        "Pisteet",
      ];
      // Format dictionary/json to format that autotable understands (arrays in arrays);
      rows = this.dictToArray(this.normal_points, 1);
      //TODO generate table in code instead of html, like the others
      doc.autoTable({
        head: [columns],
        body: rows,
        styles: {
          overflow: "linebreak",
          cellWidth: "wrap",
          rowPageBreak: "avoid",
          halign: "justify",
          fontSize: "8",
          lineColor: "100",
          lineWidth: ".25",
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

  //"Suurimmat kalat" to pdf if it's inclued in this.selected_print array
  if (this.selected_print.includes("biggest_fishes")) {
    // If there is content before, start from new page
    if (
      this.selected_print.includes("normal") ||
      this.selected_print.includes("team")
    ) {
      doc.addPage();
    }
    let counter = 0;
    // For each fish, generate tables for "Suurimmat Kalat (Kala)" and "Suurimmat Kalasaaliit (Kala)"
    this.table_fish_names.forEach((name) => {
      // Same process as above, but for every fish instead of only winners
      this.selected_biggest_fish = name;
      this.calculateBiggestFishes();
      start_coord = 10;

      if (this.biggest_fishes_results.length) {
        // So it doesn't add unnecessary page on the first loop
        if (counter > 0) {
          doc.addPage();
        }
        doc.setFontSize(24);
        doc.text(10, 10, title, { align: "left" });
        doc.setFontSize(14);
        doc.text(10, 20, this.competition.cup_name, { align: "left" });
        doc.text(10, 30, time, { align: "left" });
        doc.line(0, 35, 400, 35);
        doc.setFontSize(18);
        start_coord = 50;

        columns = ["Sijoitus", "Veneen nro", "Kippari", "Paino"];
        rows = this.dictToArray(this.biggest_fishes_results, 3);

        doc.text(100, start_coord, "Suurimmat kalat" + ` (${name})`, {
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
            lineColor: "100",
            lineWidth: ".25",
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
      this.selected_print.includes("biggest_fishes")
    ) {
      doc.addPage();
    }
    let counter = 0;
    columns = ["Sijoitus", "Veneen nro", "Kippari", "Paino"];
    this.table_fish_names.forEach((name) => {
      this.selected_biggest_amount = name;
      this.calculateBiggestAmounts();
      start_coord = 10;

      if (this.biggest_amounts[name].length) {
        // So it doesn't add unnecessary page on the first loop
        if (counter > 0) {
          doc.addPage();
        }
        doc.setFontSize(24);
        doc.text(10, 10, title, { align: "left" });
        doc.setFontSize(14);
        doc.text(10, 20, this.competition.cup_name, { align: "left" });
        doc.text(10, 30, time, { align: "left" });
        doc.line(0, 35, 400, 35);
        doc.setFontSize(18);
        start_coord = 50;
        columns = ["Sijoitus", "Veneen nro", "Kippari", "Paino"];
        rows = this.dictToArray(this.biggest_amounts[name], 3);
        doc.text(100, start_coord, "Suurimmat kalasaaliit" + ` (${name})`, {
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
            lineColor: "100",
            lineWidth: ".25",
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
      this.selected_print.includes("biggest_amounts")
    ) {
      doc.addPage();
    }
    // Suurimmat Kalat  (Voittajat)
    // Select these for calculations
    this.selected_biggest_fish = this.selected_biggest_amount = "Voittajat";
    columns = ["Kalalaji", "Veneen nro", "Kippari", "Paino"];
    // Calculate data
    this.calculateBiggestFishes();
    this.calculateBiggestAmounts();
    // If there are any results, add title
    if (
      this.biggest_fishes_results.length ||
      this.biggest_amounts_results.length
    ) {
      doc.setFontSize(24);
      doc.text(10, 10, title, { align: "left" });
      doc.setFontSize(14);
      doc.text(10, 20, this.competition.cup_name, { align: "left" });
      doc.text(10, 30, time, { align: "left" });
      doc.line(0, 35, 400, 35);
      doc.setFontSize(18);
    }

    // If there are biggest fishes
    if (this.biggest_fishes_results.length) {
      rows = this.dictToArray(this.biggest_fishes_results, 4);
      doc.text(
        100,
        50,
        "Suurimmat kalat" + ` (${this.selected_biggest_fish})`,
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
          lineColor: "100",
          lineWidth: ".25",
        },
        columnStyles: { text: { cellwidth: "auto" } },
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
    if (this.biggest_amounts_results.length) {
      rows = this.dictToArray(this.biggest_amounts_results, 4);
      doc.text(
        100,
        start_coord,
        "Suurimmat kalasaaliit" + ` (${this.selected_biggest_fish})`,
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
          lineColor: "100",
          lineWidth: ".25",
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
    doc.setFontSize(24);
    doc.text(10, 10, title, { align: "left" });
    doc.setFontSize(14);
    doc.text(10, 20, this.competition.cup_name, { align: "left" });
    doc.text(10, 30, time, { align: "left" });
    doc.line(0, 35, 400, 35);
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
      doc.addImage(fishesImg, "PNG", -30, 40, 180, 90);
      doc.addImage(signeeImg, "PNG", 70, 40, 180, 90);
    } catch (err) {
      charts_loaded = false;
      this.tab = "stats";
      // Try again after 1 sec
      setTimeout(() => this.saveAllAsPDF(current_tab), 1000);
    }
    doc.text(100, 165, "Kalalajien määritykset", { align: "center" });
    // Table generated straight from html
    rows = this.dictToArray(this.calculated_fish_weights, 7);
    columns = ["Kalalaji", "Kerroin", "Alamitta", "Saalista saatu"];

    doc.autoTable({
      head: [columns],
      body: rows,
      styles: {
        overflow: "linebreak",
        cellWidth: "wrap",
        rowPageBreak: "avoid",
        halign: "justify",
        fontSize: "8",
        lineColor: "100",
        lineWidth: ".25",
      },
      columnStyles: { text: { cellwidth: "auto" } },
      theme: "striped",
      pageBreak: "auto",
      tableWidth: "auto",
      startY: 170,
      margin: { top: 20 },
    });

    doc.text(100, doc.autoTable.previous.finalY + 20, "Yleisiä tilastoja", {
      align: "center",
    });
    // Generate table
    columns = ["", ""];
    rows = [
      ["Cup pistekerroin", `x ${this.competition.cup_points_multiplier}`],
      ["Ilmoittautuneita yhteensä", `${this.signees.length} kpl`],
      [
        "Saalista saaneita",
        `${Math.round(
          (this.$store.getters.getPointSignees.length /
            this.competition.signees.length) *
            100 *
            100
        ) / 100} % (${this.$store.getters.getPointSignees.length}/${
          this.signees.length
        })`,
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
        lineColor: "100",
        lineWidth: ".25",
      },
      columnStyles: { text: { cellwidth: "auto" } },
      theme: "striped",
      pageBreak: "auto",
      tableWidth: "auto",
      margin: { top: 20 },
      startY: doc.autoTable.previous.finalY + 25,
    });
  }

  // Reset variables
  this.selected_biggest_fish = temp_selected_biggest_fish;
  this.selected_biggest_amount = temp_selected_biggest_amount;
  this.selected_normal = temp_selected_normal;
  this.calculateBiggestFishes();
  this.calculateBiggestAmounts();

  // Save to pdf
  if (charts_loaded) {
    this.tab = current_tab;
    doc.save(
      `${year}_${this.replaceAll(this.competition.name, " ", "")}Tulokset.pdf`
    );
    // Set charts to be responsive again
    this.onafterprint();
  } else {
    M.toast({ html: "Kaaviot ei ruudulla, yritetään uudelleen..." });
  }
}

//Fix chartjs printing:
function onbeforeprint() {
  const Chart = require("chart.js");
  for (var id in Chart.instances) {
    let chart = Chart.instances[id];
    // Resize charts to fit pdf nicely
    chart.canvas.parentNode.style.height = "800px";
    chart.canvas.parentNode.style.width = "1600px";
    chart.resize();
  }
}

function onafterprint() {
  const Chart = require("chart.js");
  for (var id in Chart.instances) {
    let chart = Chart.instances[id];
    // Resize charts back to original width
    chart.canvas.parentNode.style.height = "";
    chart.canvas.parentNode.style.width = "";
    chart.resize();
  }
  this.drawCharts();
}

// Custom range function for for loop, with recursion which is more efficient
function* range(start, end) {
  yield start;
  if (start === end) return;
  yield* range(start + 1, end);
}

function getColor(placement) {
  if (placement > 30) return "red";
  if (placement > 20) return "orange";
  else if (placement > 5) return "yellow";
  else return "green";
}
function getColorPoints(points) {
  if (points > 5) return "primary darken-2";
  else return "red";
}

// Parse data, define charts, draw them
function drawCharts() {
  let temp_weights = [];
  let colors = [];

  // Get fish weights, and color from array for fishesChart
  this.calculated_fish_weights.forEach((fish) => {
    temp_weights.push(fish.weights);
    colors.push(fish.color);
  });

  // Get data for signeesChart (total signees, and signees who have more than 0 points)
  let signee_data = [];
  let point_signees = this.$store.getters.getPointSignees.length;
  let no_points_signees = this.signees.length - point_signees;
  signee_data.push(point_signees);
  signee_data.push(no_points_signees);
  this.fishes_chart_title = "Kaloja saatu yhteensä";
  this.fishes_chart_data = {
    labels: this.table_fish_names, // Fish names
    datasets: [
      {
        label: "Paino",
        backgroundColor: colors, // Colors
        data: temp_weights, // Weights
      },
    ],
  };

  this.signee_chart_title = "Saalista saaneita";
  this.signee_chart_data = {
    labels: ["Kyllä", "Ei saalista"],
    datasets: [
      {
        label: "Lukumäärä",
        backgroundColor: ["#7fbf7f", "#ff7f7f"], // Green and red
        data: signee_data, // Data
      },
    ],
  };
}

//Check if user is logged in has admin status, update values to vuex (Header.vue updates based on these values)
function checkLogin() {
  // If login token present --> user is logged in
  if (localStorage.getItem("jwt") != null) {
    this.$store.state.logged_in = true;
    let user = JSON.parse(localStorage.getItem("user"));
    // Check if user is admin
    //TODO safer way to check this than use localstorage?
    user.is_admin == true
      ? (this.$store.state.is_admin = true)
      : (this.$store.state.is_admin = false);
  } else {
    //Not logger in, so not admin either
    this.$store.state.logged_in = false;
    this.$store.state.is_admin = false;
  }
}

// Sorts the dictionary based on weights
function sortDict(fishes) {
  if (fishes) {
    let all_results = [];
    let temp_results = [];
    this.fish_names.forEach((name) => {
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

export default {
  onafterprint: onafterprint,
  onbeforeprint: onbeforeprint,
  saveAllAsPDF: saveAllAsPDF,
  saveStatsAsPDF: saveStatsAsPDF,
  saveAsPDF: saveAsPDF,
  dictToArray: dictToArray,
  capitalize_words: capitalize_words,
  replaceAll: replaceAll,
  formatDate: formatDate,
  range: range,
  getColorPoints: getColorPoints,
  getColor: getColor,
  drawCharts: drawCharts,
  checkLogin: checkLogin,
  sortDict: sortDict,
};
