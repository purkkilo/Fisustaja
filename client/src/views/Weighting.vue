<template>
  <!-- /weighting: weigh in the boats' catches -->
  <div>
    <Timedate />

    <v-container
      :class="{
        mobile: $vuetify.display.width < 800,
        browser: $vuetify.display.width >= 800,
        wide: $vuetify.display.width >= 1200,
      }"
    >
      <v-card style="background: transparent" elevation="3" variant="outlined">
        <h1 style="margin: 30px">{{ $t("weighting") }}</h1>
        <h2
          v-if="allReturned && signees.length"
          style="margin: 10px; color: chartreuse"
        >
          {{ $t("all-finished") }}
        </h2>
      </v-card>

      <v-tabs
        slider-color="blue-darken-4"
        v-model="tab"
        bg-color="blue-lighten-2"
        color="blue-darken-4"
        grow
        show-arrows
        next-icon="mdi-arrow-right-bold-box-outline"
        prev-icon="mdi-arrow-left-bold-box-outline"
        center-active
      >
        <v-tab value="weighting">{{ $t("weighting") }}</v-tab>
        <v-tab value="situation">{{ $t("leaderboard") }}</v-tab>
        <v-tab v-if="!allReturned" value="onwater">{{
          $t("comp-overview.still-on-water")
        }}</v-tab>
      </v-tabs>

      <v-window v-model="tab" style="background: rgba(0, 0, 0, 0.4)">
        <!-- Weighing -->
        <v-window-item :class="panelClass" value="weighting">
          <v-row v-if="loadingSite">
            <v-col>
              <h2 :class="textClass">{{ $t("fetching") }}...</h2>
              <ProgressBarQuery />
            </v-col>
          </v-row>
          <v-row v-else-if="!signees.length">
            <v-col style="padding: 30px">
              <p class="flow-text" :class="textClass">
                {{ $t("comp-overview.no-signees") }}
              </p>
            </v-col>
          </v-row>
          <template v-else>
            <v-row v-if="notification" style="margin-top: 20px">
              <v-col>
                <v-alert type="success">{{ $t(notification) }}</v-alert>
              </v-col>
            </v-row>

            <v-row v-if="!saving" style="margin-top: 20px">
              <v-col
                :class="store.getTheme ? 'bg-grey-darken-4' : 'input-fields'"
                md="6"
                offset-md="3"
                style="padding: 20px"
              >
                <p class="flow-text" :class="textClass">{{ $t("boat") }}</p>
                <BoatPicker
                  :model-value="selectedBoat"
                  :boats="boatsByNumber"
                  :placements="placements"
                  :disabled="loadingSite"
                  @update:model-value="selectBoat"
                  @clear="clear"
                />
              </v-col>
            </v-row>

            <v-row v-if="!selectedBoat">
              <v-col>
                <v-alert v-if="!searched" type="warning">
                  {{ $t("errors.no-boat-selected") }}
                </v-alert>
                <v-alert v-else type="error">
                  {{ $t("errors.no-boat-found") }}
                </v-alert>
              </v-col>
            </v-row>

            <template v-else>
              <v-row v-if="!saving" style="margin-top: 30px">
                <v-col offset="4" cols="4">
                  <v-btn block color="yellow" @click="clear" size="large"
                    ><v-icon>mdi-backspace-reverse-outline</v-icon
                    >{{ $t("cancel") }}</v-btn
                  >
                </v-col>
              </v-row>
              <v-divider color="black" class="my-3"></v-divider>

              <v-row>
                <v-col md="10" offset-md="1">
                  <BiggestFishForm
                    v-model:visible="biggestFishVisible"
                    v-model:fish-name="biggestFishName"
                    v-model:weight="biggestFishWeight"
                    :fishes="competition.fishes"
                    :saving="savingFish"
                    :disabled="saving"
                    class="pa-2 mb-2"
                    @save="saveBiggestFish"
                  />

                  <div v-for="(w, index) in weights" :key="w.id" class="py-3">
                    <v-divider color="black" class="mb-3"></v-divider>
                    <FishWeightInput
                      v-model="w.value"
                      :name="w.name"
                      :index="index"
                      :loading="savingFish"
                      :disabled="saving || savingFish"
                    />
                  </div>
                  <v-divider color="black" class="my-3"></v-divider>

                  <v-row v-if="!saving" class="justify-center align-center">
                    <v-col cols="8">
                      <CatchSummary
                        :boat="selectedBoat"
                        :total-weight="totalWeight"
                        :total-points="totalPoints"
                        :placement="previewPlacement"
                      />
                    </v-col>
                  </v-row>
                  <v-divider color="black" class="my-3"></v-divider>

                  <v-row v-if="!saving">
                    <v-col>
                      <v-btn
                        tile
                        color="red"
                        @click="saveCatch({ reset: true })"
                        :loading="refreshing"
                        size="large"
                        ><v-icon>mdi-delete</v-icon
                        >{{ $t("button.clear-signee") }}</v-btn
                      >
                    </v-col>
                    <v-col>
                      <v-btn
                        tile
                        color="green"
                        @click="saveCatch()"
                        :loading="refreshing"
                        size="large"
                        ><v-icon>mdi-check</v-icon>{{ $t("save") }}</v-btn
                      >
                    </v-col>
                  </v-row>
                  <v-row v-else>
                    <v-col>
                      <p class="flow-text" :class="textClass">
                        {{ $t("updating") }}...
                      </p>
                      <ProgressBarQuery />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </template>

            <v-row v-if="!saving" style="margin-bottom: 20px">
              <v-col>
                <v-btn
                  id="updatebtn"
                  tile
                  color="blue-darken-4"
                  @click="refresh"
                  :loading="refreshing"
                  class="text-white"
                  size="large"
                >
                  <v-icon>mdi-update</v-icon>{{ $t("button.update") }}
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </v-window-item>

        <!-- Leaderboard -->
        <v-window-item :class="panelClass" value="situation">
          <v-row v-if="returned.length">
            <v-col md="8" offset-md="2" style="margin-top: 20px">
              <BoatTable
                :title="$t('leaderboard')"
                :items="leaderboard"
                :columns="leaderboardColumns"
                @select="pickFromTable"
              />
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col md="8" offset-md="2" class="my-8">
              <p class="flow-text" :class="textClass">{{ $t("no-results") }}</p>
            </v-col>
          </v-row>
        </v-window-item>

        <!-- Still on the water -->
        <v-window-item :class="panelClass" value="onwater">
          <v-row v-if="stillOnWater.length">
            <v-col md="8" offset-md="2">
              <BoatTable
                :title="$t('comp-overview.still-on-water')"
                :items="stillOnWater"
                :columns="onWaterColumns"
                :loading="saving"
                @select="pickFromTable"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col md="8" offset-md="2" class="my-8">
              <v-btn
                v-if="stillOnWater.length"
                tile
                color="grey-darken-4"
                class="text-white"
                @click="allReturnedClicked"
                :loading="saving"
                size="large"
                ><v-icon>mdi-check-outline</v-icon
                >{{ $t("button.set-all-finished") }}</v-btn
              >
              <p v-else class="flow-text" :class="textClass">
                {{ $t("all-finished") }}
              </p>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-container>
    <NotificationBar v-model:snackbar="snackbar" :text="text" />
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import { useMainStore } from "@/store";
import { useWeighting } from "@/composables/useWeighting";
import Timedate from "../components/layout/Timedate.vue";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
import NotificationBar from "../components/NotificationBar.vue";
import BoatPicker from "../components/weighting/BoatPicker.vue";
import BiggestFishForm from "../components/weighting/BiggestFishForm.vue";
import FishWeightInput from "../components/weighting/FishWeightInput.vue";
import CatchSummary from "../components/weighting/CatchSummary.vue";
import BoatTable from "../components/weighting/BoatTable.vue";

