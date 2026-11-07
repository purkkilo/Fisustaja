<template>
  <v-container
    :class="{
      mobile: $vuetify.display.width < 800,
      browser: $vuetify.display.width >= 800,
      wide: $vuetify.display.width >= 1200,
    }"
  >
    <v-card
      style="background: transparent; padding: 20px"
      elevation="3"
      variant="outlined"
    >
      <v-row>
        <v-col md="12">
          <h1 class="text-center">Sivua ei löytynyt</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <h3>Takaisin kotisivulle</h3>
          <v-btn
            color="red"
            @click="$router.push({ path: '/' })"
            variant="outlined"
            ><v-icon>mdi-home</v-icon></v-btn
          >
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { usePreviousRoute } from "@/composables/usePreviousRoute";

defineOptions({ name: "Notfound" });

const prevRoute = usePreviousRoute();
const message = ref(null);
const type = ref("Bugi");
const type_options = ref(["Bugi", "Ehdotus", "Muu"]);
const loading = ref(false);
const error = ref(null);
</script>
