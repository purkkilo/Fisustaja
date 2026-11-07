<template>
  <!-- /cup-overview -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div>
    <v-container
      v-bind:class="{
        mobile: $vuetify.display.width < 800,
        browser: $vuetify.display.width >= 800,
        wide: $vuetify.display.width >= 1200,
      }"
    >
      <v-card style="background: transparent" elevation="3" variant="outlined">
        <v-row>
          <v-col md="6" offset-md="3">
            <h1>{{ $t("home.cup") }}</h1>
          </v-col>
        </v-row>
        <v-row v-if="cups.length" class="scroll_table">
          <v-col md="4" offset-md="4">
            <!-- TODO add v-autocompelete, but so that it popsup the keyboad on mobile only when pressing search button? -->
            <v-autocomplete
              v-model="selected_cup"
              :items="cups"
              item-title="select"
              item-value="_id"
              :label="$t('choose') + ' ' + $t('cup.normal')"
              @update:model-value="pickCup"
              return-object
              single-line
              variant="outlined"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col v-if="!loading">
            <h2 class="text-white">{{ $t("loading") }}...</h2>
            <ProgressBarQuery />
          </v-col>
          <v-col v-else>
            <h2 class="text-white">
              {{ $t("cup.not-found") }} {{ $t("available") }}
            </h2>
          </v-col>
        </v-row>
        <v-row
          class="justify-center align-center"
          v-if="!loading && selected_cup"
        >
          <v-col>
            <h1>{{ cup.name }}, {{ cup.year }}</h1>
          </v-col>
        </v-row>
        <v-tabs
          slider-color="blue-darken-4"
          v-if="!loading && selected_cup"
          v-model="tab"
          bg-color="blue-lighten-2"
          color="blue-darken-4"
          grow
          show-arrows
          next-icon="mdi-arrow-right-bold-box-outline"
          prev-icon="mdi-arrow-left-bold-box-outline"
          center-active
        >
          <v-tab :disabled="!competitions.length" value="points">{{
            $t("point-status")
          }}</v-tab>
          <v-tab :disabled="!competitions.length" value="stats">{{
            $t("general-statistics")
          }}</v-tab>
        </v-tabs>
        <v-window v-model="tab" style="background: rgba(0, 0, 0, 0.4)">
          <v-window-item :value="'points'">
            <cup-points
              v-if="selected_cup && !loading"
              :competitions="competitions"
              :allCompetitions="allCompetitions"
              :headers="headers"
              :cup="selected_cup"
              :isResults="isResults"
              :loading="loading"
              :notFinishedCount="notFinishedCount"
              :results="results"
              :selectNumbers="selectNumbers"
              @change="(selection) => changeHeaders(selection)"
              @refresh="(cup) => refreshCup(cup)"
              @calculate="
                (selectedCompetitions) =>
                  calculateAll(competitions, selectedCompetitions)
              "
              @save="
                (options) => {
                  selectedCompetitions = options.selectedCompetitions;
                  isLandscape = options.isLandscape;
                  showInfoInPdf = options.showInfoInPdf;
                  pdfWrapper(`Tulokset`);
                }
              "
              @sort="
                (show) => {
                  showUnfinishedCompetitions = show;
                  setCompetitionData(cup);
                }
              "
            ></cup-points>
          </v-window-item>
          <v-window-item :value="'stats'">
            <cup-stats
              :competitions="competitions"
              :cup="cup"
              :all_signees="all_signees"
              :biggest_fishes="biggest_fishes"
              :biggest_amounts="biggest_amounts"
              :loading="loading"
            ></cup-stats>
          </v-window-item>
        </v-window>
        <v-row>
          <v-col>
            <v-btn
              color="yellow"
              @click="
                selected_cup = null;
                competitions = [];
                results = [];
              "
              :disabled="!selected_cup"
              size="large"
              variant="outlined"
            >
              <v-icon>mdi-cancel</v-icon>{{ $t("cancel") }}
            </v-btn>
          </v-col>
        </v-row>

        <v-row v-if="loading" style="margin: 20px">
          <v-row>
            <v-col>
              <h2 class="text-white">{{ $t("loading") }}...</h2>
              <ProgressBarQuery />
            </v-col>
          </v-row>
        </v-row>
        <notification-bar :snackbar="snackbar" :text="text"></notification-bar>
      </v-card>
    </v-container>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useMainStore } from "@/store";
