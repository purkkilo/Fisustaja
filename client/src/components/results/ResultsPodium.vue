<template>
  <!-- Top three of the leaderboard -->
  <ol class="podium" :aria-label="$t('results-page.podium')">
    <li
      v-for="(row, i) in rows"
      :key="row.boat_number"
      class="podium__card"
      :class="{ 'podium__card--first': i === 0 }"
    >
      <PlacementBadge :placement="row.placement" class="podium__badge" />
      <div class="podium__who">
        <span class="font-weight-bold">{{ row.captain_name }}</span>
        <span class="text-body-small podium__meta"
          >{{ $t("results-page.boat", { n: row.boat_number })
          }}{{
            row.locality && row.locality !== "-" ? " · " + row.locality : ""
          }}</span
        >
      </div>
      <span class="fs-display fs-num podium__points">{{
        Number(row.total_points).toLocaleString("fi-FI")
      }}</span>
    </li>
  </ol>
</template>

<script setup>
import PlacementBadge from "./PlacementBadge.vue";

defineProps({ rows: { type: Array, default: () => [] } });
</script>

<style scoped>
.podium {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
@media (max-width: 800px) {
  .podium {
    grid-template-columns: minmax(0, 1fr);
  }
}
.podium__card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-radius: 14px;
  background: rgb(var(--v-theme-surface));
  border: 2px solid rgba(var(--v-theme-results), 0.35);
}
.podium__card--first {
  background: rgb(var(--v-theme-results));
  color: rgb(var(--v-theme-on-results));
  border-color: transparent;
}
.podium__card--first .podium__badge {
  background: #ffffff;
  color: #8a4b0f;
}
.podium__who {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}
.podium__meta {
  opacity: 0.85;
}
.podium__points {
  font-size: 28px;
}
</style>
