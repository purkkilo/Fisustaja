<template>
  <!-- /weighting -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div>
    <Timedate />

    <v-container
      v-bind:class="{
        mobile: $vuetify.display.width < 800,
        browser: $vuetify.display.width >= 800,
        wide: $vuetify.display.width >= 1200,
      }"
    >
      <v-card style="background: transparent" elevation="3" variant="outlined">
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <v-row class="justify-center">
              <v-col>
                <h1 style="margin: 30px">{{ $t("weighting") }}</h1>
                <h2 style="margin: 10px; color: chartreuse">
                  {{ allReturned ? $t("all-finished") : "" }}
                </h2>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>

      <!-- Tabs -->
      <v-tabs
        slider-color="blue-darken-4"
        v-model="tab"
        bg-color="blue-lighten-2"
        color="blue-darken-4"
        grow
        show-arrows
        next-icon="mdi-arrow-right-bold-box-outline"
        prev-icon="mdi-arrow-left-bold-box-outline"
        center-active
      >
        <v-tab value="weighting">{{ $t("weighting") }}</v-tab>
        <v-tab value="situation">{{ $t("leaderboard") }}</v-tab>
        <v-tab v-if="!allReturned" value="onwater">{{
          $t("comp-overview.still-on-water")
        }}</v-tab>
      </v-tabs>
      <v-window v-model="tab" style="background: rgba(0, 0, 0, 0.4)">
        <!-- "Punnitus" tab -->
        <v-window-item
          v-bind:class="{
            inputarea: !store.getTheme,
            'inputarea-dark': store.getTheme,
          }"
          :value="'weighting'"
        >
          <v-row v-if="!loading_site">
            <v-col>
              <v-row v-if="signees.length">
                <v-col>
                  <v-row v-if="notification" style="margin-top: 20px">
                    <v-col>
                      <v-alert type="success">
                        {{ $t(notification) }}
                      </v-alert>
                    </v-col>
                  </v-row>
                  <v-row v-if="!loading" style="margin-top: 20px">
                    <v-col
                      v-bind:class="{
                        'bg-grey-darken-4': store.getTheme,
                        'input-fields': !store.getTheme,
                      }"
                      md="6"
                      offset-md="3"
                      style="padding: 20px"
                    >
                      <v-col>
                        <p
                          class="flow-text"
                          v-bind:class="{
                            'text-white': store.getTheme,
                          }"
                        >
                          {{ $t("boat") }}
                        </p>
                      </v-col>
                      <v-col class="d-flex">
                        <v-autocomplete
                          v-model="boat_number_input"
                          :items="sortedArray"
                          :label="$t('choose-boat')"
                          :hint="
                            boat_number_input['boat_number'] !== undefined
                              ? $t('chosen-boat')
                              : $t('choose-boat')
                          "
                          :disabled="loading_site"
                          return-object
                          single-line
                          @update:model-value="searchSelected"
                          :custom-filter="filterBoat"
                          :item-title="boatTitle"
                          variant="outlined"
                        >
                          <template v-slot:selection="data">
                            <v-chip closable @click:close="clearInputs">
                              ({{ data.item.boat_number }})
                              {{ data.item.captain_name }},
                              {{ data.item.temp_captain_name }}
                            </v-chip>
                          </template>
                          <template v-slot:item="data">
                            <v-list-item v-bind="data.props" :title="undefined">
                              <template v-slot:prepend>
                                <v-icon v-if="data.item.returned" color="green"
                                  >mdi-checkbox-marked-circle</v-icon
                                >
                                <v-icon v-else color="yellow-darken-2"
                                  >mdi-account-question</v-icon
                                >
                              </template>
                              <v-list-item-title>{{
                                data.item.boat_number
                              }}</v-list-item-title>
                              <v-list-item-subtitle
                                >{{ data.item.captain_name }},
                                {{
                                  data.item.temp_captain_name
                                }}</v-list-item-subtitle
                              >
                              <template v-slot:append>
                                <v-chip v-if="data.item.returned">{{
                                  data.item.placement
                                }}</v-chip>
                              </template>
                            </v-list-item>
                          </template>
                        </v-autocomplete>
                      </v-col>
                    </v-col>
                  </v-row>
                  <v-row v-if="!competition_boat">
                    <v-col>
                      <v-alert v-if="loading" type="info"> </v-alert>
                      <v-alert v-if="!searched" type="warning">
                        {{ $t("errors.no-boat-selected") }}
                      </v-alert>
                      <v-alert v-else type="error">
                        {{ $t("errors.no-boat-found") }}
                      </v-alert>
                    </v-col>
                  </v-row>
                  <v-row v-if="competition_boat">
                    <v-col>
                      <v-row v-if="!loading" style="margin-top: 30px">
                        <v-col offset="4" cols="4">
                          <v-btn
                            block
                            color="yellow"
                            @click="clearInputs"
                            size="large"
                            ><v-icon>mdi-backspace-reverse-outline</v-icon
                            >{{ $t("cancel") }}</v-btn
                          >
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-divider class="bg-black"></v-divider>
                        </v-col>
                      </v-row>

                      <v-col md="10" offset-md="1">
                        <ul
                          id="fish_weights"
                          v-if="competition.fishes.length"
                          style="list-style-type: none"
                        >
                          <li style="padding: 10px; margin-bottom: 10px">
                            <v-btn
                              @click="
                                isBiggestFishVisible = !isBiggestFishVisible
                              "
                              color="primary"
                              :disabled="loading || loading_fish"
                              ><v-icon>{{
                                isBiggestFishVisible ? "mdi-eye-off" : "mdi-eye"
                              }}</v-icon
                              >{{
                                isBiggestFishVisible
                                  ? $t("hide")
                                  : $t("weight-one-fish")
                              }}</v-btn
                            >
                            <v-row v-if="loading_fish" style="margin-top: 20px">
                              <v-col>
                                <p
                                  class="flow-text"
                                  v-bind:class="{
                                    'text-white': store.getTheme,
                                  }"
                                >
                                  {{ $t("adding-fish") }}
                                </p>
                                <ProgressBarQuery />
                              </v-col>
                            </v-row>
                            <v-row
                              class="align-center"
                              v-if="!loading_fish && isBiggestFishVisible"
                              style="margin-top: 20px"
                            >
                              <v-col md="3">
                                <p
                                  class="flow-text"
                                  v-bind:class="{
                                    'text-white': store.getTheme,
                                  }"
                                >
                                  {{ $t("biggest-fish") }}?
                                </p>
                              </v-col>
                              <v-col md="4">
                                <v-select
                                  class="flow-text"
                                  :label="$t('choose-fish')"
                                  v-model="selected_fish"
                                  item-title="name"
                                  :items="competition.fishes"
                                  variant="outlined"
                                >
                                  <template v-slot:selection="data">
                                    <v-chip
                                      color="primary"
                                      closable
                                      @click:close="selected_fish = null"
                                      variant="flat"
                                    >
                                      {{ data.item.name }}
                                    </v-chip>
                                  </template>
                                </v-select>
                              </v-col>
                              <v-col class="input-fields" md="3">
                                <v-text-field
                                  :label="$t('weight-grams')"
                                  v-model="biggest_fish"
                                  type="number"
                                  @paste.prevent
                                  @keypress="isNumber($event)"
                                  step="50"
                                  min="0"
                                  :rules="number_rules"
                                  :loading="loading_fish"
                                />
                              </v-col>
                              <v-col md="2">
                                <v-btn
                                  v-if="selected_fish && biggest_fish"
                                  tile
                                  color="green"
                                  @click="saveBiggestFish"
                                  size="large"
                                  ><v-icon>mdi-content-save</v-icon
                                  >{{ $t("save") }}</v-btn
                                >
                              </v-col>
                            </v-row>
                          </li>
                          <li
                            v-for="(input, index) in inputs"
                            :key="index"
                            style="padding-top: 10px; padding-bottom: 20px"
                          >
                            <v-row>
                              <v-col md="12">
                                <v-divider class="bg-black"></v-divider>
                              </v-col>
                            </v-row>
                            <v-row class="justify-center align-center">
                              <v-col md="6">
                                <span
                                  class="flow-text"
                                  v-bind:class="{
                                    'text-white': store.getTheme,
                                  }"
                                >
                                  {{ index + 1 }}.
                                </span>
                                <span
                                  class="flow-text"
                                  v-bind:class="{
                                    'text-white': store.getTheme,
                                  }"
                                >
                                  {{ input.name }}
                                </span>
                              </v-col>
                              <v-col md="4" class="input-fields">
                                <v-text-field
                                  :label="$t('weight-grams')"
                                  v-model="input.value"
                                  type="number"
                                  @paste.prevent
                                  @keypress="isNumber($event)"
                                  step="50"
                                  min="0"
                                  :rules="number_rules"
                                  :loading="loading_fish"
                                  :disabled="loading || loading_fish"
                                />
                              </v-col>
                              <v-col md="2">
                                <v-dialog
                                  v-model="input.dialog"
                                  persistent
                                  max-width="600px"
                                >
                                  <template v-slot:activator="{ props }">
                                    <v-btn
                                      color="primary"
                                      v-bind="props"
                                      :disabled="loading || loading_fish"
                                      ><v-icon>mdi-plus</v-icon
                                      >{{ $t("add-calculation") }}</v-btn
                                    >
                                  </template>
                                  <v-card>
                                    <v-card-title>
                                      <span class="text-headline-small">{{
                                        $t("add-together")
                                      }}</span>
                                    </v-card-title>
                                    <v-card-text>
                                      <v-row>
                                        <v-col md="6" offset-md="3">
                                          <v-text-field
                                            class="title"
                                            :label="$t('value-original')"
                                            :model-value="input.value"
                                            disabled
                                          ></v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col md="6 " offset-md="3">
                                          <v-text-field
                                            v-model="input.addition"
                                            :label="$t('value-to-add')"
                                            type="number"
                                            @paste.prevent
                                            @keypress="isNumber($event)"
                                            step="50"
                                            min="0"
                                            single-line
                                            variant="outlined"
                                          ></v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col
                                          md="6"
                                          offset-md="3"
                                          class="title text-red"
                                        >
                                          <v-text-field
                                            :model-value="
                                              parseInt(input.value) +
                                              parseInt(
                                                input.addition
                                                  ? input.addition
                                                  : 0,
                                              )
                                            "
                                            :label="$t('sum')"
                                            disabled
                                          ></v-text-field>
                                        </v-col>
                                      </v-row>
                                    </v-card-text>
                                    <v-card-actions>
                                      <v-spacer></v-spacer>
                                      <v-btn
                                        color="red-darken-1"
                                        @click="
                                          input.addition = null;
                                          input.dialog = false;
                                        "
                                        variant="outlined"
                                        >{{ $t("cancel") }}</v-btn
                                      >
                                      <v-btn
                                        color="green-darken-1"
                                        @click="
                                          input.value =
                                            parseInt(input.value) +
                                            parseInt(
                                              input.addition
                                                ? input.addition
                                                : 0,
                                            );
                                          input.dialog = false;
                                          input.addition = 0;
                                        "
                                        variant="outlined"
                                        >{{ $t("save") }}</v-btn
                                      >
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                              </v-col>
                            </v-row>
                          </li>
                        </ul>
                        <v-row>
                          <v-col md="12">
                            <v-divider class="bg-black"></v-divider>
                          </v-col>
                        </v-row>
                        <v-row
                          class="justify-center align-center"
                          v-if="!loading"
                        >
                          <v-col cols="8">
                            <v-card tile variant="outlined">
                              <v-card-title>{{ $t("overview") }}</v-card-title>
                              <v-list density="compact">
                                <v-list-item>
                                  <template v-slot:prepend>
                                    <v-icon>mdi-sail-boat</v-icon>
                                  </template>
                                  <v-list-item-title>
                                    <h3>
                                      ({{ boat_number_input.boat_number }})
                                      {{ boat_number_input.captain_name }},
                                      {{ boat_number_input.temp_captain_name }}
                                    </h3>
                                  </v-list-item-title>
                                  <v-list-item-subtitle>
                                    {{ $t("boat") }}
                                  </v-list-item-subtitle>
                                </v-list-item>
                                <v-list-item>
                                  <template v-slot:prepend>
                                    <v-icon>mdi-weight-gram</v-icon>
                                  </template>
                                  <v-list-item-title>
                                    <h3>
                                      {{
                                        getBoatTotalWeights().toLocaleString()
                                      }}
                                      g
                                    </h3>
                                  </v-list-item-title>
                                  <v-list-item-subtitle>
                                    {{ $t("total-weights") }}
                                  </v-list-item-subtitle>
                                </v-list-item>
                                <v-list-item>
                                  <template v-slot:prepend>
                                    <v-icon>mdi-counter</v-icon>
                                  </template>
                                  <v-list-item-title>
                                    <h3>
                                      {{
                                        getBoatTotalPoints().toLocaleString()
                                      }}
                                      p
                                    </h3>
                                  </v-list-item-title>
                                  <v-list-item-subtitle>
                                    {{ $t("total-points") }}
                                  </v-list-item-subtitle>
                                </v-list-item>
                                <v-list-item>
                                  <template v-slot:prepend>
                                    <v-icon>mdi-pound-box</v-icon>
                                  </template>
                                  <v-list-item-title>
                                    <h3>#{{ getBoatPlacing() }}</h3>
                                  </v-list-item-title>
                                  <v-list-item-subtitle>
                                    {{ $t("placement") }}
                                  </v-list-item-subtitle>
                                </v-list-item>
                              </v-list>
                            </v-card>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col md="12">
                            <v-divider class="bg-black"></v-divider>
                          </v-col>
                        </v-row>
                        <v-row v-if="!loading">
                          <v-col>
                            <v-btn
                              tile
                              color="red"
                              @click="saveToDatabase(true)"
                              :loading="refreshing"
                              size="large"
                              ><v-icon>mdi-delete</v-icon
                              >{{ $t("button.clear-signee") }}</v-btn
                            >
                          </v-col>
                          <v-col>
                            <p
                              class="flow-text"
                              v-if="refreshing"
                              v-bind:class="{
                                'text-white': store.getTheme,
                              }"
                            >
                              {{ $t("updating") }}...
                            </p>
                          </v-col>
                          <v-col>
                            <v-btn
                              tile
                              color="green"
                              @click="saveToDatabase(false)"
                              :loading="refreshing"
                              size="large"
                              ><v-icon>mdi-check</v-icon>{{ $t("save") }}</v-btn
                            >
                          </v-col>
                        </v-row>
                        <v-row v-if="!loading" style="margin-bottom: 20px">
                          <v-col>
                            <v-btn
                              id="updatebtn"
                              tile
                              color="blue-darken-4"
                              @click="refreshCompetition(competition._id)"
                              class="text-white"
                              size="large"
                            >
                              <v-icon>mdi-update</v-icon
                              >{{ $t("button.update") }}
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-row v-else>
                          <v-col>
                            <p
                              class="flow-text"
                              v-bind:class="{
                                'text-white': store.getTheme,
                              }"
                            >
                              {{ $t("updating") }}...
                            </p>
                            <ProgressBarQuery />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col style="padding: 30px">
                  <p
                    class="flow-text"
                    v-bind:class="{ 'text-white': store.getTheme }"
                  >
                    Kilpailussa ei vielä ilmoittautuneita!
                  </p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col>
              <h2 v-bind:class="{ 'text-white': store.getTheme }">
                Haetaan veneitä...
              </h2>
              <ProgressBarQuery />
            </v-col>
          </v-row>
        </v-window-item>

        <!-- "Tilannekatsaus" tab -->
        <v-window-item
          v-bind:class="{
            inputarea: !store.getTheme,
            'inputarea-dark': store.getTheme,
          }"
          :value="'situation'"
        >
          <v-row>
            <v-col>
              <v-row v-if="signees.filter((s) => s.returned).length">
                <v-col md="8" offset-md="2" style="margin-top: 20px">
                  <v-card>
                    <v-card-title class="d-flex flex-wrap align-center">
                      <p class="flow-text">{{ $t("leaderboard") }}</p>
                      <v-tooltip location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-icon
                            v-bind="props"
                            style="margin: 0px 0px 20px 5px"
                            >mdi-chat-question-outline</v-icon
                          >
                        </template>
                        <span> {{ $t("info-table-click") }}</span>
                      </v-tooltip>
                      <v-spacer></v-spacer>
                      <v-text-field
                        v-model="search"
                        append-inner-icon="mdi-magnify"
                        :label="$t('search-boat')"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-card-title>
                    <v-data-table
                      @click:row="rowClick"
                      :headers="tableHeaders(headers)"
                      :items="sortedCompetition"
                      :search="search"
                    >
                      <template
                        v-for="(h, index) in headers"
                        v-slot:[`header.${h.value}`]="{ column: header }"
                      >
                        <span> {{ $t(header.text) }}</span>
                      </template>
                      <template v-slot:[`item.placement`]="{ item }">
                        <v-chip
                          :color="getColor(item.placement)"
                          :variant="store.getTheme ? 'outlined' : 'flat'"
                          >{{ item.placement }}.</v-chip
                        >
                      </template>
                      <template v-slot:[`item.total_points`]="{ item }">
                        <v-chip
                          :color="getColorPoints(item.total_points)"
                          variant="flat"
                          >{{ item.total_points.toLocaleString() }}</v-chip
                        >
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col
                  md="8"
                  offset-md="2"
                  style="margin-top: 30px; margin-bottom: 30px"
                >
                  <p
                    class="flow-text"
                    v-bind:class="{ 'text-white': store.getTheme }"
                  >
                    Ei vielä tuloksia!
                  </p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-window-item>

        <!-- "Vielä vesillä" tab -->
        <v-window-item
          v-bind:class="{
            inputarea: !store.getTheme,
            'inputarea-dark': store.getTheme,
          }"
          :value="'onwater'"
        >
          <v-row>
            <v-col>
              <v-row v-if="!signees.length">
                <v-col md="8" offset-md="2" style="margin-top: 100px">
                  <p v-if="!signees.length" class="flow-text text-red">
                    Kilpailussa ei vielä ilmoittautuneita
                  </p>
                  <p
                    v-if="!signees.filter((s) => !s.returned).length"
                    class="flow-text text-green"
                  >
                    Kaikki venekunnat palanneet maaliin!
                  </p>
                </v-col>
              </v-row>
              <v-row
                v-if="signees.filter((s) => !s.returned).length"
                style="margin: 0px 0px 0px 0px"
              >
                <v-col md="8" offset-md="2">
                  <v-card>
                    <v-card-title class="d-flex flex-wrap align-center">
                      <p class="flow-text">
                        {{ $t("comp-overview.still-on-water") }}
                      </p>
                      <v-tooltip location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-icon
                            v-bind="props"
                            style="margin: 0px 0px 20px 5px"
                            >mdi-chat-question-outline</v-icon
                          >
                        </template>
                        <span> {{ $t("info-table-click") }}</span>
                      </v-tooltip>
                      <v-spacer></v-spacer>
                      <v-text-field
                        v-model="search_on_water"
                        append-inner-icon="mdi-magnify"
                        :label="$t('search-boat')"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-card-title>

                    <v-data-table
                      @click:row="rowClick"
                      :headers="tableHeaders(headers_on_water)"
                      :items="signees.filter((s) => !s.returned)"
                      :search="search_on_water"
                      :loading="loading"
                    >
                      <template
                        v-for="(h, index) in headers_on_water"
                        v-slot:[`header.${h.value}`]="{ column: header }"
                      >
                        <span> {{ $t(header.text) }}</span>
                      </template>
                      <template v-slot:[`item.boat_number`]="{ item }">
                        <v-chip>{{ item.boat_number }}.</v-chip>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
              <v-row v-if="signees.filter((s) => !s.returned).length">
                <v-col
                  md="8"
                  offset-md="2"
                  style="margin-top: 30px; margin-bottom: 30px"
                >
                  <v-btn
                    tile
                    color="grey-darken-4"
                    class="text-white"
                    @click="allFinished"
                    :loading="loading"
                    size="large"
                    ><v-icon>mdi-check-outline</v-icon
                    >{{ $t("button.set-all-finished") }}</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col
                  md="8"
                  offset-md="2"
                  style="margin-top: 30px; margin-bottom: 30px"
                >
                  <p
                    class="flow-text"
                    v-bind:class="{ 'text-white': store.getTheme }"
                  >
                    {{ $t("all-finished") }}
                  </p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-container>
    <notification-bar :snackbar="snackbar" :text="text"></notification-bar>
  </div>
