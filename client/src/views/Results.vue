<template>
  <!-- /results: live results of the competition being run -->
  <div>
    <Timedate />

    <v-container
      :class="{
        mobile: $vuetify.display.width < 800,
        browser: $vuetify.display.width >= 800,
        wide: $vuetify.display.width >= 1200,
      }"
    >
      <v-card style="background: transparent" elevation="3" variant="outlined">
        <v-row class="justify-center">
          <v-col>
            <h1 style="margin: 30px">{{ $t("results") }}</h1>
          </v-col>
        </v-row>
        <v-row class="justify-center align-center">
          <v-col cols="4">
            <v-switch
              :loading="resultsView?.loading"
              v-model="autoRefresh"
              color="orange-darken-3"
              :label="$t('button.auto-download')"
            ></v-switch>
          </v-col>
        </v-row>
      </v-card>

      <CompetitionResults
        ref="resultsView"
        :competition-id="competitionId"
        @loaded="(c) => (competition = c)"
      />

      <v-card
        v-if="competition"
        style="background: transparent"
        elevation="3"
        variant="outlined"
      >
        <v-row
          v-if="!resultsView?.loading"
          style="margin-top: 20px; margin-bottom: 10px"
        >
          <v-col>
            <v-btn
              rounded
              :color="competition.isPublic ? 'grey-darken-4' : 'green-darken-4'"
              @click="togglePublic"
              class="text-white"
              :loading="updating"
              size="large"
            >
              <template v-if="competition.isPublic">
                <v-icon>mdi-incognito</v-icon>{{ $t("button.set-private") }}
              </template>
              <template v-else>
                <v-icon color="green">mdi-publish</v-icon
                >{{ $t("button.set-public") }}
              </template>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              rounded
              :color="competition.isFinished ? 'yellow' : 'green-darken-3'"
              @click="toggleFinished"
              :loading="updating"
              size="large"
            >
              <span v-if="competition.isFinished" class="text-black">
                <v-icon color="red-darken-2">mdi-cancel</v-icon
                >{{ $t("button.set-not-complete") }}
              </span>
              <span v-else>
                <v-icon color="yellow">mdi-trophy</v-icon
                >{{ $t("button.set-complete") }}
              </span>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              id="updatebtn"
              rounded
              color="blue-darken-4"
              @click="resultsView.refresh()"
              class="text-white"
              :loading="updating"
              size="large"
            >
              <v-icon>mdi-update</v-icon>{{ $t("button.update") }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col>
            <h2 class="text-white">{{ $t("refreshing") }}</h2>
            <ProgressBarQuery />
          </v-col>
        </v-row>
      </v-card>
    </v-container>
    <NotificationBar :snackbar="snackbar" :text="text" />
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useMainStore } from "@/store";
import CompetitionService from "../services/CompetitionService";
import Timedate from "../components/layout/Timedate.vue";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
import NotificationBar from "../components/NotificationBar.vue";
import CompetitionResults from "../components/results/CompetitionResults.vue";

defineOptions({ name: "Results" });

const AUTO_REFRESH_MS = 60000;

const store = useMainStore();
const resultsView = ref(null);
const competition = ref(null);
const updating = ref(false);
const autoRefresh = ref(false);
const snackbar = ref(false);
const text = ref("");

// The competition being run is remembered in localStorage
const stored = JSON.parse(localStorage.getItem("competition") || "null");
const competitionId = stored?._id ?? null;

function notify(message) {
  text.value = message;
  snackbar.value = false;
  nextTick(() => (snackbar.value = true));
}

let timer = null;
watch(autoRefresh, (enabled) => {
  clearInterval(timer);
  if (enabled) {
    timer = setInterval(() => resultsView.value?.refresh(), AUTO_REFRESH_MS);
    notify("notification.auto-update-enabled");
  } else {
    notify("notification.auto-update-disabled");
  }
});
onBeforeUnmount(() => clearInterval(timer));

async function saveValues(values) {
  updating.value = true;
  try {
    store.refreshCompetition(competition.value);
    await CompetitionService.updateValues(competition.value._id, {
      $set: values,
    });
  } catch (err) {
    console.error(err.message);
  } finally {
    updating.value = false;
  }
}

function togglePublic() {
  competition.value.isPublic = !competition.value.isPublic;
  saveValues({ isPublic: competition.value.isPublic });
}

function toggleFinished() {
  const c = competition.value;
  c.isFinished = !c.isFinished;
  c.state = c.isFinished ? "ended" : "not-finished";
  saveValues({ isFinished: c.isFinished, state: c.state });
}
</script>
