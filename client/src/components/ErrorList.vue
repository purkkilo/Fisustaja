<template>
  <!-- if there are errors, show this div -->
  <v-card
    id="error-list"
    :dark="$store.getters.getTheme"
    elevation="20"
    v-if="errors.length"
  >
    <v-alert type="error"> {{ $t("errors.fix-text") }}: </v-alert>
    <v-list>
      <v-list-item v-for="(error, index) in errors" v-bind:key="index">
        <v-list-item-icon>
          <v-icon color="red">mdi-alert-circle</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $t(error) }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: "ErrorList",
  props: ["errors"],
};
</script>
<style scoped></style>
