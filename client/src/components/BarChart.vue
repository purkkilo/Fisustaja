<template>
  <!-- vue-chartjs 5: the wrapper div sets the size, the canvas fills it -->
  <div :class="cssClasses" :style="containerStyles">
    <Bar
      :id="chartId"
      :options="options"
      :data="chartData"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :aria-label="title"
    />
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import { t } from "../i18n";

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
    title: {
      type: String,
      default: "",
    },
    chartData: {
      type: Object,
      default: () => ({ labels: [], datasets: [] }),
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
      default: () => ({}),
    },
    plugins: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    options: {
      locale: "en-US",
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
              if (context.dataset.label === "Amount") {
                lbl = `${t(
                  "total-signees"
                )}: ${context.parsed.y.toLocaleString()}`;
              } else {
                lbl = `${context.dataset.label}: ${(
                  context.parsed.y / 1000
                ).toLocaleString()} kg ( ${percentage}% ${t(
                  "of-fishes"
                )} )`;
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
  computed: {
    containerStyles() {
      return { position: "relative", height: `${this.height}px`, ...this.styles };
    },
  },
  mounted() {
    this.$i18n.locale === "en"
      ? (this.options.locale = "en-US")
      : (this.options.locale = "fi-FI");
  },
  watch: {
    "$i18n.locale"(newValue) {
      if (newValue) {
        newValue === "en"
          ? (this.options.locale = "en-US")
          : (this.options.locale = "fi-FI");
      } else {
        this.options.locale = "en-US";
      }
    },
  },
};
</script>
