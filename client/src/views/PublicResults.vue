<template>
  <!-- /public-results and /public-results/<id>: results of public
       competitions. The id in the address is what organizers share. -->
  <div class="fs-page public">
    <PageHead
      :title="$t('shell.public-comps')"
      :eyebrow="$t('shell.public')"
      tone="results"
    >
      <template #actions>
        <v-autocomplete
          :model-value="listed ? competitionId : null"
          :items="competitions"
          item-title="select"
          item-value="_id"
          :label="$t('choose-comp')"
          :loading="loadingList"
          :no-data-text="$t('no') + ' ' + $t('comp.plural')"
          hide-details
          clearable
          prepend-inner-icon="mdi-magnify"
          class="public__select"
          @update:model-value="open"
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

    <v-alert
      v-if="competitionId && notPublic"
      type="info"
      variant="tonal"
      icon="mdi-lock-outline"
    >
      {{ $t("public-page.not-found") }}
    </v-alert>

    <template v-else-if="competitionId">
      <PageHead
        v-if="shown"
        :title="shown.name"
        :subtitle="meta(shown)"
        tone="results"
      >
        <template #actions>
          <ShareLinkButton
            :to="{ name: 'PublicResults', params: { id: competitionId } }"
            :title="shown.name"
          />
        </template>
      </PageHead>
      <CompetitionResults
        :competition-id="competitionId"
        public-only
        live
        @loaded="(c) => (loaded = c)"
      />
    </template>

    <p v-else-if="!loadingList" class="fs-panel pa-8 fs-muted">
      {{ $t("public-page.pick") }}
    </p>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import CompetitionService from "../services/CompetitionService";
import CompetitionResults from "../components/results/CompetitionResults.vue";
import PageHead from "@/components/ui/PageHead.vue";
import ShareLinkButton from "@/components/ui/ShareLinkButton.vue";
import { usePageTitle } from "@/composables/usePageTitle";
import { formatDateToLocaleDateString } from "@/utils/format";

defineOptions({ name: "PublicResults" });
const route = useRoute();
const router = useRouter();

const competitions = ref([]);
const loadingList = ref(false);
const listFailed = ref(false);
const loaded = ref(null); // the competition as CompetitionResults loaded it

const competitionId = computed(() => route.params.id || null);
const listed = computed(() =>
  competitions.value.find((c) => c._id === competitionId.value),
);
// the list holds every public competition: an id missing from it is not public
const notPublic = computed(
  () =>
    !loadingList.value &&
    !listFailed.value &&
    !!competitionId.value &&
    !listed.value,
);
const shown = computed(() =>
  loaded.value?._id === competitionId.value ? loaded.value : listed.value,
);
usePageTitle(() => shown.value?.name);

const meta = (c) =>
  [c.locality, formatDateToLocaleDateString(c.start_date), c.cup_name]
    .filter(Boolean)
    .join(" · ");

// choosing from the list changes the address, so it can be shared as is
function open(id) {
  router.replace({ name: "PublicResults", params: { id: id || undefined } });
}

watch(competitionId, () => (loaded.value = null));

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
    listFailed.value = true;
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
