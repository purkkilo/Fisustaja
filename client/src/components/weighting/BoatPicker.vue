<template>
  <!-- Search a boat by number or captain name -->
  <v-autocomplete
    :model-value="modelValue"
    :items="boats"
    :label="$t('choose-boat')"
    :hint="modelValue ? $t('chosen-boat') : $t('choose-boat')"
    :disabled="disabled"
    :custom-filter="matchesBoat"
    :item-title="(boat) => `${boat.boat_number} ${boat.captain_name}`"
    return-object
    single-line
    variant="outlined"
    @update:model-value="(boat) => emit('update:modelValue', boat)"
  >
    <template v-slot:selection="{ item }">
      <v-chip closable @click:close="emit('clear')">
        ({{ item.boat_number }}) {{ item.captain_name }},
        {{ item.temp_captain_name }}
      </v-chip>
    </template>
    <template v-slot:item="{ item, props }">
      <v-list-item v-bind="props" :title="undefined">
        <template v-slot:prepend>
          <v-icon v-if="item.returned" color="green"
            >mdi-checkbox-marked-circle</v-icon
          >
          <v-icon v-else color="yellow-darken-2">mdi-account-question</v-icon>
        </template>
        <v-list-item-title>{{ item.boat_number }}</v-list-item-title>
        <v-list-item-subtitle
          >{{ item.captain_name }},
          {{ item.temp_captain_name }}</v-list-item-subtitle
        >
        <template v-slot:append>
          <v-chip v-if="item.returned">{{
            placements.get(item.boat_number)
          }}</v-chip>
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup>
defineProps({
  modelValue: { type: Object, default: null },
  boats: { type: Array, required: true },
  // boat_number -> current placement
  placements: { type: Map, required: true },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue", "clear"]);

// Vuetify custom-filter: (value, query, internalItem)
function matchesBoat(value, query, internalItem) {
  const boat = internalItem.raw;
  const q = query.toLocaleLowerCase();
  return (
    (boat.captain_name || "").toLocaleLowerCase().includes(q) ||
    (boat.temp_captain_name || "").toLocaleLowerCase().includes(q) ||
    String(boat.boat_number).includes(query)
  );
}
</script>
