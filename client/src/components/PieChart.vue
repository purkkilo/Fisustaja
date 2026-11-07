<template>
  <!-- vue-chartjs 5: the wrapper div sets the size, the canvas fills it -->
  <div :class="cssClasses" :style="containerStyles">
    <Pie
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
import { Pie } from "vue-chartjs";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";

defineOptions({ name: "PieChart" });
const props = defineProps({
  title: {
    type: String,
    default: "pie-chart",
  },
  chartData: {
    type: Object,
    default: () => ({ labels: [], datasets: [] }),
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
    default: () => ({}),
  },
  plugins: {
    type: Array,
    default: () => [],
  },
});
const { locale } = useI18n();
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);
ChartJS.register(ChartDataLabels);

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

          let lbl = `${tooltipData} kpl ( ${percentage}% )`;
          return lbl;
        },
      },
    },
    legend: {
      display: true,
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
});

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
