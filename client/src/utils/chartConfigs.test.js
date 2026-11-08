import { describe, expect, it } from "vitest";
import {
  biggestFishChart,
  catchByCompetitionChart,
  catchTimelineChart,
  pointsSpreadChart,
  speciesChart,
  standingsRaceChart,
  topBoatsChart,
} from "./chartConfigs";
import { SERIES } from "./chartData";

const env = {
  palette: {
    series: SERIES.light,
    primary: "#2A74A0",
    muted: "#B9C3C9",
    surface: "#FFFFFF",
  },
  t: (key) => key,
  lang: "fi-FI",
};

describe("chart configs", () => {
  it("species: one bar per species in species colour, weight in the tooltip", () => {
    const species = [
      {
        name: "Hauki",
        color: "#0a0",
        multiplier: 0.5,
        weight: 4000,
        points: 2000,
      },
      {
        name: "Kuha",
        color: undefined,
        multiplier: 2,
        weight: 600,
        points: 1200,
      },
    ];
    const c = speciesChart(species, env);
    expect(c.data.labels).toEqual(["Hauki ×0,5", "Kuha ×2"]);
    expect(c.data.datasets[0].backgroundColor).toEqual(["#0a0", "#2A74A0"]);
    const label = c.options.plugins.tooltip.callbacks.label({ dataIndex: 0 });
    expect(label).toBe("2 000 p · 4 kg");
  });

  it("top boats: stacked, one dataset per species, total in the footer", () => {
    const c = topBoatsChart(
      {
        boats: [{ label: "1. A (1)", total: 2200 }],
        species: [
          { name: "Ahven", color: "#a00", data: [1000] },
          { name: "Kuha", color: "#00a", data: [1200] },
        ],
      },
      env,
    );
    expect(c.options.scales.x.stacked).toBe(true);
    expect(c.data.datasets.map((d) => d.borderColor)).toEqual([
      "#FFFFFF",
      "#FFFFFF",
    ]);
    expect(c.options.plugins.tooltip.callbacks.footer([{ dataIndex: 0 }])).toBe(
      "total-big: 2 200 p",
    );
  });

  it("points spread: the no-catch bar is grey and labelled", () => {
    const c = pointsSpreadChart(
      [
        { from: 0, to: 0, count: 2 },
        { from: 1, to: 500, count: 3 },
      ],
      env,
    );
    expect(c.data.labels).toEqual(["stats-page.no-catch", "1–500"]);
    expect(c.data.datasets[0].backgroundColor).toEqual(["#B9C3C9", "#2A74A0"]);
  });

  it("biggest fish: dots on species rows, the record larger", () => {
    const c = biggestFishChart(
      [
        {
          name: "Hauki",
          color: "#0a0",
          fishes: [
            { weight: 5200, record: true, captain_name: "E", boat_number: 5 },
            { weight: 3100, record: false, captain_name: "B", boat_number: 2 },
          ],
        },
      ],
      env,
    );
    expect(c.options.scales.y.labels).toEqual(["Hauki"]);
    expect(c.data.datasets[0].pointRadius).toEqual([8, 5]);
    expect(c.data.datasets[0].data[0]).toMatchObject({ x: 5200, y: "Hauki" });
  });

  it("timeline: real time on a linear axis", () => {
    const c = catchTimelineChart(
      [{ time: new Date("2026-06-01T15:00:00Z"), kg: 1.25, boats: 1 }],
      env,
    );
    expect(c.options.scales.x.type).toBe("linear");
    expect(c.data.datasets[0].data[0]).toMatchObject({ y: 1.25, boats: 1 });
  });

  it("standings race: series colours in fixed order", () => {
    const c = standingsRaceChart(
      {
        labels: ["Lahti", "Hollola"],
        boats: [
          { label: "A", data: [32, 54] },
          { label: "B", data: [22, 44] },
        ],
      },
      env,
    );
    expect(c.data.datasets.map((d) => d.borderColor)).toEqual(
      SERIES.light.slice(0, 2),
    );
  });

  it("catch by competition: stacked kilograms with a total footer", () => {
    const c = catchByCompetitionChart(
      {
        labels: ["Lahti"],
        species: [{ name: "Ahven", color: "#a00", data: [1.4] }],
      },
      env,
    );
    expect(c.options.scales.y.stacked).toBe(true);
    expect(
      c.options.plugins.tooltip.callbacks.footer([{ raw: 1.4 }, { raw: 0.6 }]),
    ).toBe("total-big: 2 kg");
  });
});
