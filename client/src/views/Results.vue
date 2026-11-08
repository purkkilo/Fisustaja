<template>
  <!-- /results: results of the competition being run, with publishing -->
  <div class="fs-page">
    <PageHead
      v-if="competition"
      :title="competition.name"
      :eyebrow="$t('steps.results')"
      :subtitle="competition.cup_name || competition.locality"
      tone="results"
    >
      <template #actions>
        <v-switch
          v-model="autoRefresh"
          :label="$t('results-page.auto-refresh')"
          color="results"
          density="compact"
          hide-details
          inset
        />
        <v-btn
          :variant="competition.isPublic ? 'flat' : 'outlined'"
          color="results"
          :prepend-icon="competition.isPublic ? 'mdi-earth' : 'mdi-earth-off'"
          :loading="updating"
          @click="togglePublic"
          >{{
            competition.isPublic
              ? $t("results-page.public-on")
              : $t("results-page.public-off")
          }}</v-btn
        >
        <v-btn
          :variant="competition.isFinished ? 'flat' : 'outlined'"
          :color="competition.isFinished ? 'signing' : undefined"
          :prepend-icon="
            competition.isFinished ? 'mdi-trophy' : 'mdi-trophy-outline'
          "
          :loading="updating"
          @click="toggleFinished"
          >{{
            competition.isFinished
              ? $t("button.set-not-complete")
              : $t("button.set-complete")
          }}</v-btn
        >
        <ShareLinkButton
          :to="{ name: 'PublicResults', params: { id: competition._id } }"
          :title="competition.name"
          :text="$t('share.public-link')"
          :disabled="!competition.isPublic"
          :disabled-hint="$t('share.publish-first')"
        />
        <v-btn
          variant="text"
          icon="mdi-refresh"
          :loading="resultsView?.loading"
          :aria-label="$t('button.update')"
          @click="resultsView.refresh()"
        />
      </template>
    </PageHead>

    <CompetitionResults
      ref="resultsView"
      :competition-id="competitionId"
      :live="autoRefresh"
      :live-interval-ms="AUTO_REFRESH_MS"
      @loaded="(c) => (competition = c)"
    />
    <NotificationBar v-model:snackbar="snackbar" :text="text" />
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";
import { useMainStore } from "@/store";
import CompetitionService from "../services/CompetitionService";
import NotificationBar from "../components/NotificationBar.vue";
import CompetitionResults from "../components/results/CompetitionResults.vue";
import PageHead from "@/components/ui/PageHead.vue";
import ShareLinkButton from "@/components/ui/ShareLinkButton.vue";

defineOptions({ name: "Results" });

const AUTO_REFRESH_MS = 30000;

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

// CompetitionResults does the refreshing (quietly, paused in hidden tabs)
watch(autoRefresh, (enabled) =>
  notify(
    enabled
      ? "notification.auto-update-enabled"
      : "notification.auto-update-disabled",
  ),
);

async function saveValues(values, rollback) {
  updating.value = true;
  try {
    await CompetitionService.updateValues(competition.value._id, {
      $set: values,
    });
    store.refreshCompetition({ ...store.competition, ...competition.value });
  } catch (err) {
    console.error(err.message);
    rollback();
    notify("errors.in-saving");
  } finally {
    updating.value = false;
  }
}

function togglePublic() {
  const c = competition.value;
  const previous = c.isPublic;
  c.isPublic = !previous;
  saveValues({ isPublic: c.isPublic }, () => (c.isPublic = previous));
}

function toggleFinished() {
  const c = competition.value;
  const previous = { isFinished: c.isFinished, state: c.state };
  c.isFinished = !c.isFinished;
  c.state = c.isFinished ? "ended" : "not-finished";
  saveValues({ isFinished: c.isFinished, state: c.state }, () =>
    Object.assign(c, previous),
  );
}
</script>
