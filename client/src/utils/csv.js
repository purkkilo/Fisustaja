// CSV export. Semicolons and a BOM so Excel (Finnish locale) opens it
// with columns and UTF-8 letters intact.

const quote = (value) => {
  const text = value == null ? "" : String(value);
  return /[";\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/**
 * @param rows array of objects
 * @param columns [{ key, title }] in output order
 */
export function toCsv(rows, columns) {
  const lines = [columns.map((c) => quote(c.title)).join(";")];
  for (const row of rows) {
    lines.push(columns.map((c) => quote(row[c.key])).join(";"));
  }
  return lines.join("\r\n");
}

/** Start a download of `text` as `filename` in the browser. */
export function downloadCsv(filename, text) {
  const blob = new Blob(["﻿" + text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
