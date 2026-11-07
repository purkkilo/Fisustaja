import { Chart } from "chart.js";

export function setChartsResponsive() {
  for (var id in Chart.instances) {
    Chart.instances[id].resize();
  }
}

export function resizeChartForPDF() {
  for (var id in Chart.instances) {
    Chart.instances[id].resize(400, 800);
  }
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
