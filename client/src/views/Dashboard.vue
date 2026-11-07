<template>
  <!-- /dashboard-->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container
    v-bind:class="{
      mobile: $vuetify.display.width < 800,
      browser: $vuetify.display.width >= 800,
      wide: $vuetify.display.width >= 1200,
    }"
  >
    <error-list :errors="errors"></error-list>
    <v-card
      style="background: transparent; padding: 20px"
      elevation="3"
      variant="outlined"
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
              <v-card
                style="background: transparent"
                v-if="user"
                variant="outlined"
              >
                <v-card-title
                  ><v-icon size="x-large">mdi-account-circle</v-icon> &nbsp;{{
                    $t("dashboard.user-details")
                  }}</v-card-title
                >
                <v-list style="background: transparent" lines="two" border>
                  <v-list-item>
                    <template v-slot:prepend
                      ><v-avatar>
                        <v-icon> mdi-account-box </v-icon>
                      </v-avatar></template
                    >

                    <v-list-item-title>{{ user.name }}</v-list-item-title>

                    <v-list-item-subtitle>{{
                      $t("name")
                    }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <template v-slot:prepend
                      ><v-avatar>
                        <v-icon> mdi-email </v-icon>
                      </v-avatar></template
                    >

                    <v-list-item-title>{{ user.email }}</v-list-item-title>

                    <v-list-item-subtitle>{{
                      $t("email")
                    }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <template v-slot:prepend
                      ><v-avatar>
                        <v-icon> mdi-calendar </v-icon>
                      </v-avatar></template
                    >

                    <v-list-item-title>{{ created }}</v-list-item-title>

                    <v-list-item-subtitle>{{
                      $t("created")
                    }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col>
              <!-- if user is found on localstorage (this.user is not null/false) -->
              <v-card
                style="background: transparent"
                v-if="user"
                variant="outlined"
              >
                <v-card-title
                  ><v-icon size="x-large">mdi-gauge</v-icon> &nbsp;{{
                    $t("dashboard.functions")
                  }}</v-card-title
                >
                <v-list style="background: transparent" border>
                  <v-list-item>
                    <v-list-item-title>{{
                      $t("comp.create")
                    }}</v-list-item-title>
                    <v-list-item-action>
                      <router-link to="/register-comp">
                        <v-btn
                          icon
                          :loading="loading || publishing"
                          :disabled="loading || publishing"
                          variant="outlined"
                          ><v-icon>mdi-plus</v-icon></v-btn
                        >
                      </router-link>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-title>{{
                      $t("cup.create")
                    }}</v-list-item-title>
                    <v-list-item-action>
                      <v-dialog
                        v-model="createCupDialog"
                        width="700"
                        persistent
                      >
                        <template v-slot:activator="{ props }">
                          <v-btn
                            icon
                            v-bind="props"
                            :loading="loading || publishing"
                            :disabled="loading || publishing"
                            variant="outlined"
                          >
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </template>

                        <v-card>
                          <v-card-title>
                            {{ $t("cup.create") }}
                          </v-card-title>

                          <v-row class="justify-center align-center">
                            <v-col cols="8" class="input-fields">
                              <v-text-field
                                :label="$t('cup.normal') + ' ' + $t('name')"
                                v-model="name"
                                :maxlength="40"
                                :loading="loading"
                                :counter="40"
                              />
                            </v-col>
                          </v-row>
                          <v-row class="justify-center align-center">
                            <v-col cols="6" class="input-fields">
                              <!-- Vuetify 2 used a year-mode date picker here -->
                              <v-select
                                v-model="year"
                                :items="yearOptions"
                                :label="$t('year')"
                                prepend-icon="mdi-calendar"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row class="justify-center align-center">
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
                            class="justify-center align-center"
                            v-if="isThereCompetitionLimit"
                          >
                            <v-col cols="6" class="input-fields">
                              <v-text-field
                                v-model="meaningful_competitions"
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
                          <v-row class="justify-center align-center">
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
                              @click="createCupDialog = false"
                              variant="text"
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
                    v-if="user"
                    variant="outlined"
                  >
                    <v-list style="background: transparent" border>
                      <v-list-item>
                        <v-spacer></v-spacer>
                        <v-list-item-title
                          ><h2>
                            {{ tweenedCompetitions.toFixed(0) }}
                          </h2></v-list-item-title
                        >

                        <v-list-item-subtitle>{{
                          $t("comp.plural")
                        }}</v-list-item-subtitle>
                        <v-spacer></v-spacer>
                        <v-list-item-title
                          ><h2>
                            {{ tweenedCups.toFixed(0) }}
                          </h2></v-list-item-title
                        >

                        <v-list-item-subtitle>{{
                          $t("cup.plural")
                        }}</v-list-item-subtitle>
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

<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { useMainStore } from "@/store";
import CompCupTable from "../components/CompCupTable.vue";
import CompetitionService from "../services/CompetitionService";
import CupService from "../services/CupService";
import gsap from "gsap";
import NotificationBar from "../components/NotificationBar.vue";
import ErrorList from "../components/ErrorList.vue";

defineOptions({ name: "Home" });
const store = useMainStore();

const user = ref(null);
const created = ref(null);
const createCupDialog = ref(false);
const loading = ref(false);
const publishing = ref(false);
const name = ref(null);
const year = ref(null);
const meaningful_competitions = ref(1);
const isThereCompetitionLimit = ref(false);
const competitions = ref([]);
const cups = ref([]);
const errors = ref([]);
const number_rules = ref([
  (value) => !!value || "Kenttä ei voi jäädä tyhjäksi!",
  (value) => !isNaN(value || "") || "Ei ole numero!",
]);
const snackbar = ref(false);
const text = ref("");
const cupsAmount = ref(0);
const competitionsAmount = ref(0);
// GSAP animates these numbers for the count-up effect
const tweened = reactive({ cups: 0, competitions: 0 });
const tweenedCups = computed(() => tweened.cups);
const tweenedCompetitions = computed(() => tweened.competitions);
const animationLength = ref(1.5);
const tab = ref(null);

const yearOptions = computed(() => {
  const years = [];
  for (let y = new Date().getFullYear() + 1; y >= 2000; y--) {
    years.push(String(y));
  }
  return years;
});

watch(cupsAmount, (n) => {
  gsap.to(tweened, {
    duration: animationLength.value,
    cups: Number(n) || 0,
  });
});

watch(competitionsAmount, (n) => {
  gsap.to(tweened, {
    duration: animationLength.value,
    competitions: Number(n) || 0,
  });
});

//filter other characters out for number inputs

function isNumber(evt, isDate) {
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
}

async function publishCup(cup) {
  cup.isPublic = !cup.isPublic;
  try {
    //TODO update only this one variable (competition.normal_points) to database, not the whole competition
    publishing.value = true;
    const newValues = {
      $set: { isPublic: cup.isPublic },
    };
    await CupService.updateValues(cup._id, newValues);
  } catch (err) {
    console.error(err.message);
  }

  publishing.value = false;
}

// Add error to error array and direct user to it
// Add error to error array and direct user to it

function showError(error) {
  errors.value.push(error);
  nextTick(() => {
    document.getElementById("error-list").scrollIntoView();
  });
}

//TODO dropdown to select current year as highlighted when opened

async function saveCup() {
  errors.value = [];
  loading.value = true;

  if (!name.value) {
    showError("errors.missing-cup-name");
  }
  if (!year.value) {
    showError("errors.missing-cup-year");
  }

  if (isThereCompetitionLimit.value && !meaningful_competitions.value) {
    showError("errors.missing-meaningfull-comps");
  }

  if (!errors.value.length) {
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user["_id"];
    const cup = {
      user_id: user_id,
      name: name.value,
      year: year.value,
      meaningful_competitions: isThereCompetitionLimit.value
        ? Number(meaningful_competitions.value)
        : -1,
    };
    try {
      //Submit Cup to database (check 'client\src\CupService.js' and 'server\routes\api\cups.js' to see how this works)
      await CupService.insertCup([cup]);
      text.value = "Cup lisätty tietokantaan!";
      snackbar.value = true;
      cups.value.push(cup);
      cupsAmount.value = cups.value.length;
      cups.value.sort((a, b) => {
        return parseInt(b.year) - parseInt(a.year);
      });
      loading.value = false;
      year.value = null;
      name.value = null;
      tab.value = "cups";
    } catch (err) {
      errors.value.push(err.message);
    }
  }
  loading.value = false;
  createCupDialog.value = false;
  isThereCompetitionLimit.value = false;
  meaningful_competitions.value = 1;
}

// Runs when the component is created
(async () => {
  loading.value = true;
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user["_id"];
  // Get competitions
  const query = { user_id: user_id };

  await CompetitionService.getCompetitions(query)
    .then((response) => {
      competitions.value = response;
      competitionsAmount.value = competitions.value.length;
      // Convert dates
      competitions.value.forEach((competition) => {
        competition.start_date = new Date(competition.start_date);
        competition.end_date = new Date(competition.end_date);
      });
      // Sort them based on start_date so the oldest competitions are the last
      competitions.value.sort(
        (a, b) => new Date(b.start_date) - new Date(a.start_date),
      );
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 408) {
          loading.value = false;
          return console.log(err);
        } else {
          loading.value = false;
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
      cups.value = response;
      cupsAmount.value = cups.value.length;
      cups.value.sort((a, b) => {
        return parseInt(b.year) - parseInt(a.year);
      });
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 400) {
          console.log(err);
          return showError("error.bad-request");
        }
        if (err.response.status === 408) {
          return showError("error.timeout");
        } else {
          return console.log(err);
        }
      } else {
        return console.log(err);
      }
    });

  loading.value = false;
})();

onMounted(() => {
  // Set competition in localstorage and vuex to null
  store.refreshCompetition(null);
  localStorage.removeItem("competition");
  store.refreshCup(null);
  localStorage.removeItem("cup");
  // Get user info form localstorage
  if (localStorage.getItem("user") != null) {
    user.value = JSON.parse(localStorage.getItem("user"));
    let createdAt = new Date(user.value.createdAt);
    created.value = `${createdAt.getDate()}.${
      createdAt.getMonth() + 1
    }.${createdAt.getFullYear()}`;
  }
});
</script>