import CupService from "../services/CupService";
import CompetitionService from "../services/CompetitionService";
import ResultService from "../services/ResultService";
import FishService from "../services/FishService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
import CupPoints from "../components/CupPoints.vue";
import CupStats from "../components/CupStats.vue";
import { sortBy } from "@/utils/format";
import { saveCupAsPDF } from "@/pdf";
import NotificationBar from "../components/NotificationBar.vue";

defineOptions({ name: "PublicCups" });
const store = useMainStore();

const dialog = ref(false);
const isLandscape = ref(false);
const cup = ref(null);
const cups = ref([]);
const competitions = ref([]);
const allCompetitions = ref([]);
const all_signees = ref([]);
const biggest_amounts = ref([]);
const biggest_fishes = ref([]);
const headers = ref([]);
const results = ref([]);
const loading = ref(false);
const selectNumbers = ref([]);
const selectedCompetitions = ref(0);
const selected_cup = ref(null);
const tab = ref(null);
const search = ref("");
const notFinishedCount = ref(0);
const snackbar = ref(false);
const text = ref("");
const isResults = ref(false);
const showInfoInPdf = ref(true);
const showUnfinishedCompetitions = ref(false);
const signees = ref(null);

function pickCup() {
  refreshCup(selected_cup.value);
}

function pdfWrapper(table_title) {
  saveCupAsPDF(
    table_title,
    isLandscape.value,
    cup.value,
    competitions.value,
    showUnfinishedCompetitions.value,
    showInfoInPdf.value,
    selectedCompetitions.value,
    headers.value,
    results.value,
    signees.value,
  );
  dialog.value = false;
}

// Calculate all the cup points, and limit the number of races taken into account
// If limit = 4, 4 races with highest points will be calculated, other races will have 5 points where the signee has participated

async function calculateAll(competitions, limit) {
  let all_results = [];
  isResults.value = false;
  competitions.forEach((competition) => {
    let _signees = all_signees.value.filter(
      (s) => s.competition_id === competition._id,
    );

    competition.total_weights = 0;
    _signees.forEach((s) => {
      s.total_points = 0;
      if (s.fishes.length) {
        s.fishes.forEach((f) => {
          let fish = competition.fishes.find((cf) => cf.id === f.id);
          s.total_points += f.weights * fish.multiplier;
          competition.total_weights += f.weights;
          fish.weights += f.weights;
        });
      } else {
        // Fix for pdf
        competition.fishes.forEach((cf) => {
          s.fishes.push({ id: cf.id, name: cf.name, weights: "-" });
        });
      }
    });
    competition.normal_points = calculateNormalResults(
      competition,
      _signees,
    ).normal_points;
    // Dynamic headers, because competition names change
    //If there are any results in the competition
    if (competition.normal_points.length) {
      //Loop through each competition's results
      competition.normal_points.forEach((signee) => {
        // Get each signee's results from array that has all the results
        let index = all_results.findIndex((item) => {
          return parseInt(signee.boat_number) === parseInt(item.boat_number);
        });

        //If the signee is found there
        if (index > -1) {
          // Get the signee, and add competitions results to array, under the competition.name key
          let found_signee = all_results[index];
          found_signee.cup_results[competition.key_name] = {
            competition: competition._id,
            key_name: competition.key_name,
            points: signee.cup_points_total,
            placement: signee.placement,
          };
          // For tracking total points
          all_results.splice(index, 1, found_signee);
        }
        // Not any points on cup_results yet
        else {
          // Get the data that is stored in the cup's signees array
          let cup_signee = signees.value.find(
            (element) => element.boat_number === signee.boat_number,
          );
          if (cup_signee) {
            // Add original names from the first instance
            signee.captain_name = cup_signee.captain_name;
            signee.temp_captain_name = cup_signee.temp_captain_name;
            signee.locality = cup_signee.locality;
          } else {
            // TODO: Figure out a better way to notify
            console.log(
              `(${signee.boat_number}) - ${signee.captain_name} wasn't found on results somehow`,
            );
            alert(
              `(${signee.boat_number}) - ${signee.captain_name} wasn't found on results somehow`,
            );
          }
          // Initialize variables and add first points
          signee.cup_results = [];
          // Array for comparing points with limit
          signee.cup_results[competition.key_name] = {
            competition: competition._id,
            key_name: competition.key_name,
            points: signee.cup_points_total,
            placement: signee.placement,
          };
          all_results.push(signee);
        }
      });
    }

    all_results.length ? (isResults.value = true) : (isResults.value = false);

    if (all_results.length) {
      // limits the amount of competitions are taken into account in the cup
      all_results = limitCompetitions(all_results, limit);
      // Sort the array based on total cup points
      all_results = all_results.sort(function compare(a, b) {
        return (
          parseInt(b.cup_results["total"]) - parseInt(a.cup_results["total"])
        );
      });
      changeHeaders("locality");

      let final_placement = 1;
      let last_points = -1;
      let last_placement = -1;

      all_results.forEach((signee) => {
        if (last_points === signee.cup_results["total"]) {
          signee.final_placement = last_placement;
        } else {
          signee.final_placement = final_placement;
          last_points = signee.cup_results["total"];
          last_placement = signee.final_placement;
        }
        signee.final_cup_points = signee.cup_results["total"];
        final_placement++;
      });
      results.value = all_results;
    }
  });
}

