<template>
  <!-- Totals for the boat being weighed, before saving -->
  <v-card tile variant="outlined">
    <v-card-title>{{ $t("overview") }}</v-card-title>
    <v-list density="compact">
      <v-list-item prepend-icon="mdi-sail-boat" :subtitle="$t('boat')">
        <v-list-item-title>
          <h3>
            ({{ boat.boat_number }}) {{ boat.captain_name }},
            {{ boat.temp_captain_name }}
          </h3>
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-weight-gram"
        :subtitle="$t('total-weights')"
      >
        <v-list-item-title>
          <h3>{{ totalWeight.toLocaleString() }} g</h3>
        </v-list-item-title>
      </v-list-item>
      <v-list-item prepend-icon="mdi-counter" :subtitle="$t('total-points')">
        <v-list-item-title>
          <h3>{{ totalPoints.toLocaleString() }} p</h3>
        </v-list-item-title>
      </v-list-item>
      <v-list-item prepend-icon="mdi-pound-box" :subtitle="$t('placement')">
        <v-list-item-title>
          <h3>#{{ placement }}</h3>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
defineProps({
  boat: { type: Object, required: true },
  totalWeight: { type: Number, required: true },
  totalPoints: { type: Number, required: true },
  placement: { type: Number, required: true },
});
</script>
