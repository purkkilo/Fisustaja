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
          v-model="selectedCup"
          :items="cups"
          item-title="select"
          item-value="_id"
          :label="`${$t('choose')} ${$t('cup.normal')}`"
          :loading="loadingList"
          :no-data-text="`${$t('cup.not-found')} ${$t('available')}`"
          return-object
          hide-details
          clearable
          prepend-inner-icon="mdi-magnify"
          class="public__select"
        />
      </template>
    </PageHead>

    <v-skeleton-loader
      v-if="loading && !cup"
      type="heading, table"
      class="fs-panel"
    />
    <template v-else-if="selectedCup && cup">
      <PageHead
        :title="`${cup.name} ${cup.year}`"
        :subtitle="
          $t('dashboard.cup-progress', {
            done: allCompetitions.filter((c) => c.isFinished).length,
            total: allCompetitions.length,
          })
        "
        tone="results"
      />
      <PillTabs v-model="tab" :items="tabs" :label="$t('cup-page.views')" />
      <CupPoints
        v-if="tab === 'points'"
        :competitions="competitions"
        :all-competitions="allCompetitions"
        :headers="headers"
        :cup="cup"
        :is-results="isResults"
        :loading="loading"
        :results="standings"
        :select-numbers="selectNumbers"
        @change="setHeaderLabel"
        @refresh="() => load(selectedCup._id)"
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
    <p v-else-if="!loadingList" class="fs-panel pa-8 fs-muted">
      {{ $t("cup-page.pick-public") }}
    </p>
    <NotificationBar v-model:snackbar="snackbar" :text="text" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import CupService from "../services/CupService";
import { useCupStandings } from "@/composables/useCupStandings";
import NotificationBar from "../components/NotificationBar.vue";
import CupPoints from "../components/CupPoints.vue";
import CupStats from "../components/CupStats.vue";
import PillTabs from "../components/ui/PillTabs.vue";
import PageHead from "../components/ui/PageHead.vue";

defineOptions({ name: "PublicCups" });
const { t } = useI18n();

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
const selectedCup = ref(null);
const loadingList = ref(false);
const tab = ref("points");

const tabs = computed(() => [
  { value: "points", label: t("point-status"), icon: "mdi-podium" },
  {
    value: "stats",
    label: t("general-statistics"),
    icon: "mdi-chart-bar",
    disabled: !competitions.value.length,
  },
]);

watch(selectedCup, (c) => {
  tab.value = "points";
  return c ? load(c._id) : clear();
});

onMounted(async () => {
  loadingList.value = true;
  try {
    const list = await CupService.list({ isPublic: true });
    for (const c of list) c.select = `${c.name} (${c.year})`;
    // newest first
    cups.value = list.sort((a, b) => Number(b.year) - Number(a.year));
  } catch (err) {
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
