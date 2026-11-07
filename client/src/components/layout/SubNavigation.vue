<template>
  <!-- v-bottom-navigation is a fixed layout bar in Vuetify 3+, so a button group is used instead -->
  <v-btn-toggle
    :model-value="selectedItem"
    mandatory
    color="primary"
    variant="text"
    class="d-flex w-100"
    style="background: transparent; margin-bottom: 10px; height: auto"
  >
    <v-tooltip v-for="(item, i) in items" :key="i" location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn
          class="flex-grow-1"
          :value="i"
          stacked
          @click="changePage(item.path)"
          v-bind="props"
        >
          <v-icon>{{ item.icon }}</v-icon>
          <span>{{ $t(item.text) }}</span>
        </v-btn>
      </template>
      <span v-if="type == 'public'">{{ $t(item.text) }}</span>
      <span v-else>{{ $t("comp.is") }} {{ $t(item.text) }}</span>
    </v-tooltip>
  </v-btn-toggle>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

defineOptions({ name: "PublicNavigation" });
const props = defineProps({
  items: { type: Array, default: () => [] },
  type: { type: String, default: "public" },
});
const router = useRouter();
const route = useRoute();

const selectedItem = ref(0);
const snackbar = ref(false);
const text = ref("");

watch(
  () => route.fullPath,
  () => {
    const to = route;
    selectedItem.value = props.items.findIndex((i) => i.path === to.path);
  },
);

function changePage(path) {
  if (route.path !== path) {
    router.push(path);
  } else {
    text.value = "errors.already-here";
    snackbar.value = true;
  }
}

onMounted(() => {
  selectedItem.value = props.items.findIndex((i) => i.path === route.path);
});
</script>

<style scoped></style>
