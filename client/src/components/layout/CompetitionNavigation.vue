<template>
  <v-bottom-navigation dark :value="selectedItem" color="primary" horizontal>
    <v-tooltip bottom v-for="(item, i) in items" :key="i">
      <template v-slot:activator="{ on, attrs }">
        <v-btn @click="changePage(item.path)" v-bind="attrs" v-on="on">
          <span v-if="$vuetify.breakpoint.width >= 700">{{ item.text }}</span>

          <v-icon>{{ item.icon }}</v-icon>
        </v-btn>
      </template>
      <span>{{ item.text }}</span>
    </v-tooltip>
  </v-bottom-navigation>
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
