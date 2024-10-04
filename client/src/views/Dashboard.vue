<template>
  <!-- /dashboard-->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container
    v-bind:class="{
      mobile: $vuetify.breakpoint.width < 800,
      browser: $vuetify.breakpoint.width >= 800,
      wide: $vuetify.breakpoint.width >= 1200,
    }"
  >
    <!-- if there are errors, show this div -->
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
      style="background: transparent; padding: 20px"
      elevation="10"
      outlined
      :dark="$store.getters.getTheme"
    >
      <v-row>
        <v-col>
          <v-row>
            <v-col>
              <h1>Dashboard</h1>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <!-- if user is found on localstorage (this.user is not null/false) -->
              <v-card style="background: transparent" outlined v-if="user" dark>
                <v-card-title
                  ><v-icon x-large>mdi-account-circle</v-icon>
                  &nbsp;Käyttäjätiedot</v-card-title
                >
                <v-list two-line style="background: transparent" outlined>
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon> mdi-account-box </v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{ user.name }}</v-list-item-title>

                      <v-list-item-subtitle>Nimi</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon> mdi-email </v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{ user.email }}</v-list-item-title>

                      <v-list-item-subtitle>Sähköposti</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon> mdi-calendar </v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{ created }}</v-list-item-title>

                      <v-list-item-subtitle>Luotu</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col>
              <!-- if user is found on localstorage (this.user is not null/false) -->
              <v-card style="background: transparent" outlined v-if="user" dark>
                <v-card-title
                  ><v-icon x-large>mdi-gauge</v-icon>
                  &nbsp;Toiminnot</v-card-title
                >
                <v-list style="background: transparent" outlined>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Luo uusi kilpailu</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <router-link to="/register-comp">
                        <v-btn
                          icon
                          outlined
                          :loading="loading || publishing"
                          :disabled="loading || publishing"
                          ><v-icon>mdi-plus</v-icon></v-btn
                        >
                      </router-link>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Luo uusi cup</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-dialog
                        v-model="createCupDialog"
                        width="700"
                        persistent
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            icon
                            outlined
                            v-bind="attrs"
                            v-on="on"
                            :loading="loading || publishing"
                            :disabled="loading || publishing"
                          >
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </template>

                        <v-card :dark="$store.getters.getTheme">
                          <v-card-title> Luo Cup </v-card-title>

                          <v-row align="center" justify="center">
                            <v-col cols="8" class="input-fields">
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
                          <v-row align="center" justify="center">
                            <v-col cols="6" class="input-fields">
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
                          <v-row align="center" justify="center">
                            <v-col cols="6" class="input-fields">
                              <v-checkbox
                                v-model="isThereCompetitionLimit"
                                label="Aseta merkitsevien kilpailujen määrä?"
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                          <v-row
                            align="center"
                            justify="center"
                            v-if="isThereCompetitionLimit"
                          >
                            <v-col cols="6" class="input-fields">
                              <v-text-field
                                v-model="meaningful_competitions"
                                :dark="$store.getters.getTheme"
                                label="Merkitsevien kilpailujen määrä"
                                maxlength="3"
                                type="number"
                                @paste.prevent
                                counter="3"
                                min="1"
                                max="100"
                                @keypress="isNumber($event, true)"
                                :rules="number_rules"
                                :loading="loading"
                              />
                            </v-col>
                          </v-row>
                          <v-row align="center" justify="center">
                            <v-col>
                              <v-btn
                                tile
                                color="primary"
                                @click="saveCup"
                                :loading="loading"
                                ><v-icon>mdi-check</v-icon>Luo Cup</v-btn
                              >
                            </v-col>
                          </v-row>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="primary"
                              text
                              @click="createCupDialog = false"
                            >
                              Peruuta
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card>
              <v-row>
                <v-col>
                  <!-- if user is found on localstorage (this.user is not null/false) -->
                  <v-card
                    style="background: transparent; margin-top: 6px"
                    outlined
                    v-if="user"
                    dark
                  >
                    <v-list style="background: transparent" outlined>
                      <v-list-item>
                        <v-spacer></v-spacer>
                        <v-list-item-content>
                          <v-list-item-title
                            ><h2>
                              {{ tweenedCompetitions.toFixed(0) }}
                            </h2></v-list-item-title
                          >

                          <v-list-item-subtitle
                            >Kilpailuja</v-list-item-subtitle
                          >
                        </v-list-item-content>
                        <v-spacer></v-spacer>
                        <v-list-item-content>
                          <v-list-item-title
                            ><h2>
                              {{ tweenedCups.toFixed(0) }}
                            </h2></v-list-item-title
                          >

                          <v-list-item-subtitle>Cuppeja</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-spacer></v-spacer>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <comp-cup-table
      :competitions="competitions"
      :cups="cups"
      :loading="loading"
      :publishing="publishing"
      @publish="
        (cup) => {
          publishCup(cup);
        }
      "
    ></comp-cup-table>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