</template>
<script setup>
import { tableHeaders } from "@/utils/tableHeaders";
import { computed, nextTick, ref } from "vue";
import { useMainStore } from "@/store";
import CompetitionService from "../services/CompetitionService";
import ResultService from "../services/ResultService";
import FishService from "../services/FishService";
import Timedate from "../components/layout/Timedate.vue";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
import { isNumber } from "@/utils/format";
import NotificationBar from "../components/NotificationBar.vue";

defineOptions({ name: "Weighting" });
const store = useMainStore();

const dialog = ref(false);
const tab = ref(null);
const competition = ref({});
const boat_number_input = ref({});
const competition_boat = ref(null);
const calculated_total_weights = ref(null);
const calculated_fish_weights = ref(null);
const searched = ref(false);
const selected_boat_number = ref(null);
const loading = ref(false);
const refreshing = ref(false);
const loading_fish = ref(false);
const loading_site = ref(true);
const notification = ref(null);
const biggest_fish = ref(null);
const selected_fish = ref(null);
const isBiggestFishVisible = ref(false);
const biggest_fishes = ref({});
const biggest_amounts = ref({});
const signees = ref([]);
const headers = ref([
  { text: "placement", value: "placement" },
  { text: "boat-number", value: "boat_number" },
  { text: "captain-name", value: "captain_name" },
  { text: "points", value: "total_points" },
]);
const headers_on_water = ref([
  { text: "boat-number", value: "boat_number" },
  { text: "captain-name", value: "captain_name" },
  { text: "temp-captain-name", value: "temp_captain_name" },
  { text: "starting-place", value: "starting_place" },
]);
const search_on_water = ref("");
const search = ref("");
const number_rules = ref([
  (value) => !isNaN(value || "") || "Ei ole numero!",
  (value) => (value || "") >= 0 || "Numeron pitää olla positiivinen!",
]);
const timer_refresh = ref(null);
const interval = ref(60000);
const inputs = ref([]);
const snackbar = ref(false);
const text = ref("");
const searchInput = ref(null);

