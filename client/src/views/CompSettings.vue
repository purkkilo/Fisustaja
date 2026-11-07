<template>
  <!-- /comp-settings -->
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
        <v-row class="align-center">
          <v-col>
            <h1 style="margin: 30px">{{ $t("comp.is") }} määritykset</h1>
          </v-col>
          <v-col>
            <v-btn
              :disabled="!basic_info_validated"
              tile
              color="grey"
              @click="basic_info_validated = false"
              size="large"
              ><v-icon>mdi-cog-transfer</v-icon>{{ $t("modify-info") }}</v-btn
            >
          </v-col>
        </v-row>
      </v-card>

      <!-- if this.loading === false, meaning app isn't loading competition data from database -->

      <v-card
        style="background: transparent"
        elevation="3"
        v-if="basic_info_validated"
        variant="outlined"
      >
        <v-row v-if="!loading && competition" id="settings-info">
          <v-col>
            <v-row style="margin-top: 20px">
              <v-col md="10" offset-md="1">
                <v-card elevation="5" variant="outlined">
                  <v-card-title class="text-center">
                    <p class="text-headline-large">
                      {{ competition.name }}, {{ competition.locality }}
                    </p>
                  </v-card-title>
                  <v-list elevation="3" border>
                    <v-list-item v-if="competition.isCupCompetition">
                      <template v-slot:prepend>
                        <v-icon color="yellow-darken-4">mdi-trophy</v-icon>
                      </template>
                      <v-list-item-title>Cup</v-list-item-title>
                      <v-list-item-subtitle class="blue-text">
                        <b>{{ competition.cup_name }}</b>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon>mdi-calendar-today</v-icon>
                      </template>
                      <v-list-item-title>{{ $t("date") }}</v-list-item-title>
                      <v-list-item-subtitle class="blue-text">
                        <b
                          >{{ formatDate(competition.start_date) }} -
                          {{ formatDate(competition.end_date) }}</b
                        >
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item v-if="competition.isCupCompetition">
                      <template v-slot:prepend>
                        <v-icon color="green">mdi-clipboard-check</v-icon>
                      </template>
                      <v-list-item-title
                        >{{ $t("comp.is") }}
                        {{ $t("placement-points") }}</v-list-item-title
                      >
                      <v-list
                        elevation="5"
                        style="max-height: 400px; overflow-y: auto"
                        border
                      >
                        <div
                          v-for="(p, index) in placement_points_array"
                          :key="index"
                          style="margin-top: 20px"
                        >
                          <v-list-item>
                            <v-row class="align-center">
                              <v-col>
                                <h3>#{{ p.placement }}</h3>
                              </v-col>
                              <v-col>
                                <p>{{ p.points }}p</p>
                              </v-col>
                            </v-row>
                          </v-list-item>
                          <v-divider></v-divider>
                        </div>
                      </v-list>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item v-if="competition.isCupCompetition">
                      <template v-slot:prepend>
                        <v-icon color="green-darken-2"
                          >mdi-clipboard-check</v-icon
                        >
                      </template>
                      <v-list-item-title
                        >{{ $t("cup.normal") }}
                        {{ $t("participation-points") }}</v-list-item-title
                      >
                      <v-list-item-subtitle class="blue-text">
                        <b>{{ competition.cup_participation_points }}</b>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item v-if="competition.isCupCompetition">
                      <template v-slot:prepend>
                        <v-icon color="green-darken-1"
                          >mdi-calculator-variant-outline</v-icon
                        >
                      </template>
                      <v-list-item-title
                        >{{ $t("cup.normal") }}
                        {{ $t("multiplier") }}</v-list-item-title
                      >
                      <v-list-item-subtitle class="blue-text">
                        <b>x {{ competition.cup_points_multiplier }}</b>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon>mdi-incognito</v-icon>
                      </template>
                      <v-list-item-title
                        >{{ $t("is") }} {{ $t("public") }}</v-list-item-title
                      >
                      <v-list-item-subtitle class="blue-text">
                        <v-icon
                          v-if="competition.isPublic"
                          color="green-darken-2"
                          >mdi-check-bold</v-icon
                        >
                        <v-icon v-else color="red">mdi-close</v-icon>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="yellow-darken-4"
                          >mdi-trophy-award</v-icon
                        >
                      </template>
                      <v-list-item-title>{{
                        $t("comp.has-it-ended")
                      }}</v-list-item-title>
                      <v-list-item-subtitle class="blue-text">
                        <v-icon
                          v-if="competition.isFinished"
                          color="green-darken-2"
                          >mdi-check-bold</v-icon
                        >
                        <v-icon v-else color="red">mdi-close</v-icon>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
            <v-row class="fishes_summary">
              <v-col md="10" offset-md="1" class="scroll_table">
                <v-card variant="outlined">
                  <v-card-title class="text-center"
                    ><p class="text-headline-large">
                      {{ $t("fish-specs") }}
                    </p></v-card-title
                  >
                  <v-list elevation="3" border>
                    <div v-for="(fish, index) in fish_specs" :key="index">
                      <v-list-item>
                        <v-list-item-title>{{ fish.name }}</v-list-item-title>
                        <v-divider vertical></v-divider>
                        <v-list-item-subtitle class="green-text">
                          <b> x {{ fish.multiplier }}</b>
                        </v-list-item-subtitle>
                        <v-divider vertical></v-divider>
                        <v-list-item-subtitle class="blue-text">
                          <b>{{ fish.minsize }} cm</b>
                        </v-list-item-subtitle>
                      </v-list-item>
                      <v-divider></v-divider>
                    </div>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-if="!loading">
              <v-col style="margin-top: 20px">
                <v-btn
                  rounded
                  :color="
                    competition.isPublic ? 'grey-darken-4' : 'green-darken-4'
                  "
                  @click="publishCompetition(competition.isPublic)"
                  class="text-white"
                  :loading="updating"
                  size="large"
                >
                  <div v-if="competition.isPublic">
                    <v-icon>mdi-incognito</v-icon>{{ $t("button.set-private") }}
                  </div>
                  <div v-else>
                    <v-icon color="green">mdi-publish</v-icon
                    >{{ $t("button.set-public") }}
                  </div>
                </v-btn>
              </v-col>
              <v-col style="margin-top: 20px">
                <v-btn
                  rounded
                  :color="competition.isFinished ? 'yellow' : 'green-darken-3'"
                  @click="endCompetition(competition.isFinished)"
                  :loading="updating"
                  size="large"
                >
                  <div v-if="competition.isFinished" class="text-black">
                    <v-icon color="red-darken-2">mdi-cancel</v-icon>
                    {{ $t("button.set-not-complete") }}
                  </div>
                  <div v-else>
                    <v-icon color="yellow">mdi-trophy</v-icon>
                    {{ $t("button.set-complete") }}
                  </div>
                </v-btn>
              </v-col>
            </v-row>
            <v-row style="margin-bottom: 20px">
              <v-col md="3" offset-md="4" style="margin-top: 20px">
                <v-btn
                  block
                  color="red-darken-4"
                  class="text-white"
                  :loading="updating"
                  @click="deleteCompetition(competition._id, false)"
                  ><v-icon color="white">mdi-delete-forever</v-icon
                  >{{ $t("button.delete-comp") }}</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="justify-center align-center" v-if="loading">
          <v-col>
            <h2 class="text-white">{{ loadingMessage }}</h2>
            <ProgressBarQuery />
          </v-col>
        </v-row>
      </v-card>
      <v-card
        style="background: transparent"
        elevation="3"
        v-if="!basic_info_validated"
        variant="outlined"
      >
        <error-list :errors="errors"></error-list>
        <v-row>
          <v-col>
            <h1>{{ $t("modify-settings") }}</h1>
          </v-col>
        </v-row>
        <v-row v-if="!loading">
          <v-col cols="12">
            <v-row class="justify-center" v-if="competition">
              <v-col cols="6" class="input-fields">
                <v-text-field
                  :label="$t('comp.is') + ' ' + $t('name')"
                  v-model="name"
                  :maxlength="max_input"
                  :disabled="basic_info_validated"
                  :rules="rules"
                  :counter="max_input"
                />
              </v-col>
            </v-row>

            <v-row class="justify-center" v-if="competition">
              <v-col cols="6" class="input-fields">
                <v-text-field
                  :label="$t('locality')"
                  v-model="locality"
                  :maxlength="max_input"
                  :disabled="basic_info_validated"
                  :rules="rules"
                  :counter="max_input"
                />
              </v-col>
            </v-row>

            <v-row v-if="loading_cups">
              <v-col>
                <h2 class="text-white">
                  {{ $t("fetching") }} {{ $t("cup.many") }}...
                </h2>
                <ProgressBarQuery />
              </v-col>
            </v-row>
            <v-row class="justify-center align-center" v-if="competition">
              <v-col cols="6" class="input-fields">
                <span class="text-white">{{ $t("does-it-belong") }}?</span>
                <v-row class="justify-center align-center">
                  <v-spacer></v-spacer>
                  <v-col>
                    <v-radio-group
                      v-model="isCupCompetition"
                      :disabled="basic_info_validated"
                      inline
                    >
                      <v-radio :label="$t('yes')" value="Kyllä"></v-radio>
                      <v-radio :label="$t('no')" value="Ei"></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-spacer></v-spacer>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-if="!cups.length">
              <v-col>
                <h2
                  v-bind:class="{
                    'text-white': store.getTheme,
                  }"
                >
                  Cuppeja ei löytynyt...
                </h2>
              </v-col>
            </v-row>
            <v-row v-if="!competition.cup_name && competition.isCupCompetition">
              <v-col>
                <h2
                  v-bind:class="{
                    'text-white': store.getTheme,
                  }"
                >
                  Kilpailusta ei löytynyt cuppia...
                </h2>
              </v-col>
            </v-row>
            <v-row
              class="justify-center align-center"
              v-if="competition && isCupCompetition === 'Kyllä'"
            >
              <v-col cols="6" class="input-fields">
                <v-list-subheader class="text-white">
                  {{ $t("choose") }} {{ $t("cup.normal") }}
                </v-list-subheader>
                <v-select
                  label="Valitse Cup"
                  v-model="cup"
                  :items="cups"
                  item-title="select"
                  item-value="_id"
                  :hint="`${cup.name} (${cup.year})`"
                  :disabled="basic_info_validated"
                  return-object
                  single-line
                  variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
            <v-row
              class="justify-center"
              v-if="competition && isCupCompetition === 'Kyllä'"
            >
              <v-col cols="6">
                <h2 class="text-white">{{ $t("placement-points") }}</h2>
                <v-list
                  elevation="5"
                  style="max-height: 400px; overflow-y: auto"
                  border
                >
                  <div
                    v-for="(p, index) in placement_points_array"
                    :key="index"
                    style="margin-top: 20px"
                  >
                    <v-list-item>
                      <v-row class="align-center">
                        <v-col>
                          <h3>#{{ p.placement }}</h3>
                        </v-col>
                        <v-col>
                          <v-text-field
                            label="Pisteet"
                            v-model="p.points"
                            :rules="number_rules"
                            :disabled="basic_info_validated || !editPoints"
                            @blur="sortPlacements"
                          />
                        </v-col>
                        <v-col v-if="editPoints"
                          ><v-btn @click="removePlacement(index)" color="red">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-list-item>
                    <v-divider></v-divider>
                  </div>
                </v-list>
                <v-row v-if="editPoints">
                  <v-col>
                    <v-btn color="green" @click="addPlacement"
                      ><v-icon>mdi-plus</v-icon>{{ $t("add-placement") }}</v-btn
                    >
                  </v-col>
                </v-row>
                <v-row>
                  <v-col v-if="editPoints">
                    <v-btn
                      block
                      color="yellow"
                      class="text-black"
                      @click="cancelPoints"
                      ><v-icon>mdi-cancel</v-icon>{{ $t("cancel") }}</v-btn
                    >
                  </v-col>
                  <v-col>
                    <v-btn
                      block
                      :color="editPoints ? 'green-darken-2' : 'grey'"
                      @click="confirmPoints"
                      :disabled="basic_info_validated"
                      ><v-icon>mdi-check</v-icon
                      >{{ editPoints ? $t("confirm") : $t("modify") }}</v-btn
                    >
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="2" v-if="editPoints">
                <div style="margin-top: 200px">
                  <p
                    class="center-align flow-text"
                    v-bind:class="{
                      'text-white': store.getTheme,
                    }"
                  >
                    {{ $t("restore-original-points") }}:<br />#1 = 30, #2 = 28,
                    #3 = 26...
                  </p>
                  <v-btn color="red" @click="resetPoints">{{
                    $t("restore")
                  }}</v-btn>
                </div>
              </v-col>
            </v-row>

            <v-row
              class="justify-center"
              v-if="competition && isCupCompetition === 'Kyllä'"
            >
              <v-col cols="6" class="input-fields">
                <v-text-field
                  :label="$t('cup.normal') + ' ' + $t('participation-points')"
                  v-model="cup_participation_points"
                  append-icon="mdi-plus"
                  maxlength="6"
                  @click:append="
                    cup_participation_points >= 0
                      ? cup_participation_points++
                      : (cup_participation_points = 1)
                  "
                  prepend-icon="mdi-minus"
                  @click:prepend="
                    cup_participation_points >= 1
                      ? cup_participation_points--
                      : (cup_participation_points = 0)
                  "
                  @paste.prevent
                  :counter="6"
                  @keypress="isNumber($event, true)"
                  :rules="number_rules"
                  :disabled="basic_info_validated"
                />
              </v-col>
            </v-row>

            <v-row
              class="justify-center"
              v-if="competition && isCupCompetition === 'Kyllä'"
            >
              <v-col cols="6" class="input-fields">
                <v-text-field
                  :label="$t('cup.normal') + ' ' + $t('multiplier')"
                  v-model="cup_points_multiplier"
                  append-icon="mdi-plus"
                  maxlength="3"
                  @click:append="
                    cup_points_multiplier >= 1
                      ? (cup_points_multiplier += 0.5)
                      : (cup_points_multiplier = 1)
                  "
                  prepend-icon="mdi-minus"
                  @click:prepend="
                    cup_points_multiplier >= 1.5
                      ? (cup_points_multiplier -= 0.5)
                      : (cup_points_multiplier = 1)
                  "
                  @paste.prevent
                  :counter="3"
                  @keypress="isNumber($event, true)"
                  :rules="number_rules"
                  :disabled="basic_info_validated"
                />
              </v-col>
            </v-row>

            <v-row class="justify-center align-center" v-if="competition">
              <v-col cols="6" class="input-fields">
                <span class="text-white"
                  >{{ $t("is-there") }} {{ $t("comp.is-team") }}?</span
                >
                <v-row class="justify-center align-center">
                  <v-spacer></v-spacer>
                  <v-col>
                    <v-radio-group
                      v-model="isTeamCompetition"
                      :disabled="basic_info_validated"
                      inline
                    >
                      <v-radio :label="$t('yes')" value="Kyllä"></v-radio>
                      <v-radio :label="$t('no')" value="Ei"></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-spacer></v-spacer>
                </v-row>
              </v-col>
            </v-row>

            <v-row
              class="justify-center align-center"
              v-if="competition"
              style="padding: 20px; margin-bottom: 50px"
            >
              <v-col cols="12" xl="6" md="6">
                <span class="text-white">{{ $t("starting-date") }}</span>

                <v-date-picker
                  style="height: 480px"
                  v-model="start_date"
                  elevation="4"
                  class="mt-4"
                  first-day-of-week="1"
                  :disabled="basic_info_validated"
                  width="100%"
                ></v-date-picker>
              </v-col>
              <v-col cols="12" xl="6" md="6">
                <span class="text-white">{{ $t("ending-date") }}</span>

                <v-date-picker
                  style="height: 480px"
                  v-model="end_date"
                  elevation="4"
                  class="mt-4"
                  first-day-of-week="1"
                  :disabled="basic_info_validated"
                  width="100%"
                ></v-date-picker>
              </v-col>
            </v-row>

            <v-row
              class="justify-center align-center"
              v-if="competition"
              style="padding: 20px; margin-bottom: 50px"
            >
              <v-col cols="12" xl="6" md="6">
                <span class="text-white">{{ $t("starting-time") }}</span>

                <v-time-picker
                  v-model="start_time"
                  format="24hr"
                  scrollable
                  elevation="4"
                  :disabled="basic_info_validated"
                  width="100%"
                ></v-time-picker>
              </v-col>
              <v-col cols="12" xl="6" md="6">
                <span class="text-white">{{ $t("ending-time") }}</span>

                <v-time-picker
                  v-model="end_time"
                  format="24hr"
                  scrollable
                  elevation="4"
                  :disabled="basic_info_validated"
                  width="100%"
                ></v-time-picker>
              </v-col>
            </v-row>
            <v-row class="fishes_summary justify-center align-center">
              <v-col cols="12" xl="8" md="10">
                <table class="highlight centered responsive-table table_header">
                  <thead>
                    <tr>
                      <th>{{ $t("fish") }}</th>
                      <th>{{ $t("multiplier") }}</th>
                      <th>{{ $t("min-size") }}</th>
                      <th v-if="!basic_info_validated">{{ $t("delete") }}?</th>
                    </tr>
                  </thead>

                  <!-- for every fish in this.fish_specs, show info for that fish -->
                  <!-- vuedraggable 4: rows come from the #item slot -->
                  <draggable v-model="inputs" tag="tbody" item-key="id">
                    <template #item="{ element: input, index }">
                      <tr>
                        <th style="border: 1px solid black" scope="row">
                          <v-text-field
                            :label="$t('name')"
                            v-model="input.name"
                            :disabled="basic_info_validated"
                            :rules="rules"
                            :counter="max_input"
                          />
                        </th>
                        <td style="border: 1px solid black">
                          <v-text-field
                            :label="$t('multiplier')"
                            v-model="input.multiplier"
                            maxlength="4"
                            append-icon="mdi-plus"
                            @click:append="
                              parseInt(input.multiplier) >= 1
                                ? (input.multiplier += 0.5)
                                : (input.multiplier = 1)
                            "
                            prepend-icon="mdi-minus"
                            @click:prepend="
                              input.multiplier >= 1.5
                                ? (input.multiplier -= 0.5)
                                : (input.multiplier = 1)
                            "
                            @paste.prevent
                            :counter="3"
                            @keypress="isNumber($event, true)"
                            :rules="number_rules"
                            :disabled="basic_info_validated"
                          />
                        </td>
                        <td style="border: 1px solid black">
                          <v-text-field
                            :label="$t('min-size') + ' (cm)'"
                            v-model="input.minsize"
                            :maxlength="40"
                            :disabled="basic_info_validated"
                            :rules="rules"
                            :counter="40"
                          />
                        </td>
                        <td
                          style="border: 1px solid black"
                          v-if="!basic_info_validated"
                        >
                          <v-btn
                            icon
                            color="red-darken-4"
                            class="text-white"
                            :disabled="basic_info_validated"
                            @click="
                              deleteFish(index, input.original_name, false)
                            "
                            variant="text"
                            ><v-icon>mdi-delete</v-icon></v-btn
                          >
                        </td>
                      </tr>
                    </template>
                  </draggable>
                </table>
              </v-col>
            </v-row>
            <v-row v-if="!basic_info_validated">
              <v-col
                ><b>
                  <p>
                    {{ $t("create-competition.table-row-instruction") }}
                  </p></b
                ></v-col
              >
            </v-row>
            <v-row v-if="!basic_info_validated">
              <v-col>
                <v-btn
                  color="green-darken-4"
                  class="text-white"
                  @click="addInput"
                  size="large"
                  ><v-icon color="green-lighten-2">mdi-plus-circle</v-icon>
                  {{ $t("add") }} {{ $t("fish") }}</v-btn
                >
              </v-col>
            </v-row>

            <v-row v-if="!basic_info_validated" style="margin-bottom: 20px">
              <v-col md="6" v-if="competition">
                <v-btn
                  color="yellow"
                  class="text-black"
                  @click="setOriginalValues"
                  size="large"
                  ><v-icon color="red-darken-2">mdi-cancel</v-icon
                  >{{ $t("cancel") }}</v-btn
                >
              </v-col>
              <v-col md="6" v-if="competition">
                <v-btn color="green" @click="checkBasicInformation" size="large"
                  ><v-icon color="green-darken-4">mdi-check-outline</v-icon>
                  {{ $t("save") }}</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>

      <notification-bar :snackbar="snackbar" :text="text"></notification-bar>
    </v-container>
  </div>
