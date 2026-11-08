<template>
  <!-- /404 -->
  <div class="fs-page notfound">
    <div class="fs-panel notfound__card">
      <span class="fs-display fs-num notfound__code" aria-hidden="true"
        >404</span
      >
      <h1>{{ $t("notfound-page.title") }}</h1>
      <p class="fs-muted">{{ $t("notfound-page.text") }}</p>
      <div class="d-flex flex-wrap justify-center ga-3">
        <v-btn
          v-if="prevRoute?.name"
          variant="outlined"
          prepend-icon="mdi-arrow-left"
          @click="router.push(prevRoute.fullPath || prevRoute.path)"
          >{{ $t("button.return-back") }}</v-btn
        >
        <v-btn to="/" color="weighing" prepend-icon="mdi-home-outline">{{
          $t("notfound-page.home")
        }}</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { usePreviousRoute } from "@/composables/usePreviousRoute";

defineOptions({ name: "NotFound" });
const router = useRouter();
const prevRoute = usePreviousRoute();
</script>

<style scoped>
.notfound {
  min-height: calc(100vh - 160px);
  align-items: center;
  justify-content: center;
}
.notfound__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  max-width: 480px;
  padding: 40px 32px;
  text-align: center;
  border-radius: 22px;
}
.notfound__code {
  font-size: 72px;
  line-height: 1;
  color: rgb(var(--v-theme-weighing));
}
.notfound__card h1 {
  margin: 0;
  font-size: 26px;
}
.notfound__card p {
  margin: 0 0 8px;
}
</style>
