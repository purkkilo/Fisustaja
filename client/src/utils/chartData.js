// Chart data and colours without chart.js itself, so pages can prepare
// chart data without loading the chart library.

export const CHART_THEME = {
  light: { text: "#55656E", grid: "rgba(19, 52, 74, 0.08)" },
  dark: { text: "#C9D6DE", grid: "rgba(255, 255, 255, 0.08)" },
};

/**
 * Categorical series colours, validated for colour-blind separation on the
 * app's light (#FFFFFF) and dark (#15252F) surfaces. Use them in this order;
 * never cycle them.
 */
export const SERIES = {
  light: [
    "#2a78d6",
    "#eb6834",
    "#1baf7a",
    "#eda100",
    "#e87ba4",
    "#008300",
    "#6250d6",
    "#e34948",
  ],
  dark: [
    "#3987e5",
    "#d95926",
    "#199e70",
    "#c98500",
    "#d55181",
    "#008300",
    "#9085e9",
    "#e66767",
  ],
};

/**
 * A copy of Chart.js options with text, ticks and grid lines in the theme's
 * colours. Never mutates the input, so it can be called in a computed.
 * @param {object} options  Chart.js options
 * @param {{ text: string, grid: string }} theme  CHART_THEME.light or .dark
 */
export function themeChartOptions(options = {}, theme = CHART_THEME.light) {
  const scales = {};
  for (const [key, axis] of Object.entries(options.scales || {})) {
    scales[key] = {
      ...axis,
      ticks: { ...(axis.ticks || {}), color: theme.text },
      grid: { ...(axis.grid || {}), color: theme.grid },
      title: axis.title ? { ...axis.title, color: theme.text } : axis.title,
    };
  }
  const plugins = options.plugins || {};
  return {
    // no entrance animation: a PDF capture must never get a half-drawn chart
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    ...options,
    color: theme.text,
    scales,
    plugins: {
      ...plugins,
      legend: {
        ...(plugins.legend || {}),
        labels: { ...(plugins.legend?.labels || {}), color: theme.text },
      },
    },
  };
}
