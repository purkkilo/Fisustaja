<template>
  <Doughnut
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
import { Doughnut } from "vue-chartjs/legacy";
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
    chartData: {
      type: Object,
      default: () => {},
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
          display: function (context) {
            let sum = context.dataset.data.reduce(function (a, b) {
              return a + b;
            }, 0);
            let percentage =
              (context.dataset.data[context.dataIndex] / sum) * 100;
            return percentage > 1; // display labels for data that are larger than 1%
          },
          formatter: function (value, context) {
            let sum = context.dataset.data.reduce(function (a, b) {
              return a + b;
            }, 0);

            let percentage = (value / sum) * 100;
            percentage = Math.round((percentage + Number.EPSILON) * 100) / 100;
            /*
            let lbl = `${
              data.datasets[tooltipItem.datasetIndex].label
            }: ${value.toLocaleString()} g ( ${percentage}% )`;

*/
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
      /*
            plugins: {
        labels: {
          // convert grams to kilograms and add "kg" to end of the label
          render: function (args) {
            return ((args.value / (1000 + Number.EPSILON)) * 100) / 100 + " kg";
          },
          // Other options
          fontSize: 14,
          fontStyle: "bold",
          // draw text shadows under labels, default is false
          textShadow: true,
          position: "border",
          textmargin: 1,

          fontColor: "#000",
          fontFamily: '"Lucida Console", Monaco, monospace',
        },
      },
      */
    },
  }),
  mounted() {},
  watch: {},
};
</script>
