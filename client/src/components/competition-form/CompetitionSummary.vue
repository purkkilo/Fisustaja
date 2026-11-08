<template>
  <!-- Read-only overview of a competition's settings -->
  <div class="csummary">
    <dl class="csummary__list">
      <div>
        <dt>{{ $t("comp.normal") }}</dt>
        <dd>{{ info.name }}</dd>
      </div>
      <div>
        <dt>{{ $t("locality") }}</dt>
        <dd>{{ info.locality }}</dd>
      </div>
      <div>
        <dt>{{ $t("date") }}</dt>
        <dd>
          {{ formatDate(info.start_date) }} – {{ formatDate(info.end_date) }}
        </dd>
      </div>
      <div>
        <dt>{{ $t("overview-page.team") }}</dt>
        <dd>{{ info.isTeamCompetition ? $t("yes") : $t("no") }}</dd>
      </div>
      <div>
        <dt>{{ $t("cup.normal") }}</dt>
        <dd>
          {{
            info.isCupCompetition ? info.cup_name : $t("overview-page.no-cup")
          }}
        </dd>
      </div>
      <template v-if="info.isCupCompetition">
        <div>
          <dt>{{ $t("overview-page.cup-multiplier") }}</dt>
          <dd>× {{ info.cup_points_multiplier }}</dd>
        </div>
        <div>
          <dt>{{ $t("participation-points") }}</dt>
          <dd>{{ info.cup_participation_points }}</dd>
        </div>
      </template>
    </dl>

    <template v-if="info.isCupCompetition && info.cup_placement_points?.length">
      <span class="csummary__label">{{ $t("placement-points") }}</span>
      <div class="d-flex flex-wrap ga-2">
        <span
          v-for="p in info.cup_placement_points"
          :key="p.placement"
          class="csummary__pill fs-num"
          >#{{ p.placement }} <strong>{{ p.points }} p</strong></span
        >
      </div>
    </template>

    <span class="csummary__label">{{ $t("fish-specs") }}</span>
    <ul class="csummary__fishes">
      <li v-for="fish in fishes" :key="fish.id ?? fish.name">
        <span
          aria-hidden="true"
          class="csummary__dot"
          :style="{ background: fish.color || 'currentColor' }"
        ></span>
        <strong>{{ fish.name }}</strong>
        <span class="fs-muted"
          >× {{ fish.multiplier }} · {{ $t("min-size") }}
          {{ fish.minsize }} cm</span
        >
      </li>
    </ul>
  </div>
</template>

<script setup>
import { formatDate } from "@/utils/format";

defineProps({
  // the competition's basic info as saved (or as it will be saved)
  info: { type: Object, required: true },
  fishes: { type: Array, required: true },
});
</script>

<style scoped>
.csummary {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.csummary__list {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0 24px;
}
.csummary__list > div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.csummary__list dt {
  color: rgb(var(--v-theme-muted));
  font-weight: 600;
}
.csummary__list dd {
  margin: 0;
  font-weight: 600;
  text-align: right;
}
.csummary__label {
  margin-top: 8px;
  font-weight: 700;
}
.csummary__pill {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgb(var(--v-theme-results-soft));
  font-size: 14px;
}
.csummary__fishes {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.csummary__fishes li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 12px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.csummary__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>
