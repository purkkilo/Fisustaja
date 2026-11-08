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

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Bar } from "vue-chartjs";
import { useChartColors } from "@/composables/useChartColors";
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

defineOptions({ name: "BarChart" });
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
});
const { locale } = useI18n();
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

const options = ref({
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
          percentage = Math.round((percentage + Number.EPSILON) * 100) / 100;

          let lbl = "";
          if (context.dataset.label === "Amount") {
            lbl = `${t("total-signees")}: ${context.parsed.y.toLocaleString()}`;
          } else {
            lbl = `${context.dataset.label}: ${(
              context.parsed.y / 1000
            ).toLocaleString()} kg ( ${percentage}% ${t("of-fishes")} )`;
          }

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
    x: {},
    y: {
      beginAtZero: true,
      ticks: {
        callback(value) {
          let output = value < 1000 ? value : value / 1000 + "kg";
          return output;
        },
      },
    },
  },
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