</template>
<script setup>
import { nextTick, onMounted, ref } from "vue";
import { useMainStore } from "@/store";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { alert, confirm } from "@/plugins/alerts";
import CompetitionService from "../services/CompetitionService";
import CupService from "../services/CupService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
import Timedate from "../components/layout/Timedate.vue";
import constants from "../data/constants";
import draggable from "vuedraggable";
import {
  validateTime,
  formatDateToLocaleDateString,
  formatDate,
  isNumber,
} from "@/utils/format";
import NotificationBar from "../components/NotificationBar.vue";
import ErrorList from "../components/ErrorList.vue";

defineOptions({ name: "CompSettings" });
const store = useMainStore();
const { t } = useI18n();
const router = useRouter();

const dialog = ref(false);
const errors = ref([]);
const cups = ref([]);
const cup = ref({});
const competition = ref(null);
const name = ref(null);
const locality = ref(null);
const isCupCompetition = ref(null);
const cup_participation_points = ref(null);
const cup_points_multiplier = ref(null);
const isTeamCompetition = ref(null);
const fish_specs = ref(null);
const start_date = ref(null);
const end_date = ref(null);
const start_time = ref(null);
const end_time = ref(null);
const loading = ref(false);
const loadingMessage = ref("Haetaan määrityksiä...");
const loading_cups = ref(false);
const updating = ref(false);
const tab = ref(null);
const basic_info_validated = ref(true);
const inputs = ref([]);
const rules = ref([
  (value) => !!value || "Kenttä ei voi jäädä tyhjäksi!",
  (value) => (value || "").length <= max_input.value || "Enintään 40 merkkiä",
]);
const number_rules = ref([
  (value) => !!value || "Kenttä ei voi jäädä tyhjäksi!",
  (value) => !isNaN(value || "") || "Ei ole numero!",
  (value) => (value || "") >= 0 || "Numeron pitää olla positiivinen!",
]);
const max_input = ref(40);
const placement_points_array = ref([]);
const temp_placement_points_array = ref([]);
const snackbar = ref(false);
const text = ref("");
const editPoints = ref(false);
const error = ref(null);
const validated = ref(null);

