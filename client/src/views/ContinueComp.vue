<template>
  <!-- /continue -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container>
    <Header />
    <!-- if there are errors, show this div -->
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
      <v-tab href="#competitions">Kaikki kilpailut</v-tab>
      <v-tab href="#create">Luo Cup</v-tab>
      <v-tab href="#cups">Cupit</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" style="background: rgba(0,0,0,0.6);">
      <v-tab-item
        :value="'competitions'"
        v-bind:class="{
          'container-transparent': !$store.getters.getTheme,
          'container-transparent-dark': $store.getters.getTheme,
        }"
      >
        <v-row>
          <v-col>
            <h1>Kilpailut</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div v-if="competitions.length" class="scroll_table">
              <v-card :dark="$store.getters.getTheme">
                <v-card-title>
                  <p class="flow-text">Kilpailut</p>
                  <v-spacer></v-spacer>
                  <v-text-field
                    :dark="$store.getters.getTheme"
                    v-model="search_comp"
                    append-icon="mdi-magnify"
                    label="Hae kilpailua"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-card-title>
                <v-data-table
                  id="normal-table"
                  :headers="headers"
                  :items="competitions"
                  :search="search_comp"
                >
                  <template v-slot:[`item.start_date`]="{ item }">
                    <v-chip color="primary darken-2">{{
                      item.start_date.format("DD.MM.YYYY")
                    }}</v-chip>
                  </template>
                                    <template v-slot:[`item.cup_name`]="{ item }">
                    <v-chip>{{
                      item.cup_name
                    }} ({{item.start_date.format("YYYY")}})</v-chip>
                  </template>
                  <template v-slot:[`item.cup_points_multiplier`]="{ item }">
                    <v-chip
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
                          ><v-icon color="black"
                            >mdi-arrow-right-bold-box-outline</v-icon
                          ></v-btn
                        >
                      </template>
                      <span>Siirry kilpailuun</span>
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
                      Ei kilpailuja!
                    </h2>
                    <router-link to="/register-comp">
                      <v-btn tile color="blue lighten-1"
                        ><i class="material-icons left">add_circle_outline</i
                        >Luo kilpailu!</v-btn
                      >
                    </router-link>
                  </v-col>
                  <v-col v-else>
                    <h2
                      v-bind:class="{
                        'white--text': $store.getters.getTheme,
                      }"
                    >
                      Ei kilpailuja!
                    </h2>
                    <h2
                      v-bind:class="{
                        'white--text': $store.getters.getTheme,
                      }"
                    >
                      Luo Cup ensin
                    </h2>
                    <v-btn tile color="blue lighten-1" @click="tab = 'create'"
                      ><i class="material-icons left">add_circle_outline</i>Luo
                      Cup!</v-btn
                    >
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
                  Ladataan kilpailuja...
                </h2>
                <ProgressBarQuery />
              </v-col>
            </div>
            <v-col v-if="competitions.length" style="margin-top:20px;">
              <router-link to="/register-comp">
                <v-btn tile color="blue lighten-1"
                  ><i class="material-icons left">add_circle_outline</i>Luo uusi
                  kilpailu!</v-btn
                >
              </router-link>
            </v-col>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item
        :value="'create'"
        v-bind:class="{
          'container-transparent': !$store.getters.getTheme,
          'container-transparent-dark': $store.getters.getTheme,
        }"
      >
        <v-row>
          <v-col>
            <h1>Luo Cup</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="8" offset-md="2" class="input-fields">
            <v-text-field
              :dark="$store.getters.getTheme"
              label="Cupin nimi"
              v-model="name"
              :maxlength="40"
              :loading="loading"
              :counter="40"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col md="6" offset-md="3" class="input-fields">
            <v-menu
              ref="menu"
              :close-on-content-click="false"
              v-model="menu"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  :dark="$store.getters.getTheme"
                  v-model="year"
                  label="Vuosi"
                  prepend-icon="event"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="picker"
                v-model="year"
                @input="saveYear"
                min="2000-01-01"
                reactive
                no-title
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn tile color="primary" @click="saveCup" :loading="loading"
              ><i class="material-icons left">check</i>Luo Cup</v-btn
            >
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item
        :value="'cups'"
        v-bind:class="{
          'container-transparent': !$store.getters.getTheme,
          'container-transparent-dark': $store.getters.getTheme,
        }"
      >
        <v-row>
          <v-col>
            <h1>Cupit</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div v-if="cups.length" class="scroll_table">
              <v-card :dark="$store.getters.getTheme">
                <v-card-title>
                  <p class="flow-text">Cupit</p>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search_cup"
                    append-icon="mdi-magnify"
                    label="Hae cuppia"
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
                  <template v-slot:[`item.name`]="{ item }">
                    <v-chip color="primary darken-3">{{ item.name }}</v-chip>
                  </template>
                  <template v-slot:[`item.year`]="{ item }">
                    <v-chip color="grey" :outlined="$store.getters.getTheme">{{
                      item.year
                    }}</v-chip>
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
                          @click="publishCup(item)"
                          :disabled="publishing"
                          >{{ item.isPublic ? "Julkinen" : "Salainen" }}</v-chip
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
              <v-col v-if="!loading">
                <h2
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Ei Cuppeja!
                </h2>
                <v-btn tile color="blue lighten-1" @click="tab = 'create'"
                  ><i class="material-icons left">add_circle_outline</i>Luo
                  Cup!</v-btn
                >
              </v-col>
              <v-col v-else-if="error" class="error"
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
  </v-container>
</template>

<script>
import Header from "../components/layout/Header";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import CompetitionService from "../CompetitionService";
import CupService from "../CupService";
import M from "materialize-css";

