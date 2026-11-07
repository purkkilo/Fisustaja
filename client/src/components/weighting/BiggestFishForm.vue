<template>
  <!-- Optional: the boat's biggest single fish -->
  <div>
    <v-btn
      @click="visible = !visible"
      color="primary"
      :disabled="disabled || saving"
      ><v-icon>{{ visible ? "mdi-eye-off" : "mdi-eye" }}</v-icon
      >{{ visible ? $t("hide") : $t("weight-one-fish") }}</v-btn
    >
    <v-row v-if="saving" style="margin-top: 20px">
      <v-col>
        <p class="flow-text" :class="textClass">{{ $t("adding-fish") }}</p>
        <ProgressBarQuery />
      </v-col>
    </v-row>
    <v-row v-else-if="visible" class="align-center" style="margin-top: 20px">
      <v-col md="3">
        <p class="flow-text" :class="textClass">{{ $t("biggest-fish") }}?</p>
      </v-col>
      <v-col md="4">
        <v-select
          :label="$t('choose-fish')"
          v-model="fishName"
          item-title="name"
          item-value="name"
          :items="fishes"
          variant="outlined"
        >
          <template v-slot:selection="{ item }">
            <v-chip
              color="primary"
              closable
              @click:close="fishName = null"
              variant="flat"
            >
              {{ item.name }}
            </v-chip>
          </template>
        </v-select>
      </v-col>
      <v-col class="input-fields" md="3">
        <v-text-field
          :label="$t('weight-grams')"
          v-model="weight"
          type="number"
          @paste.prevent
          @keypress="isNumber($event)"
          step="50"
          min="0"
          :rules="weightRules"
        />
      </v-col>
      <v-col md="2">
        <v-btn
          v-if="fishName && weight"
          tile
          color="green"
          @click="emit('save')"
          size="large"
          ><v-icon>mdi-content-save</v-icon>{{ $t("save") }}</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useMainStore } from "@/store";
import { isNumber } from "@/utils/format";
import ProgressBarQuery from "../layout/ProgressBarQuery.vue";

defineProps({
  fishes: { type: Array, required: true },
  saving: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(["save"]);

const visible = defineModel("visible", { type: Boolean, default: false });
const fishName = defineModel("fishName", { type: String, default: null });
const weight = defineModel("weight", { type: [Number, String], default: null });

const { t } = useI18n();
const store = useMainStore();
const textClass = computed(() => ({ "text-white": store.getTheme }));
const weightRules = [
  (value) => !isNaN(value || "") || t("rules.not-number"),
  (value) => (value || "") >= 0 || t("rules.must-be-positive"),
];
</script>
