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
    <error-list :errors="errors"></error-list>
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
                  ><v-icon x-large>mdi-account-circle</v-icon> &nbsp;{{
                    $t("dashboard.user-details")
                  }}</v-card-title
                >
                <v-list two-line style="background: transparent" outlined>
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon> mdi-account-box </v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{ user.name }}</v-list-item-title>

                      <v-list-item-subtitle>{{
                        $t("name")
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon> mdi-email </v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{ user.email }}</v-list-item-title>

                      <v-list-item-subtitle>{{
                        $t("email")
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon> mdi-calendar </v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{ created }}</v-list-item-title>

                      <v-list-item-subtitle>{{
                        $t("created")
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col>
              <!-- if user is found on localstorage (this.user is not null/false) -->
              <v-card style="background: transparent" outlined v-if="user" dark>
                <v-card-title
                  ><v-icon x-large>mdi-gauge</v-icon> &nbsp;{{
                    $t("dashboard.functions")
                  }}</v-card-title
                >
                <v-list style="background: transparent" outlined>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>{{
                        $t("comp.create")
                      }}</v-list-item-title>
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
                      <v-list-item-title>{{
                        $t("cup.create")
                      }}</v-list-item-title>
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
                          <v-card-title>
                            {{ $t("cup.create") }}
                          </v-card-title>

                          <v-row align="center" justify="center">
                            <v-col cols="8" class="input-fields">
                              <v-text-field
                                :dark="$store.getters.getTheme"
                                :label="$t('cup.normal') + ' ' + $t('name')"
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
                                    :label="$t('year')"
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
                                :label="
                                  $t('dashboard.set') +
                                  ' ' +
                                  $t('dashboard.meaningfull-comps')
                                "
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
                                :label="$t('dashboard.meaningfull-comps')"
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
                                ><v-icon>mdi-check</v-icon>
                                {{ $t("cup.create") }}</v-btn
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

                          <v-list-item-subtitle>{{
                            $t("comp.plural")
                          }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-spacer></v-spacer>
                        <v-list-item-content>
                          <v-list-item-title
                            ><h2>
                              {{ tweenedCups.toFixed(0) }}
                            </h2></v-list-item-title
                          >

                          <v-list-item-subtitle>{{
                            $t("cup.plural")
                          }}</v-list-item-subtitle>
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
    <notification-bar :snackbar="snackbar" :text="text"></notification-bar>
  </v-container>
</template>

<script>
import CompCupTable from "../components/CompCupTable.vue";
import CompetitionService from "../services/CompetitionService";
import CupService from "../services/CupService";
import gsap from "gsap";
import NotificationBar from "../components/NotificationBar.vue";
import ErrorList from "../components/ErrorList.vue";

export default {
  name: "Home",
  components: {
    CompCupTable,
    NotificationBar,
    ErrorList,
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
        // Convert dates
        this.competitions.forEach((competition) => {
          competition.start_date = new Date(competition.start_date);
          competition.end_date = new Date(competition.end_date);
        });
        // Sort them based on start_date so the oldest competitions are the last
        this.competitions.sort((a, b) => a.start_date < b.start_date);
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
          return parseInt(a.year) < parseInt(b.year);
        });
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 400) {
            console.log(err);
            return this.showError("error.bad-request");
          }
          if (err.response.status === 408) {
            return this.showError("error.timeout");
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
      let createdAt = new Date(this.user.createdAt);
      this.created = `${createdAt.getDate()}.${
        createdAt.getMonth() + 1
      }.${createdAt.getFullYear()}`;
    }
  },
  methods: {
    //filter other characters out for number inputs
    isNumber(evt, isDate) {
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
    // Add error to error array and direct user to it
    showError(error) {
      this.errors.push(error);
      this.$nextTick(() => {
        document.getElementById("error-list").scrollIntoView();
      });
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
        this.showError("errors.missing-cup-name");
      }
      if (!this.year) {
        this.showError("errors.missing-cup-year");
      }

      if (this.isThereCompetitionLimit && !this.meaningful_competitions) {
        this.showError("errors.missing-meaningfull-comps");
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
            return parseInt(a.year) < parseInt(b.year);
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
