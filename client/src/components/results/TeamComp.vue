<template>
  <div>
    <v-row v-if="team_results.length">
      <v-col style="padding-top: 50px" md="3" offset-md="8">
        <v-btn
          large
          outlined
          color="red lighten-2"
          :dark="$store.getters.getTheme"
          :loading="loading"
          @click="
            $emit('dialog', {
              pdf: '#team-table',
              pdfDialog: true,
            })
          "
        >
          <v-icon color="red">mdi-file-pdf-box</v-icon> Lataa pdf
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        md="10"
        offset-md="1"
        style="padding-bottom: 20px"
        v-if="team_results.length"
      >
        <v-card :dark="$store.getters.getTheme">
          <v-card-title>
            <p
              class="flow-text"
              v-bind:class="{
                'white--text': $store.getters.getTheme,
              }"
            >
              Tiimikilpailu
            </p>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search_team"
              append-icon="mdi-magnify"
              label="Hae kilpailijaa"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="team_results"
            :search="search_team"
          >
            <template v-slot:[`item.placement`]="{ item }">
              <v-chip
                :outlined="$store.getters.getTheme"
                :color="getColor(item.placement)"
                >{{ item.placement }}.</v-chip
              >
            </template>
            <template v-slot:[`item.points`]="{ item }">
              <v-chip>{{ item.points.toLocaleString() }} p</v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col v-else>
        <v-col v-if="!loading"> </v-col>
        <p
          v-if="!loading"
          class="flow-text"
          v-bind:class="{
            'white--text': $store.getters.getTheme,
          }"
        >
          Ei tuloksia, vielä...
        </p>
        <v-col v-else>
          <h2 class="white--text">Päivitetään tuloksia tietokannasta...</h2>
          <ProgressBarQuery />
        </v-col>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { getColorPoints, getColor } from "@/shared";

export default {
  name: "TeamComp",
  components: {},
  props: ["team_results", "search_team", "loading", "headers"],
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
