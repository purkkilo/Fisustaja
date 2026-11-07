<template>
  <!-- v-bottom-navigation is a fixed layout bar in Vuetify 3+, so a button group is used instead -->
  <v-btn-toggle
    :model-value="selectedItem"
    mandatory
    color="primary"
    variant="text"
    class="d-flex w-100"
    style="background: transparent; margin-bottom: 10px; height: auto"
  >
    <v-tooltip v-for="(item, i) in items" :key="i" location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn
          class="flex-grow-1"
          :value="i"
          stacked
          @click="changePage(item.path)"
          v-bind="props"
        >
          <v-icon>{{ item.icon }}</v-icon>
          <span>{{ $t(item.text) }}</span>
        </v-btn>
      </template>
      <span v-if="type == 'public'">{{ $t(item.text) }}</span>
      <span v-else>{{ $t("comp.is") }} {{ $t(item.text) }}</span>
    </v-tooltip>
  </v-btn-toggle>
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
      (i) => i.path === this.$route.path
    );
  },
  watch: {
    $route(to) {
      this.selectedItem = this.items.findIndex((i) => i.path === to.path);
    },
  },
  methods: {
    changePage(route) {
      if (this.$route.path !== route) {
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
