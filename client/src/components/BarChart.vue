<script>
import { Bar, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
import "chartjs-plugin-labels";
export default {
  props: ["title"],
  extends: Bar,
  mixins: [reactiveProp],
  data: () => ({
    options: {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      tooltips: {
        callbacks: {
          title: (tooltipItem, data) => {
            return data.labels[tooltipItem[0].index];
          },
          label: (tooltipItem, data) => {
            let sum = data.datasets[tooltipItem.datasetIndex].data.reduce(
              function(a, b) {
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
              ).toLocaleString()} kg ( ${percentage}% Cupin kaloista )`;
            }

            return lbl;
          },
        },
      },
      plugins: {
        labels: {
          render: function(args) {
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
      legend: {
        display: true,
      },
    },
  }),
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    chartData(val) {
      this.renderChart(val, this.options);
    },
  },
};
</script>