// Keep array sorted based on boat number in "Punnitus" tab

const sortedArray = computed(() => {
  return [...signees.value].sort((a, b) => a.boat_number - b.boat_number);
});

const allReturned = computed(() => {
  return signees.value.filter((b) => !b.returned).length === 0 ? true : false;
});

const sortedCompetition = computed(() => {
  let _signees = [...signees.value].sort(
    (a, b) => b.total_points - a.total_points,
  );
  let placement = 1;
  let last_points = -1;
  let last_placement = -1;
  _signees.forEach((signee, index) => {
    // If competitor has same points as last competitor
    if (signee.total_points == last_points) {
      placement = last_placement;
    }
    // If no tie, add tied_competitors to placement, to give correct placement to next not tied competitor
    else {
      placement = index + 1;
      last_points = signee.total_points;
      last_placement = placement;
    }
    signee.placement = placement;
  });
  return _signees;
});

function boatTitle(item) {
  return `${item.boat_number} ${item.captain_name}`;
}

// Vuetify 3+ custom-filter: (value, query, internalItem)

function filterBoat(value, queryText, internalItem) {
  const item = internalItem.raw;
  return (
    item.captain_name
      .toLocaleLowerCase()
      .indexOf(queryText.toLocaleLowerCase()) > -1 ||
    item.temp_captain_name
      .toLocaleLowerCase()
      .indexOf(queryText.toLocaleLowerCase()) > -1 ||
    String(item.boat_number).includes(queryText)
  );
}

