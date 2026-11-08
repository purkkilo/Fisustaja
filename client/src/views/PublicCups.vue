<template>
  <!-- /public-cups: standings and statistics of public cups -->
  <div class="fs-page public">
    <PageHead
      :title="$t('shell.public-cups')"
      :eyebrow="$t('shell.public')"
      tone="results"
    >
      <template #actions>
        <v-autocomplete
          :model-value="listed ? cupId : null"
          :items="cups"
          item-title="select"
          item-value="_id"
          :label="`${$t('choose')} ${$t('cup.normal')}`"
          :loading="loadingList"
          :no-data-text="`${$t('cup.not-found')} ${$t('available')}`"
          hide-details
          clearable
          prepend-inner-icon="mdi-magnify"
          class="public__select"
          @update:model-value="open"
        />
      </template>
    </PageHead>

    <v-alert
      v-if="cupId && notPublic"
      type="info"
      variant="tonal"
      icon="mdi-lock-outline"
    >
      {{ $t("public-page.cup-not-found") }}
    </v-alert>
    <v-skeleton-loader
      v-else-if="loading && !cup"
      type="heading, table"
      class="fs-panel"
    />
    <template v-else-if="cupId && cup">
      <PageHead
        :title="`${cup.name} ${cup.year}`"
        :subtitle="
          $t('dashboard.cup-progress', {
            done: allCompetitions.filter((c) => c.isFinished).length,
            total: allCompetitions.length,
          })
        "
        tone="results"
      >
        <template #actions>
          <ShareLinkButton
            :to="{ name: 'PublicCups', params: { id: cupId } }"
            :title="`${cup.name} ${cup.year}`"
          />
        </template>
      </PageHead>
      <PillTabs v-model="tab" :items="tabs" :label="$t('cup-page.views')" />
      <CupPoints
        v-if="tab === 'points'"
        :key="cupId"
        :competitions="competitions"
        :all-competitions="allCompetitions"
        :headers="headers"
        :cup="cup"
        :is-results="isResults"
        :loading="loading"
        :results="standings"
        :select-numbers="selectNumbers"
        @change="setHeaderLabel"
        @refresh="() => load(cupId)"
        @calculate="recalculate"
        @save="(options) => savePdf('Tulokset', options)"
        @sort="setShowUnfinished"
      />
      <CupStats
        v-else-if="tab === 'stats'"
        :competitions="competitions"
        :cup="cup"
        :all_signees="allResults"
        :biggest_fishes="biggestFishes"
        :biggest_amounts="biggestAmounts"
        :loading="loading"
      />
    </template>
    <p v-else-if="!loadingList && !cupId" class="fs-panel pa-8 fs-muted">
      {{ $t("cup-page.pick-public") }}
    </p>
    <NotificationBar v-model:snackbar="snackbar" :text="text" />
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import CupService from "../services/CupService";
import { useCupStandings } from "@/composables/useCupStandings";
import NotificationBar from "../components/NotificationBar.vue";
import CupPoints from "../components/CupPoints.vue";
import PillTabs from "../components/ui/PillTabs.vue";
import PageHead from "../components/ui/PageHead.vue";
import ShareLinkButton from "../components/ui/ShareLinkButton.vue";
import { usePageTitle } from "@/composables/usePageTitle";

defineOptions({ name: "PublicCups" });

// Statistics bring chart.js with them: load them when the tab is opened
const CupStats = defineAsyncComponent(
  () => import("../components/CupStats.vue"),
);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const {
  loading,
  cup,
  allCompetitions,
  competitions,
  allResults,
  biggestFishes,
  biggestAmounts,
  standings,
  headers,
  isResults,
  selectNumbers,
  snackbar,
  text,
  load,
  recalculate,
  setHeaderLabel,
  setShowUnfinished,
  savePdf,
  clear,
} = useCupStandings({ publicOnly: true });

const cups = ref([]);
const loadingList = ref(false);
const listFailed = ref(false);
const tab = ref("points");

// /public-cups/<id>: the id in the address is the shareable link
const cupId = computed(() => route.params.id || null);
const listed = computed(() => cups.value.find((c) => c._id === cupId.value));
// the list holds every public cup: an id missing from it is not public
const notPublic = computed(
  () =>
    !loadingList.value && !listFailed.value && !!cupId.value && !listed.value,
);
usePageTitle(() => (cupId.value && cup.value ? cup.value.name : ""));

function open(id) {
  router.replace({ name: "PublicCups", params: { id: id || undefined } });
}

const tabs = computed(() => [
  { value: "points", label: t("point-status"), icon: "mdi-podium" },
  {
    value: "stats",
    label: t("general-statistics"),
    icon: "mdi-chart-bar",
    disabled: !competitions.value.length,
  },
]);

watch(
  cupId,
  (id) => {
    tab.value = "points";
    return id ? load(id) : clear();
  },
  { immediate: true },
);

onMounted(async () => {
  loadingList.value = true;
  try {
    const list = await CupService.list({ isPublic: true });
    for (const c of list) c.select = `${c.name} (${c.year})`;
    // newest first
    cups.value = list.sort((a, b) => Number(b.year) - Number(a.year));
  } catch (err) {
    listFailed.value = true;
    console.error(err.message);
  } finally {
    loadingList.value = false;
  }
});
</script>

<style scoped>
.public {
  max-width: 1400px;
  margin: 0 auto;
}
.public__select {
  flex: 0 1 420px;
  min-width: 260px;
}
</style>
