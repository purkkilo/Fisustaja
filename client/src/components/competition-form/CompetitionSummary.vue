<template>
  <!-- Read-only overview of a competition before it is saved -->
  <div>
    <h2 :class="textClass">{{ $t("basic-info") }}</h2>
    <v-list elevation="5" border class="my-4">
      <v-list-item prepend-icon="mdi-ferry" :title="$t('comp.normal')">
        <v-list-item-subtitle>
          <b>{{ info.name }} ({{ info.locality }})</b>
        </v-list-item-subtitle>
      </v-list-item>
      <template v-if="info.isCupCompetition">
        <v-divider></v-divider>
        <v-list-item :title="$t('cup.normal')">
          <template v-slot:prepend>
            <v-icon color="yellow-darken-1">mdi-medal</v-icon>
          </template>
          <v-list-item-subtitle
            ><b>{{ info.cup_name }}</b></v-list-item-subtitle
          >
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item :title="`${$t('comp.is')} ${$t('placement-points')}`">
          <template v-slot:prepend>
            <v-icon color="green">mdi-clipboard-check</v-icon>
          </template>
          <v-list-item-subtitle>
            <span
              v-for="p in info.cup_placement_points"
              :key="p.placement"
              class="mr-3"
              >#{{ p.placement }}: {{ p.points }}p</span
            >
          </v-list-item-subtitle>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          :title="`${$t('cup.normal')} ${$t('participation-points')}`"
        >
          <template v-slot:prepend>
            <v-icon color="green-darken-1">mdi-scoreboard</v-icon>
          </template>
          <v-list-item-subtitle
            ><b>{{ info.cup_participation_points }}</b></v-list-item-subtitle
          >
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          prepend-icon="mdi-close-outline"
          :title="`${$t('comp.is')} ${$t('cup.normal')} ${$t('multiplier')}`"
        >
          <v-list-item-subtitle
            ><b>{{ info.cup_points_multiplier }}</b></v-list-item-subtitle
          >
        </v-list-item>
      </template>
      <v-divider></v-divider>
      <v-list-item
        prepend-icon="mdi-account-multiple-outline"
        :title="`${$t('is-there')} ${$t('comp.is-team')}?`"
      >
        <v-list-item-subtitle>
          <b>{{ info.isTeamCompetition ? $t("yes") : $t("no") }}</b>
        </v-list-item-subtitle>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item prepend-icon="mdi-calendar-today" :title="$t('date')">
        <v-list-item-subtitle>
          <b
            >{{ formatDate(info.start_date) }} -
            {{ formatDate(info.end_date) }}</b
          >
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <h2 :class="textClass">{{ $t("fish-specs") }}</h2>
    <v-list elevation="5" border class="my-4">
      <v-list-item v-for="fish in fishes" :key="fish.id" :title="fish.name">
        <v-list-item-subtitle>
          <b>x {{ fish.multiplier }}</b> · {{ $t("min-size") }}
          <b>{{ fish.minsize }} cm</b>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useMainStore } from "@/store";
import { formatDate } from "@/utils/format";

defineProps({
  // the competition's basic info as it will be saved
  info: { type: Object, required: true },
  fishes: { type: Array, required: true },
});

const store = useMainStore();
const textClass = computed(() => ({ "text-white": store.getTheme }));
</script>