// "Normaalikilpailu" results

function calculateNormalResults(competition, signees) {
  const placement_points = competition.cup_placement_points;
  let cup_placement_points = placement_points[0];
  const cup_participation_points = competition.cup_participation_points;
  let last_points = 0;
  let last_placement = 1;

  let placement = 1;
  let cup_points_total = 0;
  let normal_points = [];
  let normal_weights = [];
  signees = signees.filter((signee) => signee.returned == true);
  signees = signees.sort(function compare(a, b) {
    return parseInt(b.total_points) - parseInt(a.total_points);
  });
  // For every signee, calculate their cup points and placing
  //TODO rework the structure, seems more complex than it should be
  // Placements and points now saved in every competition to cup_placement_points_array, based on placement fetch from there?
  signees.forEach((signee, index) => {
    // If competitor has same points as last competitor
    if (signee.total_points === last_points) {
      placement = last_placement;
    }
    // If no tie, add tied_competitors to placement, to give correct placement to next not tied competitor
    else {
      placement = index + 1;
    }

    // Find the placement points according to the placement
    let p = placement_points.find((e) => e.placement === placement);
    // If placement isn't found (placement > than provided placements), or points = 0 (no points from competition)
    if (!p || signee.total_points === 0) {
      cup_placement_points = 0;
    } else {
      cup_placement_points = p.points * competition.cup_points_multiplier;
    }
    // Calculate total cup points, cup points multiplier only scales the placement points
    cup_points_total = cup_placement_points + cup_participation_points;
    //For showing cup points, "Pisteet" on v-select
    normal_points.push({
      placement: placement,
      boat_number: signee.boat_number,
      captain_name: signee.captain_name,
      temp_captain_name: signee.temp_captain_name,
      locality: signee.locality,
      total_points: signee.total_points,
      cup_placement_points: cup_placement_points,
      cup_participation_points: cup_participation_points,
      cup_points_total: cup_points_total,
    });
    //For showing fish weights, "Kalat" on v-select
    signee.placement = placement;
    // For the data-table
    signee.fishes.forEach((f) => {
      signee[f.id] = f.weights;
    });
    normal_weights.push(signee);

    last_placement = placement;
    last_points = signee.total_points;
  });

  return { normal_points, normal_weights };
}

function limitCompetitions(results, limit) {
  results.forEach((signee) => {
    // If there are more or equal amount of competitions than the limit, limit remaining competitions after the limit
    if (competitions.value.length >= limit) {
      // Initialize total points to 0
      signee.cup_results["total"] = 0;
      // sort the array that points are compared to
      let temp = [...signee.cup_results];
      temp.sort(function compare(a, b) {
        return parseInt(b.points) - parseInt(a.points);
      });

      // Add all the limited points to total points
      temp.forEach((element, index) => {
        if (element) {
          if (index + 1 <= limit) {
            signee.cup_results["total"] += element.points;
          } else {
            const comp = competitions.value.find(
              (c) => element.competition === c._id,
            );
            signee.cup_results[element.key_name].points =
              comp.cup_participation_points;
            signee.cup_results["total"] += comp.cup_participation_points;
          }
        }
      });
    }
  });

  // Return sorted results
  return results;
}

function setCompetitionData(_cup) {
  selectNumbers.value = [];
  // Convert dates
  let counter = 1;
  allCompetitions.value.forEach((competition) => {
    competition.start_date = new Date(competition.start_date);
    competition.end_date = new Date(competition.end_date);
    // Index for competition
    competition.key_name = counter;
    counter++;
  });
  allCompetitions.value.sort((a, b) => {
    return new Date(a.start_date) - new Date(b.start_date);
  });
  signees.value = cup.value.signees.sort(sortBy("boat_number", true));
  signees.value.forEach((signee) => {
    signee.dialog = false;
  });

  competitions.value = [...allCompetitions.value];
  if (!showUnfinishedCompetitions.value) {
    competitions.value = competitions.value.filter((comp) => comp.isFinished);
  }
  competitions.value.forEach((_, i) => {
    selectNumbers.value.push(i + 1);
  });
  if (_cup.meaningful_competitions > 0)
    selectedCompetitions.value = _cup.meaningful_competitions;
  else selectedCompetitions.value = competitions.value.length;
  calculateAll(competitions.value, selectedCompetitions.value);
}

