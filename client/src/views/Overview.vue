<template>
  <!-- /overview -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div>
    <Header style="margin-bottom:60px" />
    <v-navigation-drawer permanent>
      <v-card
        class="mx-auto"
        max-width="400"
        tile
        :dark="$store.getters.getTheme"
      >
        <v-list dense>
          <p>Navigointi</p>
          <v-list-item-group v-model="selectedItem" color="primary">
            <v-divider></v-divider>
            <div v-for="(item, i) in items" :key="i">
              <v-list-item
                @click="changePage(item.path)"
                :disabled="$router.currentRoute.path === item.path"
              >
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </div>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-navigation-drawer>
    <v-container>
      <div id="errordiv" v-if="errors.length">
        <ul class="collection with-header" style="border:1px solid red;">
          <li class="collection-header" style="background: rgba(0,0,0,0);">
            <v-alert type="error">
              Korjaa seuraavat virheet:
            </v-alert>
          </li>
          <li
            class="collection-item"
            id="error"
            v-for="(error, index) in errors"
            v-bind:key="index"
          >
            <p class="flow-text">{{ index + 1 }}. {{ error }}</p>
          </li>
        </ul>
      </div>
      <div
        v-if="!loading"
        v-bind:class="{
          'container-transparent': !$store.getters.getTheme,
          'container-transparent-dark': $store.getters.getTheme,
        }"
      >
        <v-row class="valign-wrapper">
          <v-col md="6" offset-md="3">
            <h1>Yleisnäkymä</h1>
          </v-col>
          <v-col md="3">
            <div class="text-center">
              <v-dialog v-model="dialog">
                <template v-slot:activator="{ on, attrs }">
                  <p
                    v-bind:class="{
                      'black-text': !$store.getters.getTheme,
                      'white-text': $store.getters.getTheme,
                    }"
                  >
                    Kello/Kilpailuaika
                  </p>
                  <v-btn
                    text
                    outlined
                    color="red darken-4"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-timer</v-icon>
                  </v-btn>
                </template>

                <v-card :dark="$store.getters.getTheme">
                  <v-card-title class="headline"> </v-card-title>
                  <Timedate />

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" outlined @click="dialog = false">
                      Sulje
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-col>
        </v-row>

        <v-row
          class="section"
          v-bind:class="{
            inputarea: !$store.getters.getTheme,
            'inputarea-dark': $store.getters.getTheme,
          }"
        >
          <v-col md="8" offset-md="2">
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
                  <v-list-item-subtitle class="blue-text">
                    <b>{{ formatted_start_date }} - {{ formatted_end_date }}</b>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-clock-time-four</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Kilpailuaika</v-list-item-title>
                  <v-list-item-subtitle class="blue-text">
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
                      'green-text': competition.state === 'Kaikki maalissa',
                      'blue-text': competition.state !== 'Kaikki maalissa',
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
                      'green-text': competition.signees.length,
                      'red-text': !competition.signees.length,
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
                      'green-text':
                        !competition.signees.length -
                        $store.getters.getFinishedSignees.length,
                      'red-text': competition.signees.length,
                    }"
                  >
                    <b>{{ hasNotReturnedPercentage }}%</b>
                    ({{
                      competition.signees.length -
                        $store.getters.getFinishedSignees.length
                    }}
                    / {{ competition.signees.length }})
                  </v-list-item-subtitle>

                  <v-list-item-subtitle class="green-text" v-else
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
                    class="green-text"
                    v-if="competition.signees.length"
                  >
                    <b>{{ hasGottenFishPercentage }}%</b> ({{
                      $store.getters.getPointSignees.length
                    }}
                    / {{ competition.signees.length }})
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="red-text" v-else
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
                    class="green-text"
                    v-if="competition.signees.length"
                  >
                    <b>{{ competition.total_weights / 1000 }} kg</b>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="red-text" v-else
                    ><b>Ei vielä ilmoittautuneita!</b></v-list-item-subtitle
                  >
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <h2>Valmistellaan kilpailua...</h2>
        <ProgressBarQuery />
      </div>
    </v-container>
  </div>
</template>
<script>
"use strict";
import CompetitionService from "../CompetitionService";
import Timedate from "../components/layout/Timedate";
import Header from "../components/layout/Header";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import M from "materialize-css";

export default {
  name: "Overview",
  components: {
    Timedate,
    ProgressBarQuery,
    Header,
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
    //Check if user is logged in has admin status, update header
    this.checkLogin();

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
    changePage: function(route) {
      if (this.$router.currentRoute.path !== route) {
        this.$router.push(route);
        this.drawer = !this.drawer;
      } else {
        M.toast({ html: "Olet jo tällä sivulla!" });
      }
    },
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
          this.formatted_start_date = `${start_date.date()}.${start_date.month() +
            1}.${start_date.year()}`;
          this.formatted_end_date = `${end_date.date()}.${end_date.month() +
            1}.${end_date.year()}`;

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
    //Check if user is logged in has admin status, update values to vuex (Header.vue updates based on these values)
    checkLogin: function() {
      // If login token present --> user is logged in
      const user = JSON.parse(localStorage.getItem("user"));
      const jwt = localStorage.getItem("jwt");
      if (user != null && jwt != null) {
        this.$store.state.logged_in = true;
        // Check if user is admin
        //TODO safer way to check this than use localstorage?
        user.is_admin == true
          ? (this.$store.state.is_admin = true)
          : (this.$store.state.is_admin = false);
      } else {
        if (user) {
          localStorage.removeItem("user");
        }
        if (jwt) {
          localStorage.removeItem("jwt");
        }
        //Not logger in, so not admin either
        this.$store.state.logged_in = false;
        this.$store.state.is_admin = false;
        M.toast({ html: "Tapahtui virhe... Kirjaudu sisään uudestaan" });
      }
    },
  },
};
</script>
