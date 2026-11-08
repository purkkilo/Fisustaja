import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";
import spaceRegularUrl from "./fonts/SpaceGrotesk-Regular.ttf?url";
import spaceBoldUrl from "./fonts/SpaceGrotesk-Bold.ttf?url";

applyPlugin(jsPDF);

/** Lake palette (mirrors the light theme in vuetify.js). */
export const PDF = {
  lake: [19, 52, 74],
  primary: [42, 116, 160],
  results: [165, 86, 26],
  amber: [242, 196, 109],
  muted: [85, 101, 110],
  line: [220, 226, 230],
  soft: [248, 250, 249],
  softBlue: [220, 234, 242],
  softAmber: [251, 240, 220],
  white: [255, 255, 255],
  black: [20, 20, 20],
  marginX: 14,
  headerH: 36,
  font: "SpaceGrotesk",
};

const COLOR_THEME = {
  inkSaver: false,
  headerFill: PDF.lake,
  headerText: PDF.white,
  accent: PDF.amber,
  subtitle: PDF.amber,
  meta: [186, 198, 206],
  body: PDF.lake,
  muted: PDF.muted,
  line: PDF.line,
  sectionAccent: PDF.amber,
  tableHeadFill: PDF.lake,
  tableHeadText: PDF.white,
  tableAlt: PDF.soft,
  tableLine: PDF.line,
  chartFrame: PDF.softBlue,
};

const INK_THEME = {
  inkSaver: true,
  headerFill: null,
  headerText: PDF.black,
  accent: PDF.black,
  subtitle: PDF.muted,
  meta: PDF.muted,
  body: PDF.black,
  muted: PDF.muted,
  line: [170, 170, 170],
  sectionAccent: PDF.black,
  tableHeadFill: null,
  tableHeadText: PDF.black,
  tableAlt: null,
  tableLine: [190, 190, 190],
  chartFrame: [245, 245, 245],
};

let activeTheme = { ...COLOR_THEME };
let fontsReady = null;

function readPdfInkSaver() {
  try {
    const p = JSON.parse(localStorage.getItem("preferences") || "{}");
    return !!p.pdfInkSaver;
  } catch {
    return false;
  }
}

export function getPdfInkSaver() {
  return readPdfInkSaver();
}

export function setPdfInkSaver(value) {
  const p = JSON.parse(localStorage.getItem("preferences") || "{}");
  p.pdfInkSaver = !!value;
  localStorage.setItem("preferences", JSON.stringify(p));
  activeTheme = value ? { ...INK_THEME } : { ...COLOR_THEME };
}

export function applyPdfStyleFromPreferences() {
  activeTheme = readPdfInkSaver() ? { ...INK_THEME } : { ...COLOR_THEME };
  return activeTheme;
}

export function getPdfTheme() {
  return activeTheme;
}

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function loadFonts() {
  if (!fontsReady) {
    fontsReady = (async () => {
      const [regular, bold] = await Promise.all([
        fetch(spaceRegularUrl).then((r) => r.arrayBuffer()),
        fetch(spaceBoldUrl).then((r) => r.arrayBuffer()),
      ]);
      return {
        regular: arrayBufferToBase64(regular),
        bold: arrayBufferToBase64(bold),
      };
    })();
  }
  return fontsReady;
}

function registerFonts(doc, { regular, bold }) {
  doc.addFileToVFS("SpaceGrotesk-Regular.ttf", regular);
  doc.addFont("SpaceGrotesk-Regular.ttf", PDF.font, "normal");
  doc.addFileToVFS("SpaceGrotesk-Bold.ttf", bold);
  doc.addFont("SpaceGrotesk-Bold.ttf", PDF.font, "bold");
  doc.setFont(PDF.font, "normal");
}

/** Create a jsPDF doc with fonts + current ink/color theme applied. */
export async function createPdfDoc(orientation = "portrait") {
  applyPdfStyleFromPreferences();
  const doc = new jsPDF({ orientation });
  registerFonts(doc, await loadFonts());
  return doc;
}

