<template>
  <!-- /continue -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div>
    <v-card
      style="background: transparent; padding: 20px"
      elevation="3"
      variant="outlined"
    >
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
        <v-tab value="competitions">{{ $t("comp.plural") }}</v-tab>
        <v-tab value="cups">{{ $t("cup.plural") }}</v-tab>
      </v-tabs>
      <v-window v-model="tab" style="background: transparent">
        <v-window-item :value="'competitions'">
          <v-row>
            <v-col>
              <div v-if="competitions.length">
                <v-card>
                  <v-card-title class="d-flex flex-wrap align-center">
                    <p class="flow-text">{{ $t("comp.plural") }}</p>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search_comp"
                      append-inner-icon="mdi-magnify"
                      :label="$t('search') + ' ' + $t('comp.for')"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-card-title>
                  <v-data-table
                    id="normal-table"
                    :headers="tableHeaders(headers)"
                    :items="competitions"
                    :search="search_comp"
                  >
                    <template
                      v-for="h in headers"
                      :key="h.value"
                      v-slot:[`header.${h.value}`]="{ column: header }"
                    >
                      <span> {{ $t(header.text) }}</span>
                    </template>

                    <template v-slot:[`item.start_date`]="{ item }">
                      <v-chip color="primary-darken-2" variant="flat">{{
                        formatDateToLocaleDateString(item.start_date)
                      }}</v-chip>
                    </template>
                    <template v-slot:[`item.cup_name`]="{ item }">
                      <v-chip v-if="item.cup_id"
                        >{{ item.cup_name }} ({{
                          getYear(item.start_date)
                        }})</v-chip
                      >
                    </template>
                    <template v-slot:[`item.cup_points_multiplier`]="{ item }">
                      <v-chip
                        v-if="item.cup_id"
                        :color="getColor(item.cup_points_multiplier)"
                        :variant="store.getTheme ? 'outlined' : 'flat'"
                        >{{ item.cup_points_multiplier }}x</v-chip
                      >
                    </template>
                    <template v-slot:[`item.choose`]="{ item }">
                      <v-tooltip location="end">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="primary"
                            v-bind="props"
                            @click="pickCompetition(item)"
                            :disabled="loading || publishing"
                            ><v-icon color="black"
                              >mdi-arrow-right-bold-box-outline</v-icon
                            ></v-btn
                          >
                        </template>
                        <span>{{ $t("comp.to") }}</span>
                      </v-tooltip>
                    </template>
                  </v-data-table>
                </v-card>
              </div>
              <div v-else>
                <v-col v-if="!loading">
                  <v-row>
                    <v-col v-if="cups.length">
                      <h2
                        v-bind:class="{
                          'text-white': store.getTheme,
                        }"
                      >
                        {{ $t("comp.not-found") }}
                      </h2>
                    </v-col>
                    <v-col v-else>
                      <h2
                        v-bind:class="{
                          'text-white': store.getTheme,
                        }"
                      >
                        {{ $t("comp.not-found") }}
                      </h2>
                      <h2
                        v-bind:class="{
                          'text-white': store.getTheme,
                        }"
                      >
                        {{ $t("cup.not-found") }}
                      </h2>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-else-if="error">
                  <h2 class="bg-error">{{ error }}</h2>
                </v-col>
                <v-col v-else>
                  <h2
                    v-bind:class="{
                      'text-white': store.getTheme,
                    }"
                  >
                    {{ $t("loading") }} {{ $t("comp.count") }}...
                  </h2>
                  <ProgressBarQuery />
                </v-col>
              </div>
            </v-col>
          </v-row>
        </v-window-item>
        <v-window-item :value="'cups'">
          <v-row>
            <v-col>
              <div v-if="cups.length">
                <v-card>
                  <v-card-title class="d-flex flex-wrap align-center">
                    <p class="flow-text">{{ $t("cup.plural") }}</p>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search_cup"
                      append-inner-icon="mdi-magnify"
                      :label="$t('search') + ' ' + $t('cup.for')"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-card-title>
                  <v-data-table
                    id="normal-table"
                    :headers="tableHeaders(headers_cup)"
                    :items="cups"
                    :search="search_cup"
                    :loading="publishing"
                  >
                    <template
                      v-for="h in headers_cup"
                      :key="h.value"
                      v-slot:[`header.${h.value}`]="{ column: header }"
                    >
                      <span> {{ $t(header.text) }}</span>
                    </template>
                    <template v-slot:[`item.name`]="{ item }">
                      <v-chip color="primary-darken-3" variant="flat">{{
                        item.name
                      }}</v-chip>
                    </template>
                    <template v-slot:[`item.year`]="{ item }">
                      <v-chip
                        color="grey"
                        :variant="store.getTheme ? 'outlined' : 'flat'"
                        >{{ item.year }}</v-chip
                      >
                    </template>
                    <template v-slot:[`item.isPublic`]="{ item }">
                      <v-tooltip location="end">
                        <template v-slot:activator="{ props }">
                          <v-chip
                            v-bind="props"
                            :color="
                              item.isPublic ? 'green-darken-2' : 'red-darken-2'
                            "
                            @click="$emit('publish', item)"
                            :disabled="publishing"
                            :variant="store.getTheme ? 'outlined' : 'flat'"
                            >{{
                              item.isPublic ? "Julkinen" : "Salainen"
                            }}</v-chip
                          >
                        </template>
                        <span>Muuta tila painamalla</span>
                      </v-tooltip>
                    </template>
                    <template v-slot:[`item.choose`]="{ item }">
                      <v-tooltip location="end">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="primary"
                            v-bind="props"
                            @click="pickCup(item)"
                            :disabled="loading || publishing"
                            ><v-icon color="black"
                              >mdi-arrow-right-bold-box-outline</v-icon
                            ></v-btn
                          >
                        </template>
                        <span>Siirry Cuppiin</span>
                      </v-tooltip>
                    </template>
                  </v-data-table>
                </v-card>
              </div>
              <v-row v-else>
                <v-col v-if="error" class="bg-error"
                  ><h2>{{ error }}</h2></v-col
                >
                <v-col v-else>
                  <h2
                    v-bind:class="{
                      'text-white': store.getTheme,
                    }"
                  >
                    Ladataan Cuppeja...
                  </h2>
                  <ProgressBarQuery />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-card>
  </div>
