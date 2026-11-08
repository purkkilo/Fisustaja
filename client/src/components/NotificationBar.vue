<template>
  <v-snackbar
    v-model="snackbar"
    class="fs-toast"
    :class="[
      isError ? 'fs-toast--error' : 'fs-toast--ok',
      { 'fs-toast--dark': isDark },
    ]"
    location="bottom"
    :timeout="timeout"
    rounded="lg"
    multi-line
  >
    <div class="fs-toast__body">
      <v-icon :icon="icon" size="20" />
      <span>{{ $t(text) }}</span>
    </div>
    <template #actions>
      <v-btn
        variant="text"
        icon="mdi-close"
        size="small"
        :aria-label="$t('close')"
        @click="snackbar = false"
      />
    </template>
  </v-snackbar>
</template>

<script setup>
import { computed } from "vue";
import { useTheme } from "vuetify";

defineOptions({ name: "NotificationBar" });
const props = defineProps({
  text: { type: String, default: "" },
});
const snackbar = defineModel("snackbar", { type: Boolean, default: false });
const theme = useTheme();

const isDark = computed(() => theme.global.current.value.dark);

const isError = computed(
  () =>
    props.text.startsWith("errors.") ||
    props.text.includes("failed") ||
    props.text.includes("not-matching") ||
    props.text.includes("something-wrong"),
);

const icon = computed(() =>
  isError.value ? "mdi-alert-circle-outline" : "mdi-check-circle-outline",
);

const timeout = computed(() => (isError.value ? 5000 : 2800));
</script>

<style scoped>
.fs-toast :deep(.v-snackbar__wrapper) {
  min-width: 0;
  max-width: min(420px, calc(100vw - 32px));
  padding: 4px 4px 4px 8px;
  border: 1px solid transparent;
  box-shadow: 0 12px 32px rgba(19, 52, 74, 0.22);
}
.fs-toast--ok :deep(.v-snackbar__wrapper) {
  background: #13344a;
  color: #fff;
}
.fs-toast--error :deep(.v-snackbar__wrapper) {
  background: #b3261e;
  color: #fff;
}
.fs-toast--dark.fs-toast--ok :deep(.v-snackbar__wrapper) {
  background: #d7e6ef;
  color: #13344a;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}
.fs-toast--dark.fs-toast--error :deep(.v-snackbar__wrapper) {
  background: #f2b8b5;
  color: #4a1410;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}
.fs-toast__body {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-weight: 600;
  line-height: 1.35;
  padding: 6px 0;
}
.fs-toast--dark :deep(.v-btn) {
  color: inherit;
}
</style>
