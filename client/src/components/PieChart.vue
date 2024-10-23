<template>
  <Pie
    :chart-options="options"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
    :title="title"
  />
</template>

<script>
import { Pie } from "vue-chartjs/legacy";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);
ChartJS.register(ChartDataLabels);
export default {
  name: "PieChart",
  components: {
    Pie,
  },
  props: {
    title: {
      type: String,
      default: "pie-chart",
    },
    chartData: {
      type: Object,
      default: () => {},
    },
    chartId: {
      type: String,
      default: "pie-chart",
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
      locale: "en-US",
      plugins: {
        tooltip: {
          callbacks: {
            title: (tooltipItem) => {
              return tooltipItem[0].label;
            },
            label: (tooltipItem) => {
              let allData = tooltipItem.dataset.data;
              let tooltipData = allData[tooltipItem.dataIndex];
              let sum = allData.reduce(function (a, b) {
                return a + b;
              }, 0);
              let percentage = (tooltipData / sum) * 100;
              percentage =
                Math.round((percentage + Number.EPSILON) * 100) / 100;

              let lbl = `${tooltipData} kpl ( ${percentage}% )`;
              return lbl;
            },
          },
        },
        datalabels: {
          labels: {
            value: {
              color: "#000",
              font: {
                weight: "bold",
                size: 26,
                family: '"Lucida Console", Monaco, monospace',
              },
            },
          },
        },
      },
      maintainAspectRatio: false,
      responsive: true,

      legend: {
        display: true,
      },
    },
  }),
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
