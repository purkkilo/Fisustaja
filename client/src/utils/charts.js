// Live Chart.js instances: theme colours, resizing and PDF capture.
// Imports chart.js, so load this module lazily (await import()).
import { Chart } from "chart.js";
import { CHART_THEME } from "./chartData";

function eachChart(fn) {
  for (const canvas of document.querySelectorAll("canvas")) {
    const chart = Chart.getChart(canvas);
    if (chart) fn(chart);
  }
}

function setChartColors(chart, dark) {
  const c = dark ? CHART_THEME.dark : CHART_THEME.light;
  // Mutate in place — spreading Chart.js option proxies breaks scriptable keys
  chart.options.color = c.text;
  const legend = ((chart.options.plugins ??= {}).legend ??= {});
  const labels = (legend.labels ??= {});
  labels.color = c.text;
  for (const axis of Object.values(chart.options.scales || {})) {
    (axis.ticks ??= {}).color = c.text;
    (axis.grid ??= {}).color = c.grid;
  }
}

/** Apply legend/tick/grid colours to every live Chart.js instance. */
export function applyChartThemeColors(dark) {
  eachChart((chart) => {
    setChartColors(chart, dark);
    chart.update("none");
  });
}

export function setChartsResponsive() {
  eachChart((chart) => {
    chart.resize();
  });
}

/**
 * Snap charts to a finished light-theme frame and return PNG data URLs.
 * Pass ids, or { id, width, height } (CSS pixels) to capture at the shape the
 * chart will have in the PDF. Must stay synchronous: any await between draw
 * and capture lets Vue re-animate.
 */
export function captureChartsForPDF(charts) {
  const out = {};
  for (const spec of charts) {
    const {
      id,
      width = 400,
      height = 400,
    } = typeof spec === "string" ? { id: spec } : spec;
    const chart = Chart.getChart(id);
    if (!chart) {
      out[id] = null;
      continue;
    }
    chart.stop();
    chart.options.animation = false;
    // sharp in print: draw the capture at 3× the screen resolution
    const previousRatio = chart.options.devicePixelRatio;
    chart.options.devicePixelRatio = 3;
    setChartColors(chart, false);
    chart.resize(Math.round(width), Math.round(height));
    chart.update("none");
    chart.draw();
    out[id] = chart.toBase64Image("image/png", 1);
    chart.options.devicePixelRatio = previousRatio;
  }
  return out;
}
