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

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Doughnut } from "vue-chartjs";
import { useChartColors } from "@/composables/useChartColors";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";

const props = defineProps({
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
});
const { locale } = useI18n();
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const options = ref({
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
          percentage = Math.round((percentage + Number.EPSILON) * 100) / 100;

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
        let percentage = (context.dataset.data[context.dataIndex] / sum) * 100;
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

  // No entrance animation — PDF capture must never grab a half-drawn pie
  animation: false,
  maintainAspectRatio: false,
  responsive: true,
});

// legend and axis text follow the light/dark theme
useChartColors(options);

const containerStyles = computed(() => {
  return { position: "relative", height: `${props.height}px`, ...props.styles };
});

watch(locale, (newValue) => {
  if (newValue) {
    newValue === "en"
      ? (options.value.locale = "en-US")
      : (options.value.locale = "fi-FI");
  } else {
    options.value.locale = "en-US";
  }
});

onMounted(() => {
  locale.value === "en"
    ? (options.value.locale = "en-US")
    : (options.value.locale = "fi-FI");
});
</script>
