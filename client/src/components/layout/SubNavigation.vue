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
          <span>{{ $t(item.text) }}</span>

          <v-icon>{{ item.icon }}</v-icon>
        </v-btn>
      </template>
      <span v-if="type == 'public'">{{ $t(item.text) }}</span>
      <span v-else>{{ $t("comp.is") }} {{ $t(item.text) }}</span>
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
        this.text = "errors.already-here";
        this.snackbar = true;
      }
    },
  },
};
</script>

<style scoped></style>
