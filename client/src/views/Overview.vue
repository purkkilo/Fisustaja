<template>
  <!-- /overview -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div style="padding: 0px">
    <Timedate />

    <v-container
      v-bind:class="{
        mobile: $vuetify.breakpoint.width < 800,
        browser: $vuetify.breakpoint.width >= 800,
        wide: $vuetify.breakpoint.width >= 1200,
      }"
    >
      <error-list :errors="errors"></error-list>
      <v-card
        v-if="!loading"
        style="background: transparent"
        elevation="10"
        outlined
        :dark="$store.getters.getTheme"
      >
        <v-row>
          <v-col>
            <v-card :dark="$store.getters.getTheme" elevation="20" outlined>
              <v-card-title
                ><span class="display-2">
                  {{ competition.name }}
                </span></v-card-title
              >
              <v-list outlined elevation="10">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-calendar-today</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ $t("date") }}</v-list-item-title>
                  <v-list-item-subtitle class="blue--text">
                    <b
                      >{{ formatDate(competition.start_date) }} -
                      {{ formatDate(competition.end_date) }}</b
                    >
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider></v-divider>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="green darken-4">mdi-state-machine</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ $t("status") }}</v-list-item-title>
                  <v-list-item-subtitle
                    v-bind:class="{
                      'green--text': competition.state === 'finished',
                      'blue--text': competition.state !== 'finished',
                    }"
                  >
                    <b>{{ $t(competition.state) }}</b>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-card-account-details-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ $t("signees") }}</v-list-item-title>
                  <v-list-item-subtitle
                    v-bind:class="{
                      'green--text': competition.signees.length,
                      'red--text': !competition.signees.length,
                    }"
                  >
                    <b>{{ competition.signees.length }}</b>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="blue darken-4">mdi-water-alert</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{
                    $t("comp-overview.still-on-water")
                  }}</v-list-item-title>
                  <v-list-item-subtitle
                    v-if="competition.signees.length"
                    v-bind:class="{
                      'green--text': !competition.signees.filter(
                        (s) => !s.returned
                      ).length,
                      'red--text': competition.signees.filter(
                        (s) => !s.returned
                      ).length,
                    }"
                  >
                    <b>{{ hasNotReturnedPercentage }}%</b>
                    ({{
                      competition.signees.filter((s) => !s.returned).length
                    }}
                    / {{ competition.signees.length }})
                  </v-list-item-subtitle>

                  <v-list-item-subtitle class="green--text" v-else
                    ><b>{{
                      $t("comp-overview.nobody-on-water")
                    }}</b></v-list-item-subtitle
                  >
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="blue">mdi-fish</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{
                    $t("comp-overview.gotten-fish")
                  }}</v-list-item-title>
                  <v-list-item-subtitle
                    class="green--text"
                    v-if="competition.signees.length"
                  >
                    <b>{{ hasGottenFishPercentage }}%</b> ({{
                      hasGottenFishCount
                    }}
                    / {{ competition.signees.length }})
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="red--text" v-else
                    ><b>{{
                      $t("comp-overview.no-signees")
                    }}</b></v-list-item-subtitle
                  >
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="yellow darken-4">mdi-seal</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{
                    $t("comp-overview.fish-amount-total")
                  }}</v-list-item-title>
                  <v-list-item-subtitle
                    class="green--text"
                    v-if="competition.signees.length"
                  >
                    <b>{{ competition.total_weights / 1000 }} kg</b>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="red--text" v-else
                    ><b>{{
                      $t("comp-overview.no-signees")
                    }}</b></v-list-item-subtitle
                  >
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
      <div v-else>
        <v-row>
          <v-col>
            <v-card
              style="background: transparent; text-align: center"
              elevation="2"
              outlined
              :dark="$store.getters.getTheme"
            >
              <h1 class="text-center">{{ $t("comp.preparing") }}...</h1>
              <ProgressBarQuery />
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>
<script>
import CompetitionService from "../services/CompetitionService";
import ResultService from "../services/ResultService.js";
import Timedate from "../components/layout/Timedate";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import { formatDate } from "../shared";
import ErrorList from "../components/ErrorList.vue";

export default {
  name: "Overview",
  components: {
    Timedate,
    ProgressBarQuery,
    ErrorList,
  },
  data() {
    return {
      competition: null,
      loading: false,
      errors: [],
      formatted_start_date: null,
      formatted_end_date: null,
      dialog: false,
      hasNotReturnedPercentage: 0,
      hasGottenFishPercentage: 0,
      hasGottenFishCount: 0,
    };
  },
  created() {
    // IF competition on localstorage
    if (localStorage.getItem("competition") != null) {
      // update from database
      const competition = JSON.parse(localStorage.getItem("competition"));
      const competition_id = competition["_id"];
      this.refreshCompetition(competition_id);
    } else {
      console.log("No competition in localstorage!");
    }
  },
  methods: {
    formatDate: formatDate,
    // fetch/update competition from database
    async refreshCompetition(competition_id) {
      this.loading = true;
      this.errors = [];
      try {
        //Get competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
        let competition = await CompetitionService.getCompetitions({
          _id: competition_id,
        });
        // IF competition found from database
        if (competition) {
          this.competition = competition;

          // Get results === signees
          await ResultService.getResults({ competition_id: competition._id })
            .then((r) => {
              this.competition.total_weights = 0;
              r.forEach((s) => {
                s.fishes.forEach((f) => {
                  this.competition.total_weights += f.weights;
                });
              });
              this.competition.signees = r;
            })
            .catch((e) => {
              console.log(e);
            });
          // Update to vuex, Assing variables from vuex (see client/store/index.js)
          this.$store.commit("refreshCompetition", this.competition);
          localStorage.setItem("cup", this.competition.cup_id);
          let start_date = new Date(this.competition.start_date);
          let end_date = new Date(this.competition.end_date);
          this.formatted_start_date = `${start_date.getDate()}.${
            start_date.getMonth() + 1
          }.${start_date.getFullYear()}`;
          this.formatted_end_date = `${end_date.getDate()}.${
            end_date.getMonth() + 1
          }.${end_date.getFullYear()}`;

          this.hasNotReturnedPercentage =
            Math.round(
              (this.competition.signees.filter((s) => !s.returned).length /
                this.competition.signees.length) *
                100 *
                100
            ) / 100;

          // Check how many signees have gotten fish
          this.competition.signees.forEach((signee) => {
            if (signee.fishes.length) this.hasGottenFishCount++;
          });

          this.hasGottenFishPercentage =
            Math.round(
              (this.hasGottenFishCount / this.competition.signees.length) *
                100 *
                100
            ) / 100;
        } else {
          this.competition = { name: "Kilpailua ei löytynyt tietokannasta..." };
        }
      } catch (err) {
        console.log(err);
      }
      this.loading = false;
    },
  },
};
</script>