function getBoatTotalPoints() {
  let totalPoints = 0;
  inputs.value.forEach((i) => {
    const fish = competition.value.fishes.find((f) => f.name === i.name);
    totalPoints += fish.multiplier * i.value;
  });
  return totalPoints;
}

function getBoatTotalWeights() {
  let sum = 0;
  inputs.value.forEach((element) => {
    sum += element.value ? parseInt(element.value) : 0;
  });
  return sum;
}

function getBoatPlacing() {
  if (sortedCompetition.value.length === 0) {
    return 1;
  }
  let points = getBoatTotalPoints();
  let index = bisect(points, sortedCompetition.value);
  let placement = index + 1;
  let samePoints = sortedCompetition.value.find(
    (b) => b.total_points === points,
  );
  if (samePoints) placement = samePoints.placement;

  return placement;
}

function bisect(value, array) {
  let idx;
  if (array.length === 0) {
    return 0;
  }
  for (idx = 0; idx < array.length; idx++) {
    if (value > array[idx].total_points) {
      return idx;
    }
  }
  return idx;
}

// Fetch competition from database, and update variables

async function refreshCompetition(competition_id) {
  refreshing.value = true;
  try {
    let _competition = await CompetitionService.getCompetitions({
      _id: competition_id,
    });
    if (_competition) {
      competition.value = _competition;
      // Update to vuex, Assing variables and arrays from vuex (see client/store/index.js)
      calculateNormalResults(competition.value);
      inputs.value = [];
      competition.value.fishes.forEach((fish) => {
        inputs.value.push({
          id: fish.id,
          name: fish.name,
          value: null,
          dialog: false,
          addition: null,
          multiplier: fish.multiplier,
        });
      });
    } else {
      console.log("No competition found on database...");
    }
  } catch (err) {
    console.log(err);
  }
  loading_site.value = false;
  refreshing.value = false;
}

