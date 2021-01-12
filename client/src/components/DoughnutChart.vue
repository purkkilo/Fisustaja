<script>
import { Doughnut, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
import "chartjs-plugin-labels";

export default {
  props: ["title"],
  extends: Doughnut,
  mixins: [reactiveProp],
  data: () => ({
    options: {
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

            let value =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

            let percentage = (value / sum) * 100;
            percentage = Math.round((percentage + Number.EPSILON) * 100) / 100;

            let lbl = `${
              data.datasets[tooltipItem.datasetIndex].label
            }: ${value.toLocaleString()} g ( ${percentage}% )`;
            return lbl;
          },
        },
      },

      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        labels: {
          // convert grams to kilograms and add "kg" to end of the label
          render: function(args) {
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
