<template>
  <v-navigation-drawer permanent expand-on-hover>
    <v-card
      class="mx-auto"
      max-width="400"
      tile
      :dark="$store.getters.getTheme"
    >
      <v-list dense>
        <p>Navigointi</p>
        <v-list-item-group v-model="selectedItem" color="primary">
          <v-divider></v-divider>
          <div v-for="(item, i) in items" :key="i">
            <v-list-item
              @click="changePage(item.path)"
              :disabled="$router.currentRoute.path === item.path"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </div>
        </v-list-item-group>
      </v-list>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "CompetitionNavigation",
  data() {
    return {
      selectedItem: 0,
      items: [
        {
          text: "Yleisnäkymä",
          icon: "mdi-magnify-expand",
          path: "/overview",
        },
        {
          text: "Määritykset",
          icon: "mdi-tune",
          path: "/comp-settings",
        },
        {
          text: "Ilmoittautuminen",
          icon: "mdi-draw",
          path: "/signing",
        },
        {
          text: "Punnitus",
          icon: "mdi-dumbbell",
          path: "/weighting",
        },
        {
          text: "Tulokset",
          icon: "mdi-seal",
          path: "/results",
        },
      ],
      snackbar: false,
      text: "",
      timeout: 5000,
    };
  },
  mounted() {
    this.selectedItem = this.items.findIndex(
      (i) => i.path === this.$router.currentRoute.path
    );
  },
  methods: {
    changePage(route) {
      if (this.$router.currentRoute.path !== route) {
        this.$router.push(route);
      } else {
        this.text = "Olet jo tällä sivulla!";
        this.snackbar = true;
      }
    },
  },
};
</script>

<style scoped></style>
