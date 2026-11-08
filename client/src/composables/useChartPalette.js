import { computed } from "vue";
import { useTheme } from "vuetify";
import { SERIES } from "@/utils/chartData";

/** Chart colours for the current light/dark theme. */
export function useChartPalette() {
  const theme = useTheme();
  return computed(() => {
    const { dark, colors } = theme.current.value;
    return {
      dark,
      series: dark ? SERIES.dark : SERIES.light,
      primary: colors.weighing,
      muted: dark ? "#5B6C76" : "#B9C3C9",
      surface: colors.surface,
    };
  });
}