// "Kaikki päässeet maaliin" button pressed

async function allFinished() {
  let not_finished = signees.value.filter((s) => !s.returned);
  let ids = [];
  not_finished.forEach((element) => {
    element.returned = true;
    ids.push(element._id);
  });

  let valueToSet = {
    $set: { returned: true },
  };

  try {
    loading.value = true;
    await ResultService.updateManyResults(ids, valueToSet).catch((e) => {
      console.log(e);
    });
    loading.value = false;
    text.value = "all-finished";
    snackbar.value = true;
  } catch (err) {
    console.log(err.message);
  }
}

function getColor(placement) {
  if (placement > 30) return "red";
  if (placement > 20) return "orange";
  else if (placement > 5) return "yellow";
  else return "green";
}

function getColorPoints(points) {
  if (points > 0) return "indigo-lighten-2";
  else return "grey";
}

// Vuetify 3+: (event, { item, internalItem, index })

function rowClick(event, { item }) {
  boat_number_input.value = item;
  searchSelected();
}

// Set input weights for each fish for the signee

function setInputWeights() {
  // Loop trhough all the competition fishes
  inputs.value.forEach((input) => {
    input.value = null; // Reset input value
    if (competition_boat.value.fishes.length) {
      // find the fish weights based on the fish_name, from signees weights array
      let fish = competition_boat.value.fishes.find(
        (fish) => fish.id === input.id,
      );
      // Assign the value to input
      if (fish) {
        input.value = fish.weights;
      }
    }
  });
}

