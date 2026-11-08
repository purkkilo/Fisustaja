// PDF options remembered in localStorage. Kept apart from the PDF code so
// dialogs can read them without loading jsPDF.

function readPreferences() {
  try {
    return JSON.parse(localStorage.getItem("preferences") || "{}") || {};
  } catch {
    return {};
  }
}

/** Ink saver: black-and-white PDFs for printing. */
export function getPdfInkSaver() {
  return !!readPreferences().pdfInkSaver;
}

export function setPdfInkSaver(value) {
  const p = readPreferences();
  p.pdfInkSaver = !!value;
  localStorage.setItem("preferences", JSON.stringify(p));
}
