<template>
  <!-- /admin -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container>
    <Header />
    <Timedate style="margin-top:0" />

    <!-- Tabs -->
    <v-tabs
      v-model="tab"
      background-color="blue lighten-2"
      color="basil"
      grow
      show-arrows
    >
      <v-tabs-slider color="blue darken-4"></v-tabs-slider>
      <v-tab href="#overview">Yleisnäkymä</v-tab>
      <v-tab href="#users">Käyttäjät</v-tab>
      <v-tab href="#competitions">Kilpailut</v-tab>
      <v-tab href="#feedback">Saatu palaute</v-tab>
      <v-tab href="#generate">Kilpailun generointi</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" style="background: rgba(0,0,0,0.4);">
      <v-tab-item :value="'overview'">
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <v-btn large rounded color="yellow" @click="$router.go(-3)"
                  ><i class="material-icons left">history</i>Palaa
                  takaisin</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <h1>Yleistietoja</h1>
              </v-col>
            </v-row>
            <!-- if this.loading === false, meaning app isn't loading feedback from database, then show this div -->
            <v-row v-if="!loading">
              <v-col class="inputarea black--text" md="6" offset-md="3">
                <p v-if="feedback.length" class="flow-text">
                  <i class="material-icons">feedback</i> Palautetta annettu:
                  {{ feedback.length }} kpl
                </p>
                <p v-else class="flow-text">
                  <i class="material-icons">feedback</i> Ei palautetta!
                </p>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col md="6" offset-md="3">
                <h3>Ladataan palautteita...</h3>
                <ProgressBarQuery />
              </v-col>
            </v-row>
            <!-- if this.loading_users === false, meaning app isn't loading users, then show this div -->
            <v-row v-if="!loading_users">
              <v-col class="inputarea black--text" md="6" offset-md="3">
                <p v-if="users.length" class="flow-text">
                  <i class="material-icons">account_circle</i> Käyttäjiä
                  yhteensä: {{ users.length }} kpl
                </p>
                <p v-else class="flow-text">
                  <i class="material-icons">account_circle</i> Ei käyttäjiä!
                </p>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col md="6" offset-md="3">
                <h3>Ladataan käyttäjiä...</h3>
                <ProgressBarQuery />
              </v-col>
            </v-row>
            <!-- if this.loading_competitions === false, meaning app isn't loading competitions, then show this div -->
            <v-row v-if="!loading_competitions">
              <v-col class="inputarea black--text" md="6" offset-md="3">
                <p v-if="competitions.length" class="flow-text">
                  <i class="material-icons">directions_boat</i> Kilpailuja
                  yhteensä: {{ competitions.length }} kpl
                </p>
                <p v-else class="flow-text">
                  <i class="material-icons">directions_boat</i> Ei kilpailuja!
                </p>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col md="6" offset-md="3">
                <h3>Ladataan kilpailuja...</h3>
                <ProgressBarQuery />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item :value="'users'">
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <v-btn large rounded color="yellow" @click="$router.go(-3)"
                  ><i class="material-icons left">history</i>Palaa
                  takaisin</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <h1>Käyttäjät</h1>
              </v-col>
            </v-row>
            <v-row v-if="users.length">
              <v-col>
                <ul id="fish_weights">
                  <!-- Vue loop -->
                  <!-- similar to js foreach loop -->
                  <li v-for="(user, index) in users" :key="index">
                    <!-- For every user in this.users array -->
                    <v-row>
                      <v-col class="card-panel blue lighten-5 z-depth-1">
                        <p v-if="user.is_admin" class="flow-text">
                          #{{ index + 1 }}. {{ user.name }} (Admin)<i
                            class="material-icons"
                            >admin_panel_settings</i
                          >
                        </p>
                        <p v-else class="flow-text">
                          #{{ index + 1 }}. {{ user.name }} (Käyttäjä)<i
                            class="material-icons"
                            >account_circle</i
                          >
                        </p>

                        <div class="row valign-wrapper">
                          <div class="col s12">
                            <p
                              class="black-text flow-text "
                              style="word-break: break-all;"
                            >
                              Sähköposti: {{ user.email }}
                            </p>
                            <p
                              class="black-text flow-text "
                              style="word-break: break-all;"
                            >
                              Tili luotu: {{ user.createdAt }}
                            </p>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </li>
                </ul>
              </v-col>
            </v-row>
            <!-- users.length === 0 === false-->
            <v-row v-else-if="loading_users">
              <v-col md="10" offset-md="1">
                <v-sheet
                  :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
                  class="px-3 pt-3 pb-3"
                >
                  <v-skeleton-loader
                    class="mx-auto"
                    type="card"
                  ></v-skeleton-loader>
                </v-sheet>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col>
                <h2>Ei käyttäjiä!</h2>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item :value="'competitions'">
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <v-btn large rounded color="yellow" @click="$router.go(-3)"
                  ><i class="material-icons left">history</i>Palaa
                  takaisin</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <h1>Kilpailut</h1>
              </v-col>
            </v-row>
            <!-- if there are competitions in database-->
            <v-row v-if="competitions.length">
              <v-col md="10" offset-md="1">
                <v-card :dark="updateSwitch">
                  <v-card-title>
                    <p class="flow-text">Kilpailut</p>
                    <v-spacer></v-spacer>
                    <v-switch
                      v-model="updateSwitch"
                      class="black--text"
                      color="indigo darken-3"
                      append-icon="mdi-weather-night"
                      prepend-icon="mdi-weather-sunny"
                    ></v-switch>
                    <v-spacer></v-spacer>
                    <v-text-field
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
                    :loading="loading_competitions"
                  >
                    <template v-slot:[`item.start_date`]="{ item }">
                      <v-chip>{{
                        item.start_date.format("DD.MM.YYYY")
                      }}</v-chip>
                    </template>
                    <template v-slot:[`item.choose`]="{ item }">
                      <v-btn
                        color="primary"
                        @click="pickCompetition(item)"
                        :loading="loading_competitions"
                        ><i class="material-icons left">check</i>Valitse</v-btn
                      >
                    </template>
                    <template v-slot:[`item.delete`]="{ item }">
                      <v-btn
                        color="red"
                        @click="deleteCompetition(item._id, false)"
                        :loading="loading_competitions"
                        ><i class="material-icons left">delete_forever</i
                        >Poista</v-btn
                      >
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
            <!-- this.competitions.length === 0 === false -->
            <v-row v-else>
              <v-col v-if="loading_competitions" md="10" offset-md="1">
                <v-sheet
                  :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
                  class="px-3 pt-3 pb-3"
                >
                  <v-skeleton-loader
                    class="mx-auto"
                    type="card"
                  ></v-skeleton-loader>
                </v-sheet>
              </v-col>
              <v-col v-else>
                <h2>Ei Kilpailuja!</h2>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item :value="'feedback'">
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <v-btn large rounded color="yellow" @click="$router.go(-3)"
                  ><i class="material-icons left">history</i>Palaa
                  takaisin</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <h1>Saatu Palaute</h1>
              </v-col>
            </v-row>

            <v-row v-if="feedback.length">
              <v-col>
                <ul id="fish_weights">
                  <!-- For every feedback in this.feedback array -->
                  <li v-for="(feedback, index) in feedback" :key="index">
                    <v-card
                      class="mx-auto"
                      :dark="updateSwitch"
                      min-width="200px"
                      max-width="850px"
                      style="margin-bottom:30px;margin-top:30px"
                    >
                      <v-card-title>
                        <v-col md="10" offset-md="1">
                          <span class="title font-weight-light"
                            >#{{ index + 1 }} {{ feedback.type }}</span
                          >
                        </v-col>
                      </v-card-title>
                      <v-card-text
                        class="headline font-weight-bold"
                        style="word-break: break-all;"
                      >
                        {{ feedback.message }}
                      </v-card-text>
                      <v-card-actions>
                        <v-col>
                          <v-btn
                            large
                            rounded
                            color="yellow"
                            :loading="loading"
                            @click="deleteFeedback(feedback._id)"
                            class="black--text"
                            ><i class="material-icons left">done_outline</i
                            >Ratkaise</v-btn
                          >
                        </v-col>
                      </v-card-actions>
                    </v-card>
                  </li>
                </ul>
              </v-col>
            </v-row>
            <!-- this.feedback.length === 0 === false -->
            <v-row v-else>
              <v-col v-if="loading" md="10" offset-md="1">
                <v-sheet
                  :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
                  class="px-3 pt-3 pb-3"
                >
                  <v-skeleton-loader
                    class="mx-auto"
                    type="card"
                  ></v-skeleton-loader>
                </v-sheet>
              </v-col>
              <v-col v-else>
                <h2>Palautetta ei vielä annettu!</h2>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item :value="'generate'">
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <v-btn large rounded color="yellow" @click="$router.go(-3)"
                  ><i class="material-icons left">history</i>Palaa
                  takaisin</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <h1>Kilpailun generointi</h1>
              </v-col>
            </v-row>
            <v-row v-if="cup.name">
              <v-col md="3">
                <p class="center-align flow-text black--text">Valitse Cup</p>
              </v-col>
              <v-col class="d-flex" md="6">
                <v-select
                  v-model="cup"
                  :items="cups"
                  item-text="select"
                  item-value="_id"
                  :hint="`${cup.name} (${cup.year})`"
                  :disabled="!cup.name"
                  outlined
                  return-object
                  single-line
                ></v-select>
              </v-col>
              <v-col md="3">
                <router-link to="/continue">
                  <v-btn tile color="green lighten-1"
                    ><i class="material-icons left">add_circle_outline</i>Luo
                    uusi cup!</v-btn
                  >
                </router-link>
              </v-col>
            </v-row>
            <v-row v-if="cup.name">
              <v-col md="6" offset-md="3" class="input-fields">
                <v-text-field
                  label="Kilpailijoiden määrä"
                  v-model="signees_amount"
                  append-outer-icon="add"
                  maxlength="6"
                  @click:append-outer="
                    signees_amount >= 0
                      ? signees_amount++
                      : (signees_amount = 1)
                  "
                  prepend-icon="remove"
                  @click:prepend="
                    signees_amount >= 1
                      ? signees_amount--
                      : (signees_amount = 0)
                  "
                  @paste.prevent
                  :counter="6"
                  @keypress="isNumber($event, true)"
                  :rules="number_rules"
                  :disabled="!cup.name"
                />
              </v-col>
            </v-row>
            <v-row v-if="cup.name">
              <v-col md="6" offset-md="3" class="input-fields">
                <v-col>
                  <span class="flow-text black-text">Onko Tiimikilpailua?</span>
                </v-col>
                <v-col offset-md="4">
                  <v-radio-group
                    v-model="team_competition"
                    row
                    :disabled="!cup.name"
                  >
                    <v-radio label="Kyllä" value="Kyllä"></v-radio>
                    <v-radio label="Ei" value="Ei"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col md="6" offset-md="3">
                <h3>Ladataan Cuppeja...</h3>
                <ProgressBarQuery />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn large rounded color="green" @click="generateCompetition"
                  ><i class="material-icons left">history</i>Generoi
                  kilpailu</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