function addPlacement() {
  const lastItem =
    placement_points_array.value[placement_points_array.value.length - 1];
  placement_points_array.value.push({
    points: lastItem.points > 1 ? lastItem.points - 1 : 1,
    placement: lastItem.placement + 1,
  });
}

function removePlacement(index) {
  placement_points_array.value.splice(index, 1);
}

function sortPlacements() {
  placement_points_array.value.sort((a, b) => b.points - a.points);
  savePlacements();
}

function savePlacements() {
  placement_points_array.value.forEach((p, index) => {
    p.placement = index + 1;
  });
}

function cancelPoints() {
  editPoints.value = !editPoints.value;
  placement_points_array.value = JSON.parse(
    JSON.stringify(temp_placement_points_array.value),
  );
}

function confirmPoints() {
  savePlacements();
  editPoints.value = !editPoints.value;
  temp_placement_points_array.value = JSON.parse(
    JSON.stringify(placement_points_array.value),
  );
}

function resetPoints() {
  placement_points_array.value = JSON.parse(
    JSON.stringify(constants.placement_points),
  );
  editPoints.value = !editPoints.value;
}

async function publishCompetition(isPublic) {
  competition.value.isPublic = !isPublic;
  const newvalues = {
    $set: { isPublic: competition.value.isPublic },
  };
  updateToDatabase(competition.value, newvalues);
}

