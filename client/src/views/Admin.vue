<template>
  <!-- /admin -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container
    v-bind:class="{
      mobile: $vuetify.display.width < 800,
      browser: $vuetify.display.width >= 800,
      wide: $vuetify.display.width >= 1200,
    }"
  >
    <!-- Tabs -->
    <v-tabs
      slider-color="blue-darken-4"
      v-model="tab"
      bg-color="blue-lighten-2"
      color="blue-darken-4"
      grow
      show-arrows
      next-icon="mdi-arrow-right-bold-box-outline"
      prev-icon="mdi-arrow-left-bold-box-outline"
      center-active
    >
      <v-tab value="overview">{{ $t("general") }}</v-tab>
      <v-tab value="users">{{ $t("users") }}</v-tab>
      <v-tab value="competitions">{{ $t("comp.plural") }}</v-tab>
    </v-tabs>
    <v-window v-model="tab" style="background: rgba(0, 0, 0, 0.4)">
      <v-window-item
        :value="'overview'"
        v-bind:class="{
          inputarea: !store.getTheme,
          'inputarea-dark': store.getTheme,
        }"
      >
        <v-row>
          <v-col>
            <v-row>
              <v-col v-if="prevRoute">
                <v-btn
                  v-if="prevRoute.name"
                  rounded
                  color="yellow"
                  @click="$router.push({ path: prevRoute.path })"
                  size="large"
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
                <v-card elevation="5">
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
                    'text-white': store.getTheme,
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
                <v-card elevation="5">
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
                    'text-white': store.getTheme,
                  }"
                >
                  {{ $t("loading") }} {{ $t("comp.plural") }}...
                </h3>
                <ProgressBarQuery />
              </v-col>
            </v-row>
            <v-row v-if="!loading_cups">
              <v-col md="6" offset-md="3">
                <v-card elevation="5">
                  <p v-if="all_cups.length" class="flow-text">
                    <v-icon color="yellow-darken-1">mdi-medal</v-icon
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
                    'text-white': store.getTheme,
                  }"
                >
                  {{ $t("loading") }} {{ $t("cup.plural") }}...
                </h3>
                <ProgressBarQuery />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item
        :value="'users'"
        v-bind:class="{
          inputarea: !store.getTheme,
          'inputarea-dark': store.getTheme,
        }"
      >
        <v-row>
          <v-col>
            <v-row>
              <v-col v-if="prevRoute">
                <v-btn
                  v-if="prevRoute.name"
                  rounded
                  color="yellow"
                  @click="$router.push({ path: prevRoute.path })"
                  size="large"
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
                    'text-white': store.getTheme,
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
                  'bg-grey-darken-4': store.getTheme,
                }"
              >
                <v-data-iterator
                  :items="users"
                  :search="search"
                  :items-per-page="-1"
                  class="scroll_table"
                >
                  <template v-slot:header>
                    <v-toolbar class="mb-1">
                      <v-text-field
                        v-model="search"
                        clearable
                        flat
                        hide-details
                        prepend-inner-icon="mdi-magnify"
                        :label="$t('search')"
                        variant="solo-inverted"
                      ></v-text-field>
                    </v-toolbar>
                  </template>
                  <template v-slot:default="{ items }">
                    <v-col
                      v-for="({ raw: user }, index) in items"
                      :key="index"
                      style="margin-top: 20px"
                    >
                      <!-- For every user in this.users array -->
                      <v-menu
                        v-model="user.menu"
                        transition="scale-transition"
                        origin="top left"
                        location="bottom end"
                        persistent
                      >
                        <template v-slot:activator="{ props }">
                          <v-chip
                            v-bind="props"
                            :color="user.is_admin ? 'yellow-darken-2' : 'green'"
                            size="large"
                            :variant="store.getTheme ? 'outlined' : 'flat'"
                          >
                            <v-avatar start>
                              <v-icon v-if="user.is_admin"
                                >mdi-shield-crown</v-icon
                              >
                              <v-icon v-else>mdi-account</v-icon>
                            </v-avatar>
                            {{ user.name }}
                          </v-chip>
                        </template>
                        <v-card width="300">
                          <v-list>
                            <v-list-item>
                              <template v-slot:prepend
                                ><v-avatar>
                                  <v-icon v-if="user.is_admin"
                                    >mdi-shield-crown</v-icon
                                  >
                                  <v-icon v-else>mdi-account</v-icon>
                                </v-avatar></template
                              >
                              <v-list-item-title>{{
                                user.name
                              }}</v-list-item-title>
                              <v-list-item-subtitle>{{
                                user.email
                              }}</v-list-item-subtitle>
                              <v-list-item-action>
                                <v-btn
                                  icon
                                  @click="user.menu = false"
                                  variant="text"
                                >
                                  <v-icon>mdi-close-circle</v-icon>
                                </v-btn>
                              </v-list-item-action>
                            </v-list-item>
                          </v-list>
                          <v-list>
                            <v-tooltip location="end">
                              <template v-slot:activator="{ props }">
                                <v-list-item
                                  v-bind="props"
                                  @click="copyToClipboard(user._id, user)"
                                >
                                  <v-list-item-action>
                                    <v-icon
                                      >mdi-badge-account-horizontal</v-icon
                                    >
                                  </v-list-item-action>
                                  <v-list-item-title>{{
                                    user._id
                                  }}</v-list-item-title>
                                  <v-list-item-subtitle
                                    >Id</v-list-item-subtitle
                                  >
                                </v-list-item>
                              </template>
                              <span>{{ $t("users") }}</span>
                            </v-tooltip>
                            <v-tooltip location="end">
                              <template v-slot:activator="{ props }">
                                <v-list-item
                                  v-bind="props"
                                  @click="copyToClipboard(user.createdAt, user)"
                                >
                                  <v-list-item-action>
                                    <v-icon>mdi-calendar-check</v-icon>
                                  </v-list-item-action>
                                  <v-list-item-title>{{
                                    user.createdAt
                                  }}</v-list-item-title>
                                  <v-list-item-subtitle>{{
                                    $t("created")
                                  }}</v-list-item-subtitle>
                                </v-list-item>
                              </template>
                              <span>Kopioi</span>
                            </v-tooltip>
                            <v-list-item v-if="user.is_admin" @click="() => {}">
                              <v-list-item-action>
                                <v-icon>mdi-briefcase</v-icon>
                              </v-list-item-action>
                              <v-list-item-title>Admin</v-list-item-title>
                              <v-list-item-subtitle>{{
                                $t("role")
                              }}</v-list-item-subtitle>
                            </v-list-item>
                            <v-list-item v-else @click="() => {}">
                              <v-list-item-action>
                                <v-icon>mdi-briefcase</v-icon>
                              </v-list-item-action>
                              <v-list-item-title>{{
                                $t("user")
                              }}</v-list-item-title>
                              <v-list-item-subtitle>{{
                                $t("role")
                              }}</v-list-item-subtitle>
                            </v-list-item>
                            <v-list-item @click="() => {}">
                              <v-btn
                                color="blue"
                                @click="
                                  copyToClipboard(JSON.stringify(user), user)
                                "
                              >
                                <v-icon>mdi-copy-content</v-icon>
                                {{ $t("copy") }}
                              </v-btn>
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
                  :color="`grey ${store.getTheme ? 'darken-2' : 'lighten-4'}`"
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
                    'text-white': store.getTheme,
                  }"
                >
                  Ei käyttäjiä!
                </h2>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item
        :value="'competitions'"
        v-bind:class="{
          inputarea: !store.getTheme,
          'inputarea-dark': store.getTheme,
        }"
      >
        <v-row>
          <v-col>
            <v-row>
              <v-col v-if="prevRoute">
                <v-btn
                  v-if="prevRoute.name"
                  rounded
                  color="yellow"
                  @click="$router.push({ path: prevRoute.path })"
                  size="large"
                  ><v-icon>mdi-keyboard-return</v-icon
                  >{{ $t("button.return-back") }}</v-btn
                >
              </v-col>
            </v-row>

            <!-- if there are competitions in database-->
            <v-row v-if="all_competitions.length">
              <v-col>
                <v-card>
                  <v-card-title class="d-flex flex-wrap align-center">
                    <p class="flow-text">{{ $t("comp.plural") }}</p>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search_comp"
                      append-inner-icon="mdi-magnify"
                      :label="$t('search')"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-card-title>
                  <v-data-table
                    id="normal-table"
                    :headers="tableHeaders(headers)"
                    :items="all_competitions"
                    :search="search_comp"
                    :loading="loading_competitions"
                  >
                    <template
                      v-for="(h, index) in headers"
                      v-slot:[`header.${h.value}`]="{ column: header }"
                    >
                      <span> {{ $t(header.text) }}</span>
                    </template>
                    <template v-slot:[`item.start_date`]="{ item }">
                      <v-chip color="primary-darken-2" variant="flat">{{
                        formatDateToLocaleDateString(item.start_date)
                      }}</v-chip>
                    </template>
                    <template v-slot:[`item.cup_points_multiplier`]="{ item }">
                      <v-chip
                        :color="getColor(item.cup_points_multiplier)"
                        :variant="store.getTheme ? 'outlined' : 'flat'"
                        >{{ item.cup_points_multiplier }}x</v-chip
                      >
                    </template>
                    <template v-slot:[`item.choose`]="{ item }">
                      <v-tooltip location="end">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="primary"
                            v-bind="props"
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
                      <v-tooltip location="end">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
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
                  :color="`grey ${store.getTheme ? 'darken-2' : 'lighten-4'}`"
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
                    'text-white': store.getTheme,
                  }"
                >
                  {{ $t("no") }} {{ $t("comp.plural") }}!
                </h2>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>
    <notification-bar :snackbar="snackbar" :text="text"></notification-bar>
  </v-container>
