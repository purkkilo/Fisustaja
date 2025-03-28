<template>
  <!-- /continue -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div>
    <v-card
      style="background: transparent; padding: 20px"
      elevation="10"
      outlined
      :dark="$store.getters.getTheme"
    >
      <v-tabs
        v-model="tab"
        background-color="blue lighten-2"
        color="blue darken-4"
        grow
        show-arrows
        next-icon="mdi-arrow-right-bold-box-outline"
        prev-icon="mdi-arrow-left-bold-box-outline"
        center-active
      >
        <v-tabs-slider color="blue darken-4"></v-tabs-slider>
        <v-tab href="#competitions">{{ $t("comp.plural") }}</v-tab>
        <v-tab href="#cups">{{ $t("cup.plural") }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" style="background: transparent">
        <v-tab-item :value="'competitions'">
          <v-row>
            <v-col>
              <div v-if="competitions.length">
                <v-card :dark="$store.getters.getTheme">
                  <v-card-title>
                    <p class="flow-text">{{ $t("comp.plural") }}</p>
                    <v-spacer></v-spacer>
                    <v-text-field
                      :dark="$store.getters.getTheme"
                      v-model="search_comp"
                      append-icon="mdi-magnify"
                      :label="$t('search') + ' ' + $t('comp.for')"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-card-title>
                  <v-data-table
                    id="normal-table"
                    :headers="headers"
                    :items="competitions"
                    :search="search_comp"
                    show-group-by
                  >
                    <template
                      v-for="(h, index) in headers"
                      v-slot:[`header.${h.value}`]="{ header }"
                    >
                      <span :key="index"> {{ $t(header.text) }}</span>
                    </template>

                    <template v-slot:[`item.start_date`]="{ item }">
                      <v-chip color="primary darken-2">{{
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
                        :outlined="$store.getters.getTheme"
                        >{{ item.cup_points_multiplier }}x</v-chip
                      >
                    </template>
                    <template v-slot:[`item.choose`]="{ item }">
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            color="primary"
                            v-bind="attrs"
                            v-on="on"
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
                          'white--text': $store.getters.getTheme,
                        }"
                      >
                        {{ $t("comp.not-found") }}
                      </h2>
                    </v-col>
                    <v-col v-else>
                      <h2
                        v-bind:class="{
                          'white--text': $store.getters.getTheme,
                        }"
                      >
                        {{ $t("comp.not-found") }}
                      </h2>
                      <h2
                        v-bind:class="{
                          'white--text': $store.getters.getTheme,
                        }"
                      >
                        {{ $t("cup.not-found") }}
                      </h2>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col v-else-if="error">
                  <h2 class="error">{{ error }}</h2>
                </v-col>
                <v-col v-else>
                  <h2
                    v-bind:class="{
                      'white--text': $store.getters.getTheme,
                    }"
                  >
                    {{ $t("loading") }} {{ $t("comp.count") }}...
                  </h2>
                  <ProgressBarQuery />
                </v-col>
              </div>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item :value="'cups'">
          <v-row>
            <v-col>
              <div v-if="cups.length">
                <v-card :dark="$store.getters.getTheme">
                  <v-card-title>
                    <p class="flow-text">{{ $t("cup.plural") }}</p>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search_cup"
                      append-icon="mdi-magnify"
                      :label="$t('search') + ' ' + $t('cup.for')"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-card-title>
                  <v-data-table
                    id="normal-table"
                    :headers="headers_cup"
                    :items="cups"
                    :search="search_cup"
                    :loading="publishing"
                  >
                    <template
                      v-for="(h, index) in headers_cup"
                      v-slot:[`header.${h.value}`]="{ header }"
                    >
                      <span :key="index"> {{ $t(header.text) }}</span>
                    </template>
                    <template v-slot:[`item.name`]="{ item }">
                      <v-chip color="primary darken-3">{{ item.name }}</v-chip>
                    </template>
                    <template v-slot:[`item.year`]="{ item }">
                      <v-chip
                        color="grey"
                        :outlined="$store.getters.getTheme"
                        >{{ item.year }}</v-chip
                      >
                    </template>
                    <template v-slot:[`item.isPublic`]="{ item }">
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-chip
                            v-bind="attrs"
                            v-on="on"
                            :outlined="$store.getters.getTheme"
                            :color="
                              item.isPublic ? 'green darken-2' : 'red darken-2'
                            "
                            @click="$emit('publish', item)"
                            :disabled="publishing"
                            >{{
                              item.isPublic ? "Julkinen" : "Salainen"
                            }}</v-chip
                          >
                        </template>
                        <span>Muuta tila painamalla</span>
                      </v-tooltip>
                    </template>
                    <template v-slot:[`item.choose`]="{ item }">
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            color="primary"
                            v-bind="attrs"
                            v-on="on"
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
                <v-col v-if="error" class="error"
                  ><h2>{{ error }}</h2></v-col
                >
                <v-col v-else>
                  <h2
                    v-bind:class="{
                      'white--text': $store.getters.getTheme,
                    }"
                  >
                    Ladataan Cuppeja...
                  </h2>
                  <ProgressBarQuery />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import CupService from "../services/CupService.js";
import { formatDateToLocaleDateString } from "../shared";

export default {
  name: "ContinueComp",
  props: ["competitions", "cups", "loading", "publishing"],
  data() {
    return {
      tab: null,
      headers: [
        { text: "date", value: "start_date", groupable: false },
        { text: "name", value: "name", groupable: false },
        { text: "cup.normal", value: "cup_name" },
        {
          text: "multiplier",
          value: "cup_points_multiplier",
          groupable: false,
        },
        { text: "choose", value: "choose", sortable: false, groupable: false },
      ],
      headers_cup: [
        { text: "name", value: "name" },
        { text: "year", value: "year" },
        { text: "publicity", value: "isPublic" },
        { text: "choose", value: "choose", sortable: false },
      ],
      error: "",
      competition_input: null,
      search_comp: "",
      search_cup: "",
    };
  },
  watch: {},
  components: {
    ProgressBarQuery,
  },

  mounted() {},
  methods: {
    formatDateToLocaleDateString: formatDateToLocaleDateString,
    getYear(date) {
      return new Date(date).getFullYear();
    },
    getColor(multiplier) {
      if (multiplier > 1) return "red";
      if (multiplier === 1) return "green";
      else return "grey";
    },
    pickCompetition(competition) {
      // Pick competition for the app to use
      //NOTE Store competition to vuex, redundant?
      this.$store.state.competition = competition;
      // Set competition._id to localstorage for database queries
      localStorage.setItem(
        "competition",
        JSON.stringify({
          _id: competition._id,
          start_date: competition.start_date,
          end_date: competition.end_date,
        })
      );
      // redirect to /overview
      this.$router.push({ path: "/overview" });
    },
    pickCup(cup) {
      // Pick cup for the app to use
      // Set cup._id to localstorage for database queries
      localStorage.setItem("cup", cup._id);
      // redirect to /cup-overview
      this.$router.push({ path: "/cup-overview" });
    },
    async publishCup(cup) {
      cup.isPublic = !cup.isPublic;
      try {
        this.publishing = true;
        const newValues = {
          $set: { isPublic: cup.isPublic },
        };
        await CupService.updateValues(cup._id, newValues);
      } catch (err) {
        console.error(err.message);
      }
      this.publishing = false;
    },
  },
};
</script>

<style></style>
