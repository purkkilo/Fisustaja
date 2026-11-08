<template>
  <!-- /weighting: queue | the boat on the scale | live standings -->
  <div class="fs-page">
    <v-skeleton-loader v-if="loadingSite" type="table" class="fs-panel" />
    <p v-else-if="!signees.length" class="fs-panel pa-8 fs-muted">
      {{ $t("comp-overview.no-signees") }}
    </p>
    <div v-else class="weighing">
      <WeighQueue
        class="weighing__queue"
        :on-water="onWaterSorted"
        :returned="returnedSorted"
        :selected-id="selectedBoat?._id ?? null"
        :saving="saving"
        @select="pick"
        @select-number="pickNumber"
        @all-returned="allReturnedClicked"
      />

      <section aria-labelledby="boat-title" class="fs-panel weighing__boat">
        <template v-if="selectedBoat">
          <div class="boat__head">
            <span class="boat__tile fs-display fs-num">{{
              selectedBoat.boat_number
            }}</span>
            <div class="boat__who">
              <h2 id="boat-title">{{ selectedBoat.captain_name }}</h2>
              <span>{{ boatMeta }}</span>
            </div>
            <div class="boat__points">
              <span class="fs-eyebrow">{{ $t("points") }}</span>
              <span class="fs-display fs-num boat__total">{{
                format(totalPoints)
              }}</span>
            </div>
          </div>

          <form class="boat__body" @submit.prevent="saveAndNext">
            <v-alert
              v-if="selectedBoat.returned"
              type="info"
              variant="tonal"
              density="compact"
              >{{ $t("weighing-page.already-weighed") }}</v-alert
            >
            <div class="boat__rows">
              <div class="boat__labels fs-muted">
                <span>{{ $t("fish") }}</span>
                <span>{{ $t("multiplier") }}</span>
                <span>{{ $t("weight-grams") }}</span>
                <span class="text-right">{{ $t("points") }}</span>
              </div>
              <FishWeightInput
                v-for="(w, i) in weights"
                :key="w.id"
                v-model="w.value"
                :name="w.name"
                :multiplier="w.multiplier"
                :minsize="w.minsize"
                :input-id="i === 0 ? 'first-weight' : undefined"
                :disabled="saving"
              />
            </div>

            <BiggestFishForm
              v-model:fish-name="biggestFishName"
              v-model:weight="biggestFishWeight"
              :fishes="competition?.fishes ?? []"
              :best-by-name="biggestByName"
              :is-new="isNewBiggest"
              :disabled="saving || savingFish"
            />

            <div class="d-flex flex-wrap ga-2">
              <v-btn
                type="submit"
                color="weighing"
                size="x-large"
                class="flex-grow-1"
                :loading="saving"
              >
                {{ $t("weighing-page.save-next") }}
                <kbd class="boat__kbd">Enter</kbd>
              </v-btn>
              <v-btn
                variant="outlined"
                size="x-large"
                :disabled="saving"
                @click="noCatch"
                >{{ $t("weighing-page.no-catch") }}</v-btn
              >
            </div>
            <div class="d-flex flex-wrap ga-2">
              <v-btn variant="text" @click="clear">{{ $t("cancel") }}</v-btn>
              <v-btn
                v-if="selectedBoat.returned"
                variant="text"
                color="error"
                :disabled="saving"
                @click="backOnWater"
                >{{ $t("weighing-page.back-on-water") }}</v-btn
              >
            </div>
          </form>
        </template>
        <div v-else class="boat__empty">
          <v-icon icon="mdi-scale" size="48" color="weighing" />
          <h2 id="boat-title">{{ $t("weighing-page.pick-boat") }}</h2>
          <p class="fs-muted">{{ $t("weighing-page.pick-boat-help") }}</p>
          <p v-if="notification" class="text-signing font-weight-bold">
            {{ $t(notification) }}
          </p>
        </div>
      </section>

      <LiveStandings class="weighing__live" :rows="liveStandings" />
    </div>
    <NotificationBar v-model:snackbar="snackbar" :text="text" />
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import { confirm } from "@/plugins/alerts";
import { t } from "@/i18n";
import { useWeighting } from "@/composables/useWeighting";
import NotificationBar from "../components/NotificationBar.vue";
import WeighQueue from "../components/weighting/WeighQueue.vue";
import BiggestFishForm from "../components/weighting/BiggestFishForm.vue";
import FishWeightInput from "../components/weighting/FishWeightInput.vue";
import LiveStandings from "../components/weighting/LiveStandings.vue";