// Search signee from database when selected from table

function searchSelected() {
  // Change tab to "Punnitus" and fetch
  tab.value = "weighting";
  selected_boat_number.value = null;
  // If boat_number_input is empty, boat_number = -1
  // If boat_number selected on input
  if (boat_number_input.value.boat_number !== -1) {
    searched.value = true;
    notification.value = null;
    competition_boat.value = signees.value.find(
      (s) => s.boat_number === boat_number_input.value.boat_number,
    );
    if (competition_boat.value) {
      //Wait for render to set weights to inputs
      nextTick(() => setInputWeights());
      boat_number_input.value = competition_boat.value;
    } else {
      console.log("No such boat in list!");
    }
  } else {
    // No boat selected, clear inputs
    clearInputs();
  }
}

// Save biggest fish to database

async function saveBiggestFish() {
  // If name for biggest fish, boat number and weight for biggest fish all have been selected
  if (selected_fish.value && boat_number_input.value && biggest_fish.value) {
    try {
      let comp_fish = competition.value.fishes.find(
        (cf) => cf.name === selected_fish.value,
      );
      loading_fish.value = true;
      // TODO Check if there is already a biggest fish,
      // If yes then update
      let found_fish = null;
      let query = {
        boat_number: boat_number_input.value.boat_number,
        competition_id: boat_number_input.value.competition_id,
        fish_id: comp_fish.id,
      };
      await FishService.getFishes(query).then((r) => {
        if (r.length) found_fish = r[0];
      });
      if (found_fish) {
        found_fish.weight = biggest_fish.value;
        await FishService.updateFish(found_fish._id, found_fish);
      } else {
        let fish = {
          fish_id: comp_fish.id,
          boat_number: boat_number_input.value.boat_number,
          captain_name: boat_number_input.value.captain_name,
          name: selected_fish.value,
          weight: biggest_fish.value,
          competition_id: boat_number_input.value.competition_id,
          cup_id: boat_number_input.value.cup_id,
        };
        //Otherwise
        await FishService.insertFishes([fish]).catch((e) => console.log(e));
      }

      notification.value = `notification.updated`;
      loading_fish.value = false;
      selected_fish.value = null;
      biggest_fish.value = null;
    } catch (err) {
      console.log(err.message);
    }
    text.value = "biggest-fish-saved";
    snackbar.value = true;
  }
}

