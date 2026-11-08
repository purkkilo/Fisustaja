<template>
  <!-- Copies (or on phones shares) a link to a page; confirms in place.
       A disabled button gets no hover, so the wrapper carries the hint. -->
  <span class="d-inline-flex" :title="disabled ? disabledHint : undefined">
    <v-btn
      :variant="variant"
      :color="state === 'copied' || state === 'shared' ? 'signing' : color"
      :prepend-icon="icon"
      :disabled="disabled"
      :title="disabled ? undefined : url"
      @click="share"
      >{{ label }}</v-btn
    >
  </span>
  <span class="d-sr-only" role="status" aria-live="polite">{{
    state === "copied" ? $t("share.copied") : ""
  }}</span>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { absoluteUrl, shareLink } from "@/utils/share";

const props = defineProps({
  // route to share, e.g. { name: "PublicResults", params: { id } }
  to: { type: Object, required: true },
  // title for the phone's share sheet
  title: { type: String, default: "Fisustaja" },
  text: { type: String, default: "" },
  disabled: Boolean,
  // shown as a tooltip when disabled (why it can't be shared yet)
  disabledHint: { type: String, default: "" },
  variant: { type: String, default: "outlined" },
  color: { type: String, default: undefined },
});

const { t } = useI18n();
const router = useRouter();
const state = ref("idle"); // idle | copied | shared | failed
let reset = null;

const url = computed(() => absoluteUrl(router.resolve(props.to).href));
const label = computed(() => {
  if (state.value === "copied") return t("share.copied");
  if (state.value === "failed") return t("share.failed");
  return props.text || t("share.copy-link");
});
const icon = computed(() =>
  state.value === "copied" || state.value === "shared"
    ? "mdi-check"
    : state.value === "failed"
      ? "mdi-alert-circle-outline"
      : "mdi-link-variant",
);

async function share() {
  state.value = await shareLink({ url: url.value, title: props.title });
  clearTimeout(reset);
  reset = setTimeout(() => (state.value = "idle"), 2500);
}
onBeforeUnmount(() => clearTimeout(reset));
</script>