async function refreshCup(_cup) {
  if (selected_cup.value) {
    cup.value = _cup;
    loading.value = true;
    // Returns an array, get first result (there shouldn't be more than one in any case, since id's are unique)
    //TODO make a test for this?
    // Update to vuex, Assing variables from vuex (see client/store/index.js)
    store.refreshCup(cup.value);
    try {
      allCompetitions.value = await CompetitionService.getCompetitions({
        cup_id: _cup._id,
        isPublic: true,
      });

      biggest_fishes.value = await FishService.getFishes({
        cup_id: _cup._id,
      });
      biggest_fishes.value = biggest_fishes.value.sort(
        (a, b) => b.weight - a.weight,
      );

      await ResultService.getResults({ cup_id: _cup._id })
        .then((r) => {
          r.forEach((s) => {
            if (s.fishes.length) {
              s.fishes.forEach((f) => {
                let comp = allCompetitions.value.find(
                  (c) => c._id === s.competition_id,
                );
                let fish = comp.fishes.find((cf) => cf.id === f.id);

                biggest_amounts.value.push({
                  id: fish.id,
                  competition_id: comp._id,
                  competition_name: comp.name,
                  boat_number: s.boat_number,
                  captain_name: s.captain_name,
                  name: fish.name,
                  weight: f.weights,
                });
              });
            }
          });

          all_signees.value = r;
          biggest_amounts.value = biggest_amounts.value.sort(
            (a, b) => b.weight - a.weight,
          );
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setCompetitionData(cup.value);
          loading.value = false;
          text.value = "notification.info-up-to-date";
          snackbar.value = true;
        });
    } catch (error) {
      console.error(error);
    }
  }
}

function getCompetitionFinishedColor(isFinished) {
  if (isFinished) return "red";
  else return "primary";
}

function replaceAllChars(text, obj) {
  return [...text]
    .map((each) => {
      for (const o in obj) {
        each == o ? (each = obj[o]) : o;
      }
      return each;
    })
    .join("");
}

function changeHeaders(headerSelection) {
  headers.value = [
    {
      text: "placement",
      highlight: false,
      align: "center",
      value: "final_placement",
    },
    {
      text: "boat-number",
      align: "center",
      highlight: false,
      value: "boat_number",
    },
    {
      text: "captain-name",
      align: "center",
      highlight: false,
      value: "captain_name",
    },
    {
      text: "locality",
      align: "center",
      highlight: false,
      value: "locality",
    },
  ];

  notFinishedCount.value = 0;
  competitions.value.forEach((competition) => {
    // Keep track if there are unfinished competitions
    if (!competition.isFinished) {
      notFinishedCount.value++;
    }
    // Dynamic headers, because competition names change
    if (headerSelection === "locality") {
      // Check if there are competitions with same locality, if so, add identifier
      let found_headers = headers.value.filter((header) => {
        return competition.locality === header.text;
      });
      if (found_headers.length) {
        let new_header_text = ` ${competition.locality} #${
          found_headers.length + 1
        }`;
        headers.value.push({
          text: new_header_text,
          align: "center",
          highlight: true,
          isFinished: competition.isFinished,
          value: `cup_results[${competition.key_name}].points`,
        });
      } else {
        headers.value.push({
          text: competition.locality,
          align: "center",
          highlight: true,
          isFinished: competition.isFinished,
          value: `cup_results[${competition.key_name}].points`,
        });
      }
    } else {
      headers.value.push({
        text: competition.name,
        align: "center",
        highlight: true,
        isFinished: competition.isFinished,
        value: `cup_results[${competition.key_name}].points`,
      });
    }
  });
  headers.value.push({
    text: "total-big",
    align: "center",
    highlight: false,
    value: "final_cup_points",
  });
}

onMounted(async () => {
  cups.value = await CupService.getCups({
    isPublic: true,
  });
  if (cups.value.length) {
    cups.value.forEach((cup) => {
      cup.select = `${cup.name} (${cup.year})`;
    });
  }
});
</script>
<style scoped>
.isFinished {
  background-color: rgb(117, 23, 0);
}
tbody tr :hover {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