// Save all weights to database

async function saveToDatabase(reset) {
  let fish_weights = [];
  let fish_weight = 0;
  let total_points = 0;
  // if biggest fish not yet saved, save it
  if (isBiggestFishVisible.value) await saveBiggestFish();

  //if reset == true, reset current weights to 0, otherwise update weights from inputs
  if (reset) {
    competition_boat.value.returned = false;
    // reset weights
    competition_boat.value.fishes = [];
    // Check if biggest fish and delete
  }
  // Don't reset points, add new values
  else {
    competition_boat.value.returned = true;
    // For every fish, get values from inputs
    inputs.value.forEach((input) => {
      fish_weight = input.value ? parseInt(input.value) : 0; // If input empty, replace with 0
      // Add fish object to array¨
      if (fish_weight) {
        fish_weights.push({
          id: input.id,
          weights: fish_weight,
        });
        total_points += fish_weight * input.multiplier;
      }
    });
  }

  competition_boat.value.total_points = total_points;
  competition_boat.value.fishes = fish_weights;
  const index = signees.value.findIndex(
    (item) => item._id === competition_boat.value._id,
  );
  signees.value.splice(index, 1, competition_boat.value);

  try {
    loading.value = true;
    loading_fish.value = true;

    await ResultService.updateResult(
      competition_boat.value._id,
      competition_boat.value,
    ).catch((e) => console.log(e));

    // Update competition state
    if (signees.value.filter((s) => !s.returned).length) {
      competition.value.state = "weighting";
    } else {
      competition.value.state = "all-finished";
      // Refresh to vuex
      store.refreshCompetition(competition.value);
      let newvalues = {
        $set: {
          state: competition.value.state,
        },
      };
      //await CompetitionService.updateCompetition(comp._id, comp);
      await CompetitionService.updateValues(competition.value._id, newvalues);
    }

    clearInputs();
    notification.value = `notification.updated`;
    // Update values for next signee
    boat_number_input.value = {};
    competition_boat.value = null;
  } catch (err) {
    console.log(err.message);
  }
  loading.value = false;
  loading_fish.value = false;
  searched.value = false;
}

