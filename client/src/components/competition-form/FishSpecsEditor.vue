<template>
  <!-- Editable fish species table: drag rows to reorder, add and delete rows -->
  <div>
    <table class="table_header fish-specs-table">
      <thead>
        <tr>
          <th>{{ $t("fish") }}</th>
          <th>{{ $t("multiplier") }}</th>
          <th>{{ $t("min-size") }}</th>
          <th v-if="!disabled"></th>
        </tr>
      </thead>
      <draggable
        v-model="fishes"
        tag="tbody"
        item-key="id"
        :disabled="disabled"
      >
        <template #item="{ element: fish, index }">
          <tr>
            <td class="cell">
              <v-text-field
                :label="$t('name')"
                v-model="fish.name"
                :maxlength="40"
                :counter="40"
                :rules="rules.text"
                :disabled="disabled"
              />
            </td>
            <td class="cell">
              <NumberStepper
                v-model="fish.multiplier"
                :label="$t('multiplier')"
                :step="0.5"
                :min="1"
                :maxlength="3"
                decimal
                :disabled="disabled"
              />
            </td>
            <td class="cell">
              <v-text-field
                :label="$t('min-size') + ' (cm)'"
                v-model="fish.minsize"
                :maxlength="40"
                :counter="40"
                :rules="rules.text"
                :disabled="disabled"
              />
            </td>
            <td v-if="!disabled" class="cell">
              <v-btn
                icon
                color="red-darken-4"
                variant="text"
                @click="askRemove(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </td>
          </tr>
        </template>
      </draggable>
    </table>
    <template v-if="!disabled">
      <p class="my-3">
        <b>{{ $t("create-competition.table-row-instruction") }}</b>
      </p>
      <v-btn
        color="green-darken-4"
        class="text-white"
        size="large"
        @click="emit('add')"
        ><v-icon color="green-lighten-2">mdi-plus-circle</v-icon>
        {{ $t("add") }} {{ $t("fish") }}</v-btn
      >
    </template>
  </div>
</template>

<script setup>
import draggable from "vuedraggable";
import { useI18n } from "vue-i18n";
import { confirm } from "@/plugins/alerts";
import { useRules } from "@/composables/useRules";
import NumberStepper from "./NumberStepper.vue";

const fishes = defineModel({ type: Array, required: true });
defineProps({ disabled: { type: Boolean, default: false } });
const emit = defineEmits(["add", "remove"]);

const { t } = useI18n();
const rules = useRules();

function askRemove(index) {
  confirm(
    t("confirm-dialog"),
    `${t("delete")} ${fishes.value[index].name}`,
    "question",
  )
    .then(() => emit("remove", index))
    .catch(() => {}); // cancelled
}
</script>

<style scoped>
.cell {
  border: 1px solid black;
}
</style>