export default {
  name: "ContinueComp",
  data() {
    return {
      tab: null,
      competitions: [],
      headers: [
        { text: "Kilpailun Päivämäärä", value: "start_date" },
        { text: "Nimi", value: "name" },
        { text: "Cup", value: "cup_name" },
        { text: "Pistekerroin", value: "cup_points_multiplier" },
        { text: "Valitse", value: "choose", sortable: false },
      ],
      headers_cup: [
        { text: "Nimi", value: "name" },
        { text: "Vuosi", value: "year" },
        { text: "Julkisuus", value: "isPublic" },
        { text: "Valitse", value: "choose", sortable: false },
      ],
      error: "",
      competition_input: null,
      loading: false,
      publishing: false,
      cups: [],
      name: null,
      year: null,
      menu: false,
      errors: [],
      search_comp: "",
      search_cup: "",
    };
  },
  watch: {
    menu(val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = "YEAR"));
    },
  },
  components: {
    ProgressBarQuery,
    Header,
  },
  async created() {
    this.loading = true;
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user["id"];
    // Get competitions
    const query = { user_id: user_id };
    await CompetitionService.getCompetitions(query)
      .then((response) => {
        this.competitions = response;
        // Convert dates to moment objects
        this.competitions.forEach((competition) => {
          competition.start_date = this.$moment(competition.start_date);
          competition.end_date = this.$moment(competition.end_date);
        });
        // Sort them based on start_date so the oldest competitions are the last
        this.competitions.sort(function compare(a, b) {
          return b.start_date.isAfter(a.start_date);
        });
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 408) {
            this.loading = false;
            return console.log(err);
          } else {
            this.loading = false;
            return console.log(err);
          }
        } else {
          return console.log(err);
        }
      });

    // Get Cups
    await CupService.getCups({
      user_id: user_id,
    })
      .then((response) => {
        this.cups = response;
        this.cups.sort((a, b) => {
          return this.$moment(b.year).isAfter(this.$moment(a.year));
        });
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 400) {
            console.log(err);
            return this.showError("Bad request!");
          }
          if (err.response.status === 408) {
            return this.showError(
              "Yhteyttä tietokantaan ei saatu... Yritä uudelleen päivittämällä sivu (Connection timed out)"
            );
          } else {
            return console.log(err);
          }
        } else {
          return console.log(err);
        }
      });
    this.loading = false;
  },
  mounted() {
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab;
    }
    M.AutoInit();
    this.checkLogin();
    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
  },
  methods: {
    getColor(multiplier) {
      if (multiplier > 1) return "red";
      if (multiplier === 1) return "green";
      else return "grey";
    },
    async publishCup(cup) {
      cup.isPublic = !cup.isPublic;
      try {
        //TODO update only this one variable (competition.normal_points) to database, not the whole competition
        this.publishing = true;
        const newvalues = {
          $set: { isPublic: cup.isPublic },
        };
        await CupService.updateValues(cup.id, newvalues);
      } catch (err) {
        console.error(err.message);
      }
      this.publishing = false;
    },
    // Add error to error array and direct user to it
    showError: function(error) {
      this.errors.push(error);
      M.toast({ html: error });
      location.href = "#";
      location.href = "#app";
    },
    //Check if user is logged in has admin status, update values to vuex (Header.vue updates based on these values)
    checkLogin: function() {
      // If login token present --> user is logged in
      if (localStorage.getItem("jwt") != null) {
        this.$store.state.logged_in = true;
        let user = JSON.parse(localStorage.getItem("user"));
        // Set preferences to vuex
        this.$store.state.isDark = user.preferences.isDark;
        this.$store.state.lang = user.preferences.lang;
        // Check if user is admin
        //TODO safer way to check this than use localstorage?
        user.is_admin == true
          ? (this.$store.state.is_admin = true)
          : (this.$store.state.is_admin = false);
      } else {
        //Not logger in, so not admin either
        this.$store.state.logged_in = false;
        this.$store.state.is_admin = false;
      }
    },
    pickCompetition: function(competition) {
      // Pick competition for the app to use
      //NOTE Store competition to vuex, redundant?
      this.$store.state.competition = competition;
      // Set competition._id to localstorage for database queries
      localStorage.setItem(
        "competition",
        JSON.stringify({
          id: competition._id,
          start_date: competition.start_date,
          end_date: competition.end_date,
        })
      );
      // redirect to /overview
      this.$router.push({ path: "/overview" });
    },
    pickCup: function(cup) {
      // Pick cup for the app to use
      // Set cup.id to localstorage for database queries
      localStorage.setItem("cup", cup.id);
      // redirect to /cup-overview
      this.$router.push({ path: "/cup-overview" });
    },
    //TODO dropdown to select current year as highlighted when opened
    saveYear(year) {
      year = year.split("-")[0];
      this.year = year;
      this.$refs.picker.activePicker = "YEAR";
      this.menu = false;
    },
    async saveCup() {
      this.errors = [];
      this.loading = true;

      if (!this.name) {
        this.showError("Syötä Cupille nimi!");
      }
      if (!this.year) {
        this.showError("Valitse Cupille vuosi!");
      }

      if (!this.errors.length) {
        const user = JSON.parse(localStorage.getItem("user"));
        const user_id = user["id"];
        const cup = { user_id: user_id, name: this.name, year: this.year };
        try {
          //Submit Cup to database (check 'client\src\CupService.js' and 'server\routes\api\cups.js' to see how this works)
          await CupService.insertCup(cup);
          M.toast({ html: "Cup lisätty tietokantaan!" });
          this.cups = await CupService.getCups({
            user_id: user_id,
          });
          this.loading = false;
          this.year = null;
          this.name = null;
          this.tab = "cups";
        } catch (err) {
          this.errors.push(err.message);
        }
      }
      this.loading = false;
    },
  },
};
</script>

<style></style>