async function endCompetition(isFinished) {
  competition.value.isFinished = !isFinished;
  competition.value.isFinished
    ? (competition.value.state = "ended")
    : (competition.value.state = "not-finished");

  const newvalues = {
    $set: {
      isFinished: competition.value.isFinished,
      state: competition.value.state,
    },
  };
  updateToDatabase(competition.value, newvalues);
}

async function updateToDatabase(_competition, newvalues) {
  try {
    store.refreshCompetition(_competition);
    updating.value = true;
    await CompetitionService.updateValues(competition.value._id, newvalues);
  } catch (err) {
    console.error(err.message);
  }
  updating.value = false;
}

async function getCups() {
  loading_cups.value = true;
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user["_id"];
  // Get Cups
  try {
    cups.value = await CupService.getCups({
      user_id: user_id,
    });
    if (cups.value.length) {
      cups.value.sort(function compare(a, b) {
        return a.name - b.name;
      });
      cups.value.forEach((_cup) => {
        _cup.select = `${_cup.name} (${_cup.year})`;
      });
      if (competition.value.isCupCompetition) {
        let temp_cup = cups.value.find((_cup) => {
          return competition.value.cup_id === _cup._id;
        });
        if (temp_cup) {
          cup.value = temp_cup;
        }
      }
    }
  } catch (err) {
    error.value = err.message;
  }
  loading_cups.value = false;
}

