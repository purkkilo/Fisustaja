<template>
  <!-- Points multiplier and minimum size for each fish species -->
  <div>
    <p v-if="!specs.length" class="flow-text">
      {{ $t("errors.no-fish-selected") }}
    </p>
    <v-row v-for="(fish, index) in specs" :key="fish.name" class="align-center">
      <v-col>
        <span class="flow-text" :class="{ 'text-white': store.getTheme }"
          >{{ index + 1 }}. {{ fish.name }}</span
        >
      </v-col>
      <v-col class="input-fields">
        <v-text-field
          :label="$t('multiplier')"
          v-model="fish.multiplier"
          type="number"
          min="1"
          maxlength="4"
          :counter="4"
          :rules="rules.number"
          :disabled="disabled"
          @paste.prevent
        />
      </v-col>
      <v-col class="input-fields">
        <v-text-field
          :label="$t('min-size')"
          v-model="fish.minsize"
          :maxlength="40"
          :counter="40"
          :rules="rules.text"
          :disabled="disabled"
          @paste.prevent
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useMainStore } from "@/store";
import { useRules } from "@/composables/useRules";

// [{ name, multiplier, minsize }], edited in place
const specs = defineModel({ type: Array, required: true });
defineProps({ disabled: { type: Boolean, default: false } });

const store = useMainStore();
const rules = useRules();
</script>
