<template>
  <!-- /public-cups: standings and statistics of public cups -->
  <v-container
    :class="{
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

      <v-row v-if="loadingList">
        <v-col>
          <h2 class="text-white">{{ $t("loading") }}...</h2>
          <ProgressBarQuery />
        </v-col>
      </v-row>
      <v-row v-else-if="cups.length" class="scroll_table">
        <v-col md="4" offset-md="4">
          <v-autocomplete
            v-model="selectedCup"
            :items="cups"
            item-title="select"
            item-value="_id"
            :label="$t('choose') + ' ' + $t('cup.normal')"
            return-object
            single-line
            variant="outlined"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col>
          <h2 class="text-white">
            {{ $t("cup.not-found") }} {{ $t("available") }}
          </h2>
        </v-col>
      </v-row>

      <v-row v-if="loading" style="margin: 20px">
        <v-col>
          <h2 class="text-white">{{ $t("loading") }}...</h2>
          <ProgressBarQuery />
        </v-col>
      </v-row>

      <template v-else-if="selectedCup && cup">
        <h1 class="my-4">{{ cup.name }}, {{ cup.year }}</h1>
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
          <v-tab :disabled="!competitions.length" value="points">{{
            $t("point-status")
          }}</v-tab>
          <v-tab :disabled="!competitions.length" value="stats">{{
            $t("general-statistics")
          }}</v-tab>
        </v-tabs>
        <v-window v-model="tab" style="background: rgba(0, 0, 0, 0.4)">
          <v-window-item value="points">
            <CupPoints
              :competitions="competitions"
              :allCompetitions="allCompetitions"
              :headers="headers"
              :cup="cup"
              :isResults="isResults"
              :loading="loading"
              :results="standings"
              :selectNumbers="selectNumbers"
              @change="setHeaderLabel"
              @refresh="() => load(selectedCup)"
              @calculate="recalculate"
              @save="(options) => savePdf('Tulokset', options)"
              @sort="setShowUnfinished"
            />
          </v-window-item>
          <v-window-item value="stats">
            <CupStats
              :competitions="competitions"
              :cup="cup"
              :all_signees="allResults"
              :biggest_fishes="biggestFishes"
              :biggest_amounts="biggestAmounts"
              :loading="loading"
            />
          </v-window-item>
        </v-window>
      </template>

      <v-row>
        <v-col>
          <v-btn
            color="yellow"
            @click="selectedCup = null"
            :disabled="!selectedCup"
            size="large"
            variant="outlined"
          >
            <v-icon>mdi-cancel</v-icon>{{ $t("cancel") }}
          </v-btn>
        </v-col>
      </v-row>
      <NotificationBar :snackbar="snackbar" :text="text" />
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import CupService from "../services/CupService";
import { useCupStandings } from "@/composables/useCupStandings";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
import NotificationBar from "../components/NotificationBar.vue";
import CupPoints from "../components/CupPoints.vue";
import CupStats from "../components/CupStats.vue";

defineOptions({ name: "PublicCups" });

const {
  loading,
  cup,
  allCompetitions,
  competitions,
  allResults,
  biggestFishes,
  biggestAmounts,
  standings,
  headers,
  isResults,
  selectNumbers,
  snackbar,
  text,
  load,
  recalculate,
  setHeaderLabel,
  setShowUnfinished,
  savePdf,
  clear,
} = useCupStandings({ publicOnly: true });

const cups = ref([]);
const selectedCup = ref(null);
const loadingList = ref(false);
const tab = ref("points");

watch(selectedCup, (c) => (c ? load(c) : clear()));

onMounted(async () => {
  loadingList.value = true;
  try {
    const list = await CupService.getCups({ isPublic: true });
    for (const c of list) c.select = `${c.name} (${c.year})`;
    cups.value = list;
  } catch (err) {
    console.error(err.message);
  } finally {
    loadingList.value = false;
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