// Update competition data from database

async function refreshCompetition(competition_id) {
  loadingMessage.value = "Haetaan määrityksiä...";
  loading.value = true;
  inputs.value = [];
  try {
    //Get competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
    let _competition = await CompetitionService.getCompetitions({
      _id: competition_id,
    });
    // IF competition found from database
    if (_competition) {
      //TODO make a test for this?
      competition.value = _competition;
      // Update to vuex, Assing variables from vuex (see client/store/index.js)
      store.refreshCompetition(_competition);
      fish_specs.value = store.getCompetitionFishes;
      setOriginalValues();
      if (!cups.value.length) {
        getCups();
      }
    } else {
      console.log("No competition found on database...");
    }
  } catch (err) {
    console.error(err.message);
  }
  loading.value = false;
}

//filter other characters out for number inputs

function addInput() {
  inputs.value.push({
    // unique even after deleting a row (draggable uses it as the row key)
    id: Math.max(inputs.value.length - 1, ...inputs.value.map((i) => i.id)) + 1,
    name: "",
    multiplier: 1,
    minsize: "0",
    weights: 0,
    color: generateRandomColor(),
  });
}

function deleteFish(index, fish_name, confirmed) {
  if (confirmed) {
    try {
      inputs.value.splice(index, 1);
      competition.value.signees.forEach((signee) => {
        if (signee.weights.length) {
          let signee_index = signee.weights.findIndex((fish) => {
            return fish.name === fish_name;
          });
          if (signee_index > -1) {
            // Replace
            signee.weights.splice(signee_index, 1);
          }
        }
      });
    } catch (err) {
      console.error = err.message;
    }
  } else {
    // demos for this -->  https://constkhi.github.io/vue-simple-alert/
    confirm("Oletko varma?", "Poista kala", "question")
      .then((r) => {
        if (r) {
          deleteFish(index, fish_name, r);
        }
      })
      .catch((error) => {
        if (error) {
          console.error(error);
        }
      });
  }
}