async function calculateNormalResults(competition) {
  await ResultService.getResults({ competition_id: competition._id })
    .then((r) => {
      signees.value = r;
    })
    .catch((e) => {
      console.log(e);
    });

  signees.value.forEach((s) => {
    s.total_points = 0;
    if (s.fishes.length) {
      s.fishes.forEach((f) => {
        let competition_fish = competition.fishes.find((cf) => cf.id === f.id);
        s.total_points += f.weights * competition_fish.multiplier;
      });
    }
  });

  //this.signees = this.signees.filter((signee) => signee.returned == true);
  signees.value = signees.value.sort(function compare(a, b) {
    return parseInt(b.total_points) - parseInt(a.total_points);
  });

  let last_points = -1;
  let last_placement = -1;
  let placement = 1;
  signees.value.forEach((signee, index) => {
    // If competitor has same points as last competitor
    if (signee.total_points == last_points) {
      placement = last_placement;
    }
    // If no tie, add tied_competitors to placement, to give correct placement to next not tied competitor
    else {
      placement = index + 1;
      last_points = signee.total_points;
      last_placement = placement;
    }
    signee.placement = placement;
  });
}

function calculateTeamResults() {
  var team_names = [];
  let team_results = [];
  // Get all the team names
  signees.value.forEach((signee) => {
    if (signee.team !== "-" && signee.team !== null) {
      team_names.push(signee.team);
    }
  });
  // Only unique ones needed
  team_names = [...new Set(team_names)];

  // Get all the members of each team and add up their points
  team_names.forEach((team_name) => {
    let team = signees.value.filter((signee) => signee.team == team_name);
    let team_points = 0;
    let members = [];

    team.forEach((member) => {
      members.push(member.captain_name);
      team_points += member.total_points;
    });

    // If there aren't 3 members in a team, add "-"'s as members for nicer looking table
    if (members.length === 1) {
      members.push("-");
      members.push("-");
    }
    if (members.length === 2) {
      members.push("-");
    }
    team_results.push({
      name: team_name,
      captain_name_1: members[0],
      captain_name_2: members[1],
      captain_name_3: members[2],
      points: team_points.toLocaleString(),
    });
  });

  return team_results;
}

// Clear all inputs and selections

function clearInputs() {
  text.value = "clearing";
  snackbar.value = true;
  inputs.value.forEach((input) => {
    input.value = null;
  });
  competition_boat.value = null;
  boat_number_input.value = {};
  selected_fish.value = null;
  biggest_fish.value = null;
  searched.value = false;
}

// Runs when the component is created
// IF competition on localstorage
if (localStorage.getItem("competition") != null) {
  // update from database
  const competition = JSON.parse(localStorage.getItem("competition"));
  refreshCompetition(competition._id);
} else {
  console.log("No competition in localstorage!");
}
</script>
