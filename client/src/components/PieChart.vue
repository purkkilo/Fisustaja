<script>
import { Pie, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
import "chartjs-plugin-labels";
export default {
  props: ["title"],
  extends: Pie,
  mixins: [reactiveProp],
  data: () => ({
    options: {
      maintainAspectRatio: false,
      responsive: true,
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

            let lbl = `${data.datasets[tooltipItem.datasetIndex].label}: ${
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
            } kpl ( ${percentage}% )`;
            return lbl;
          },
        },
      },
      plugins: {
        labels: {
          render: "percentage",
          fontSize: 26,
          fontStyle: "bold",
          fontColor: "#000",
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
