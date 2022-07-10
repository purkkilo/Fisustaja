<template>
  <v-row>
    <v-dialog v-model="dialog" width="500">
      <v-card :dark="$store.getters.getTheme">
        <v-card-title> Pdf Asetukset </v-card-title>
        <v-card-text>
          <v-checkbox
            label="Pfd Vaakatasossa"
            v-model="isLandscape"
            :disabled="!competitions.length"
          ></v-checkbox>
          <v-checkbox
            v-model="showInfoInPdf"
            label="Näytä pdf:ssä kuinka monta parasta kilpailua otettu huomioon pisteissä"
            :disabled="!competitions.length"
            color="indigo darken-3"
          ></v-checkbox>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="yellow" text @click="dialog = false"> Peruuta </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="
              dialog = false;
              $emit('save', {
                selectedCompetitions: selectedCompetitions,
                isLandscape: isLandscape,
                showInfoInPdf: showInfoInPdf,
              });
            "
          >
            Lataa
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-col>
      <v-row v-if="results.length" style="margin-top: 50px; padding-left: 50px">
        <v-col class="d-flex" md="4">
          <v-select
            :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
            :dark="$store.getters.getTheme"
            :items="headerOptions"
            label="Kilpailun otsikko"
            outlined
            v-model="headerSelection"
            @input="$emit('change', headerSelection)"
          ></v-select>
        </v-col>
        <v-col class="d-flex" md="4">
          <v-select
            :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
            :dark="$store.getters.getTheme"
            :items="selectNumbers"
            label="Cup sijoittumispisteisiin vaikuttavien kilpailujen määrä"
            outlined
            v-model="selectedCompetitions"
            @input="$emit('calculate', selectedCompetitions)"
          ></v-select>
        </v-col>
        <v-col md="4">
          <v-btn
            large
            outlined
            :dark="$store.getters.getTheme"
            @click="dialog = true"
            :loading="loading"
          >
            <v-icon color="red">mdi-file-pdf-box</v-icon> Lataa pdf
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-if="results.length && notFinishedCount > 0">
        <v-col>
          <p
            class="flow-text"
            v-bind:class="{
              'white--text': $store.getters.getTheme,
            }"
          >
            *Punaisella merkityt kilpailut ovat vielä kesken! ({{
              notFinishedCount
            }}
            kpl)
          </p>
        </v-col>
      </v-row>
      <v-row v-if="isResults">
        <v-col>
          <v-card :dark="$store.getters.getTheme">
            <v-card-title>
              <p class="flow-text">Cupin kokonaispisteet</p>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Hae kilpailijaa"
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
                v-for="(h, index) in headers"
                v-slot:[`header.${h.value}`]="{ header }"
              >
                <span
                  v-if="header.highlight"
                  :key="index"
                  class="strokeme"
                  v-bind:class="{
                    'red-text': header.isFinished,
                    'green-text': !header.isFinished,
                  }"
                >
                  {{ header.text }}
                </span>
                <span v-else :key="h.value">{{ header.text }}</span>
              </template>
              <template v-slot:[`item.final_placement`]="{ item }">
                <v-chip
                  :outlined="$store.getters.getTheme"
                  :color="getColor(item.final_placement)"
                  >{{ item.final_placement }}.</v-chip
                >
              </template>
              <template
                v-for="(c, index) in competitions.length"
                v-slot:[`item.cup_results[${c}].points`]="{ item }"
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
                      `${getColor(item.cup_results[c].placement)}--text`,
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
                <span class="indigo--text font-weight-bold"
                  >{{ item.final_cup_points }}p</span
                >
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col>
          <h2
            v-bind:class="{
              'white--text': $store.getters.getTheme,
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
              'white--text': $store.getters.getTheme,
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
            large
            tile
            :loading="loading"
            :disabled="!isResults"
            color="blue darken-4"
            @click="$emit('refresh', cup)"
            class="white--text"
          >
            <v-icon>mdi-update</v-icon>Päivitä cupin tulokset
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col>
          <h2
            v-bind:class="{
              'white--text': $store.getters.getTheme,
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
import shared from "../shared";
export default {
  name: "CupPoints",
  props: [
    "competitions",
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
      headerOptions: ["Paikkakunta", "Kilpailun nimi"],
      headerSelection: "Paikkakunta",
      selectedCompetitions: this.competitions.length,
      search: "",
      showInfoInPdf: true,
      isLandscape: false,
      dialog: false,
    };
  },
  methods: {
    getColor(placement) {
      return shared.getColor(placement);
    },
  },
};
</script>
<style scoped></style>
