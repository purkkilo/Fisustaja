<template>
  <!-- /overview -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div>
    <v-row>
      <v-col>
        <CompetitionNavigation></CompetitionNavigation>
      </v-col>
      <v-col>
        <Timedate />
      </v-col>
    </v-row>

    <v-container
      v-bind:class="{
        mobile: $vuetify.breakpoint.width < 800,
        browser: $vuetify.breakpoint.width >= 800,
        wide: $vuetify.breakpoint.width >= 1200,
      }"
    >
      <v-card
        :dark="$store.getters.getTheme"
        id="errordiv"
        elevation="20"
        v-if="errors.length"
      >
        <v-alert type="error"> Korjaa seuraavat virheet: </v-alert>
        <v-list>
          <v-list-item v-for="(error, index) in errors" v-bind:key="index">
            <v-list-item-icon>
              <v-icon color="red">mdi-alert-circle</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ error }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <v-card
        v-if="!loading"
        style="background: transparent"
        elevation="10"
        outlined
        :dark="$store.getters.getTheme"
      >
        <v-row align="center">
          <v-col>
            <h1 style="margin: 30px">Yleisnäkymä</h1>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card :dark="$store.getters.getTheme" elevation="20" outlined>
              <v-card-title class="text-center"
                ><p class="display-1">
                  {{ competition.name }}
                </p></v-card-title
              >
              <v-list outlined elevation="10">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-calendar-today</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Päivämäärä</v-list-item-title>
                  <v-list-item-subtitle class="blue--text">
                    <b>{{ formatted_start_date }} - {{ formatted_end_date }}</b>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-clock-time-four</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Kilpailuaika</v-list-item-title>
                  <v-list-item-subtitle class="blue--text">
                    <b
                      >{{ competition.start_time }} -
                      {{ competition.end_time }}</b
                    >
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="green darken-4">mdi-state-machine</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Tila</v-list-item-title>
                  <v-list-item-subtitle
                    v-bind:class="{
                      'green--text': competition.state === 'Kaikki maalissa',
                      'blue--text': competition.state !== 'Kaikki maalissa',
                    }"
                  >
                    <b>{{ competition.state }}</b>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-card-account-details-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Ilmoittautuneita</v-list-item-title>
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
                  <v-list-item-title>Vielä vesillä</v-list-item-title>
                  <v-list-item-subtitle
                    v-if="competition.signees.length"
                    v-bind:class="{
                      'green--text':
                        !competition.signees.length -
                        $store.getters.getFinishedSignees.length,
                      'red--text': competition.signees.length,
                    }"
                  >
                    <b>{{ hasNotReturnedPercentage }}%</b>
                    ({{
                      competition.signees.length -
                      $store.getters.getFinishedSignees.length
                    }}
                    / {{ competition.signees.length }})
                  </v-list-item-subtitle>

                  <v-list-item-subtitle class="green--text" v-else
                    ><b>Ketään ei vielä vesillä!</b></v-list-item-subtitle
                  >
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="blue">mdi-fish</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Saalista saaneita</v-list-item-title>
                  <v-list-item-subtitle
                    class="green--text"
                    v-if="competition.signees.length"
                  >
                    <b>{{ hasGottenFishPercentage }}%</b> ({{
                      $store.getters.getPointSignees.length
                    }}
                    / {{ competition.signees.length }})
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="red--text" v-else
                    ><b>Ei vielä ilmoittautuneita!</b></v-list-item-subtitle
                  >
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="yellow darken-4">mdi-seal</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Kalaa saatu yhteensä</v-list-item-title>
                  <v-list-item-subtitle
                    class="green--text"
                    v-if="competition.signees.length"
                  >
                    <b>{{ competition.total_weights / 1000 }} kg</b>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="red--text" v-else
                    ><b>Ei vielä ilmoittautuneita!</b></v-list-item-subtitle
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
              <h1 class="text-center">Valmistellaan kilpailua...</h1>
              <ProgressBarQuery />
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>
<script>
"use strict";
import CompetitionService from "../CompetitionService";
import Timedate from "../components/layout/Timedate";
import CompetitionNavigation from "../components/layout/CompetitionNavigation.vue";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";

export default {
  name: "Overview",
  components: {
    Timedate,
    ProgressBarQuery,
    CompetitionNavigation,
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
      selectedItem: 0,
      items: [
        {
          text: "Yleisnäkymä",
          icon: "mdi-desktop-mac-dashboard",
          path: "/overview",
        },
        {
          text: "Määritykset",
          icon: "mdi-tune",
          path: "/comp-settings",
        },
        {
          text: "Ilmoittautuminen",
          icon: "mdi-draw",
          path: "/signing",
        },
        {
          text: "Punnitus",
          icon: "mdi-dumbbell",
          path: "/weighting",
        },
        {
          text: "Tulokset",
          icon: "mdi-seal",
          path: "/results",
        },
      ],
    };
  },
  created() {
    // IF competition on localstorage
    if (localStorage.getItem("competition") != null) {
      // update from database
      const competition = JSON.parse(localStorage.getItem("competition"));
      const competition_id = competition["id"];
      this.refreshCompetition(competition_id);
    } else {
      console.log("No competition in localstorage!");
    }
  },
  mounted() {
    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
    // IF competition on localstorage
    if (localStorage.getItem("competition") != null) {
      // update from database
      const competition = JSON.parse(localStorage.getItem("competition"));
      const competition_id = competition["id"];
      this.refreshCompetition(competition_id);
    } else {
      console.log("No competition in localstorage!");
    }
  },
  methods: {
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
          // Returns an array, get first result (there shouldn't be more than one in any case, since id's are unique)
          //TODO make a test for this?
          this.competition = competition;
          // Update to vuex, Assing variables from vuex (see client/store/index.js)
          this.$store.commit("refreshCompetition", this.competition);
          localStorage.setItem("cup", this.competition.cup_id);
          let start_date = this.$moment(this.competition.start_date);
          let end_date = this.$moment(this.competition.end_date);
          this.formatted_start_date = `${start_date.date()}.${
            start_date.month() + 1
          }.${start_date.year()}`;
          this.formatted_end_date = `${end_date.date()}.${
            end_date.month() + 1
          }.${end_date.year()}`;

          this.hasGottenFishPercentage =
            Math.round(
              (this.$store.getters.getPointSignees.length /
                this.competition.signees.length) *
                100 *
                100
            ) / 100;

          this.hasNotReturnedPercentage =
            Math.round(
              ((this.competition.signees.length -
                this.$store.getters.getFinishedSignees.length) /
                competition.signees.length) *
                100 *
                100
            ) / 100;
        } else {
          this.competition = { name: "Kilpailua ei löytynyt tietokannasta..." };
        }
      } catch (err) {
        console.log(err.message);
      }
      this.loading = false;
    },
  },
};
</script>
