<template>
  <!-- Users as chips; clicking one opens its details -->
  <v-data-iterator
    :items="users"
    :search="search"
    :items-per-page="-1"
    class="scroll_table"
  >
    <template #header>
      <v-toolbar class="mb-1">
        <v-text-field
          v-model="search"
          clearable
          hide-details
          prepend-inner-icon="mdi-magnify"
          :label="$t('search')"
          variant="solo-inverted"
        />
      </v-toolbar>
    </template>
    <template #default="{ items }">
      <v-col v-for="{ raw: user } in items" :key="user._id" class="mt-5">
        <v-menu
          :model-value="openId === user._id"
          transition="scale-transition"
          location="bottom end"
          persistent
          @update:model-value="(open) => (openId = open ? user._id : null)"
        >
          <template #activator="{ props }">
            <v-chip
              v-bind="props"
              :color="user.is_admin ? 'yellow-darken-2' : 'green'"
              size="large"
              :variant="store.isDark ? 'outlined' : 'flat'"
            >
              <v-icon start>{{ roleIcon(user) }}</v-icon>
              {{ user.name }}
            </v-chip>
          </template>
          <v-card width="320">
            <v-list>
              <v-list-item
                :prepend-icon="roleIcon(user)"
                :title="user.name"
                :subtitle="user.email"
              >
                <template #append>
                  <v-btn
                    icon="mdi-close-circle"
                    variant="text"
                    @click="openId = null"
                  />
                </template>
              </v-list-item>
              <v-divider />
              <v-list-item
                prepend-icon="mdi-badge-account-horizontal"
                :title="user._id"
                subtitle="Id"
                @click="emit('copy', user._id)"
              />
              <v-list-item
                prepend-icon="mdi-calendar-check"
                :title="formatDate(user.createdAt)"
                :subtitle="$t('created')"
                @click="emit('copy', user.createdAt)"
              />
              <v-list-item
                prepend-icon="mdi-briefcase"
                :title="user.is_admin ? 'Admin' : $t('user')"
                :subtitle="$t('role')"
              />
              <v-list-item>
                <v-btn
                  color="blue"
                  prepend-icon="mdi-content-copy"
                  @click="emit('copy', JSON.stringify(withoutUiState(user)))"
                >
                  {{ $t("copy") }}
                </v-btn>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <v-divider class="mt-2" />
      </v-col>
    </template>
  </v-data-iterator>
</template>

<script setup>
import { ref } from "vue";
import { useMainStore } from "@/store";

defineProps({ users: { type: Array, default: () => [] } });
const emit = defineEmits(["copy"]);
const store = useMainStore();

const search = ref("");
const openId = ref(null);

const roleIcon = (user) => (user.is_admin ? "mdi-shield-crown" : "mdi-account");
const formatDate = (value) => (value ? new Date(value).toLocaleString() : "-");
// eslint-disable-next-line no-unused-vars
const withoutUiState = ({ menu, ...user }) => user;
</script>
