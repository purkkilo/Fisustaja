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
                <v-list-item v-bind="props" :title="$t(item)" />
              </template>
            <template v-slot:selection="{ item }">
              <span>{{ $t(item) }}</span>
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
              <p class="flow-text">{{ $t("cup.normal") }} {{ $t("points") }}</p>
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
              :headers="$tableHeaders(headers)"
              :items="results"
              :search="search"
              :loading="loading"
            >
              <template
                v-for="(h, index) in headers"
                v-slot:[`header.${h.value}`]="{ column: header }"
              >
                <v-row class="justify-center align-center" :key="index">
                  <v-col>
                    <span
                      v-if="header.highlight"
                      class="strokeme"
                      v-bind:class="{
                        'text-red': !header.isFinished,
                        'text-green': header.isFinished,
                      }"
                    >
                      {{ header.text }}
                    </span>
                    <span v-else :key="h.value">{{ $t(header.text) }}</span>
                  </v-col>
                </v-row>
              </template>
              <template v-slot:[`item.final_placement`]="{ item }">
                <v-chip
                  :color="getColor(item.final_placement)"
                  :variant="$store.getTheme ? 'outlined' : 'flat'"
                  >{{ item.final_placement }}.</v-chip
                >
              </template>
              <template
                v-for="(c, index) in competitions.length"
                v-slot:[resultSlot(c)]="{ item }"
              >
                <div v-if="item.cup_results[c]" v-bind:key="c">
                  <span
                    class="strokeme"
                    v-if="
                      item.cup_results[c].points ===
                      competitions[index].cup_participation_points
                    "
                    >{{ item.cup_results[c].points }}p ({{
                      item.cup_results[c].placement
                    }}.)</span
                  >
                  <span
                    class="strokeme"
                    v-else
                    :class="[
                      'font-weight-bold',
                      getColor(item.cup_results[c].placement) + '--text',
                      'strokeme',
                    ]"
                    >{{ item.cup_results[c].points }}p ({{
                      item.cup_results[c].placement
                    }}.)</span
                  >
                </div>
                <span v-else v-bind:key="index"> - </span>
              </template>
              <template v-slot:[`item.final_cup_points`]="{ item }">
                <v-chip color="primary" variant="flat">{{ item.final_cup_points }}p</v-chip>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col>
          <h2
            v-bind:class="{
              'text-white': $store.getTheme,
            }"
          >
            Kilpailuissa ei vielä tuloksia!
          </h2>
        </v-col>
      </v-row>
      <v-row v-if="competitions.length && cup">
        <v-col v-if="loading">
          <p
            class="flow-text"
            v-bind:class="{
              'text-white': $store.getTheme,
            }"
          >
            Päivitetään tuloksia...
          </p>
        </v-col>
      </v-row>
      <v-row v-if="competitions.length && cup" style="margin-bottom: 20px">
        <v-col>
          <v-btn
            id="updatebtn"
            tile
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
            v-bind:class="{
              'text-white': $store.getTheme,
            }"
          >
            Ei kilpailuja rekisteröitynä!
          </h2>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import { getColor } from "@/shared";
export default {
  name: "CupPoints",
  emits: ["calculate", "change", "refresh", "save", "sort"],
  props: [
    "competitions",
    "allCompetitions",
    "results",
    "cup",
    "headers",
    "isResults",
    "notFinishedCount",
    "loading",
    "selectNumbers",
  ],
  data() {
    return {
      headerOptions: ["locality", "name"],
      headerSelection: "locality",
      selectedCompetitions: this.competitions.length,
      search: "",
      showInfoInPdf: false,
      showUnfinishedCompetitions: false,
      isLandscape: false,
      dialog: false,
    };
  },
  mounted() {
    if (this.cup.meaningful_competitions > 0)
      this.selectedCompetitions = this.cup.meaningful_competitions;
    else this.selectedCompetitions = this.competitions.length;
  },
  methods: {
    // Vue 3 can't parse "[" "]" inside a dynamic slot name in the template
    resultSlot(c) {
      return `item.cup_results[${c}].points`;
    },
    getColor: getColor,
  },
};
</script>
<style scoped></style>