/** Heuristic: placement / boat / numeric result columns align center or right. */
function alignForHeader(headerText, columnIndex) {
  const h = String(headerText || "").toLowerCase();
  if (
    columnIndex === 0 &&
    (h.includes("sija") || h.includes("place") || h.includes("placement"))
  ) {
    return "center";
  }
  if (
    h.includes("(p)") ||
    h.includes("(g)") ||
    h.includes("kg") ||
    h.includes("piste") ||
    h.includes("point") ||
    h.includes("paino") ||
    h.includes("weight") ||
    h.includes("tulos") ||
    h.includes("result") ||
    h.includes("cup (p)")
  ) {
    return "right";
  }
  if (
    h.includes("vene") ||
    h.includes("boat") ||
    h.includes("nro") ||
    h.includes("number")
  ) {
    return "center";
  }
  return "left";
}

function looksNumeric(value) {
  const s = String(value ?? "")
    .replace(/\s/g, "")
    .replace(",", ".");
  if (!s || s === "-") return false;
  return /^-?\d+(\.\d+)?%?$/.test(s) || /^\(\d+\)$/.test(s);
}

function tableDefaults(headRow = []) {
  const theme = activeTheme;
  const headStyles = {
    textColor: theme.tableHeadText,
    fontStyle: "bold",
    fontSize: 8,
    cellPadding: { top: 3.5, right: 3, bottom: 3.5, left: 3 },
    font: PDF.font,
    valign: "middle",
    minCellHeight: 8,
  };
  if (theme.tableHeadFill) {
    headStyles.fillColor = theme.tableHeadFill;
  } else {
    headStyles.fillColor = [255, 255, 255];
  }

  const styles = {
    overflow: "linebreak",
    cellWidth: "wrap",
    rowPageBreak: "avoid",
    halign: "left",
    valign: "middle",
    fontSize: 8.5,
    textColor: theme.body,
    // Horizontal rules only — cleaner modern tables
    lineColor: theme.tableLine,
    lineWidth: { top: 0, right: 0, bottom: 0.2, left: 0 },
    cellPadding: { top: 3, right: 3, bottom: 3, left: 3 },
    font: PDF.font,
    minCellHeight: 7,
  };

  const alternateRowStyles = theme.tableAlt
    ? { fillColor: theme.tableAlt }
    : { fillColor: [255, 255, 255] };

  return {
    theme: "plain",
    styles,
    headStyles,
    bodyStyles: {
      lineWidth: { top: 0, right: 0, bottom: 0.15, left: 0 },
    },
    alternateRowStyles,
    showHead: "everyPage",
    margin: {
      top: PDF.headerH + 10,
      left: PDF.marginX,
      right: PDF.marginX,
      bottom: 18,
    },
    didParseCell(data) {
      const header = headRow[data.column.index];
      const align = alignForHeader(header, data.column.index);

      if (data.section === "head") {
        data.cell.styles.halign = align;
        // Ink-saver: underline header instead of a filled band
        if (theme.inkSaver) {
          data.cell.styles.lineWidth = { top: 0, right: 0, bottom: 0.7, left: 0 };
          data.cell.styles.lineColor = theme.body;
        }
        return;
      }

      if (data.section === "body") {
        data.cell.styles.halign = align;
        // Numeric-looking cells without a matching header still go right
        if (align === "left" && looksNumeric(data.cell.raw)) {
          data.cell.styles.halign = "right";
        }
        // Emphasise first place a touch
        if (
          data.column.index === 0 &&
          String(data.cell.raw || "").startsWith("1.")
        ) {
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  };
}

/**
 * Header: colour band (default) or ink-saver typography + hairline.
 * @returns {number} Y where page content should start
 */
export function addTitle(doc, title, cup, time) {
  const theme = activeTheme;
  const pageW = doc.internal.pageSize.getWidth();
  const h = cup ? 44 : 36;

  if (theme.headerFill) {
    doc.setFillColor(...theme.headerFill);
    doc.rect(0, 0, pageW, h, "F");
    doc.setFillColor(...theme.accent);
    doc.rect(0, h, pageW, 1.4, "F");
  } else {
    doc.setDrawColor(...theme.line);
    doc.setLineWidth(0.6);
    doc.line(PDF.marginX, h, pageW - PDF.marginX, h);
  }

  const maxTitleW = pageW - PDF.marginX * 2;
  doc.setTextColor(...theme.headerText);
  doc.setFont(PDF.font, "bold");
  doc.setFontSize(15);
  const titleLines = doc.splitTextToSize(String(title || ""), maxTitleW);
  doc.text(titleLines[0], PDF.marginX, 13);

  doc.setFont(PDF.font, "normal");
  doc.setFontSize(9);
  let y = 21;
  if (cup) {
    doc.setTextColor(...theme.subtitle);
    const cupLines = doc.splitTextToSize(String(cup), maxTitleW);
    doc.text(cupLines[0], PDF.marginX, y);
    y += 7;
  }
  if (time) {
    doc.setTextColor(...theme.meta);
    doc.setFontSize(8.5);
    doc.text(String(time), PDF.marginX, y);
  }

  doc.setTextColor(...theme.body);
  doc.setFont(PDF.font, "normal");
  return h + 12;
}

/**
 * Section label with a short accent bar — left-aligned, not centered.
 * @returns {number} Y for content under the title
 */
export function addSectionTitle(doc, label, y) {
  const theme = activeTheme;
  doc.setFillColor(...theme.sectionAccent);
  doc.rect(PDF.marginX, y - 3.5, 2.2, 5, "F");

  doc.setFont(PDF.font, "bold");
  doc.setFontSize(11);
  doc.setTextColor(...theme.body);
  doc.text(String(label || ""), PDF.marginX + 5, y);
  doc.setFont(PDF.font, "normal");
  return y + 7;
}

/** Soft rounded-ish frame behind a chart image (drawn as a filled rect). */
export function addChartFrame(doc, x, y, w, h) {
  const theme = activeTheme;
  doc.setFillColor(...theme.chartFrame);
  doc.roundedRect(x - 3, y - 3, w + 6, h + 6, 2, 2, "F");
}

/** autoTable with active theme defaults + smart column alignment. */
export function addAutoTable(doc, options = {}) {
  const headRow = options.head?.[0] || [];
  const defaults = tableDefaults(headRow);
  const {
    styles,
    headStyles,
    bodyStyles,
    alternateRowStyles,
    margin,
    theme: _theme,
    didParseCell,
    ...rest
  } = options;

  const userDidParse = didParseCell;
  return doc.autoTable({
    ...defaults,
    ...rest,
    theme: "plain",
    styles: { ...styles, ...defaults.styles },
    headStyles: { ...headStyles, ...defaults.headStyles },
    bodyStyles: { ...bodyStyles, ...defaults.bodyStyles },
    alternateRowStyles: {
      ...alternateRowStyles,
      ...defaults.alternateRowStyles,
    },
    margin: { ...defaults.margin, ...margin },
    didParseCell(data) {
      defaults.didParseCell?.(data);
      userDidParse?.(data);
    },
  });
}

/** Footer on every page: brand · context · page n/N */
export function addFooter(doc, context = "") {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const total = doc.internal.getNumberOfPages();
  const theme = activeTheme;

  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setDrawColor(...theme.line);
    doc.setLineWidth(0.35);
    doc.line(PDF.marginX, pageH - 12, pageW - PDF.marginX, pageH - 12);

    doc.setFontSize(7.5);
    doc.setFont(PDF.font, "normal");
    doc.setTextColor(...theme.muted);
    doc.text("Fisustaja", PDF.marginX, pageH - 6);
    if (context) {
      const clipped = doc.splitTextToSize(String(context), pageW * 0.45)[0];
      doc.text(clipped, pageW / 2, pageH - 6, { align: "center" });
    }
    doc.text(`${i} / ${total}`, pageW - PDF.marginX, pageH - 6, {
      align: "right",
    });
  }
  doc.setTextColor(...theme.body);
}

export function openPdfOnNewTab(doc, fileName) {
  const url = URL.createObjectURL(doc.output("blob"));
  window.open(url, "_blank", "noopener,noreferrer");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
