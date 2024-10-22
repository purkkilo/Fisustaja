<template>
  <!-- Starting page, / -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container
    v-bind:class="{
      mobile: $vuetify.breakpoint.width < 800,
      browser: $vuetify.breakpoint.width >= 800,
      wide: $vuetify.breakpoint.width >= 1200,
    }"
  >
    <v-row>
      <v-col
        align-self="center"
        :cols="$vuetify.breakpoint.width < 800 ? 12 : 6"
      >
        <v-row align="center" class="slideRight">
          <v-col>
            <v-avatar
              :size="$vuetify.breakpoint.width < 800 ? 150 : 200"
              class="logo"
            >
              <img alt="user" src="https://i.imgur.com/2WcI49A.png" />
            </v-avatar>
          </v-col>
        </v-row>
        <v-row align="center" class="slideRight">
          <v-col>
            <h1 class="ml-3 logo-text">Fisustaja</h1>
          </v-col>
        </v-row>
      </v-col>

      <v-col :cols="$vuetify.breakpoint.width < 800 ? 12 : 6">
        <div v-for="(link, i) in links" :key="i">
          <v-hover v-slot="{ hover }">
            <v-card
              :key="i"
              :dark="$store.getters.getTheme"
              tile
              outlined
              :elevation="hover ? 10 : 6"
              class="card-link"
            >
              <v-card-title>
                {{ $t(link.text) }}
              </v-card-title>

              <v-card-actions>
                <v-spacer></v-spacer>
                <router-link :to="link.path">
                  <v-chip
                    class="ma-2"
                    :color="link.color"
                    :text-color="link.color"
                    dark
                    outlined
                  >
                    Siirry
                    <v-icon right>
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
<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
      items: [
        {
          text: "home.comp",
          icon: "mdi-seal",
          path: "/public-results",
          color: "yellow darken-2",
        },
        {
          text: "home.cup",
          icon: "mdi-trophy",
          path: "/public-cups",
          color: "yellow darken-1",
        },
      ],
      links: [],
      logged_in: false,
      disabled: false,
    };
  },
  watch: {
    "$store.state.logged_in"(newValue) {
      if (newValue) {
        this.links = [
          {
            text: "nav.dashboard",
            icon: "mdi-view-dashboard",
            path: "/dashboard",
            color: "blue darken-4",
          },
          ...this.items,
        ];
      } else {
        this.links = this.items;
      }
    },
  },
  async mounted() {
    // Set competition in localstorage and vuex to null
    this.$store.commit("refreshCompetition", null);
    localStorage.removeItem("competition");
    this.$store.commit("refreshCup", null);
    localStorage.removeItem("cup");

    this.links = this.items;
    if (this.$store.state.logged_in) {
      this.links = [
        {
          text: "nav.dashboard",
          icon: "mdi-view-dashboard",
          path: "/dashboard",
          color: "blue darken-4",
        },
        ...this.items,
      ];
    }
  },
};
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