</template>

<script setup>
import { tableHeaders } from "@/utils/tableHeaders";
import { onMounted, ref } from "vue";
import { useMainStore } from "@/store";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { alert, confirm } from "@/plugins/alerts";
import { usePreviousRoute } from "@/composables/usePreviousRoute";
import CompetitionService from "../services/CompetitionService";
import UserService from "../services/UserService";
import CupService from "../services/CupService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
import { formatDateToLocaleDateString } from "@/utils/format";
import NotificationBar from "../components/NotificationBar.vue";

const store = useMainStore();
const { t } = useI18n();
const router = useRouter();

const tab = ref(null);
const users = ref([]);
const all_competitions = ref([]);
const competitions = ref([]);
const user_id = ref(null);
const loading = ref(false);
const loading_users = ref(false);
const loading_competitions = ref(false);
const loading_cups = ref(false);
const all_cups = ref([]);
const cups = ref([]);
const cup = ref({});
const headers = ref([
  { text: "date", value: "start_date" },
  { text: "name", value: "name" },
  { text: "user", value: "username" },
  { text: "cup.normal", value: "cup_name" },
  { text: "multiplier", value: "cup_points_multiplier" },
  { text: "choose", value: "choose", sortable: false },
  { text: "delete", value: "delete", sortable: false },
]);
const search_comp = ref("");
const search = ref("");
const prevRoute = usePreviousRoute();
const snackbar = ref(false);
const text = ref("");
const error = ref(null);

