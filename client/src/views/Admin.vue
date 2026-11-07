<template>
  <!-- /admin: users, cups and competitions of everyone -->
  <v-container
    :class="{
      mobile: $vuetify.display.width < 800,
      browser: $vuetify.display.width >= 800,
      wide: $vuetify.display.width >= 1200,
    }"
  >
    <v-row v-if="prevRoute?.name">
      <v-col>
        <v-btn
          rounded
          color="yellow"
          size="large"
          prepend-icon="mdi-keyboard-return"
          @click="$router.push({ path: prevRoute.path })"
          >{{ $t("button.return-back") }}</v-btn
        >
      </v-col>
    </v-row>

    <v-tabs
      v-model="tab"
      slider-color="blue-darken-4"
      bg-color="blue-lighten-2"
      color="blue-darken-4"
      grow
      show-arrows
      next-icon="mdi-arrow-right-bold-box-outline"
      prev-icon="mdi-arrow-left-bold-box-outline"
      center-active
    >
      <v-tab value="overview">{{ $t("general") }}</v-tab>
      <v-tab value="users">{{ $t("users") }}</v-tab>
      <v-tab value="competitions">{{ $t("comp.plural") }}</v-tab>
    </v-tabs>

    <v-window v-model="tab" style="background: rgba(0, 0, 0, 0.4)">
      <v-window-item value="overview" :class="areaClass">
        <h1>{{ $t("general") }}</h1>
        <StatCard
          icon="mdi-account-circle"
          :label="$t('users-plural')"
          :total="users.length"
          :loading="loadingUsers"
        />
        <StatCard
          icon="mdi-ferry"
          :label="$t('comp.plural')"
          :total="competitions.length"
          :own="ownCompetitions.length"
          :loading="loadingCompetitions"
        />
        <StatCard
          icon="mdi-medal"
          icon-color="yellow-darken-1"
          :label="$t('cup.plural')"
          :total="cups.length"
          :own="ownCups.length"
          :loading="loadingCups"
        />
      </v-window-item>

      <v-window-item value="users" :class="areaClass">
        <h1>{{ $t("users") }}</h1>
        <p class="flow-text" :class="{ 'text-white': store.getTheme }">
          {{ $t("notification.click-name") }}
        </p>
        <v-row v-if="loadingUsers">
          <v-col md="10" offset-md="1">
            <v-skeleton-loader class="mx-auto" type="card" />
          </v-col>
        </v-row>
        <v-row v-else-if="users.length">
          <v-col
            md="6"
            offset-md="3"
            :class="{ 'bg-grey-darken-4': store.getTheme }"
          >
            <UserList :users="users" @copy="copy" />
          </v-col>
        </v-row>
        <h2 v-else :class="{ 'text-white': store.getTheme }">
          {{ $t("no-users") }}!
        </h2>
      </v-window-item>

      <v-window-item value="competitions" :class="areaClass">
        <v-row v-if="loadingCompetitions && !competitions.length">
          <v-col md="10" offset-md="1">
            <v-skeleton-loader class="mx-auto" type="card" />
          </v-col>
        </v-row>
        <AdminCompetitionsTable
          v-else-if="competitions.length"
          :competitions="competitions"
          :loading="loadingCompetitions"
          :deleting="deleting"
          @open="openCompetition"
          @delete="confirmDelete"
        />
        <h2 v-else :class="{ 'text-white': store.getTheme }">
          {{ $t("no") }} {{ $t("comp.plural") }}!
        </h2>
      </v-window-item>
    </v-window>
    <NotificationBar v-model:snackbar="snackbar" :text="text" />
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useMainStore } from "@/store";
import { t } from "@/i18n";
import { confirm } from "@/plugins/alerts";
import { usePreviousRoute } from "@/composables/usePreviousRoute";
import { useAdmin } from "@/composables/useAdmin";
import NotificationBar from "../components/NotificationBar.vue";
import StatCard from "../components/admin/StatCard.vue";
import UserList from "../components/admin/UserList.vue";
import AdminCompetitionsTable from "../components/admin/AdminCompetitionsTable.vue";

defineOptions({ name: "Admin" });
const store = useMainStore();
const prevRoute = usePreviousRoute();

const {
  users,
  cups,
  competitions,
  ownCups,
  ownCompetitions,
  loadingUsers,
  loadingCups,
  loadingCompetitions,
  deleting,
  snackbar,
  text,
  load,
  openCompetition,
  deleteCompetition,
  copy,
} = useAdmin();

const tab = ref("overview");
const areaClass = computed(() =>
  store.getTheme ? "inputarea-dark" : "inputarea",
);

async function confirmDelete(competition) {
  const ok = await confirm(
    `${t("confirm-dialog")} (${competition.name})`,
    t("button.delete-comp"),
    "question",
  ).catch(() => false);
  if (ok) await deleteCompetition(competition);
}

onMounted(load);
</script>

<style scoped>
h1,
h2 {
  font-weight: normal;
}
</style>
