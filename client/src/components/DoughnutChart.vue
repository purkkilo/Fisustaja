<template>
  <!-- vue-chartjs 5: the wrapper div sets the size, the canvas fills it -->
  <div :class="cssClasses" :style="containerStyles">
    <Doughnut
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
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
  components: {
    Doughnut,
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
      default: "doughnut-chart",
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

              let lbl = `${tooltipData.toLocaleString()} g ( ${percentage}% )`;
              return lbl;
            },
          },
        },
        datalabels: {
          display(context) {
            let sum = context.dataset.data.reduce(function (a, b) {
              return a + b;
            }, 0);
            let percentage =
              (context.dataset.data[context.dataIndex] / sum) * 100;
            return percentage > 1; // display labels for data that are larger than 1%
          },
          formatter(value, context) {
            let sum = context.dataset.data.reduce(function (a, b) {
              return a + b;
            }, 0);

            let percentage = (value / sum) * 100;
            percentage = Math.round((percentage + Number.EPSILON) * 100) / 100;

            return `${percentage}%`;
          },
          labels: {
            value: {
              color: "#000",
              font: {
                weight: "bold",
                size: 14,
                family: '"Lucida Console", Monaco, monospace',
              },
            },
          },
        },
      },

      maintainAspectRatio: false,
      responsive: true,
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
