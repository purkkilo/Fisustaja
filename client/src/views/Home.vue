<template>
  <!-- Starting page, / -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container
    v-bind:class="{
      mobile: $vuetify.display.width < 800,
      browser: $vuetify.display.width >= 800,
      wide: $vuetify.display.width >= 1200,
    }"
  >
    <v-row>
      <v-col
        class="align-self-center"
        :cols="$vuetify.display.width < 800 ? 12 : 6"
      >
        <v-row class="slideRight align-center">
          <v-col>
            <v-avatar
              :size="$vuetify.display.width < 800 ? 150 : 200"
              class="logo"
            >
              <v-img alt="user" src="https://i.imgur.com/2WcI49A.png" />
            </v-avatar>
          </v-col>
        </v-row>
        <v-row class="slideRight align-center">
          <v-col>
            <h1 class="ml-3 logo-text">Fisustaja</h1>
          </v-col>
        </v-row>
      </v-col>

      <v-col :cols="$vuetify.display.width < 800 ? 12 : 6">
        <div v-for="(link, i) in links" :key="i">
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              :key="i"
              rounded="0"
              :elevation="isHovering ? 3 : 2"
              class="card-link"
              variant="outlined"
            >
              <v-card-title>
                {{ $t(link.text) }}
              </v-card-title>

              <v-card-actions>
                <v-spacer></v-spacer>
                <router-link :to="link.path">
                  <v-chip class="ma-2" :color="link.color" variant="outlined">
                    {{ $t("go-to") }}
                    <v-icon end>
                      {{ link.icon }}
                    </v-icon>
                  </v-chip>
                </router-link>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-hover>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { useMainStore } from "@/store";

defineOptions({ name: "Home" });
const store = useMainStore();

const items = ref([
  {
    text: "home.comp",
    icon: "mdi-seal",
    path: "/public-results",
    color: "yellow-darken-2",
  },
  {
    text: "home.cup",
    icon: "mdi-trophy",
    path: "/public-cups",
    color: "yellow-darken-1",
  },
]);
const links = ref([]);
const logged_in = ref(false);
const disabled = ref(false);

watch(
  () => store.logged_in,
  (newValue) => {
    if (newValue) {
      links.value = [
        {
          text: "nav.dashboard",
          icon: "mdi-view-dashboard",
          path: "/dashboard",
          color: "yellow-darken-2",
        },
        ...items.value,
      ];
    } else {
      links.value = items.value;
    }
  },
);

onMounted(async () => {
  links.value = items.value;
  if (store.logged_in) {
    links.value = [
      {
        text: "nav.dashboard",
        icon: "mdi-view-dashboard",
        path: "/dashboard",
        color: "yellow-darken-2",
      },
      ...items.value,
    ];
  }
});
</script>
<style scoped>
.slideRight {
  animation: 1.5s ease-out 0s 1 slideInFromLeft;
}

.card-link {
  background: transparent;
  margin-top: 100px;
  animation: 1.5s ease-out 0s 1 slideInFromUp;
}

.logo:hover {
  animation: spin 1s linear infinite;
}

@keyframes slideInFromUp {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInFromLeft {
  0% {
    transform: translateX(-200%) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: translateX(-50%) rotate(360deg);
    opacity: 0.2;
  }
  100% {
    transform: translateX(0) rotate(720deg);
    opacity: 1;
  }
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