function getColor(multiplier) {
  if (multiplier > 1) return "red";
  if (multiplier === 1) return "green";
  else return "grey";
}

function fallbackCopyToClipboard(text) {
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
}

function copyToClipboard(_text, user) {
  // If clipboard not there, create create input and copy it from there using doxument.execCommand("copy");
  if (!navigator.clipboard) {
    fallbackCopyToClipboard(_text);
    return;
  }
  navigator.clipboard.writeText(_text).then(
    () => {
      text.value = `notification.copied-to-clipboard`;
      snackbar.value = true;
    },
    (err) => {
      console.log(err);
      text.value = `copying-failed`;
      snackbar.value = true;
    },
  );
  user.menu = false;
}

async function getCups() {
  if (user_id.value) {
    loading_cups.value = true;
    // Get Cups
    try {
      all_cups.value = await CupService.getCups();
      if (all_cups.value.length) {
        all_cups.value.sort(function compare(a, b) {
          return a.name - b.name;
        });
        all_cups.value.forEach((_cup) => {
          _cup.select = `${_cup.name} (${_cup.year})`;
        });
        cups.value = all_cups.value.filter(
          (_cup) => _cup.user_id === user_id.value,
        );
        cup.value = cups.value[cups.value.length - 1];
      }
    } catch (err) {
      error.value = err.message;
    }
  } else {
    console.error("No user found in localstorage!");
  }
  loading_cups.value = false;
}

