import { watch } from "vue";
import { useTheme } from "vuetify";
import { CHART_THEME } from "@/utils/charts";

/**
 * Keeps a Chart.js options ref readable in the light and dark theme:
 * legend/tick text colour and grid lines follow the Vuetify theme.
 */
export function useChartColors(options) {
  const theme = useTheme();
  watch(
    () => theme.current.value.dark,
    (dark) => {
      const c = dark ? CHART_THEME.dark : CHART_THEME.light;
      // Mutate nested fields — do not replace/spread Chart.js option objects
      options.value.color = c.text;
      const legend = (options.value.plugins ??= {}).legend ??= {};
      const labels = (legend.labels ??= {});
      labels.color = c.text;
      for (const axis of Object.values(options.value.scales || {})) {
        (axis.ticks ??= {}).color = c.text;
        (axis.grid ??= {}).color = c.grid;
      }
    },
    { immediate: true },
  );
}
