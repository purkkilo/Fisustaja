<template>
  <!-- /cup-overview: manage a cup, its competitions and signees -->
  <div class="fs-page cup">
    <PageHead
      :title="cup ? `${cup.name} ${cup.year}` : $t('cup.normal')"
      :eyebrow="$t('cup.normal')"
      :subtitle="subtitle"
      tone="results"
    >
      <template v-if="cup" #badges>
        <v-chip
          size="small"
          variant="tonal"
          :color="cup.isPublic ? 'signing' : undefined"
          :prepend-icon="cup.isPublic ? 'mdi-earth' : 'mdi-lock-outline'"
          >{{
            cup.isPublic ? $t("dashboard.public") : $t("dashboard.private")
          }}</v-chip
        >
      </template>
      <template v-if="cup" #actions>
        <ShareLinkButton
          :to="{ name: 'PublicCups', params: { id: cup._id } }"
          :title="`${cup.name} ${cup.year}`"
          :text="$t('share.public-link')"
          :disabled="!cup.isPublic"
          :disabled-hint="$t('share.cup-publish-first')"
        />
        <v-btn
          variant="outlined"
          :prepend-icon="cup.isPublic ? 'mdi-lock-outline' : 'mdi-earth'"
          :loading="saving"
          @click="toggleCupPublic"
          >{{
            cup.isPublic ? $t("button.set-private") : $t("button.set-public")
          }}</v-btn
        >
        <v-btn
          color="signing"
          prepend-icon="mdi-plus"
          @click="
            router.push({ path: '/register-comp', query: { cup: cup._id } })
          "
          >{{ $t("dashboard.new-competition") }}</v-btn
        >
      </template>
    </PageHead>

    <v-alert v-if="!cupId" type="info" variant="tonal">
      {{ $t("errors.no-cup-selected") }}
      <template #append>
        <v-btn to="/dashboard" variant="text">{{ $t("shell.home") }}</v-btn>
      </template>
    </v-alert>
    <v-skeleton-loader
      v-else-if="loading && !cup"
      type="heading, table"
      class="fs-panel"
    />
    <v-alert v-else-if="!cup" type="error" variant="tonal">
      {{ $t("errors.no-cup-selected") }}
    </v-alert>

    <template v-else>
      <PillTabs v-model="tab" :items="tabs" :label="$t('cup-page.views')" />

      <!-- Overview: competitions, signee list and the cup's details -->
      <div v-if="tab === 'overview'" class="cup__grid">
        <div class="cup__main">
          <FsSection
            icon="mdi-calendar-multiple"
            :title="$t('comp.plural')"
            flush
          >
            <template #actions>
              <v-text-field
                v-model="compSearch"
                :label="$t('search')"
                prepend-inner-icon="mdi-magnify"
                density="compact"
                hide-details
                clearable
                class="cup__search"
              />
            </template>
            <CupCompetitionsTable
              :competitions="allCompetitions"
              :search="compSearch || ''"
              :loading="updating"
              @toggle-finished="toggleCompetitionFinished"
              @toggle-public="toggleCompetitionPublic"
              @open="openCompetition"
            />
          </FsSection>

          <FsSection
            icon="mdi-account-group-outline"
            tone="signing"
            :title="$t('cup-page.boats')"
            flush
          >
            <template #badges>
              <span class="fs-muted font-weight-bold"
                >({{ signees.length }})</span
              >
            </template>
            <template #actions>
              <v-text-field
                v-model="signeeSearch"
                :label="$t('search-signee')"
                prepend-inner-icon="mdi-magnify"
                density="compact"
                hide-details
                clearable
                bg-color="surface"
                class="cup__search"
              />
              <v-btn
                variant="outlined"
                prepend-icon="mdi-file-pdf-box"
                :disabled="!signees.length"
                @click="pdfDialog = true"
                >PDF</v-btn
              >
              <v-btn
                color="signing"
                prepend-icon="mdi-plus"
                :loading="saving"
                @click="openSigneeDialog(null)"
                >{{ $t("add") }}</v-btn
              >
            </template>
            <v-data-table
              :headers="signeeColumns"
              :items="signees"
              :search="signeeSearch || ''"
              :loading="saving"
              density="comfortable"
            >
              <template #[`item.boat_number`]="{ item }">
                <span class="cup__boat fs-num">{{ item.boat_number }}</span>
              </template>
              <template #[`item.actions`]="{ item }">
                <div class="d-flex justify-end ga-1">
                  <v-btn
                    icon="mdi-pencil-outline"
                    variant="text"
                    size="small"
                    :aria-label="`${$t('edit')} ${item.captain_name}`"
                    :disabled="saving"
                    @click.stop="openSigneeDialog(item)"
                  />
                  <v-btn
                    icon="mdi-delete-outline"
                    variant="text"
                    size="small"
                    color="error"
                    :aria-label="`${$t('delete')} ${item.captain_name}`"
                    :disabled="saving"
                    @click.stop="askDeleteSignee(item)"
                  />
                </div>
              </template>
            </v-data-table>
          </FsSection>
        </div>

        <div class="cup__side">
          <div class="cup__tiles">
            <StatTile
              tone="results"
              icon="mdi-flag-checkered"
              :label="$t('cup-page.finished')"
              :value="`${finishedCount} / ${allCompetitions.length}`"
              :progress="
                allCompetitions.length
                  ? (finishedCount / allCompetitions.length) * 100
                  : 0
              "
              :note="countedText"
            />
            <StatTile
              tone="signing"
              icon="mdi-sail-boat"
              :label="$t('cup-page.boats')"
              :value="signees.length"
            />
          </div>

          <FsSection icon="mdi-pencil-outline" :title="$t('cup-page.details')">
            <form class="d-flex flex-column ga-3" @submit.prevent="saveDetails">
              <v-text-field
                v-model="cupName"
                :label="$t('name')"
                maxlength="40"
                hide-details="auto"
              />
              <v-text-field
                v-model="cupYear"
                :label="$t('year')"
                type="number"
                maxlength="4"
                hide-details="auto"
              />
              <v-btn
                type="submit"
                color="signing"
                variant="tonal"
                prepend-icon="mdi-check"
                :loading="saving"
                >{{ $t("save") }}</v-btn
              >
            </form>
          </FsSection>
        </div>
      </div>

      <CupPoints
        v-else-if="tab === 'points'"
        :competitions="competitions"
        :all-competitions="allCompetitions"
        :results="standings"
        :is-results="isResults"
        :loading="loading"
        :select-numbers="selectNumbers"
        :headers="headers"
        :cup="cup"
        @change="setHeaderLabel"
        @refresh="() => load(cup._id)"
        @calculate="recalculate"
        @save="(options) => savePdf('Tulokset', options)"
        @sort="setShowUnfinished"
      />

      <CupStats
        v-else-if="tab === 'stats' && !loading"
        :competitions="competitions"
        :cup="cup"
        :all_signees="allResults"
        :biggest_fishes="biggestFishes"
        :biggest_amounts="biggestAmounts"
        :loading="loading"
      />
    </template>

    <SigneeDialog
      v-model="signeeDialog"
      :signee="editedSignee"
      :next-number="nextBoatNumber()"
      :error="signeeError"
      :saving="saving"
      @save="saveSignee"
    />
    <PdfSettingsDialog
      v-model="pdfDialog"
      v-model:landscape="isLandscape"
      @download="savePdf('Ilmoittautuneet', { isLandscape })"
    />
    <NotificationBar v-model:snackbar="snackbar" :text="text" />
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useMainStore } from "@/store";
import { confirm } from "@/plugins/alerts";
import { useCupOverview } from "@/composables/useCupOverview";
import NotificationBar from "../components/NotificationBar.vue";
import PdfSettingsDialog from "../components/PdfSettingsDialog.vue";
import CupPoints from "../components/CupPoints.vue";
import CupCompetitionsTable from "../components/cup/CupCompetitionsTable.vue";
import SigneeDialog from "../components/cup/SigneeDialog.vue";
import PageHead from "../components/ui/PageHead.vue";
import FsSection from "../components/ui/FsSection.vue";
import PillTabs from "../components/ui/PillTabs.vue";
import StatTile from "../components/ui/StatTile.vue";
import ShareLinkButton from "../components/ui/ShareLinkButton.vue";

