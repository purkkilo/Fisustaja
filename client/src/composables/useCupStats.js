import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { getRandomColors } from "@/utils/colors";
import { sortBy } from "@/utils/format";

const HEADERS_FISHES_TOTAL = [
  { title: "fish", key: "name" },
  { title: "amount", key: "weights" },
];
const HEADERS_FISHES_COMPETITION = [
  { title: "fish", key: "name" },
  { title: "comp.normal", key: "competition_name" },
  { title: "amount", key: "weights" },
];
const HEADERS_SIGNEES = [
  { title: "comp.normal", key: "competition_name" },
  { title: "amount", key: "signees" },
];
const HEADERS_BIGGEST_FISHES = [
  { title: "boat-number", key: "boat_number" },
  { title: "captain-name", key: "captain_name" },
  { title: "comp.normal", key: "competition_name" },
  { title: "fish", key: "fish_name" },
  { title: "weight", key: "weight" },
];
const HEADERS_BIGGEST_AMOUNTS = [
  { title: "boat-number", key: "boat_number" },
  { title: "captain-name", key: "captain_name" },
  { title: "comp.normal", key: "competition_name" },
  { title: "fish", key: "fish_name" },
  { title: "weight", key: "weight" },
];

function weightChart(labels, data, label = "Weights") {
  return {
    labels,
    datasets: [
      {
        label,
        backgroundColor: getRandomColors(data.length),
        data,
      },
    ],
  };
}

/**
 * Builds cup statistics tables/charts from competitions + catch data.
 * Recalculates whenever the source props change.
 */
