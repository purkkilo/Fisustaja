<template>
  <div>
    <v-row v-if="team_results.length">
      <v-col style="padding-top: 50px" md="3" offset-md="8">
        <v-btn
          color="red-lighten-2"
          :loading="loading"
          @click="
            $emit('dialog', {
              pdf: '#team-table',
              pdfDialog: true,
            })
          "
          size="large"
          variant="outlined"
        >
          <v-icon color="red">mdi-file-pdf-box</v-icon> Lataa pdf
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        md="10"
        offset-md="1"
        style="padding-bottom: 20px"
        v-if="team_results.length"
      >
        <v-card>
          <v-card-title class="d-flex flex-wrap align-center">
            <p
              class="flow-text"
              v-bind:class="{
                'text-white': store.getTheme,
              }"
            >
              Tiimikilpailu
            </p>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="searchText"
              append-inner-icon="mdi-magnify"
              :label="$t('search-boat')"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="tableHeaders(headers)"
            :items="team_results"
            :search="searchText"
          >
            <template v-slot:[`item.placement`]="{ item }">
              <v-chip
                :color="getColor(item.placement)"
                :variant="store.getTheme ? 'outlined' : 'flat'"
                >{{ item.placement }}.</v-chip
              >
            </template>
            <template v-slot:[`item.points`]="{ item }">
              <v-chip>{{ item.points.toLocaleString() }} p</v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col v-else>
        <v-col v-if="!loading"> </v-col>
        <p
          v-if="!loading"
          class="flow-text"
          v-bind:class="{
            'text-white': store.getTheme,
          }"
        >
          Ei tuloksia, vielä...
        </p>
        <v-col v-else>
          <h2 class="text-white">Päivitetään tuloksia tietokannasta...</h2>
          <ProgressBarQuery />
        </v-col>
      </v-col>
    </v-row>
  </div>
</template>
<script setup>
import { tableHeaders } from "@/utils/tableHeaders";
import { useMainStore } from "@/store";
import { ref } from "vue";
import { getColorPoints, getColor } from "@/utils/colors";

const store = useMainStore();
defineOptions({ name: "TeamComp" });
const props = defineProps([
  "team_results",
  "search_team",
  "loading",
  "headers",
]);
defineEmits(["dialog"]);

const searchText = ref(props.search_team || "");

// Runs when the component is created
</script>
<style scoped></style>
