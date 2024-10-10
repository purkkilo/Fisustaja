<template>
  <Bar
    :chart-options="options"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Bar } from "vue-chartjs/legacy";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "BarChart",
  components: {
    Bar,
  },
  props: {
    chartData: {
      type: Object,
      default: () => {},
    },
    chartId: {
      type: String,
      default: "bar-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => {},
    },
  },
  data: () => ({
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            title: (context) => {
              return context[0].label;
            },
            label: (context) => {
              let sum = context.dataset.data.reduce(function (a, b) {
                return a + b;
              }, 0);
              let percentage = (context.parsed.y / sum) * 100;
              percentage =
                Math.round((percentage + Number.EPSILON) * 100) / 100;

              let lbl = "";
              if (context.dataset.label === "Kilpailijamäärä") {
                lbl = `${
                  context.dataset.label
                }: ${context.parsed.y.toLocaleString()} kpl`;
              } else {
                lbl = `${context.dataset.label}: ${(
                  context.parsed.y / 1000
                ).toLocaleString()} kg ( ${percentage}% kaloista )`;
              }

              return lbl;
            },
          },
        },
        datalabels: {
          labels: {
            value: {
              color: "#133E71",
              font: {
                weight: "bold",
                size: 16,
                family: '"Lucida Console", Monaco, monospace',
              },
            },
          },
        },
      },
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        y: {
          ticks: {
            beginAtZero: true,
            // Include a dollar sign in the ticks
            callback(value) {
              let output = value < 1000 ? value : value / 1000 + "kg";
              return output;
            },
          },
        },
      },

      legend: {
        display: true,
      },
    },
  }),
  mounted() {},
  watch: {},
};
</script>