function setOriginalValues() {
  inputs.value = [];
  fish_specs.value.forEach((fish, index) => {
    inputs.value.push({
      id: index,
      name: fish.name,
      multiplier: parseInt(fish.multiplier),
      minsize: fish.minsize,
      weights: parseInt(fish.weights),
      color: fish.color,
    });
  });
  name.value = competition.value.name;
  locality.value = competition.value.locality;

  isTeamCompetition.value = competition.value.isTeamCompetition
    ? "Kyllä"
    : "Ei";
  isCupCompetition.value = competition.value.isCupCompetition ? "Kyllä" : "Ei";

  if (competition.value.isCupCompetition) {
    placement_points_array.value = [...competition.value.cup_placement_points];
    cup_participation_points.value = competition.value.cup_participation_points;
    cup_points_multiplier.value = competition.value.cup_points_multiplier;
  } else {
    placement_points_array.value = constants.placement_points;
    cup_participation_points.value = 5;
    cup_points_multiplier.value = 1;
  }
  start_date.value = new Date(competition.value.start_date)
    .toISOString()
    .substring(0, 10);
  end_date.value = new Date(competition.value.end_date)
    .toISOString()
    .substring(0, 10);
  start_time.value = competition.value.start_time;
  end_time.value = competition.value.end_time;
  basic_info_validated.value = true;
}

