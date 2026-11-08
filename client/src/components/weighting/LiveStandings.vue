<template>
  <!-- Standings while weighing; the boat on the scale shows where it lands -->
  <aside aria-labelledby="live-title" class="fs-panel live">
    <div class="live__head">
      <h2 id="live-title">{{ $t("weighing-page.standings") }}</h2>
      <span class="text-body-small font-weight-bold fs-num"
        >{{ rows.length }} {{ $t("weighing-page.weighed-short") }}</span
      >
    </div>
    <ol class="live__list">
      <li
        v-for="row in shown"
        :key="row._id + (row.preview ? '-preview' : '')"
        class="live__row"
        :class="{ 'live__row--preview': row.preview }"
      >
        <span class="live__place fs-num">{{ row.placement }}</span>
        <span class="live__name"
          >{{ row.captain_name }}
          <span class="live__no fs-num">#{{ row.boat_number }}</span></span
        >
        <span class="font-weight-bold fs-num">{{
          format(row.total_points)
        }}</span>
      </li>
      <li v-if="!rows.length" class="fs-muted py-3">{{ $t("no-results") }}</li>
    </ol>
    <div class="live__foot">
      <span
        v-if="preview"
        class="text-body-small font-weight-bold text-weighing"
        >{{
          $t("weighing-page.would-place", {
            n: preview.boat_number,
            place: preview.placement,
          })
        }}</span
      >
      <router-link to="/results" class="live__link"
        >{{ $t("weighing-page.full-leaderboard") }} →</router-link
      >
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // ranked rows; the boat being weighed has preview: true
  rows: { type: Array, default: () => [] },
  limit: { type: Number, default: 8 },
});

const preview = computed(() => props.rows.find((r) => r.preview) ?? null);
// top rows, and the preview row even if it falls below them
const shown = computed(() => {
  const top = props.rows.slice(0, props.limit);
  if (preview.value && !top.includes(preview.value)) top.push(preview.value);
  return top;
});
const format = (n) => Number(n).toLocaleString("fi-FI");
</script>

<style scoped>
.live {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.live__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  padding: 16px 20px;
  background: rgb(var(--v-theme-amber));
  color: #3b2604;
}
.live__head h2 {
  margin: 0;
  font-size: 19px;
}
.live__list {
  list-style: none;
  margin: 0;
  padding: 4px 20px 8px;
}
.live__row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 8px;
  margin: 0 -8px;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
}
.live__row--preview {
  background: rgb(var(--v-theme-weighing-soft));
}
.live__place {
  width: 24px;
  font-weight: 700;
}
.live__name {
  flex: 1;
  min-width: 0;
}
.live__no {
  font-size: 13px;
  opacity: 0.75;
}
.live__foot {
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.live__link {
  font-weight: 700;
  text-decoration: none;
  color: rgb(var(--v-theme-results));
  font-size: 14px;
}
</style>