"use strict";
import CompCupTable from "../components/CompCupTable.vue";
import CompetitionService from "../services/CompetitionService";
import CupService from "../services/CupService";
import gsap from "gsap";

export default {
  name: "Home",
  components: {
    CompCupTable,
  },
  data() {
    return {
      user: null,
      created: null,
      createCupDialog: false,
      menu: false,
      loading: false,
      publishing: false,
      name: null,
      year: null,
      meaningful_competitions: 1,
      isThereCompetitionLimit: false,
      competitions: [],
      cups: [],
      errors: [],
      number_rules: [
        (value) => !!value || "Kenttä ei voi jäädä tyhjäksi!",
        (value) => !isNaN(value || "") || "Ei ole numero!",
      ],
      snackbar: false,
      text: "",
      timeout: 5000,
      cupsAmount: 0,
      competitionsAmount: 0,
      tweenedCompetitions: 0,
      tweenedCups: 0,
      animationLength: 1.5,
    };
  },
  watch: {
    menu(val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = "YEAR"));
    },
    cupsAmount(n) {
      gsap.to(this, {
        duration: this.animationLength,
        tweenedCups: Number(n) || 0,
      });
    },
    competitionsAmount(n) {
      gsap.to(this, {
        duration: this.animationLength,
        tweenedCompetitions: Number(n) || 0,
      });
    },
  },
  async created() {
    this.loading = true;
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user["_id"];
    // Get competitions
    const query = { user_id: user_id };

    await CompetitionService.getCompetitions(query)
      .then((response) => {
        this.competitions = response;
        this.competitionsAmount = this.competitions.length;
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
        this.cupsAmount = this.cups.length;
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
    // Set competition in localstorage and vuex to null
    this.$store.commit("refreshCompetition", null);
    localStorage.removeItem("competition");
    this.$store.commit("refreshCup", null);
    localStorage.removeItem("cup");
    // Get user info form localstorage
    if (localStorage.getItem("user") != null) {
      this.user = JSON.parse(localStorage.getItem("user"));
      let createdAt = this.$moment(this.user.createdAt);
      this.created = `${createdAt.date()}.${
        createdAt.month() + 1
      }.${createdAt.year()}`;
    }
  },
  methods: {
    //filter other characters out for number inputs
    isNumber: function (evt, isDate) {
      var charToCheckCode = 46; // --> .
      var charToCheck = ".";

      if (!isDate) {
        charToCheckCode = 58; // --> :
        charToCheck = ":";
      }

      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== charToCheckCode
      ) {
        evt.preventDefault();
      } else {
        if (charCode == charToCheckCode) {
          if (evt.target.value.indexOf(charToCheck) >= 0) {
            evt.preventDefault();
          } else {
            return true;
          }
        } else {
          return true;
        }
      }
    },
    async publishCup(cup) {
      cup.isPublic = !cup.isPublic;
      try {
        //TODO update only this one variable (competition.normal_points) to database, not the whole competition
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
    // Add error to error array and direct user to it
    showError(error) {
      this.errors.push(error);
      location.href = "#";
      location.href = "#app";
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

      if (this.isThereCompetitionLimit && !this.meaningful_competitions) {
        this.showError("Syötä merkitsevien kilpailujen määrä!");
      }

      if (!this.errors.length) {
        const user = JSON.parse(localStorage.getItem("user"));
        const user_id = user["_id"];
        const cup = {
          user_id: user_id,
          name: this.name,
          year: this.year,
          meaningful_competitions: this.isThereCompetitionLimit
            ? Number(this.meaningful_competitions)
            : -1,
        };
        try {
          //Submit Cup to database (check 'client\src\CupService.js' and 'server\routes\api\cups.js' to see how this works)
          await CupService.insertCup([cup]);
          this.text = "Cup lisätty tietokantaan!";
          this.snackbar = true;
          /*
          this.cups = await CupService.getCups({
            user_id: user_id,
          });
          */
          this.cups.push(cup);
          this.cupsAmount = this.cups.length;
          this.cups.sort((a, b) => {
            return this.$moment(b.year).isAfter(this.$moment(a.year));
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
      this.createCupDialog = false;
      this.isThereCompetitionLimit = false;
      this.meaningful_competitions = 1;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
