<template>
  <!-- Editable fish species list: drag rows to reorder, add and delete rows -->
  <div class="specs">
    <div class="specs__row specs__row--head" aria-hidden="true">
      <span></span>
      <span>{{ $t("fish") }}</span>
      <span>{{ $t("multiplier") }}</span>
      <span>{{ $t("min-size") }} (cm)</span>
      <span></span>
    </div>
    <draggable
      v-model="fishes"
      tag="ol"
      class="specs__list"
      item-key="id"
      handle=".specs__handle"
      :disabled="disabled"
    >
      <template #item="{ element: fish, index }">
        <li class="specs__row">
          <v-icon
            class="specs__handle"
            icon="mdi-drag-vertical"
            :aria-label="$t('create-competition.table-row-instruction')"
          />
          <v-text-field
            v-model="fish.name"
            :label="$t('name')"
            :maxlength="40"
            :rules="rules.text"
            :disabled="disabled"
            density="comfortable"
            hide-details="auto"
          />
          <NumberStepper
            v-model="fish.multiplier"
            :label="$t('multiplier')"
            :step="0.5"
            :min="1"
            :maxlength="3"
            decimal
            :disabled="disabled"
          />
          <v-text-field
            v-model="fish.minsize"
            :label="$t('min-size')"
            :maxlength="40"
            :rules="rules.text"
            :disabled="disabled"
            density="comfortable"
            hide-details="auto"
          />
          <v-btn
            v-if="!disabled"
            icon="mdi-delete-outline"
            variant="text"
            color="error"
            :aria-label="`${$t('delete')} ${fish.name}`"
            @click="askRemove(index)"
          />
        </li>
      </template>
    </draggable>
    <div v-if="!disabled" class="d-flex align-center flex-wrap ga-3">
      <v-btn
        color="signing"
        variant="tonal"
        prepend-icon="mdi-plus"
        @click="emit('add')"
        >{{ $t("add") }} {{ $t("fish") }}</v-btn
      >
      <span class="fs-muted text-body-small">{{
        $t("create-competition.table-row-instruction")
      }}</span>
    </div>
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
.specs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.specs__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.specs__row {
  display: grid;
  grid-template-columns:
    28px minmax(140px, 2fr) minmax(150px, 1.4fr) minmax(110px, 1fr)
    44px;
  align-items: start;
  gap: 10px;
}
.specs__row--head {
  font-size: 13px;
  font-weight: 700;
  color: rgb(var(--v-theme-muted));
}
.specs__handle {
  margin-top: 14px;
  cursor: grab;
  color: rgb(var(--v-theme-muted));
}
@media (max-width: 700px) {
  .specs__row {
    grid-template-columns: 28px minmax(0, 1fr) 44px;
  }
  .specs__row--head {
    display: none;
  }
  .specs__row > :nth-child(3),
  .specs__row > :nth-child(4) {
    grid-column: 2;
  }
}
</style>
