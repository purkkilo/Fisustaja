<template>
  <v-row>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title> Pdf {{ $t("settings") }}</v-card-title>
        <v-card-text>
          <v-checkbox
            :label="'PDF ' + $t('pdf-landscape')"
            v-model="isLandscape"
            :disabled="!competitions.length"
          ></v-checkbox>
          <v-checkbox
            v-model="showInfoInPdf"
            :label="$t('cup.show-important-amount')"
            :disabled="!competitions.length"
            color="indigo"
          ></v-checkbox>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="yellow" @click="dialog = false" variant="text">
            {{ $t("cancel") }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="
              dialog = false;
              $emit('save', {
                selectedCompetitions: selectedCompetitions,
                isLandscape: isLandscape,
                showInfoInPdf: showInfoInPdf,
              });
            "
            variant="text"
          >
            {{ $t("download") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-col>
      <v-row v-if="results.length" style="margin-top: 50px; padding-left: 50px">
        <v-col class="d-flex" md="4">
          <v-select
            :items="headerOptions"
            :label="$t('comp.header')"
            v-model="headerSelection"
            @update:model-value="$emit('change', headerSelection)"
            variant="outlined"
          >
            <template v-slot:item="{ item, props }">
              <v-list-item
                v-bind="props"
                :title="$t(item.raw ?? item.value ?? item)"
              />
            </template>
            <template v-slot:selection="{ item }">
              <span>{{ $t(item.raw ?? item.value ?? item) }}</span>
            </template></v-select
          >
        </v-col>
        <v-col class="d-flex" md="4">
          <v-select
            :items="selectNumbers"
            :label="$t('cup.header')"
            v-model="selectedCompetitions"
            @update:model-value="$emit('calculate', selectedCompetitions)"
            variant="outlined"
          ></v-select>
        </v-col>
        <v-col md="4">
          <v-btn
            color="red-lighten-2"
            @click="dialog = true"
            :loading="loading"
            size="large"
            variant="outlined"
          >
            <v-icon color="red">mdi-file-pdf-box</v-icon>
            {{ $t("download") }} pdf
          </v-btn>
        </v-col>
      </v-row>
      <v-row
        class="justify-center align-center"
        v-if="
          results.length &&
          allCompetitions.filter((c) => !c.isFinished).length > 0
        "
      >
        <v-col cols="4">
          <v-checkbox
            v-model="showUnfinishedCompetitions"
            @update:model-value="$emit('sort', showUnfinishedCompetitions)"
            :label="$t('comp.show-not-finished')"
            :disabled="!competitions.length"
            color="green"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row v-if="isResults">
        <v-col>
          <v-card>
            <v-card-title class="d-flex flex-wrap align-center">
              <p class="text-body-large">{{ $t("cup.normal") }} {{ $t("points") }}</p>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-inner-icon="mdi-magnify"
                :label="$t('search-boat')"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              id="normal-table"
              :headers="headers"
              :items="results"
              :search="search"
              :loading="loading"
            >
              <template
                v-for="h in headers"
                :key="h.key"
                v-slot:[`header.${h.key}`]="{ column: header }"
              >
                <v-row class="justify-center align-center">
                  <v-col>
                    <span
                      v-if="header.highlight"
                      class="strokeme"
                      :class="{
                        'text-red': !header.isFinished,
                        'text-green': header.isFinished,
                      }"
                    >
                      {{ header.title }}
                    </span>
                    <span v-else>{{ $t(header.title) }}</span>
                  </v-col>
                </v-row>
              </template>
              <template v-slot:[`item.final_placement`]="{ item }">
                <v-chip
                  :color="getColor(item.final_placement)"
                  :variant="store.isDark ? 'outlined' : 'flat'"
                  >{{ item.final_placement }}.</v-chip
                >
              </template>
              <template
                v-for="comp in competitions"
                :key="comp.key_name"
                v-slot:[resultSlot(comp.key_name)]="{ item }"
              >
                <span
                  v-if="item.cup_results[comp.key_name]"
                  :class="[
                    'strokeme',
                    item.cup_results[comp.key_name].points ===
                    comp.cup_participation_points
                      ? ''
                      : 'font-weight-bold text-' +
                        getColor(item.cup_results[comp.key_name].placement),
                  ]"
                  >{{ item.cup_results[comp.key_name].points }}p ({{
                    item.cup_results[comp.key_name].placement
                  }}.)</span
                >
                <span v-else> - </span>
              </template>
              <template v-slot:[`item.final_cup_points`]="{ item }">
                <v-chip color="primary" variant="flat"
                  >{{ item.final_cup_points }}p</v-chip
                >
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col>
          <h2
            :class="{
              'text-white': store.isDark,
            }"
          >
            {{ $t("no-results") }}
          </h2>
        </v-col>
      </v-row>
      <v-row v-if="competitions.length && cup">
        <v-col v-if="loading">
          <p
            class="text-body-large"
            :class="{
              'text-white': store.isDark,
            }"
          >
            {{ $t("updating-results") }}...
          </p>
        </v-col>
      </v-row>
      <v-row v-if="competitions.length && cup" style="margin-bottom: 20px">
        <v-col>
          <v-btn
            id="updatebtn"
            rounded="0"
            :loading="loading"
            :disabled="!isResults"
            color="blue-darken-4"
            @click="$emit('refresh', cup)"
            class="text-white"
            size="large"
          >
            <v-icon>mdi-update</v-icon>{{ $t("button.update") }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col>
          <h2
            :class="{
              'text-white': store.isDark,
            }"
          >
            {{ $t("comp.not-found") }}
          </h2>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script setup>
import { useMainStore } from "@/store";
import { onMounted, ref } from "vue";
import { getColor } from "@/utils/colors";

const store = useMainStore();
defineOptions({ name: "CupPoints" });
const props = defineProps({
  competitions: { type: Array, default: () => [] },
  allCompetitions: { type: Array, default: () => [] },
  results: { type: Array, default: () => [] },
  cup: { type: Object, default: null },
  headers: { type: Array, default: () => [] },
  isResults: { type: Boolean, default: false },
  notFinishedCount: { type: Number, default: 0 },
  loading: { type: Boolean, default: false },
  selectNumbers: { type: Array, default: () => [] },
});
defineEmits(["calculate", "change", "refresh", "save", "sort"]);

const headerOptions = ref(["locality", "name"]);
const headerSelection = ref("locality");
const selectedCompetitions = ref(props.competitions.length);
const search = ref("");
const showInfoInPdf = ref(false);
const showUnfinishedCompetitions = ref(false);
const isLandscape = ref(false);
const dialog = ref(false);

// Vue 3 can't parse "[" "]" inside a dynamic slot name in the template

function resultSlot(c) {
  return `item.cup_results[${c}].points`;
}

onMounted(() => {
  if (props.cup?.meaningful_competitions > 0)
    selectedCompetitions.value = props.cup.meaningful_competitions;
  else selectedCompetitions.value = props.competitions.length;
});
</script>
<style scoped></style>
