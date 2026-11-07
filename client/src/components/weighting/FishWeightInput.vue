<template>
  <!-- Weight of one fish species, with a dialog for adding more to it -->
  <v-row class="justify-center align-center">
    <v-col md="6">
      <span class="text-body-large" :class="textClass">
        {{ index + 1 }}. {{ name }}
      </span>
    </v-col>
    <v-col md="4" class="input-fields">
      <v-text-field
        :label="$t('weight-grams')"
        :model-value="modelValue"
        type="number"
        @update:model-value="(v) => emit('update:modelValue', v)"
        @paste.prevent
        @keypress="isNumber($event)"
        step="50"
        min="0"
        :rules="weightRules"
        :loading="loading"
        :disabled="disabled"
      />
    </v-col>
    <v-col md="2">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ props }">
          <v-btn color="primary" v-bind="props" :disabled="disabled"
            ><v-icon>mdi-plus</v-icon>{{ $t("add-calculation") }}</v-btn
          >
        </template>
        <v-card>
          <v-card-title>
            <span class="text-headline-small">{{ $t("add-together") }}</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col md="6" offset-md="3">
                <v-text-field
                  :label="$t('value-original')"
                  :model-value="current"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="6" offset-md="3">
                <v-text-field
                  v-model="addition"
                  :label="$t('value-to-add')"
                  type="number"
                  @paste.prevent
                  @keypress="isNumber($event)"
                  step="50"
                  min="0"
                  single-line
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="6" offset-md="3" class="text-red">
                <v-text-field
                  :model-value="sum"
                  :label="$t('sum')"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red-darken-1" @click="close" variant="outlined">{{
              $t("cancel")
            }}</v-btn>
            <v-btn
              color="green-darken-1"
              @click="addToWeight"
              variant="outlined"
              >{{ $t("save") }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useMainStore } from "@/store";
import { isNumber } from "@/utils/format";

const props = defineProps({
  modelValue: { type: [Number, String], default: null },
  name: { type: String, required: true },
  index: { type: Number, required: true },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue"]);

const { t } = useI18n();
const store = useMainStore();
const textClass = computed(() => ({ "text-white": store.isDark }));

const weightRules = [
  (value) => !isNaN(value || "") || t("rules.not-number"),
  (value) => (value || "") >= 0 || t("rules.must-be-positive"),
];

const dialog = ref(false);
const addition = ref(null);
const current = computed(() => parseInt(props.modelValue) || 0);
const sum = computed(() => current.value + (parseInt(addition.value) || 0));

function close() {
  addition.value = null;
  dialog.value = false;
}

function addToWeight() {
  emit("update:modelValue", sum.value);
  close();
}
</script>
