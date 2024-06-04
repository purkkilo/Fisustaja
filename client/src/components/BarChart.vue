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
        datalabels: {
          labels: {
            value: {
              color: "blue",
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
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              // Include a dollar sign in the ticks
              callback: function (value) {
                let output = value < 1000 ? value : value / 1000 + "kg";
                return output;
              },
            },
          },
        ],
      },
      tooltips: {
        callbacks: {
          title: (tooltipItem, data) => {
            return data.labels[tooltipItem[0].index];
          },
          label: (tooltipItem, data) => {
            let sum = data.datasets[tooltipItem.datasetIndex].data.reduce(
              function (a, b) {
                return a + b;
              },
              0
            );
            let percentage =
              (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] /
                sum) *
              100;
            percentage = Math.round((percentage + Number.EPSILON) * 100) / 100;
            let lbl = "";
            if (
              data.datasets[tooltipItem.datasetIndex].label ===
              "Kilpailijamäärä"
            ) {
              lbl = `${
                data.datasets[tooltipItem.datasetIndex].label
              }: ${data.datasets[tooltipItem.datasetIndex].data[
                tooltipItem.index
              ].toLocaleString()} kpl`;
            } else {
              lbl = `${data.datasets[tooltipItem.datasetIndex].label}: ${(
                data.datasets[tooltipItem.datasetIndex].data[
                  tooltipItem.index
                ] / 1000
              ).toLocaleString()} kg ( ${percentage}% kaloista )`;
            }

            return lbl;
          },
        },
      },
      /*
      plugins: {
        labels: {
          render: function (args) {
            // args will be something like:
            // { label: 'Label', value: 123, percentage: 50, index: 0, dataset: {...} }
            // return object if it is image
            // return { src: 'image.png', width: 16, height: 16 };
            if (args.dataset.label === "Kilpailijamäärä") {
              return args.value;
            } else {
              return `${(args.value / 1000).toLocaleString()} kg`;
            }
          },
          fontSize: 8,
          fontStyle: "bold",
          fontFamily: '"Lucida Console", Monaco, monospace',
          precision: 2,
        },
      },
      */
      legend: {
        display: true,
      },
    },
  }),
  mounted() {},
  watch: {},
};
</script>