</template>

<script setup>
import { tableHeaders } from "@/utils/tableHeaders";
import { onMounted, ref } from "vue";
import { useMainStore } from "@/store";
import { useRouter } from "vue-router";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
import CupService from "../services/CupService.js";
import { formatDateToLocaleDateString } from "@/utils/format";

defineOptions({ name: "ContinueComp" });
const props = defineProps(["competitions", "cups", "loading", "publishing"]);
defineEmits(["publish"]);
const store = useMainStore();
const router = useRouter();

const tab = ref(null);
const headers = ref([
  { text: "date", value: "start_date", groupable: false },
  { text: "name", value: "name", groupable: false },
  { text: "cup.normal", value: "cup_name" },
  {
    text: "multiplier",
    value: "cup_points_multiplier",
    groupable: false,
  },
  { text: "choose", value: "choose", sortable: false, groupable: false },
]);
const headers_cup = ref([
  { text: "name", value: "name" },
  { text: "year", value: "year" },
  { text: "publicity", value: "isPublic" },
  { text: "choose", value: "choose", sortable: false },
]);
const error = ref("");
const competition_input = ref(null);
const search_comp = ref("");
const search_cup = ref("");

function getYear(date) {
  return new Date(date).getFullYear();
}

function getColor(multiplier) {
  if (multiplier > 1) return "red";
  if (multiplier === 1) return "green";
  else return "grey";
}

function pickCompetition(competition) {
  // Pick competition for the app to use
  //NOTE Store competition to vuex, redundant?
  store.competition = competition;
  // Set competition._id to localstorage for database queries
  localStorage.setItem(
    "competition",
    JSON.stringify({
      _id: competition._id,
      start_date: competition.start_date,
      end_date: competition.end_date,
    }),
  );
  // redirect to /overview
  router.push({ path: "/overview" });
}

function pickCup(cup) {
  // Pick cup for the app to use
  // Set cup._id to localstorage for database queries
  localStorage.setItem("cup", cup._id);
  // redirect to /cup-overview
  router.push({ path: "/cup-overview" });
}

async function publishCup(cup) {
  cup.isPublic = !cup.isPublic;
  try {
    props.publishing = true;
    const newValues = {
      $set: { isPublic: cup.isPublic },
    };
    await CupService.updateValues(cup._id, newValues);
  } catch (err) {
    console.error(err.message);
  }
  props.publishing = false;
}

onMounted(() => {});
</script>

<style></style>
