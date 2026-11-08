<template>
  <!-- Users; clicking one opens its details -->
  <ul class="users">
    <li v-for="user in filtered" :key="user._id">
      <v-menu
        :model-value="openId === user._id"
        location="bottom end"
        @update:model-value="(open) => (openId = open ? user._id : null)"
      >
        <template #activator="{ props }">
          <button v-bind="props" type="button" class="users__row">
            <span aria-hidden="true" class="users__avatar">{{
              initial(user)
            }}</span>
            <span class="users__text">
              <strong>{{ user.name }}</strong>
              <span class="fs-muted">{{ user.email }}</span>
            </span>
            <v-chip
              size="small"
              variant="tonal"
              :color="user.is_admin ? 'results' : 'signing'"
              :prepend-icon="roleIcon(user)"
              >{{ user.is_admin ? "Admin" : $t("user") }}</v-chip
            >
          </button>
        </template>
        <v-card min-width="320">
          <v-list density="comfortable">
            <v-list-item
              :prepend-icon="roleIcon(user)"
              :title="user.name"
              :subtitle="user.email"
            />
            <v-divider />
            <v-list-item
              prepend-icon="mdi-identifier"
              :title="user._id"
              subtitle="Id"
              @click="emit('copy', user._id)"
            />
            <v-list-item
              prepend-icon="mdi-calendar-check-outline"
              :title="formatDate(user.createdAt)"
              :subtitle="$t('created')"
              @click="emit('copy', user.createdAt)"
            />
          </v-list>
          <v-card-actions>
            <v-btn
              variant="tonal"
              prepend-icon="mdi-content-copy"
              @click="emit('copy', JSON.stringify(withoutUiState(user)))"
              >{{ $t("copy") }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-menu>
    </li>
  </ul>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  users: { type: Array, default: () => [] },
  search: { type: String, default: "" },
});
const emit = defineEmits(["copy"]);

const openId = ref(null);

const filtered = computed(() => {
  const q = props.search.trim().toLowerCase();
  if (!q) return props.users;
  return props.users.filter((u) =>
    [u.name, u.email].some((v) =>
      String(v ?? "")
        .toLowerCase()
        .includes(q),
    ),
  );
});

const initial = (user) => (user.name || "?").charAt(0).toUpperCase();
const roleIcon = (user) => (user.is_admin ? "mdi-shield-crown" : "mdi-account");
const formatDate = (value) => (value ? new Date(value).toLocaleString() : "-");
// eslint-disable-next-line no-unused-vars
const withoutUiState = ({ menu, ...user }) => user;
</script>

<style scoped>
.users {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  max-height: 520px;
  overflow-y: auto;
}
.users__row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.users__row:hover {
  background: rgba(var(--v-border-color), 0.06);
}
.users__row:focus-visible {
  outline: 3px solid rgb(var(--v-theme-primary));
}
.users__avatar {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgb(var(--v-theme-weighing-soft));
  color: rgb(var(--v-theme-weighing));
  font-weight: 700;
}
.users__text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}
.users__text .fs-muted {
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
