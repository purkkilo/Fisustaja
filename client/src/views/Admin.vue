<template>
  <!-- /admin: users, cups and competitions of everyone -->
  <div class="fs-page admin">
    <PageHead
      :title="$t('shell.admin')"
      :eyebrow="$t('admin-page.eyebrow')"
      tone="muted"
    >
      <template #actions>
        <v-btn to="/register" color="signing" prepend-icon="mdi-account-plus">{{
          $t("shell.register-user")
        }}</v-btn>
      </template>
    </PageHead>

    <div class="admin__tiles">
      <StatTile
        icon="mdi-account-circle-outline"
        :label="$t('users-plural')"
        :value="users.length"
        :loading="loadingUsers"
      />
      <StatTile
        tone="weighing"
        icon="mdi-ferry"
        :label="$t('comp.plural')"
        :value="competitions.length"
        :note="$t('admin-page.own', { n: ownCompetitions.length })"
        :loading="loadingCompetitions"
      />
      <StatTile
        tone="results"
        icon="mdi-medal-outline"
        :label="$t('cup.plural')"
        :value="cups.length"
        :note="$t('admin-page.own', { n: ownCups.length })"
        :loading="loadingCups"
      />
    </div>

    <div class="admin__grid">
      <FsSection
        class="admin__users"
        icon="mdi-account-multiple-outline"
        :title="$t('users')"
      >
        <template #actions>
          <v-text-field
            v-model="userSearch"
            :label="$t('search')"
            prepend-inner-icon="mdi-magnify"
            density="compact"
            hide-details
            clearable
            class="admin__search"
          />
        </template>
        <v-skeleton-loader v-if="loadingUsers" type="list-item-avatar@4" />
        <UserList
          v-else-if="users.length"
          :users="users"
          :search="userSearch || ''"
          @copy="copy"
        />
        <p v-else class="fs-muted">{{ $t("no-users") }}</p>
      </FsSection>

      <FsSection
        class="admin__comps"
        icon="mdi-calendar-multiple"
        :title="$t('comp.plural')"
        flush
      >
        <template #actions>
          <v-text-field
            v-model="compSearch"
            :label="$t('search')"
            prepend-inner-icon="mdi-magnify"
            density="compact"
            hide-details
            clearable
            class="admin__search"
          />
        </template>
        <AdminCompetitionsTable
          :competitions="competitions"
          :search="compSearch || ''"
          :loading="loadingCompetitions"
          :deleting="deleting"
          @open="openCompetition"
          @delete="confirmDelete"
        />
      </FsSection>
    </div>
    <NotificationBar v-model:snackbar="snackbar" :text="text" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { t } from "@/i18n";
import { confirm } from "@/plugins/alerts";
import { useAdmin } from "@/composables/useAdmin";
import NotificationBar from "../components/NotificationBar.vue";
import UserList from "../components/admin/UserList.vue";
import AdminCompetitionsTable from "../components/admin/AdminCompetitionsTable.vue";
import PageHead from "../components/ui/PageHead.vue";
import FsSection from "../components/ui/FsSection.vue";
import StatTile from "../components/ui/StatTile.vue";

defineOptions({ name: "Admin" });

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

const userSearch = ref("");
const compSearch = ref("");

async function confirmDelete(competition) {
  const ok = await confirm(
    `${competition.name} — ${t("settings-page.delete-help")}`,
    t("button.delete-comp"),
    "warning",
  ).catch(() => false);
  if (ok) await deleteCompetition(competition);
}

onMounted(load);
</script>

<style scoped>
.admin {
  max-width: 1400px;
}
.admin__tiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.admin__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}
.admin__users {
  flex: 1 1 320px;
}
.admin__comps {
  flex: 2 1 560px;
}
.admin__search {
  width: 200px;
}
</style>
