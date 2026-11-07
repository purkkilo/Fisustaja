// Vuetify 2 table headers were { text, value }. Vuetify 3+ wants { title, key }:
// without `key` a column isn't sortable, without `title` its label is empty.
// The original fields stay, so header slots and PDF code can keep reading .text/.value.
export function tableHeaders(headers) {
  return (headers || []).map((header) => ({
    ...header,
    title: header.title ?? header.text,
    key: header.key ?? header.value,
  }));
}
