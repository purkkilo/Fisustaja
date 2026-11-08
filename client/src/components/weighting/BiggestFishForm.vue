<template>
  <!-- The boat's biggest single fish; flags a new leader of the species -->
  <div class="biggest">
    <v-select
      v-model="fishName"
      :items="fishes"
      item-title="name"
      item-value="name"
      :label="$t('biggest-fish')"
      clearable
      hide-details
      :disabled="disabled"
      class="biggest__species"
    />
    <v-text-field
      v-model="weight"
      :label="$t('weighing-page.weight')"
      inputmode="numeric"
      hide-details
      :disabled="disabled || !fishName"
      class="biggest__weight"
      @keypress="isNumber($event)"
    />
    <div class="biggest__note">
      <span v-if="isNew" class="biggest__badge">{{
        $t("weighing-page.new-leader")
      }}</span>
      <span v-if="best" class="text-body-small font-weight-bold">{{
        $t("weighing-page.best-so-far", {
          fish: fishName,
          weight: format(best.weight),
          boat: best.boat_number,
        })
      }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { isNumber } from "@/utils/format";

const props = defineProps({
  fishes: { type: Array, required: true },
  // name -> { weight, boat_number } of the heaviest fish saved so far
  bestByName: { type: Object, default: () => ({}) },
  isNew: Boolean,
  disabled: Boolean,
});
const fishName = defineModel("fishName", { type: String, default: null });
const weight = defineModel("weight", { type: [Number, String], default: null });

const best = computed(() =>
  fishName.value ? props.bestByName[fishName.value] : null,
);
const format = (n) => Number(n).toLocaleString("fi-FI");
</script>

<style scoped>
.biggest {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 14px;
  background: rgb(var(--v-theme-results-soft));
}
.biggest__species {
  flex: 1 1 160px;
}
.biggest__weight {
  flex: 1 1 130px;
}
.biggest__note {
  flex: 1 1 180px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.biggest__badge {
  padding: 3px 10px;
  border-radius: 999px;
  background: rgb(var(--v-theme-results));
  color: rgb(var(--v-theme-on-results));
  font-size: 13px;
  font-weight: 700;
}
</style>
