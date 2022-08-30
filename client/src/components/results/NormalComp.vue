<template>
  <div>
    <v-row>
      <v-col
        md="10"
        offset-md="1"
        style="padding-top: 50px; padding-bottom: 20px"
      >
        <v-row>
          <v-col md="4" offset-md="4">
            <v-select
              dark
              :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
              label="Valitse näytettävät tulokset"
              outlined
              :items="normal_options"
              @input="$emit('switch')"
              v-model="selected_normal"
            />
          </v-col>
          <v-col
            v-if="
              normal_points.length ||
              (signees.length && selected_normal === 'Ilmoittautuneet')
            "
            md="3"
            offset-md="1"
          >
            <v-btn
              large
              outlined
              color="red lighten-2"
              :dark="$store.getters.getTheme"
              :loading="loading"
              @click="
                $emit('dialog', {
                  pdf: '#normal-table',
                  pdfDialog: true,
                })
              "
            >
              <v-icon color="red">mdi-file-pdf-box</v-icon>
              Lataa pdf
            </v-btn>
          </v-col>
        </v-row>
        <v-row
          class="row"
          v-if="
            normal_points.length ||
            (signees.length && selected_normal === 'Ilmoittautuneet')
          "
        >
          <v-col md="12">
            <v-card :dark="$store.getters.getTheme">
              <v-card-title>
                <p class="flow-text">
                  Normaalikilpailu ({{ selected_normal }})
                </p>
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
                :headers="headers"
                :items="results"
                :search="search"
              >
                <template v-slot:[`item.placement`]="{ item }">
                  <v-chip
                    :outlined="$store.getters.getTheme"
                    :color="getColor(item.placement)"
                    >{{ item.placement }}.</v-chip
                  >
                </template>
                <template
                  v-if="selected_normal === 'Ilmoittautuneet'"
                  v-slot:[`item.boat_number`]="{ item }"
                >
                  <v-chip>{{ item.boat_number }}</v-chip>
                </template>
                <template v-slot:[`item.total_points`]="{ item }">
                  <v-chip>{{ item.total_points.toLocaleString() }} p</v-chip>
                </template>
                <template v-slot:[`item.cup_points_total`]="{ item }">
                  <v-tooltip bottom color="primary">
                    <template v-slot:activator="{ on, attrs }">
                      <v-chip
                        v-bind="attrs"
                        v-on="on"
                        :color="getColorPoints(item.cup_points_total)"
                        >{{ item.cup_points_total }} p</v-chip
                      >
                    </template>
                    <span>
                      <b
                        >Sijoittumispisteet + Osallistumispisteet = Cup
                        pisteet</b
                      >
                      <br />
                      {{ item.cup_placement_points }} +
                      {{ item.cup_participation_points }} =
                      {{ item.cup_points_total }}
                    </span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col v-if="!loading">
            <p
              class="flow-text"
              v-bind:class="{
                'white--text': $store.getters.getTheme,
              }"
            >
              Ei tuloksia, vielä...
            </p>
          </v-col>
          <v-col v-else>
            <h2 class="white--text">Päivitetään tuloksia tietokannasta...</h2>
            <ProgressBarQuery />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { getColorPoints, getColor } from "@/shared";

export default {
  name: "NormalComp",
  components: {},
  props: [
    "loading",
    "headers",
    "search",
    "results",
    "normal_options",
    "selected_normal",
    "normal_points",
  ],
  data() {
    return {};
  },
  created() {
    this.getColorPoints = getColorPoints;
    this.getColor = getColor;
  },
  methods: {},
};
</script>
<style scoped></style>
