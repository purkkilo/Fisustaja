<template>
  <!-- /public-results: results of any public competition -->
  <v-container
    :class="{
      mobile: $vuetify.display.width < 800,
      browser: $vuetify.display.width >= 800,
      wide: $vuetify.display.width >= 1200,
    }"
  >
    <v-card style="background: transparent" elevation="3" variant="outlined">
      <v-row>
        <v-col md="6" offset-md="3">
          <h1>{{ $t("home.comp") }}</h1>
        </v-col>
      </v-row>

      <v-row v-if="loadingList">
        <v-col>
          <h2 class="text-white">{{ $t("loading") }}...</h2>
          <ProgressBarQuery />
        </v-col>
      </v-row>
      <v-row v-else-if="competitions.length" class="scroll_table">
        <v-col md="6" offset-md="3">
          <v-autocomplete
            v-model="selected"
            :items="competitions"
            item-title="select"
            item-value="_id"
            :label="$t('choose-comp')"
            return-object
            single-line
            variant="outlined"
          >
            <template v-slot:item="{ item, props }">
              <v-list-item v-bind="props" :title="undefined">
                <template v-slot:prepend>
                  <v-icon :color="item.isFinished ? 'green' : 'yellow'"
                    >mdi-trophy</v-icon
                  >
                </template>
                <v-list-item-title
                  >{{ item.name }}, {{ item.locality }}</v-list-item-title
                >
                <v-list-item-subtitle
                  v-if="item.isCupCompetition"
                  class="text-green"
                  >{{ item.cup_name }} ({{
                    getYear(item.start_date)
                  }})</v-list-item-subtitle
                >
                <v-list-item-subtitle class="text-blue">{{
                  formatDateToLocaleDateString(item.start_date)
                }}</v-list-item-subtitle>
                <v-list-item-subtitle v-if="!item.isFinished"
                  >{{ $t("not-finished") }}!</v-list-item-subtitle
                >
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col>
          <h2 class="text-white">{{ $t("no") }} {{ $t("comp.plural") }}</h2>
        </v-col>
      </v-row>

      <v-row
        v-if="selected"
        class="justify-center align-center"
        style="margin-bottom: 20px"
      >
        <v-col>
          <v-btn
            color="yellow"
            @click="selected = null"
            class="text-black"
            size="large"
            variant="outlined"
          >
            <v-icon>mdi-cancel</v-icon>{{ $t("cancel") }}
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            id="updatebtn"
            color="blue-darken-4"
            @click="resultsView.refresh()"
            :loading="resultsView?.loading"
            class="text-white"
            size="large"
          >
            <v-icon>mdi-update</v-icon>{{ $t("button.update") }}
          </v-btn>
        </v-col>
      </v-row>

      <CompetitionResults
        v-if="selected"
        ref="resultsView"
        :competition-id="selected._id"
        public-only
      />
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from "vue";
import CompetitionService from "../services/CompetitionService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
import CompetitionResults from "../components/results/CompetitionResults.vue";
import { formatDateToLocaleDateString, getYear } from "@/utils/format";

defineOptions({ name: "PublicResults" });

const competitions = ref([]);
const selected = ref(null);
const loadingList = ref(false);
const resultsView = ref(null);

onMounted(async () => {
  loadingList.value = true;
  try {
    const list = await CompetitionService.getCompetitions({ isPublic: true });
    for (const c of list) {
      c.start_date = new Date(c.start_date);
      c.end_date = new Date(c.end_date);
      c.select = `${c.name}, ${formatDateToLocaleDateString(c.start_date)} (${
        c.cup_name || ""
      })`;
    }
    // Newest first
    competitions.value = list.sort((a, b) => b.start_date - a.start_date);
  } catch (error) {
    console.error(error.message);
  } finally {
    loadingList.value = false;
  }
});
</script>
