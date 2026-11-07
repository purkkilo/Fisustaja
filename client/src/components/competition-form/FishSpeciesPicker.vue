<template>
  <!-- Pick fish species from the list or type new ones (Enter adds) -->
  <v-combobox
    v-model="species"
    v-model:search="search"
    item-title="text"
    :items="options"
    :hide-no-data="!search"
    :disabled="disabled"
    :label="$t('fish-species-prompt')"
    :maxlength="40"
    return-object
    hide-selected
    multiple
    clearable
    variant="solo"
  >
    <template v-slot:no-data>
      <v-list-item>
        <span
          >{{ $t("create") }} {{ $t("new") }} {{ $t("fish") }}
          {{ $t("with-enter") }}:
        </span>
        <v-chip :color="nextColor" label size="small" variant="flat">
          {{ search }}
        </v-chip>
      </v-list-item>
    </template>
    <template v-slot:selection="{ item }">
      <v-chip
        v-if="item === Object(item)"
        :color="item.color"
        label
        variant="flat"
      >
        <span class="pr-2">{{ item.text }}</span>
        <v-icon @click.stop="remove(item)" size="small">$delete</v-icon>
      </v-chip>
    </template>
    <template v-slot:item="{ index, item, props }">
      <v-list-item v-bind="props" :title="undefined">
        <v-text-field
          v-if="editing === item"
          v-model="editing.text"
          autofocus
          flat
          bg-color="transparent"
          :maxlength="40"
          :rules="rules.text"
          variant="solo"
          @click.stop
          @keyup.enter="toggleEdit(index, item)"
        ></v-text-field>
        <v-chip v-else :color="item.color" label variant="flat">
          {{ item.text }}
        </v-chip>
        <template v-slot:append>
          <v-btn
            icon
            variant="text"
            @click.stop.prevent="toggleEdit(index, item)"
          >
            <v-icon>{{ editing !== item ? "mdi-pencil" : "mdi-check" }}</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </template>
  </v-combobox>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRules } from "@/composables/useRules";

const species = defineModel({ type: Array, required: true });
defineProps({ disabled: { type: Boolean, default: false } });

const { locale } = useI18n();
const rules = useRules();

const DEFAULT_SPECIES = {
  fi: ["Ahven", "Hauki", "Kuha", "Lohi", "Taimen"],
  en: ["Perch", "Pike", "Zander", "Salmon", "Trout"],
};
const DEFAULT_COLORS = [
  "blue-lighten-1",
  "red-lighten-1",
  "green-lighten-1",
  "purple-lighten-1",
  "indigo-lighten-1",
];
const CUSTOM_COLORS = [
  "green-lighten-2",
  "purple-lighten-2",
  "indigo-lighten-2",
  "cyan-lighten-2",
  "teal-lighten-2",
  "orange-lighten-2",
];

const search = ref(null);
const editing = ref(null);
const custom = ref([]); // species typed in by the user

const options = computed(() => [
  ...(DEFAULT_SPECIES[locale.value] ?? DEFAULT_SPECIES.fi).map((text, id) => ({
    text,
    color: DEFAULT_COLORS[id],
    id,
  })),
  ...custom.value,
]);
const nextColor = computed(
  () => CUSTOM_COLORS[custom.value.length % CUSTOM_COLORS.length],
);

// Text typed + Enter arrives as a string: turn it into a species object
watch(species, (value) => {
  if (!value.some((v) => typeof v === "string")) return;
  species.value = value.map((v) => {
    if (typeof v !== "string") return v;
    const created = {
      text: v,
      color: nextColor.value,
      id: `custom-${custom.value.length}`,
    };
    custom.value.push(created);
    return created;
  });
});

function toggleEdit(index, item) {
  editing.value = editing.value ? null : item;
}

function remove(item) {
  species.value = species.value.filter((s) => s !== item);
}
</script>
