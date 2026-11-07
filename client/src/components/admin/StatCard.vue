<template>
  <!-- One "total / own" count on the admin overview -->
  <v-row>
    <v-col md="6" offset-md="3">
      <template v-if="loading">
        <h3 :class="{ 'text-white': store.getTheme }">
          {{ $t("loading") }} {{ label }}...
        </h3>
        <ProgressBarQuery />
      </template>
      <v-card v-else elevation="5" class="pa-2">
        <p class="flow-text">
          <v-icon :color="iconColor" class="mr-1">{{ icon }}</v-icon>
          <template v-if="total">
            {{ label }} {{ $t("total") }}: {{ total }}
            <template v-if="own !== null">
              <br />
              <v-icon>mdi-arrow-right-bold</v-icon>
              {{ $t("self-created") }} {{ own }}/{{ total }}
            </template>
          </template>
          <template v-else>{{ $t("no") }} {{ label }}!</template>
        </p>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { useMainStore } from "@/store";
import ProgressBarQuery from "../layout/ProgressBarQuery.vue";

defineProps({
  icon: { type: String, required: true },
  iconColor: { type: String, default: undefined },
  label: { type: String, required: true },
  total: { type: Number, default: 0 },
  own: { type: Number, default: null },
  loading: Boolean,
});
const store = useMainStore();
</script>