defineOptions({ name: "CupOverview" });

// Statistics bring chart.js with them: load them when the tab is opened
const CupStats = defineAsyncComponent(
  () => import("../components/CupStats.vue"),
);

const { t } = useI18n();
const router = useRouter();
const store = useMainStore();
const {
  loading,
  cup,
  allCompetitions,
  competitions,
  allResults,
  signees,
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
  saving,
  updating,
  signeeError,
  saveCupDetails,
  toggleCupPublic,
  toggleCompetitionPublic,
  toggleCompetitionFinished,
  nextBoatNumber,
  addSignee,
  editSignee,
  deleteSignee,
} = useCupOverview();

const cupId = localStorage.getItem("cup");
const tab = ref("overview");
const compSearch = ref("");
const signeeSearch = ref("");
const pdfDialog = ref(false);
const isLandscape = ref(false);
const cupName = ref("");
const cupYear = ref("");
const signeeDialog = ref(false);
const editedSignee = ref(null);

const tabs = computed(() => [
  {
    value: "overview",
    label: t("overview"),
    icon: "mdi-view-dashboard-outline",
  },
  {
    value: "points",
    label: t("point-status"),
    icon: "mdi-podium",
    disabled: !allCompetitions.value.length,
  },
  {
    value: "stats",
    label: t("general-statistics"),
    icon: "mdi-chart-bar",
    disabled: !competitions.value.length,
  },
]);

