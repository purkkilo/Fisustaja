<template>
  <!-- /admin -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container
    v-bind:class="{
      mobile: $vuetify.breakpoint.width < 800,
      browser: $vuetify.breakpoint.width >= 800,
      wide: $vuetify.breakpoint.width >= 1200,
    }"
  >
    <!-- Tabs -->
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
      <v-tab href="#overview">{{ $t("general") }}</v-tab>
      <v-tab href="#users">{{ $t("users") }}</v-tab>
      <v-tab href="#competitions">{{ $t("comp.plural") }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" style="background: rgba(0, 0, 0, 0.4)">
      <v-tab-item
        :value="'overview'"
        v-bind:class="{
          inputarea: !$store.getters.getTheme,
          'inputarea-dark': $store.getters.getTheme,
        }"
      >
        <v-row>
          <v-col>
            <v-row>
              <v-col v-if="prevRoute">
                <v-btn
                  v-if="prevRoute.name"
                  large
                  rounded
                  color="yellow"
                  @click="$router.push({ path: prevRoute.path })"
                  ><v-icon>mdi-keyboard-return</v-icon
                  >{{ $t("button.return-back") }}</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <h1>{{ $t("general") }}</h1>
              </v-col>
            </v-row>
            <!-- if this.loading_users === false, meaning app isn't loading users, then show this div -->
            <v-row v-if="!loading_users">
              <v-col md="6" offset-md="3">
                <v-card elevation="20" :dark="$store.getters.getTheme">
                  <p v-if="users.length" class="flow-text">
                    <v-icon>mdi-account-circle</v-icon>
                    {{ $t("users-plural") }} {{ $t("total") }}:
                    {{ users.length }}
                  </p>
                  <p v-else class="flow-text">
                    <v-icon>mdi-account-circle</v-icon> {{ $t("no-users") }}!
                  </p>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col md="6" offset-md="3">
                <h3
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  {{ $t("loading") }} {{ $t("users-plural") }}...
                </h3>
                <ProgressBarQuery />
              </v-col>
            </v-row>
            <!-- if this.loading_competitions === false, meaning app isn't loading competitions, then show this div -->
            <v-row v-if="!loading_competitions">
              <v-col md="6" offset-md="3">
                <v-card elevation="20" :dark="$store.getters.getTheme">
                  <p v-if="all_competitions.length" class="flow-text">
                    <v-icon>mdi-ferry</v-icon> {{ $t("comp.plural") }}
                    {{ $t("total") }}:
                    {{ all_competitions.length }} kpl<br /><v-icon
                      >mdi-arrow-right-bold</v-icon
                    >
                    {{ $t("self-created") }} {{ competitions.length }}/{{
                      all_competitions.length
                    }}
                  </p>
                  <p v-else class="flow-text">
                    <v-icon>mdi-ferry</v-icon> {{ $t("no") }}
                    {{ $t("comp.plural") }}!
                  </p>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col md="6" offset-md="3">
                <h3
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  {{ $t("loading") }} {{ $t("comp.plural") }}...
                </h3>
                <ProgressBarQuery />
              </v-col>
            </v-row>
            <v-row v-if="!loading_cups">
              <v-col md="6" offset-md="3">
                <v-card elevation="20" :dark="$store.getters.getTheme">
                  <p v-if="all_cups.length" class="flow-text">
                    <v-icon color="yellow darken-1">mdi-medal</v-icon
                    >{{ $t("cup.plural") }} {{ $t("total") }}:
                    {{ all_cups.length }} kpl<br /><v-icon
                      >mdi-arrow-right-bold</v-icon
                    >
                    {{ $t("self-created") }} {{ cups.length }}/{{
                      all_cups.length
                    }}
                    kpl
                  </p>
                  <p v-else class="flow-text">
                    <v-icon>mdi-ferry</v-icon> {{ $t("no") }}
                    {{ $t("cup.plural") }}!
                  </p>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col md="6" offset-md="3">
                <h3
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  {{ $t("loading") }} {{ $t("cup.plural") }}...
                </h3>
                <ProgressBarQuery />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item
        :value="'users'"
        v-bind:class="{
          inputarea: !$store.getters.getTheme,
          'inputarea-dark': $store.getters.getTheme,
        }"
      >
        <v-row>
          <v-col>
            <v-row>
              <v-col v-if="prevRoute">
                <v-btn
                  v-if="prevRoute.name"
                  large
                  rounded
                  color="yellow"
                  @click="$router.push({ path: prevRoute.path })"
                  ><v-icon>mdi-keyboard-return</v-icon
                  >{{ $t("button.return-back") }}</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <h1>{{ $t("users") }}</h1>
                <br />
                <p
                  class="flow-text"
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  {{ $t("notification.click-name") }}
                </p>
              </v-col>
            </v-row>
            <v-row v-if="users.length">
              <v-col
                md="6"
                offset-md="3"
                v-bind:class="{
                  'grey darken-4': $store.getters.getTheme,
                }"
              >
                <v-data-iterator
                  :items="users"
                  :search="search"
                  hide-default-footer
                  class="scroll_table"
                >
                  <template v-slot:header>
                    <v-toolbar class="mb-1" :dark="$store.getters.getTheme">
                      <v-text-field
                        v-model="search"
                        clearable
                        flat
                        solo-inverted
                        hide-details
                        prepend-inner-icon="search"
                        :label="$t('search')"
                      ></v-text-field>
                    </v-toolbar>
                  </template>
                  <template v-slot:default="props">
                    <v-col
                      v-for="(user, index) in props.items"
                      :key="index"
                      style="margin-top: 20px"
                    >
                      <!-- For every user in this.users array -->
                      <v-menu
                        v-model="user.menu"
                        bottom
                        right
                        transition="scale-transition"
                        origin="top left"
                        :close-on-click="false"
                      >
                        <template v-slot:activator="{ on }">
                          <v-chip
                            :dark="$store.getters.getTheme"
                            :outlined="$store.getters.getTheme"
                            large
                            v-on="on"
                            :color="user.is_admin ? 'yellow darken-2' : 'green'"
                          >
                            <v-avatar left>
                              <v-icon v-if="user.is_admin"
                                >mdi-shield-crown</v-icon
                              >
                              <v-icon v-else>mdi-account</v-icon>
                            </v-avatar>
                            {{ user.name }}
                          </v-chip>
                        </template>
                        <v-card width="300">
                          <v-list dark>
                            <v-list-item>
                              <v-list-item-avatar>
                                <v-icon v-if="user.is_admin"
                                  >mdi-shield-crown</v-icon
                                >
                                <v-icon v-else>mdi-account</v-icon>
                              </v-list-item-avatar>
                              <v-list-item-content>
                                <v-list-item-title>{{
                                  user.name
                                }}</v-list-item-title>
                                <v-list-item-subtitle>{{
                                  user.email
                                }}</v-list-item-subtitle>
                              </v-list-item-content>
                              <v-list-item-action>
                                <v-btn icon @click="user.menu = false">
                                  <v-icon>mdi-close-circle</v-icon>
                                </v-btn>
                              </v-list-item-action>
                            </v-list-item>
                          </v-list>
                          <v-list>
                            <v-tooltip right>
                              <template v-slot:activator="{ on, attrs }">
                                <v-list-item
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="copyToClipboard(user._id, user)"
                                >
                                  <v-list-item-action>
                                    <v-icon
                                      >mdi-badge-account-horizontal</v-icon
                                    >
                                  </v-list-item-action>
                                  <v-list-item-content>
                                    <v-list-item-title>{{
                                      user._id
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle
                                      >Id</v-list-item-subtitle
                                    >
                                  </v-list-item-content>
                                </v-list-item>
                              </template>
                              <span>{{ $t("users") }}</span>
                            </v-tooltip>
                            <v-tooltip right>
                              <template v-slot:activator="{ on, attrs }">
                                <v-list-item
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="copyToClipboard(user.createdAt, user)"
                                >
                                  <v-list-item-action>
                                    <v-icon>mdi-calendar-check</v-icon>
                                  </v-list-item-action>
                                  <v-list-item-content>
                                    <v-list-item-title>{{
                                      user.createdAt
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle>{{
                                      $t("created")
                                    }}</v-list-item-subtitle>
                                  </v-list-item-content>
                                </v-list-item>
                              </template>
                              <span>Kopioi</span>
                            </v-tooltip>
                            <v-list-item v-if="user.is_admin" @click="() => {}">
                              <v-list-item-action>
                                <v-icon>mdi-briefcase</v-icon>
                              </v-list-item-action>
                              <v-list-item-content>
                                <v-list-item-title>Admin</v-list-item-title>
                                <v-list-item-subtitle>{{
                                  $t("role")
                                }}</v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item v-else @click="() => {}">
                              <v-list-item-action>
                                <v-icon>mdi-briefcase</v-icon>
                              </v-list-item-action>
                              <v-list-item-content>
                                <v-list-item-title>{{
                                  $t("user")
                                }}</v-list-item-title>
                                <v-list-item-subtitle>{{
                                  $t("role")
                                }}</v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item @click="() => {}">
                              <v-list-item-content>
                                <v-btn
                                  color="blue"
                                  @click="
                                    copyToClipboard(JSON.stringify(user), user)
                                  "
                                >
                                  <v-icon>mdi-copy-content</v-icon>
                                  {{ $t("copy") }}
                                </v-btn>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-card>
                      </v-menu>
                      <v-divider style="margin-top: 10px"></v-divider>
                    </v-col>
                  </template>
                </v-data-iterator>
              </v-col>
            </v-row>
            <!-- users.length === 0 === false-->
            <v-row v-else-if="loading_users">
              <v-col md="10" offset-md="1">
                <v-sheet
                  :color="`grey ${
                    $store.getters.getTheme ? 'darken-2' : 'lighten-4'
                  }`"
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
                <h2
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Ei käyttäjiä!
                </h2>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item
        :value="'competitions'"
        v-bind:class="{
          inputarea: !$store.getters.getTheme,
          'inputarea-dark': $store.getters.getTheme,
        }"
      >
        <v-row>
          <v-col>
            <v-row>
              <v-col v-if="prevRoute">
                <v-btn
                  v-if="prevRoute.name"
                  large
                  rounded
                  color="yellow"
                  @click="$router.push({ path: prevRoute.path })"
                  ><v-icon>mdi-keyboard-return</v-icon
                  >{{ $t("button.return-back") }}</v-btn
                >
              </v-col>
            </v-row>

            <!-- if there are competitions in database-->
            <v-row v-if="all_competitions.length">
              <v-col>
                <v-card :dark="$store.getters.getTheme">
                  <v-card-title>
                    <p class="flow-text">{{ $t("comp.plural") }}</p>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search_comp"
                      append-icon="mdi-magnify"
                      :label="$t('search')"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-card-title>
                  <v-data-table
                    id="normal-table"
                    :headers="headers"
                    :items="all_competitions"
                    :search="search_comp"
                    :loading="loading_competitions"
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
                    <template v-slot:[`item.delete`]="{ item }">
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            v-bind="attrs"
                            v-on="on"
                            color="red"
                            @click="deleteCompetition(item._id, false)"
                            :loading="loading_competitions"
                            ><v-icon>mdi-delete-outline</v-icon></v-btn
                          >
                        </template>
                        <span>{{ $t("button.delete-comp") }}</span>
                      </v-tooltip>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
            <!-- this.competitions.length === 0 === false -->
            <v-row v-else>
              <v-col v-if="loading_competitions" md="10" offset-md="1">
                <v-sheet
                  :color="`grey ${
                    $store.getters.getTheme ? 'darken-2' : 'lighten-4'
                  }`"
                  class="px-3 pt-3 pb-3"
                >
                  <v-skeleton-loader
                    class="mx-auto"
                    type="card"
                  ></v-skeleton-loader>
                </v-sheet>
              </v-col>
              <v-col v-else>
                <h2
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  {{ $t("no") }} {{ $t("comp.plural") }}!
                </h2>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
    <notification-bar :snackbar="snackbar" :text="text"></notification-bar>
  </v-container>
</template>

<script>
import CompetitionService from "../services/CompetitionService";
import UserService from "../services/UserService";
import CupService from "../services/CupService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import { formatDateToLocaleDateString } from "../shared";
import NotificationBar from "../components/NotificationBar.vue";

export default {
  data() {
    return {
      tab: null,
      users: [],
      all_competitions: [],
      competitions: [],
      user_id: null,
      loading: false,
      loading_users: false,
      loading_competitions: false,
      loading_cups: false,
      all_cups: [],
      cups: [],
      cup: {},
      headers: [
        { text: "date", value: "start_date" },
        { text: "name", value: "name" },
        { text: "user", value: "username" },
        { text: "cup.normal", value: "cup_name" },
        { text: "multiplier", value: "cup_points_multiplier" },
        { text: "choose", value: "choose", sortable: false },
        { text: "delete", value: "delete", sortable: false },
      ],
      search_comp: "",
      search: "",
      prevRoute: null,
      snackbar: false,
      text: "",
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  components: {
    ProgressBarQuery,
    NotificationBar,
  },
  // Called everytime page is opened
  async mounted() {
    //Check if user is logged in has admin status, update header
    // Show loading progressbars
    this.loading =
      this.loading_users =
      this.loading_competitions =
      this.loading_cups =
        true;
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.user_id = user["_id"];
    }
    try {
      // Load data from database
      // Users first, if token is expired logout user
      await UserService.getUsers()
        .then(async (res) => {
          await this.getCups();
          this.loading = false;
          this.users = res;
          this.users.forEach((user) => {
            user.menu = false;
          });
          this.loading_users = false;
          // No query, get all competitions
          this.all_competitions = await CompetitionService.getCompetitions();
          this.all_competitions.forEach((competition) => {
            let cup = this.all_cups.find((c) => c._id === competition.cup_id);
            competition.username = this.users.find(
              (user) => user._id === competition.user_id
            ).name;
            competition.cup_name = `${cup.name} (${cup.year})`;
            competition.start_date = new Date(competition.start_date);
            competition.end_date = new Date(competition.end_date);
          });

          this.competitions = this.all_competitions.filter(
            (competition) => competition.user_id === this.user_id
          );
          // Sort them based on start_date so the oldest competitions are the last
          this.all_competitions.sort(function compare(a, b) {
            return a.start_date < b.start_date;
          });
          this.loading_competitions = false;
        })
        .catch(async (err) => {
          if (err.response.status === 401) {
            this.text = "notification.login-again";
            this.snackbar = true;
            await UserService.logoutUser()
              .then(() => {
                this.$router.push({ path: "/login" });
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            console.log(err.response.data);
          }
        });
    } catch (err) {
      console.error(err.message);
    }
  },
  methods: {
    formatDateToLocaleDateString: formatDateToLocaleDateString,
    getColor(multiplier) {
      if (multiplier > 1) return "red";
      if (multiplier === 1) return "green";
      else return "grey";
    },

    fallbackCopyToClipboard(text) {
      var textArea = document.createElement("textarea");
      textArea.value = text;
      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log("Fallback: text to copy: " + msg);
      } catch (err) {
        console.error("Fallback: unable to copy:", err);
      }

      document.body.removeChild(textArea);
    },
    copyToClipboard(text, user) {
      // If clipboard not there, create create input and copy it from there using doxument.execCommand("copy");
      if (!navigator.clipboard) {
        this.fallbackCopyToClipboard(text);
        return;
      }
      navigator.clipboard.writeText(text).then(
        () => {
          this.text = `notification.copied-to-clipboard`;
          this.snackbar = true;
        },
        (err) => {
          console.log(err);
          this.text = `copying-failed`;
          this.snackbar = true;
        }
      );
      user.menu = false;
    },
    async getCups() {
      if (this.user_id) {
        this.loading_cups = true;
        // Get Cups
        try {
          this.all_cups = await CupService.getCups();
          if (this.all_cups.length) {
            this.all_cups.sort(function compare(a, b) {
              return a.name - b.name;
            });
            this.all_cups.forEach((cup) => {
              cup.select = `${cup.name} (${cup.year})`;
            });
            this.cups = this.all_cups.filter(
              (cup) => cup.user_id === this.user_id
            );
            this.cup = this.cups[this.cups.length - 1];
          }
        } catch (err) {
          this.error = err.message;
        }
      } else {
        console.error("No user found in localstorage!");
      }
      this.loading_cups = false;
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
    // Delete competition from database
    async deleteCompetition(id, confirmed) {
      // If user clicked "OK" on confirmation box
      if (confirmed) {
        this.text = "notification.deleting";
        this.snackbar = true;
        this.loading_competitions = true;
        try {
          //Delete competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
          await CompetitionService.deleteCompetition(id);
          // No query, get all competitions
          let index = this.all_competitions.findIndex((c) => c._id === id);
          if (index > -1) {
            this.all_competitions.splice(index, 1);
          }
          this.loading_competitions = false;
        } catch (err) {
          console.error(err.message);
        }
      }
      // Show confirmation box on first function call
      else {
        this.$confirm(
          this.$t("confirm-dialog"),
          this.$t("button.delete-comp"),
          "question"
        )
          .then((r) => {
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
