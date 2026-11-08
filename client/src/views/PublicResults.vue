<template>
  <!-- /public-results: results of any public competition -->
  <div class="fs-page public">
    <PageHead
      :title="$t('shell.public-comps')"
      :eyebrow="$t('shell.public')"
      tone="results"
    >
      <template #actions>
        <v-autocomplete
          v-model="selected"
          :items="competitions"
          item-title="select"
          item-value="_id"
          :label="$t('choose-comp')"
          :loading="loadingList"
          :no-data-text="$t('no') + ' ' + $t('comp.plural')"
          return-object
          hide-details
          prepend-inner-icon="mdi-magnify"
          class="public__select"
        >
          <template #item="{ item, props }">
            <v-list-item v-bind="props">
              <template #prepend>
                <v-icon
                  :color="item.isFinished ? 'results' : 'weighing'"
                  :icon="item.isFinished ? 'mdi-trophy' : 'mdi-timer-sand'"
                />
              </template>
            </v-list-item>
          </template>
        </v-autocomplete>
      </template>
    </PageHead>

    <PageHead
      v-if="selected"
      :title="selected.name"
      :subtitle="selectedMeta"
      tone="results"
    />
    <CompetitionResults
      v-if="selected"
      ref="resultsView"
      :competition-id="selected._id"
      public-only
    />
    <p v-else-if="!loadingList" class="fs-panel pa-8 fs-muted">
      {{ $t("results-page.pick-public") }}
    </p>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import CompetitionService from "../services/CompetitionService";
import CompetitionResults from "../components/results/CompetitionResults.vue";
import PageHead from "@/components/ui/PageHead.vue";
import { formatDateToLocaleDateString } from "@/utils/format";

defineOptions({ name: "PublicResults" });

const competitions = ref([]);
const selected = ref(null);
const loadingList = ref(false);
const resultsView = ref(null);

const selectedMeta = computed(() =>
  [
    selected.value?.locality,
    selected.value && formatDateToLocaleDateString(selected.value.start_date),
    selected.value?.cup_name,
  ]
    .filter(Boolean)
    .join(" · "),
);

onMounted(async () => {
  loadingList.value = true;
  try {
    const list = await CompetitionService.list({ isPublic: true });
    for (const c of list) {
      c.start_date = new Date(c.start_date);
      c.end_date = new Date(c.end_date);
      c.select = [
        c.name,
        formatDateToLocaleDateString(c.start_date),
        c.cup_name,
      ]
        .filter(Boolean)
        .join(" · ");
    }
    competitions.value = list.sort((a, b) => b.start_date - a.start_date);
  } catch (error) {
    console.error(error.message);
  } finally {
    loadingList.value = false;
  }
});
</script>

<style scoped>
.public {
  max-width: 1320px;
  margin: 0 auto;
}
.public__select {
  flex: 0 1 460px;
  min-width: 260px;
}
</style>