"use strict";
import M from "materialize-css";
import FeedbackService from "../FeedbackService";
import CompetitionService from "../CompetitionService";
import UserService from "../UserService";
import CupService from "../CupService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import Timedate from "../components/layout/Timedate";
import Header from "../components/layout/Header";
import moment from "moment";

export default {
  data() {
    return {
      tab: null,
      feedback: [],
      users: [],
      competitions: [],
      loading: false,
      loading_users: false,
      loading_competitions: false,
      theme: { isDark: true },
      cup: {},
      signees_amount: 30,
      team_competition: "Ei",
      number_rules: [
        (value) => !!value || "Kenttä ei voi jäädä tyhjäksi!",
        (value) => !isNaN(value || "") || "Ei ole numero!",
        (value) => (value || "") >= 0 || "Numeron pitää olla positiivinen!",
      ],
      headers: [
        { text: "Kilpailun Päivämäärä", value: "start_date" },
        { text: "Nimi", value: "name" },
        { text: "Käyttäjän id", value: "user_id" },
        { text: "Cup", value: "cup_name" },
        { text: "Pistekerroin", value: "cup_points_multiplier" },
        { text: "", value: "choose", sortable: false },
        { text: "", value: "delete", sortable: false },
      ],
      search_comp: "",
      updateSwitch: true,
    };
  },
  components: {
    Timedate,
    ProgressBarQuery,
    Header,
  },
  // Called everytime page is opened
  async mounted() {
    //Init materialize elements
    M.AutoInit();
    //FIXME clocks doesn't appear on refreshing the tab
    //Check if user is logged in has admin status, update header
    this.checkLogin();
    // Focus on top of the page
    location.href = "#";
    location.href = "#app";
    // Show loading progressbars
    this.loading = this.loading_users = this.loading_competitions = true;
    try {
      // Load data from database
      this.feedback = await FeedbackService.getFeedback();
      this.loading = false;
      this.users = await UserService.getUsers();
      this.loading_users = false;
      this.competitions = await CompetitionService.getAllCompetitions();
      this.competitions.forEach((competition) => {
        competition.start_date = moment(competition.start_date);
        competition.end_date = moment(competition.end_date);
      });
      // Sort them based on start_date so the oldest competitions are the last
      this.competitions.sort(function compare(a, b) {
        return moment(b.start_date).isAfter(moment(a.start_date));
      });
      this.getCups();
      this.loading_competitions = false;
    } catch (err) {
      console.error(err.message);
    }
  },
  methods: {
    generateCompetition: function() {
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user["id"];
      M.toast({ html: "TODO: Generoi kilpailu!" });
      console.log("TODO: Generoi kilpailu!");
      const competition = {
        user_id: user_id,
        cup_id: this.cup._id,
        team_competition: this.team_competition === "Ei" ? false : true,
        //Kaikki muu generointi, katso alta
      };
      console.log("Kilpailu olio:", competition);
    },
    /* 
            Kilpailun generointi:

            Kilpailun luonti:
                - checkBasicInformation: function() | RegisterComp.vue, 719
                - CompetitionService.js | static insertCompetition(competition) 

            Mahdollisesti samalla loopilla:
                - Kilpailijoiden luonti: validateInfo: function() | Signing.vue, 661
                - Kilpailijalle pisteet: async saveToDatabase(reset) | Weighting.vue, 652

            Kilpailu olio tietokannassa, kilpailijat ja painot lisättynä

            {
                "user_id": "5f24045d2ee89c595c075149",
                "cup_id": "5f2404882ee89c595c07514a",
                "name": "Kerimäki-uistelu 2020",
                "cup_name": "Savo-Karjala CUP",
                "cup_placement_points": 30,
                "cup_participation_points": 5,
                "cup_points_multiplier": 1,
                "start_date": "2020-07-11T06:00:00.000Z",
                "end_date": "2020-07-11T13:00:00.000Z",
                "start_time": "09:00",
                "end_time": "16:00",
                "total_weights": 190830,
                "fishes": [
                    {
                        "name": "Ahven",
                        "multiplier": 3,
                        "minsize": "30",
                        "weights": 9400,
                        "color": "#8d2d20"
                    },
                    {
                        "name": "Hauki",
                        "multiplier": 1,
                        "minsize": "50",
                        "weights": 172290,
                        "color": "#53b84b"
                    },
                    {
                        "name": "Kuha",
                        "multiplier": 3,
                        "minsize": "50",
                        "weights": 0,
                        "color": "#3f618f"
                    },
                    {
                        "name": "Lohi",
                        "multiplier": 25,
                        "minsize": "61",
                        "weights": 0,
                        "color": "#8c16e9"
                    },
                    {
                        "name": "Taimen",
                        "multiplier": 25,
                        "minsize": "51",
                        "weights": 9140,
                        "color": "#4aeda0"
                    }
                ],
                "state": "Punnitus",
                "createdAt": "2020-07-10T23:52:33.944Z",
                "signees":
                [
                    {
                        "id": 1,
                        "boat_number": 1,
                        "starting_place": "-",
                        "captain_name": "Veetu Varis",
                        "temp_captain_name": "Tuomas Halko",
                        "locality": "Imatra",
                        "team": "-",
                        "total_points": 16080,
                        "total_weights": 14820,
                        "returned": true,
                        "weights": [
                            {
                                "name": "Ahven",
                                "weights": 630,
                                "points": 1890
                            },
                            {
                                "name": "Hauki",
                                "weights": 14190,
                                "points": 14190
                            },
                            {
                                "name": "Kuha",
                                "weights": 0,
                                "points": 0
                            },
                            {
                                "name": "Lohi",
                                "weights": 0,
                                "points": 0
                            },
                            {
                                "name": "Taimen",
                                "weights": 0,
                                "points": 0
                            }
                        ]
                    },
                ],
                "results": [],
                "teams": [],
                "team_competition": false,
                "biggest_fishes": {},
                "biggest_amounts": {
                    "Taimen": [
                        {
                            "boat_number": 14,
                            "captain_name": "Jarmo Nuopponen",
                            "weight": 5530
                        },
                        {
                            "boat_number": 33,
                            "captain_name": "Joona Partanen",
                            "weight": 1840
                        },
                        {
                            "boat_number": 20,
                            "captain_name": "Jere Kosonen",
                            "weight": 1770
                        }
                    ]}
            }

                //Generate competition data
                    const competition = {
                        cup_id: cup_id,
                        user_id: user_id,
                        name: this.basic_info.name,
                        cup_name: this.basic_info.cup_name,
                        cup_placement_points: this.basic_info.cup_placement_points,
                        cup_participation_points: this.basic_info.cup_participation_points,
                        cup_points_multiplier: this.basic_info.cup_points_multiplier,
                        team_competition: this.basic_info.team_competition,
                        start_date: this.basic_info.start_date,
                        end_date: this.basic_info.end_date,
                        duration: this.basic_info.duration,
                        start_time: this.basic_info.start_time,
                        end_time: this.basic_info.end_time,
                        fishes: this.completed_fish_specs,
                        state: "Rekisteröity",
                        total_weights: 0,
                        signees: [],
                        results: [],
                        teams: [],
                        biggest_fishes: {},
                        biggest_amounts: {}
                    };

                //Generate signee data on loop to signees array
                //Generate fish weights and points to every signee to every signee on signees array
                //When signees array complete, Add competition to database: await CompetitionService.insertCompetition(competition);
*/
    async getCups() {
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user["id"];
      this.loading = true;
      // Get Cups
      try {
        this.cups = await CupService.getCups(user_id);
        if (this.cups.length) {
          this.cups.sort(function compare(a, b) {
            return a.name - b.name;
          });
          this.cups.forEach((cup) => {
            cup.select = `${cup.name} (${cup.year})`;
          });
          this.cup = this.cups[this.cups.length - 1];
        }
      } catch (err) {
        this.error = err.message;
      }
      this.loading = false;
    },
    //Check if user is logged in has admin status, update values to vuex (Header.vue updates based on these values)
    checkLogin: function() {
      // If login token present --> user is logged in
      if (localStorage.getItem("jwt") != null) {
        this.$store.state.logged_in = true;
        let user = JSON.parse(localStorage.getItem("user"));
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
    // Delete received feedback
    async deleteFeedback(id) {
      this.loading = true;
      try {
        //Delete feedback from database (check 'client\src\FeedbackService.js' and 'server\routes\api\feedback.js' to see how this works)
        await FeedbackService.deleteFeedback(id);
        M.toast({ html: "Palaute ratkaistu!" });
        // Get updated list from database
        this.feedback = await FeedbackService.getFeedback();
        this.loading = false;
      } catch (err) {
        console.error(err.message);
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
    // Delete competition from database
    async deleteCompetition(id, confirmed) {
      // If user clicked "OK" on confirmation box
      if (confirmed) {
        M.toast({ html: "Poistetaan tietokannasta!" });
        this.loading_competitions = true;
        try {
          //Delete competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
          await CompetitionService.deleteCompetition(id);
          this.competitions = await CompetitionService.getAllCompetitions();
          // Change dates to moment objects, so they are easy to format
          this.competitions.forEach((competition) => {
            competition.start_date = moment(competition.start_date);
            competition.end_date = moment(competition.end_date);
          });
          // Store to vuex
          this.$store.state.competitions = this.competitions;
          this.loading_competitions = false;
        } catch (err) {
          console.error(err.message);
        }
      }
      // Show confirmation box on first function call
      else {
        this.$confirm("Oletko varma?", "Poista kilpailu", "question")
          .then((r) => {
            // if user clicked "OK" on confirmation box
            if (r) {
              this.deleteCompetition(id, r);
            }
          })
          .catch((error) => {
            if (error) {
              console.error(error);
            }
          });
      }
    },
  },
};
</script>
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