function pickCompetition(competition) {
  // Pick competition for the app to use
  //NOTE Store competition to vuex, redundant?
  store.competition = competition;
  // Set competition._id to localstorage for database queries
  localStorage.setItem(
    "competition",
    JSON.stringify({
      _id: competition._id,
      start_date: competition.start_date,
      end_date: competition.end_date,
    }),
  );
  // redirect to /overview
  router.push({ path: "/overview" });
}

// Delete competition from database

async function deleteCompetition(id, confirmed) {
  // If user clicked "OK" on confirmation box
  if (confirmed) {
    text.value = "notification.deleting";
    snackbar.value = true;
    loading_competitions.value = true;
    try {
      //Delete competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
      await CompetitionService.deleteCompetition(id);
      // No query, get all competitions
      let index = all_competitions.value.findIndex((c) => c._id === id);
      if (index > -1) {
        all_competitions.value.splice(index, 1);
      }
      loading_competitions.value = false;
    } catch (err) {
      console.error(err.message);
    }
  }
  // Show confirmation box on first function call
  else {
    confirm(t("confirm-dialog"), t("button.delete-comp"), "question")
      .then((r) => {
        if (r) {
          deleteCompetition(id, r);
        }
      })
      .catch((error) => {
        if (error) {
          console.error(error);
        }
      });
  }
}

onMounted(async () => {
  //Check if user is logged in has admin status, update header
  // Show loading progressbars
  loading.value =
    loading_users.value =
    loading_competitions.value =
    loading_cups.value =
      true;
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    user_id.value = user["_id"];
  }
  try {
    // Load data from database
    // Users first, if token is expired logout user
    await UserService.getUsers()
      .then(async (res) => {
        await getCups();
        loading.value = false;
        users.value = res;
        users.value.forEach((user) => {
          user.menu = false;
        });
        loading_users.value = false;
        // No query, get all competitions
        all_competitions.value = await CompetitionService.getCompetitions();
        all_competitions.value.forEach((competition) => {
          if (competition.isCupCompetition) {
            let cup = all_cups.value.find((c) => c._id === competition.cup_id);
            competition.cup_name = `${cup.name} (${cup.year})`;
          }
          competition.username = users.value.find(
            (user) => user._id === competition.user_id,
          ).name;

          competition.start_date = new Date(competition.start_date);
          competition.end_date = new Date(competition.end_date);
        });

        competitions.value = all_competitions.value.filter(
          (competition) => competition.user_id === user_id.value,
        );
        // Sort them based on start_date so the oldest competitions are the last
        all_competitions.value.sort(function compare(a, b) {
          return a.start_date < b.start_date;
        });
        loading_competitions.value = false;
      })
      .catch(async (err) => {
        if (err.response.status === 401) {
          text.value = "notification.login-again";
          snackbar.value = true;
          await UserService.logoutUser()
            .then(() => {
              router.push({ path: "/login" });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log(err.message);
        }
      });
  } catch (err) {
    console.error(err.message);
  }
});
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
