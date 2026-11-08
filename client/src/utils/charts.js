import { Chart } from "chart.js";

export const CHART_THEME = {
  light: { text: "#55656E", grid: "rgba(19, 52, 74, 0.08)" },
  dark: { text: "#C9D6DE", grid: "rgba(255, 255, 255, 0.08)" },
};

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
 * Must stay synchronous: any await between draw and capture lets Vue re-animate.
 */
export function captureChartsForPDF(elementIds) {
  const out = {};
  for (const id of elementIds) {
    const chart = Chart.getChart(id);
    if (!chart) {
      out[id] = null;
      continue;
    }
    chart.stop();
    chart.options.animation = false;
    setChartColors(chart, false);
    chart.resize(400, 400);
    chart.update("none");
    chart.draw();
    out[id] = chart.toBase64Image("image/png", 1);
  }
  return out;
}

/** Light colours + fixed size (also used when only redrawing, not capturing). */
export function prepareChartsForPDF() {
  captureChartsForPDF(
    [...document.querySelectorAll("canvas")]
      .map((c) => c.id)
      .filter(Boolean),
  );
}

/** @deprecated use prepareChartsForPDF / captureChartsForPDF */
export function resizeChartForPDF() {
  prepareChartsForPDF();
}

/** Canvas / Chart.js instance as PNG data URL, or null when not mounted. */
export function chartToDataURL(elementId) {
  const chart = Chart.getChart(elementId);
  if (chart) {
    chart.stop();
    chart.draw();
    return chart.toBase64Image("image/png", 1);
  }
  const el = document.getElementById(elementId);
  if (!el || typeof el.toDataURL !== "function") return null;
  return el.toDataURL("image/png", 1.0);
}

// Parse data, define charts, draw them
export function initChartData(
  weights,
  fishNames,
  signeesWithPoints,
  totalSignees,
  language,
) {
  let temp_weights = [];
  let colors = [];

  const i18n = changeChartLanguage(language);

  // Get fish weights, and color from array for fishesChart
  weights.forEach((fish) => {
    temp_weights.push(fish.weights);
    colors.push(fish.color);
  });

  const fishes_chart_data = {
    labels: fishNames,
    datasets: [
      {
        label: i18n.fishes_dataset_label,
        backgroundColor: colors,
        data: temp_weights, // Weights
      },
    ],
  };

  const signee_chart_data = {
    labels: i18n.signee_labels,
    datasets: [
      {
        label: i18n.signee_dataset_label,
        backgroundColor: ["#7fbf7f", "#ff7f7f"],
        data: [signeesWithPoints, totalSignees - signeesWithPoints], // Data
      },
    ],
  };

  return {
    fishes_chart: {
      title: "comp-overview.fish-amount-total",
      data: fishes_chart_data,
    },
    signee_chart: {
      title: "comp-overview.gotten-fish",
      data: signee_chart_data,
    },
  };
}

export function changeChartLanguage(language) {
  let signee_labels, fishes_dataset_label, signee_dataset_label;

  if (language === "en") {
    signee_labels = ["Yes", "No"];
    fishes_dataset_label = "Weight";
    signee_dataset_label = "Amount";
  } else {
    signee_labels = ["Kyllä", "Ei"];
    fishes_dataset_label = "Paino";
    signee_dataset_label = "Lukumäärä";
  }

  return {
    signee_labels,
    fishes_dataset_label,
    signee_dataset_label,
  };
}
