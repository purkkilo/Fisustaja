import { describe, expect, it } from "vitest";
import { toCsv } from "./csv";

describe("toCsv", () => {
  const columns = [
    { key: "boat_number", title: "Nro" },
    { key: "captain_name", title: "Kapteeni" },
  ];

  it("writes a header and one line per row with semicolons", () => {
    expect(
      toCsv(
        [
          { boat_number: 1, captain_name: "Liisa" },
          { boat_number: 2, captain_name: "Matti" },
        ],
        columns,
      ),
    ).toBe("Nro;Kapteeni\r\n1;Liisa\r\n2;Matti");
  });

  it("quotes values containing separators, quotes or newlines", () => {
    expect(
      toCsv([{ boat_number: 3, captain_name: 'Ville "Vippa"; Oy' }], columns),
    ).toBe('Nro;Kapteeni\r\n3;"Ville ""Vippa""; Oy"');
  });

  it("leaves missing values empty", () => {
    expect(toCsv([{ boat_number: 4 }], columns)).toBe("Nro;Kapteeni\r\n4;");
  });
});