export function useCupStats(props) {
  const { t } = useI18n();

  const stats_tab = ref(null);
  const showTables = ref(true);
  const showCharts = ref(true);

  const headers_cup_fishes_total = HEADERS_FISHES_TOTAL;
  const headers_cup_fishes_competition = HEADERS_FISHES_COMPETITION;
  const headers_cup_signees = HEADERS_SIGNEES;
  const headers_cup_biggest_fishes = HEADERS_BIGGEST_FISHES;
  const headers_cup_biggest_amounts = HEADERS_BIGGEST_AMOUNTS;

  const cup_fishes_total = ref([]);
  const cup_fishes_competition = ref([]);
  const cup_biggest_fishes = ref([]);
  const cup_biggest_amounts = ref([]);
  const cup_signees = ref([]);
  const total_fishes_chart_data = ref(null);
  const competition_fishes_chart_data = ref(null);
  const cup_biggest_fishes_chart_data = ref(null);
  const cup_biggest_amounts_chart_data = ref(null);
  const cup_signees_chart_data = ref(null);

  function calculateCupStatistics() {
    if (!props.competitions?.length) return;

    const all_fishes = [];
    const competition_signees_count = [];
    const fishesByCompetition = [];
    const all_biggest_fishes = [];
    const all_biggest_amounts = [];
    let cup_fishes = [];

    props.competitions.forEach((competition) => {
      const comp_signees = (props.all_signees ?? []).filter(
        (s) => s.competition_id === competition._id,
      );
      comp_signees.forEach((s) => {
        (s.fishes ?? []).forEach((fish) => {
          const fishDef = (competition.fishes ?? []).find(
            (f) => f.id === fish.id,
          );
          if (!fishDef) return;
          const fish_name = fishDef.name;
          if (fish.weights > 0) {
            const found_fish = all_fishes.findIndex(
              (f) => f.name.toUpperCase() === fish_name.toUpperCase(),
            );
            if (found_fish > -1) {
              all_fishes[found_fish].weights += fish.weights;
            } else {
              all_fishes.push({
                id: found_fish,
                name: fish_name,
                weights: fish.weights,
              });
            }
          }

          const comp_fish = fishesByCompetition.find(
            (f) => f.comp_id === competition._id && f.id === fish.id,
          );
          const fish_weight = Number.isInteger(fish.weights) ? fish.weights : 0;
          if (comp_fish) {
            comp_fish.weights += fish_weight;
          } else {
            fishesByCompetition.push({
              id: fish.id,
              name: fish_name,
              competition_name: competition.name,
              comp_id: competition._id,
              weights: fish_weight,
            });
          }
        });
      });

      competition_signees_count.push({
        competition_name: competition.name,
        signees: (props.all_signees ?? []).filter(
          (c) => c.competition_id === competition._id,
        ).length,
      });

      (competition.fishes ?? []).forEach((fish) => {
        cup_fishes.push(fish.name);
      });
    });

    cup_fishes = Array.from(new Set(cup_fishes));

    cup_fishes.forEach((name) => {
      let fishes = (props.biggest_fishes ?? []).filter((f) => f.name === name);
      if (fishes.length && fishes[0].weight > 0) {
        const competition = props.competitions.find(
          (c) => c._id === fishes[0].competition_id,
        );
        all_biggest_fishes.push({
          id: fishes[0].id,
          boat_number: fishes[0].boat_number,
          captain_name: fishes[0].captain_name,
          competition_name: competition?.name ?? "",
          fish_name: name,
          weight: fishes[0].weight,
        });
      }

      fishes = (props.biggest_amounts ?? []).filter((f) => f.name === name);
      if (fishes.length && fishes[0].weight > 0) {
        all_biggest_amounts.push({
          boat_number: fishes[0].boat_number,
          captain_name: fishes[0].captain_name,
          competition_name: fishes[0].competition_name,
          fish_name: name,
          weight: fishes[0].weight,
        });
      }
    });

    cup_fishes_total.value = all_fishes.sort(sortBy("weights", false));
    total_fishes_chart_data.value = weightChart(
      cup_fishes_total.value.map((f) => f.name),
      cup_fishes_total.value.map((f) => f.weights),
    );

    cup_fishes_competition.value = fishesByCompetition.sort(
      sortBy("weights", false),
    );
    const competition_labels = [];
    const competition_data = [];
    cup_fishes_competition.value.forEach((fish) => {
      if (fish.weights) {
        competition_labels.push(`${fish.name} (${fish.competition_name})`);
        competition_data.push(fish.weights);
      }
    });
    competition_fishes_chart_data.value = weightChart(
      competition_labels,
      competition_data,
    );

    cup_biggest_fishes.value = all_biggest_fishes.sort(sortBy("weight", false));
    cup_biggest_fishes_chart_data.value = weightChart(
      cup_biggest_fishes.value.map(
        (item) =>
          `${item.fish_name} (${item.boat_number}), ${item.competition_name}`,
      ),
      cup_biggest_fishes.value.map((item) => item.weight),
    );

    cup_biggest_amounts.value = all_biggest_amounts.sort(
      sortBy("weight", false),
    );
    cup_biggest_amounts_chart_data.value = weightChart(
      cup_biggest_amounts.value.map(
        (item) =>
          `${item.fish_name} (${item.boat_number}), ${item.competition_name}`,
      ),
      cup_biggest_amounts.value.map((item) => item.weight),
    );

    cup_signees.value = competition_signees_count.sort(
      sortBy("signees", false),
    );
    cup_signees_chart_data.value = weightChart(
      cup_signees.value.map((item) => item.competition_name),
      cup_signees.value.map((item) => item.signees),
      t("amount"),
    );
  }

  watch(
    () => [
      props.competitions,
      props.all_signees,
      props.biggest_fishes,
      props.biggest_amounts,
    ],
    () => calculateCupStatistics(),
    { deep: true, immediate: true },
  );

  return {
    stats_tab,
    showTables,
    showCharts,
    headers_cup_fishes_total,
    headers_cup_fishes_competition,
    headers_cup_signees,
    headers_cup_biggest_fishes,
    headers_cup_biggest_amounts,
    cup_fishes_total,
    cup_fishes_competition,
    cup_biggest_fishes,
    cup_biggest_amounts,
    cup_signees,
    total_fishes_chart_data,
    competition_fishes_chart_data,
    cup_biggest_fishes_chart_data,
    cup_biggest_amounts_chart_data,
    cup_signees_chart_data,
  };
}
