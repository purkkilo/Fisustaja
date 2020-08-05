<template>
  <v-footer app color="primary lighten-1" paddless absolute>
    <v-row justify="center">
      <v-btn
        v-for="link in links"
        :key="link"
        color="white"
        text
        rounded
        class="my-2"
      >
        {{ link }}
      </v-btn>
      <v-col class="primary lighten-2 py-4 text-center white--text" cols="12">
        {{ new Date().getFullYear() }} — <strong>Jori Kosonen</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      links: ["Work In Progress"],
    };
  },
  mounted() {},
  computed: {},
  methods: {},
};
</script>
//FIXME not idea solution to for the footer (bottom:-50px)!
<style scoped></style>
