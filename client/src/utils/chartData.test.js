import { describe, expect, it } from "vitest";
import { CHART_THEME, SERIES, themeChartOptions } from "./chartData";

describe("themeChartOptions", () => {
  const options = {
    indexAxis: "y",
    scales: {
      x: { stacked: true, ticks: { precision: 0 }, title: { text: "kg" } },
      y: {},
    },
    plugins: { legend: { position: "top" }, tooltip: { mode: "index" } },
  };

  it("colours text, ticks, titles and grid lines for the theme", () => {
    const o = themeChartOptions(options, CHART_THEME.dark);
    expect(o.color).toBe(CHART_THEME.dark.text);
    expect(o.scales.x.ticks).toEqual({
      precision: 0,
      color: CHART_THEME.dark.text,
    });
    expect(o.scales.x.title.color).toBe(CHART_THEME.dark.text);
    expect(o.scales.y.grid.color).toBe(CHART_THEME.dark.grid);
    expect(o.plugins.legend).toEqual({
      position: "top",
      labels: { color: CHART_THEME.dark.text },
    });
  });

  it("keeps the rest of the options and does not change the input", () => {
    const o = themeChartOptions(options, CHART_THEME.light);
    expect(o.indexAxis).toBe("y");
    expect(o.scales.x.stacked).toBe(true);
    expect(o.plugins.tooltip).toEqual({ mode: "index" });
    expect(o.animation).toBe(false);
    expect(options.scales.x.ticks).toEqual({ precision: 0 });
    expect(options.plugins.legend.labels).toBeUndefined();
  });

  it("has eight series colours per theme", () => {
    expect(SERIES.light).toHaveLength(8);
    expect(SERIES.dark).toHaveLength(8);
  });
});
