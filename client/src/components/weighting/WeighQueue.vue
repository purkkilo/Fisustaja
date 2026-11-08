<template>
  <!-- Pick the boat to weigh: type its number, or click one on the water -->
  <section aria-labelledby="queue-title" class="fs-panel queue">
    <form class="d-flex flex-column ga-2" @submit.prevent="submitNumber">
      <label for="weigh-number" class="font-weight-bold">{{
        $t("boat-number")
      }}</label>
      <input
        id="weigh-number"
        v-model="number"
        inputmode="numeric"
        autocomplete="off"
        :placeholder="$t('weighing-page.type-number')"
        class="queue__input fs-display fs-num"
      />
      <span v-if="notFound" class="text-error text-body-small">{{
        $t("errors.no-boat-found")
      }}</span>
    </form>

    <div class="d-flex align-center justify-space-between">
      <h2 id="queue-title">{{ $t("comp-overview.still-on-water") }}</h2>
      <span class="queue__count fs-num">{{ onWater.length }}</span>
    </div>
    <div class="queue__list">
      <button
        v-for="boat in onWater"
        :key="boat._id"
        type="button"
        class="queue__boat"
        :class="{ 'queue__boat--active': boat._id === selectedId }"
        @click="emit('select', boat)"
      >
        <span class="queue__badge fs-num">{{ boat.boat_number }}</span>
        <span>{{ boat.captain_name }}</span>
      </button>
      <p v-if="!onWater.length" class="fs-muted">{{ $t("all-finished") }}</p>
    </div>
    <v-btn
      v-if="onWater.length"
      variant="outlined"
      :loading="saving"
      @click="emit('all-returned')"
      >{{ $t("weighing-page.all-returned") }}</v-btn
    >

    <button
      type="button"
      class="queue__toggle"
      :aria-expanded="showReturned"
      @click="showReturned = !showReturned"
    >
      {{ $t("weighing-page.weighed", { n: returned.length }) }}
      <v-icon
        :icon="showReturned ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        size="18"
      />
    </button>
    <div v-if="showReturned" class="queue__list">
      <button
        v-for="boat in returned"
        :key="boat._id"
        type="button"
        class="queue__boat"
        :class="{ 'queue__boat--active': boat._id === selectedId }"
        @click="emit('select', boat)"
      >
        <span class="queue__badge queue__badge--done fs-num">{{
          boat.boat_number
        }}</span>
        <span>{{ boat.captain_name }}</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  onWater: { type: Array, default: () => [] },
  returned: { type: Array, default: () => [] },
  selectedId: { type: String, default: null },
  saving: Boolean,
});
const emit = defineEmits(["select", "select-number", "all-returned"]);

const number = ref("");
const notFound = ref(false);
const showReturned = ref(false);

function submitNumber() {
  if (!number.value) return;
  emit("select-number", number.value, (found) => {
    notFound.value = !found;
    if (found) number.value = "";
  });
}
</script>

<style scoped>
.queue {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.queue h2 {
  margin: 0;
  font-size: 18px;
}
.queue__input {
  height: 56px;
  box-sizing: border-box;
  padding: 0 16px;
  border: 2px solid rgb(var(--v-theme-weighing));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
  color: inherit;
  font-size: 24px;
  font-weight: 700;
}
.queue__input:focus {
  outline: 3px solid rgba(var(--v-theme-weighing), 0.35);
}
.queue__count {
  padding: 2px 12px;
  border-radius: 999px;
  background: rgb(var(--v-theme-weighing));
  color: #ffffff;
  font-weight: 700;
}
.queue__list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.queue__boat {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 50px;
  padding: 6px 10px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.queue__boat:hover {
  border-color: rgb(var(--v-theme-weighing));
}
.queue__boat--active {
  border: 0;
  background: rgb(var(--v-theme-weighing));
  color: #ffffff;
  font-weight: 700;
}
.queue__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  height: 32px;
  border-radius: 9px;
  background: rgb(var(--v-theme-weighing-soft));
  color: rgb(var(--v-theme-on-surface));
  font-weight: 700;
}
.queue__boat--active .queue__badge {
  background: #ffffff;
  color: #13344a;
}
.queue__badge--done {
  background: rgb(var(--v-theme-signing-soft));
}
.queue__toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0 0;
  border: 0;
  background: transparent;
  color: rgb(var(--v-theme-primary));
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
</style>