defineOptions({ name: "Weighting" });

const {
  competition,
  signees,
  loadingSite,
  saving,
  savingFish,
  notification,
  selectedBoat,
  weights,
  biggestFishName,
  biggestFishWeight,
  biggestByName,
  isNewBiggest,
  liveStandings,
  stillOnWater,
  returned,
  totalPoints,
  load,
  selectBoat,
  selectBoatByNumber,
  returnWithoutCatch,
  clear,
  saveCatch,
  markAllReturned,
} = useWeighting();

const snackbar = ref(false);
const text = ref("");

const byNumber = (a, b) => Number(a.boat_number) - Number(b.boat_number);
const onWaterSorted = computed(() => [...stillOnWater.value].sort(byNumber));
const returnedSorted = computed(() => [...returned.value].sort(byNumber));
const boatMeta = computed(() =>
  [selectedBoat.value?.locality, selectedBoat.value?.starting_place]
    .filter((v) => v && v !== "-")
    .join(" · "),
);
const format = (n) => Number(n).toLocaleString("fi-FI");

function notify(message) {
  text.value = message;
  snackbar.value = false;
  nextTick(() => (snackbar.value = true));
}

function focus(id) {
  nextTick(() => document.getElementById(id)?.focus());
}

function pick(boat) {
  selectBoat(boat);
  focus("first-weight");
}

function pickNumber(number, done) {
  const found = selectBoatByNumber(number);
  done?.(found);
  if (found) focus("first-weight");
}

async function saveAndNext() {
  await saveCatch();
  if (!selectedBoat.value) {
    notify("notification.updated");
    focus("weigh-number");
  }
}

async function noCatch() {
  await returnWithoutCatch();
  notify("notification.updated");
  focus("weigh-number");
}

async function backOnWater() {
  const ok = await confirm(
    t("weighing-page.back-on-water-confirm", {
      n: selectedBoat.value.boat_number,
    }),
    t("weighing-page.back-on-water"),
    "question",
  ).catch(() => false);
  if (ok) await saveCatch({ reset: true });
}

async function allReturnedClicked() {
  const ok = await confirm(
    t("weighing-page.all-returned-confirm", { n: stillOnWater.value.length }),
    t("weighing-page.all-returned"),
    "question",
  ).catch(() => false);
  if (ok && (await markAllReturned())) notify("all-finished");
}

// The competition being run is remembered in localStorage
const stored = JSON.parse(localStorage.getItem("competition") || "null");
if (stored?._id) {
  load(stored._id);
} else {
  loadingSite.value = false;
}
</script>

<style scoped>
.weighing {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}
.weighing__queue {
  flex: 1 1 250px;
  min-width: 0;
}
.weighing__boat {
  flex: 2.4 1 520px;
  min-width: 0;
  overflow: hidden;
}
.weighing__live {
  flex: 1 1 260px;
  min-width: 0;
}
.boat__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
  padding: 22px 24px;
  background: rgb(var(--v-theme-weighing-soft));
}
.boat__tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background: rgb(var(--v-theme-weighing));
  color: #ffffff;
  font-size: 36px;
}
.boat__who {
  display: flex;
  flex-direction: column;
  flex: 1 1 200px;
}
.boat__who h2 {
  margin: 0;
  font-size: 26px;
}
.boat__points {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.boat__total {
  font-size: 46px;
  line-height: 1.05;
}
.boat__body {
  padding: 8px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.boat__labels {
  display: grid;
  grid-template-columns: minmax(110px, 1.2fr) 70px minmax(200px, 2fr) 90px;
  gap: 12px;
  padding: 12px 0 8px;
  font-size: 14px;
  font-weight: 700;
}
@media (max-width: 700px) {
  .boat__labels {
    display: none;
  }
}
.boat__kbd {
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.2);
  font: inherit;
  font-size: 12px;
}
.boat__empty {
  padding: 56px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}
.boat__empty h2 {
  margin: 0;
  font-size: 24px;
}
</style>
