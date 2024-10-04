<template>
  <v-bottom-navigation
    dark
    shift
    grow
    :value="selectedItem"
    color="primary"
    horizontal
    style="background: transparent; box-shadow: none; margin-bottom: 10px"
  >
    <v-tooltip bottom v-for="(item, i) in items" :key="i">
      <template v-slot:activator="{ on, attrs }">
        <v-btn @click="changePage(item.path)" v-bind="attrs" v-on="on">
          <span>{{ item.text }}</span>

          <v-icon>{{ item.icon }}</v-icon>
        </v-btn>
      </template>
      <span v-if="type == 'public'">{{ item.text }}</span>
      <span v-else>Kilpailun {{ item.text }}</span>
    </v-tooltip>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: "PublicNavigation",
  props: ["items", "type"],
  data() {
    return {
      selectedItem: 0,

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