defineOptions({ name: "Weighting" });

const store = useMainStore();
const {
  competition,
  signees,
  loadingSite,
  refreshing,
  saving,
  savingFish,
  notification,
  selectedBoat,
  searched,
  weights,
  biggestFishVisible,
  biggestFishName,
  biggestFishWeight,
  boatsByNumber,
  leaderboard,
  placements,
  stillOnWater,
  returned,
  allReturned,
  totalWeight,
  totalPoints,
  previewPlacement,
  load,
  selectBoat,
  clear,
  saveBiggestFish,
  saveCatch,
  markAllReturned,
} = useWeighting();

const tab = ref("weighting");
const snackbar = ref(false);
const text = ref("");

const leaderboardColumns = [
  { key: "placement", title: "placement" },
  { key: "boat_number", title: "boat-number" },
  { key: "captain_name", title: "captain-name" },
  { key: "total_points", title: "points" },
];
const onWaterColumns = [
  { key: "boat_number", title: "boat-number" },
  { key: "captain_name", title: "captain-name" },
  { key: "temp_captain_name", title: "temp-captain-name" },
  { key: "starting_place", title: "starting-place" },
];

const panelClass = computed(() =>
  store.getTheme ? "inputarea-dark" : "inputarea",
);
const textClass = computed(() => ({ "text-white": store.getTheme }));

function notify(message) {
  text.value = message;
  snackbar.value = false;
  nextTick(() => (snackbar.value = true));
}

// A row clicked in either table opens that boat on the weighing tab
function pickFromTable(boat) {
  tab.value = "weighting";
  selectBoat(boat);
}

async function allReturnedClicked() {
  if (await markAllReturned()) notify("all-finished");
}

// The competition being run is remembered in localStorage
const stored = JSON.parse(localStorage.getItem("competition") || "null");
function refresh() {
  if (stored?._id) load(stored._id);
}

if (stored?._id) {
  refresh();
} else {
  loadingSite.value = false;
  console.log("No competition in localstorage!");
}
</script>
