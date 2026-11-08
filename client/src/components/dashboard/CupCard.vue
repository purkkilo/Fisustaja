<template>
  <!-- One cup: visibility, how many of its competitions are done -->
  <button type="button" class="cup" @click="emit('open', cup)">
    <span class="cup__head">
      <span class="font-weight-bold">{{ cup.name }} {{ cup.year }}</span>
      <span class="fs-eyebrow cup__visibility">{{
        cup.isPublic ? $t("dashboard.public") : $t("dashboard.private")
      }}</span>
    </span>
    <span class="cup__body">
      <span class="d-flex align-center ga-3">
        <span aria-hidden="true" class="cup__bar">
          <span :style="{ width: percent + '%' }"></span>
        </span>
        <span class="fs-num text-body-small font-weight-bold">{{
          $t("dashboard.cup-progress", {
            done: progress.finished,
            total: progress.total,
          })
        }}</span>
      </span>
      <span class="fs-muted text-body-small">{{ countedText }}</span>
    </span>
  </button>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  cup: { type: Object, required: true },
  progress: { type: Object, default: () => ({ total: 0, finished: 0 }) },
});
const emit = defineEmits(["open"]);
const { t } = useI18n();

const percent = computed(() =>
  props.progress.total
    ? Math.round((props.progress.finished / props.progress.total) * 100)
    : 0,
);
const countedText = computed(() =>
  props.cup.meaningful_competitions > 0
    ? t("dashboard.best-counted", { n: props.cup.meaningful_competitions })
    : t("dashboard.all-counted"),
);
</script>

<style scoped>
.cup {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 16px;
  overflow: hidden;
  background: rgb(var(--v-theme-surface));
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.cup:hover,
.cup:focus-visible {
  border-color: rgb(var(--v-theme-signing));
}
.cup__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  background: rgb(var(--v-theme-signing-soft));
}
.cup__visibility {
  font-size: 12px;
}
.cup__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 18px 16px;
}
.cup__bar {
  flex: 1;
  height: 8px;
  border-radius: 999px;
  background: rgba(var(--v-border-color), 0.12);
  overflow: hidden;
}
.cup__bar > span {
  display: block;
  height: 100%;
  background: rgb(var(--v-theme-signing));
}
</style>