const finishedCount = computed(
  () => allCompetitions.value.filter((c) => c.isFinished).length,
);
const countedText = computed(() =>
  cup.value?.meaningful_competitions > 0
    ? t("dashboard.best-counted", { n: cup.value.meaningful_competitions })
    : t("dashboard.all-counted"),
);
const subtitle = computed(() =>
  cup.value
    ? t("dashboard.cup-progress", {
        done: finishedCount.value,
        total: allCompetitions.value.length,
      })
    : "",
);

const signeeColumns = computed(() => [
  { key: "boat_number", title: t("boat-number-short"), width: 80 },
  { key: "captain_name", title: t("captain-name") },
  { key: "temp_captain_name", title: t("temp-captain-name") },
  { key: "locality", title: t("locality-team") },
  { key: "actions", title: "", sortable: false, align: "end" },
]);

watch(cup, (c) => {
  cupName.value = c?.name ?? "";
  cupYear.value = c?.year ?? "";
});

function saveDetails() {
  saveCupDetails(cupName.value, cupYear.value);
}

function openSigneeDialog(signee) {
  signeeError.value = "";
  editedSignee.value = signee;
  signeeDialog.value = true;
}

async function saveSignee(form) {
  const ok = editedSignee.value
    ? await editSignee(editedSignee.value, form)
    : await addSignee(form);
  if (ok) signeeDialog.value = false;
}

function askDeleteSignee(signee) {
  confirm(t("confirm-dialog"), t("button.delete-signee"), "warning")
    .then(() => deleteSignee(signee))
    .catch(() => {}); // cancelled
}

// Make it the "current competition" and go to its overview
function openCompetition(competition) {
  store.competition = competition;
  localStorage.setItem(
    "competition",
    JSON.stringify({
      _id: competition._id,
      start_date: competition.start_date,
      end_date: competition.end_date,
    }),
  );
  router.push({ path: "/overview" });
}

onMounted(() => {
  if (cupId) load(cupId);
});
</script>

<style scoped>
.cup {
  max-width: 1400px;
}
.cup__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}
.cup__main {
  flex: 3 1 620px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.cup__side {
  flex: 1 1 280px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.cup__tiles {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.cup__search {
  width: 220px;
}
.cup__boat {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 30px;
  padding: 0 8px;
  border-radius: 8px;
  background: rgb(var(--v-theme-signing-soft));
  font-weight: 700;
}
</style>