// Generate random colors for the fish chart in Result.vue (since adding fishes is dynamic)
//TODO look for 8-15 good colors to add/choose from, maybe with color picker next to fish name

function generateRandomColor() {
  var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  return randomColor;
}

// Add error to error array and direct user to it

function showError(error) {
  errors.value.push(error);
  nextTick(() => {
    document.getElementById("error-list").scrollIntoView();
  });
}

// Check competitions basic information (Perustiedot)

function checkBasicInformation() {
  loadingMessage.value = "Päivitetään tietoja...";
  errors.value = [];
  basic_info_validated.value = false;
  validated.value = false;

  var isDateValid = !isNaN(new Date(start_date.value).getTime());
  var isEndDateValid = !isNaN(new Date(end_date.value).getTime());

  var isStartTimeValid = validateTime(start_time.value);
  var isEndTimeValid = validateTime(end_time.value);

  // Check other variables
  if (!name.value) {
    showError("errors.missing-comp-name");
  }

  // Check other variables
  if (!locality.value) {
    showError("errors.missing-comp-locality");
  }

  if (isCupCompetition.value === "Kyllä") {
    if (!cup.value._id) {
      showError("errors.cup-not-selected");
    }
    if (!placement_points_array.value.length) {
      showError("errors.missing-placement-points");
    }
    if (!cup_participation_points.value) {
      showError("errors.missing-participation-points");
    }
    if (!cup_points_multiplier.value) {
      showError("errors.missing-multiplier");
    }
    if (cup_points_multiplier.value < 0.1) {
      showError("errors.invalid-multiplier");
    }
  }

  if (!start_time.value || !isStartTimeValid) {
    !start_time.value == true
      ? showError("errors.missing-start-time")
      : showError("errors.invalid-time");
  }
  if (!end_time.value || !isEndTimeValid) {
    !end_time.value == true
      ? showError("errors.missing-end-time")
      : showError("errors.invalid-time");
  }
  if (!start_date.value || !isDateValid) {
    showError("errors.missing-start-date");
  }
  if (!end_date.value || !isEndDateValid) {
    showError("errors.missing-end-date");
  }

  // Check all the inputs
  inputs.value.forEach((input) => {
    if (!input.name) {
      showError("errors.missing-fish-name");
    }
    if (!input.multiplier) {
      showError(
        `${input.name ? input.name : t("fish-genetive")} ${t(
          "errors.invalid-fish-multiplier",
        )}`,
      );
    }
    if (!input.minsize) {
      showError(
        `${input.name ? input.name : t("fish-genetive")} ${t(
          "errors.invalid-fish-minsize",
        )}`,
      );
    }
  });

  // If all inputs validated
  if (!errors.value.length) {
    // If dates are valid, check that start_date is before end_date
    let _start_date = new Date(start_date.value);
    let _start_time = start_time.value.split(":").map(Number);
    _start_date.setHours(_start_time[0], _start_time[1]);

    let _end_date = new Date(end_date.value);
    let _end_time = end_time.value.split(":").map(Number);
    _end_date.setHours(_end_time[0], _end_time[1]);
    if (_end_date < _start_date) {
      showError("errors.invalid-times");
    } else {
      if (isCupCompetition.value === "Kyllä") {
        // Basic info, change all the competition variables with values from inputs
        competition.value.cup_id = cup.value._id;
        competition.value.cup_name = cup.value.name;
        competition.value.cup_participation_points = Number(
          cup_participation_points.value,
        );
        let temp_placement_points = [];
        // IF the multiplier has been changed, and is different from 1, calculate new points, else just use template array
        if (
          competition.value.cup_points_multiplier !==
            cup_points_multiplier.value &&
          cup_points_multiplier.value !== 1.0
        ) {
          let temp_placement = 1;
          placement_points_array.value.forEach((placement_point) => {
            temp_placement_points.push({
              placement: temp_placement,
              points: placement_point.points * cup_points_multiplier.value,
            });
            temp_placement++;
          });
        } else {
          temp_placement_points = [...placement_points_array.value];
        }
        competition.value.cup_points_multiplier = cup_points_multiplier.value;
        competition.value.cup_placement_points = temp_placement_points;
      } else {
        delete competition.value.cup_id;
        delete competition.value.cup_name;
        delete competition.value.cup_points_multiplier;
        delete competition.value.cup_placement_points;
        delete competition.value.cup_participation_points;
      }

      if (isCupCompetition.value === "Ei") {
        delete competition.value.teams;
      }

      competition.value.name = name.value;
      competition.value.locality = locality.value;
      competition.value.isTeamCompetition =
        isTeamCompetition.value === "Ei" ? false : true;
      competition.value.isCupCompetition =
        isCupCompetition.value === "Ei" ? false : true;
      competition.value.start_date = _start_date.toISOString();
      competition.value.end_date = _end_date.toISOString();
      competition.value.start_time = start_time.value;
      competition.value.end_time = end_time.value;
      //Update to database, calculate current standings and points in case multipliers have been changed
      competition.value.fishes = fish_specs.value = inputs.value;
      updateCompetition(competition.value);
      basic_info_validated.value = true;
    }
  }
}

