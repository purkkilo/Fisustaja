<template>
  <!-- One Chart.js chart. Pass a config from utils/chartConfigs.js; the
       theme colours are applied here. -->
  <div class="fs-chart" :style="{ height: `${height}px` }">
    <Chart
      :id="chartId"
      :type="config.type"
      :data="config.data"
      :options="options"
      role="img"
      :aria-label="label"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useTheme } from "vuetify";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  ScatterController,
  Tooltip,
} from "chart.js";
import { Chart } from "vue-chartjs";
import { CHART_THEME, themeChartOptions } from "@/utils/chartData";

ChartJS.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  ScatterController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

const props = defineProps({
  // { type, data, options }
  config: { type: Object, required: true },
  // canvas id; the PDF picks charts up by it
  chartId: { type: String, required: true },
  // read out by screen readers
  label: { type: String, required: true },
  height: { type: Number, default: 320 },
});

const theme = useTheme();
const options = computed(() =>
  themeChartOptions(
    props.config.options,
    theme.current.value.dark ? CHART_THEME.dark : CHART_THEME.light,
  ),
);
</script>

<style scoped>
.fs-chart {
  position: relative;
  width: 100%;
}
</style>