// Update competition to database

async function updateCompetition(competition) {
  try {
    store.refreshCompetition(competition);
    loading.value = true;
    await CompetitionService.updateCompetition(competition._id, competition);
    tab.value = "show-settings";
  } catch (err) {
    console.error(err.message);
  }
  loading.value = false;
  text.value = "notification.updated";
  snackbar.value = true;
}

// Delete competition

async function deleteCompetition(id, confirmed) {
  // If user clicked "OK" on confirmation box
  if (confirmed) {
    text.value = "notification.deleting";
    snackbar.value = true;
    try {
      //Delete competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
      await CompetitionService.deleteCompetition(id);
      // Competition deleted, remove it from localstorage and vuex
      store.competition = null;
      localStorage.removeItem("competition");
      // Redirect to dashboard
      router.push({ path: "/dashboard" });
    } catch (err) {
      error.value = err.message;
    }
  } else {
    confirm(t("confirm-dialog"), t("button.delete-comp"), "question")
      .then((r) => {
        if (r) {
          deleteCompetition(id, r);
        }
      })
      .catch((_error) => {
        if (_error) {
          console.error(_error);
        }
      });
  }
}

// Runs when the component is created
if (localStorage.getItem("competition") != null) {
  const competition = JSON.parse(localStorage.getItem("competition"));
  const competition_id = competition["_id"];
  refreshCompetition(competition_id);
} else {
  console.log("No competition in localstorage!");
}

placement_points_array.value = JSON.parse(
  JSON.stringify(constants.placement_points),
);

onMounted(() => {});
</script>
