<template>
  <!-- /comp-settings -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div>
    <Timedate />

    <v-container
      v-bind:class="{
        mobile: $vuetify.breakpoint.width < 800,
        browser: $vuetify.breakpoint.width >= 800,
        wide: $vuetify.breakpoint.width >= 1200,
      }"
    >
      <v-card
        style="background: transparent"
        elevation="10"
        outlined
        :dark="$store.getters.getTheme"
      >
        <v-row align="center">
          <v-col>
            <h1 style="margin: 30px">{{ $t("comp.is") }} määritykset</h1>
          </v-col>
          <v-col>
            <v-btn
              :disabled="!basic_info_validated"
              large
              tile
              color="grey"
              @click="basic_info_validated = false"
              ><v-icon>mdi-cog-transfer</v-icon>{{ $t("modify-info") }}</v-btn
            >
          </v-col>
        </v-row>
      </v-card>

      <!-- if this.loading === false, meaning app isn't loading competition data from database -->

      <v-card
        style="background: transparent"
        elevation="10"
        outlined
        :dark="$store.getters.getTheme"
        v-if="basic_info_validated"
      >
        <v-row v-if="!loading && competition" id="settings-info">
          <v-col>
            <v-row style="margin-top: 20px">
              <v-col md="10" offset-md="1">
                <v-card :dark="$store.getters.getTheme" elevation="20" outlined>
                  <v-card-title class="text-center">
                    <p class="display-1">
                      {{ competition.name }}, {{ competition.locality }}
                    </p>
                  </v-card-title>
                  <v-list outlined elevation="10">
                    <v-list-item v-if="competition.isCupCompetition">
                      <v-list-item-icon>
                        <v-icon color="yellow darken-4">mdi-trophy</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Cup</v-list-item-title>
                      <v-list-item-subtitle class="blue-text">
                        <b>{{ competition.cup_name }}</b>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-calendar-today</v-icon>
                      </v-list-item-icon>
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
                      <v-list-item-icon>
                        <v-icon color="green">mdi-clipboard-check</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title
                          >{{ $t("comp.is") }}
                          {{ $t("placement-points") }}</v-list-item-title
                        >
                        <v-list
                          :dark="$store.getters.getTheme"
                          elevation="20"
                          outlined
                          style="max-height: 400px; overflow-y: auto"
                        >
                          <div
                            v-for="(p, index) in placement_points_array"
                            :key="index"
                            style="margin-top: 20px"
                          >
                            <v-list-item>
                              <v-row align="center">
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
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item v-if="competition.isCupCompetition">
                      <v-list-item-icon>
                        <v-icon color="green darken-2"
                          >mdi-clipboard-check</v-icon
                        >
                      </v-list-item-icon>
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
                      <v-list-item-icon>
                        <v-icon color="green darken-1"
                          >mdi-calculator-variant-outline</v-icon
                        >
                      </v-list-item-icon>
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
                      <v-list-item-icon>
                        <v-icon>mdi-incognito</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title
                        >{{ $t("is") }} {{ $t("public") }}</v-list-item-title
                      >
                      <v-list-item-subtitle class="blue-text">
                        <v-icon
                          v-if="competition.isPublic"
                          color="green darken-2"
                          >mdi-check-bold</v-icon
                        >
                        <v-icon v-else color="red">mdi-close</v-icon>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="yellow darken-4"
                          >mdi-trophy-award</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-title>{{
                        $t("comp.has-it-ended")
                      }}</v-list-item-title>
                      <v-list-item-subtitle class="blue-text">
                        <v-icon
                          v-if="competition.isFinished"
                          color="green darken-2"
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
                <v-card :dark="$store.getters.getTheme" outlined>
                  <v-card-title class="text-center"
                    ><p class="display-1">
                      {{ $t("fish-specs") }}
                    </p></v-card-title
                  >
                  <v-list outlined elevation="10">
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
                  large
                  rounded
                  :color="
                    competition.isPublic ? 'grey darken-4' : 'green darken-4'
                  "
                  @click="publishCompetition(competition.isPublic)"
                  class="white--text"
                  :loading="updating"
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
                  large
                  rounded
                  :color="competition.isFinished ? 'yellow' : 'green darken-3'"
                  @click="endCompetition(competition.isFinished)"
                  :loading="updating"
                >
                  <div v-if="competition.isFinished" class="black--text">
                    <v-icon color="red darken-2">mdi-cancel</v-icon>
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
                  color="red darken-4"
                  class="white--text"
                  :loading="updating"
                  @click="deleteCompetition(competition._id, false)"
                  ><v-icon color="white">mdi-delete-forever</v-icon
                  >{{ $t("button.delete-comp") }}</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row v-if="loading" align="center" justify="center">
          <v-col>
            <h2 class="white--text">{{ loadingMessage }}</h2>
            <ProgressBarQuery />
          </v-col>
        </v-row>
      </v-card>
      <v-card
        style="background: transparent"
        elevation="10"
        outlined
        :dark="$store.getters.getTheme"
        v-if="!basic_info_validated"
      >
        <error-list :errors="errors"></error-list>
        <v-row>
          <v-col>
            <h1>{{ $t("modify-settings") }}</h1>
          </v-col>
        </v-row>
        <v-row v-if="!loading">
          <v-col cols="12">
            <v-row v-if="competition" justify="center">
              <v-col cols="6" class="input-fields">
                <v-text-field
                  :dark="$store.getters.getTheme"
                  :label="$t('comp.is') + ' ' + $t('name')"
                  v-model="name"
                  :maxlength="max_input"
                  :disabled="basic_info_validated"
                  :rules="rules"
                  :counter="max_input"
                />
              </v-col>
            </v-row>

            <v-row v-if="competition" justify="center">
              <v-col cols="6" class="input-fields">
                <v-text-field
                  :dark="$store.getters.getTheme"
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
                <h2 class="white--text">
                  {{ $t("fetching") }} {{ $t("cup.many") }}...
                </h2>
                <ProgressBarQuery />
              </v-col>
            </v-row>
            <v-row v-if="competition" justify="center" align="center">
              <v-col cols="6" class="input-fields">
                <span class="white--text">{{ $t("does-it-belong") }}?</span>
                <v-row justify="center" align="center">
                  <v-spacer></v-spacer>
                  <v-col>
                    <v-radio-group
                      v-model="isCupCompetition"
                      row
                      :disabled="basic_info_validated"
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
                    'white--text': $store.getters.getTheme,
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
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Kilpailusta ei löytynyt cuppia...
                </h2>
              </v-col>
            </v-row>
            <v-row
              v-if="competition && isCupCompetition === 'Kyllä'"
              align="center"
              justify="center"
            >
              <v-col cols="6" class="input-fields">
                <v-subheader class="white--text">
                  {{ $t("choose") }} {{ $t("cup.normal") }}
                </v-subheader>
                <v-select
                  label="Valitse Cup"
                  :dark="$store.getters.getTheme"
                  v-model="cup"
                  :items="cups"
                  item-text="select"
                  item-value="_id"
                  :hint="`${cup.name} (${cup.year})`"
                  :disabled="basic_info_validated"
                  outlined
                  return-object
                  single-line
                ></v-select>
              </v-col>
            </v-row>
            <v-row
              v-if="competition && isCupCompetition === 'Kyllä'"
              justify="center"
            >
              <v-col cols="6">
                <h2 class="white--text">{{ $t("placement-points") }}</h2>
                <v-list
                  :dark="$store.getters.getTheme"
                  elevation="20"
                  outlined
                  style="max-height: 400px; overflow-y: auto"
                >
                  <div
                    v-for="(p, index) in placement_points_array"
                    :key="index"
                    style="margin-top: 20px"
                  >
                    <v-list-item>
                      <v-row align="center">
                        <v-col>
                          <h3>#{{ p.placement }}</h3>
                        </v-col>
                        <v-col>
                          <v-text-field
                            :dark="$store.getters.getTheme"
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
                      class="black--text"
                      @click="cancelPoints"
                      ><v-icon>mdi-cancel</v-icon>{{ $t("cancel") }}</v-btn
                    >
                  </v-col>
                  <v-col>
                    <v-btn
                      block
                      :color="editPoints ? 'green darken-2' : 'grey'"
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
                      'white--text': $store.getters.getTheme,
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
              v-if="competition && isCupCompetition === 'Kyllä'"
              justify="center"
            >
              <v-col cols="6" class="input-fields">
                <v-text-field
                  :dark="$store.getters.getTheme"
                  :label="$t('cup.normal') + ' ' + $t('participation-points')"
                  v-model="cup_participation_points"
                  append-outer-icon="add"
                  maxlength="6"
                  @click:append-outer="
                    cup_participation_points >= 0
                      ? cup_participation_points++
                      : (cup_participation_points = 1)
                  "
                  prepend-icon="remove"
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
              v-if="competition && isCupCompetition === 'Kyllä'"
              justify="center"
            >
              <v-col cols="6" class="input-fields">
                <v-text-field
                  :dark="$store.getters.getTheme"
                  :label="$t('cup.normal') + ' ' + $t('multiplier')"
                  v-model="cup_points_multiplier"
                  append-outer-icon="add"
                  maxlength="3"
                  @click:append-outer="
                    cup_points_multiplier >= 1
                      ? (cup_points_multiplier += 0.5)
                      : (cup_points_multiplier = 1)
                  "
                  prepend-icon="remove"
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

            <v-row v-if="competition" justify="center" align="center">
              <v-col cols="6" class="input-fields">
                <span class="white--text"
                  >{{ $t("is-there") }} {{ $t("comp.is-team") }}?</span
                >
                <v-row justify="center" align="center">
                  <v-spacer></v-spacer>
                  <v-col>
                    <v-radio-group
                      :dark="$store.getters.getTheme"
                      v-model="isTeamCompetition"
                      row
                      :disabled="basic_info_validated"
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
              v-if="competition"
              style="padding: 20px; margin-bottom: 50px"
              justify="center"
              align="center"
            >
              <v-col cols="12" xl="6" l="6" md="6" s="10" xs="12">
                <span class="white--text">{{ $t("starting-date") }}</span>

                <v-date-picker
                  :dark="$store.getters.getTheme"
                  style="height: 480px"
                  v-model="start_date"
                  full-width
                  elevation="15"
                  class="mt-4"
                  first-day-of-week="1"
                  :disabled="basic_info_validated"
                ></v-date-picker>
              </v-col>
              <v-col cols="12" xl="6" l="6" md="6" s="10" xs="12">
                <span class="white--text">{{ $t("ending-date") }}</span>

                <v-date-picker
                  :dark="$store.getters.getTheme"
                  style="height: 480px"
                  v-model="end_date"
                  full-width
                  elevation="15"
                  class="mt-4"
                  first-day-of-week="1"
                  :disabled="basic_info_validated"
                ></v-date-picker>
              </v-col>
            </v-row>

            <v-row
              v-if="competition"
              style="padding: 20px; margin-bottom: 50px"
              justify="center"
              align="center"
            >
              <v-col cols="12" xl="6" l="6" md="6" s="10" xs="12">
                <span class="white--text">{{ $t("starting-time") }}</span>

                <v-time-picker
                  :dark="$store.getters.getTheme"
                  v-model="start_time"
                  format="24hr"
                  full-width
                  scrollable
                  elevation="15"
                  :disabled="basic_info_validated"
                ></v-time-picker>
              </v-col>
              <v-col cols="12" xl="6" l="6" md="6" s="10" xs="12">
                <span class="white--text">{{ $t("ending-time") }}</span>

                <v-time-picker
                  :dark="$store.getters.getTheme"
                  v-model="end_time"
                  format="24hr"
                  full-width
                  scrollable
                  elevation="15"
                  :disabled="basic_info_validated"
                ></v-time-picker>
              </v-col>
            </v-row>
            <v-row class="fishes_summary" justify="center" align="center">
              <v-col cols="12" xl="8" l="8" md="10" s="10" xs="12">
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
                  <draggable v-model="inputs" tag="tbody">
                    <tr v-for="(input, index) in inputs" :key="index">
                      <th style="border: 1px solid black" scope="row">
                        <v-text-field
                          :dark="$store.getters.getTheme"
                          :label="$t('name')"
                          v-model="input.name"
                          :disabled="basic_info_validated"
                          :rules="rules"
                          :counter="max_input"
                        />
                      </th>
                      <td style="border: 1px solid black">
                        <v-text-field
                          :dark="$store.getters.getTheme"
                          :label="$t('multiplier')"
                          v-model="input.multiplier"
                          maxlength="4"
                          append-outer-icon="add"
                          @click:append-outer="
                            parseInt(input.multiplier) >= 1
                              ? (input.multiplier += 0.5)
                              : (input.multiplier = 1)
                          "
                          prepend-icon="remove"
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
                          :dark="$store.getters.getTheme"
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
                          color="red darken-4"
                          class="white--text"
                          :disabled="basic_info_validated"
                          @click="deleteFish(index, input.original_name, false)"
                          ><v-icon>mdi-delete</v-icon></v-btn
                        >
                      </td>
                    </tr>
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
                  large
                  color="green darken-4"
                  class="white--text"
                  @click="addInput"
                  ><v-icon color="green lighten-2">mdi-plus-circle</v-icon>
                  {{ $t("add") }} {{ $t("fish") }}</v-btn
                >
              </v-col>
            </v-row>

            <v-row v-if="!basic_info_validated" style="margin-bottom: 20px">
              <v-col md="6" v-if="competition">
                <v-btn
                  large
                  color="yellow"
                  class="black--text"
                  @click="setOriginalValues"
                  ><v-icon color="red darken-2">mdi-cancel</v-icon
                  >{{ $t("cancel") }}</v-btn
                >
              </v-col>
              <v-col md="6" v-if="competition">
                <v-btn large color="green" @click="checkBasicInformation"
                  ><v-icon color="green darken-4">mdi-check-outline</v-icon>
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
<script>
import CompetitionService from "../services/CompetitionService";
import CupService from "../services/CupService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import Timedate from "../components/layout/Timedate";
import constants from "../data/constants";
import draggable from "vuedraggable";
import {
  validateTime,
  formatDateToLocaleDateString,
  formatDate,
  isNumber,
} from "../shared";
import NotificationBar from "../components/NotificationBar.vue";
import ErrorList from "../components/ErrorList.vue";

export default {
  name: "CompSettings",
  components: {
    ProgressBarQuery,
    Timedate,
    draggable,
    NotificationBar,
    ErrorList,
  },
  data() {
    return {
      dialog: false,
      errors: [],
      cups: [],
      cup: {},
      competition: null,
      name: null,
      locality: null,
      isCupCompetition: null,
      cup_participation_points: null,
      cup_points_multiplier: null,
      isTeamCompetition: null,
      fish_specs: null,
      start_date: null,
      end_date: null,
      start_time: null,
      end_time: null,
      loading: false,
      loadingMessage: "Haetaan määrityksiä...",
      loading_cups: false,
      updating: false,
      tab: null,
      basic_info_validated: true,
      inputs: [],
      rules: [
        (value) => !!value || "Kenttä ei voi jäädä tyhjäksi!",
        (value) =>
          (value || "").length <= this.max_input || "Enintään 40 merkkiä",
      ],
      number_rules: [
        (value) => !!value || "Kenttä ei voi jäädä tyhjäksi!",
        (value) => !isNaN(value || "") || "Ei ole numero!",
        (value) => (value || "") >= 0 || "Numeron pitää olla positiivinen!",
      ],
      max_input: 40,
      placement_points_array: [],
      temp_placement_points_array: [],
      snackbar: false,
      text: "",
      editPoints: false,
    };
  },
  created() {
    if (localStorage.getItem("competition") != null) {
      const competition = JSON.parse(localStorage.getItem("competition"));
      const competition_id = competition["_id"];
      this.refreshCompetition(competition_id);
    } else {
      console.log("No competition in localstorage!");
    }

    this.placement_points_array = JSON.parse(
      JSON.stringify(constants.placement_points)
    );
  },
  mounted() {},
  methods: {
    formatDate: formatDate,
    formatDateToLocaleDateString: formatDateToLocaleDateString,
    addPlacement() {
      const lastItem =
        this.placement_points_array[this.placement_points_array.length - 1];
      this.placement_points_array.push({
        points: lastItem.points > 1 ? lastItem.points - 1 : 1,
        placement: lastItem.placement + 1,
      });
    },
    removePlacement(index) {
      this.placement_points_array.splice(index, 1);
    },
    sortPlacements() {
      this.placement_points_array.sort((a, b) => b.points - a.points);
      this.savePlacements();
    },
    savePlacements() {
      this.placement_points_array.forEach((p, index) => {
        p.placement = index + 1;
      });
    },
    cancelPoints() {
      this.editPoints = !this.editPoints;
      this.placement_points_array = JSON.parse(
        JSON.stringify(this.temp_placement_points_array)
      );
    },
    confirmPoints() {
      this.savePlacements();
      this.editPoints = !this.editPoints;
      this.temp_placement_points_array = JSON.parse(
        JSON.stringify(this.placement_points_array)
      );
    },
    resetPoints() {
      this.placement_points_array = JSON.parse(
        JSON.stringify(constants.placement_points)
      );
      this.editPoints = !this.editPoints;
    },

    async publishCompetition(isPublic) {
      this.competition.isPublic = !isPublic;
      const newvalues = {
        $set: { isPublic: this.competition.isPublic },
      };
      this.updateToDatabase(this.competition, newvalues);
    },
    async endCompetition(isFinished) {
      this.competition.isFinished = !isFinished;
      this.competition.isFinished
        ? (this.competition.state = "ended")
        : (this.competition.state = "not-finished");

      const newvalues = {
        $set: {
          isFinished: this.competition.isFinished,
          state: this.competition.state,
        },
      };
      this.updateToDatabase(this.competition, newvalues);
    },
    async updateToDatabase(competition, newvalues) {
      try {
        this.$store.commit("refreshCompetition", competition);
        this.updating = true;
        await CompetitionService.updateValues(this.competition._id, newvalues);
      } catch (err) {
        console.error(err.message);
      }
      this.updating = false;
    },
    async getCups() {
      this.loading_cups = true;
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user["_id"];
      // Get Cups
      try {
        this.cups = await CupService.getCups({
          user_id: user_id,
        });
        if (this.cups.length) {
          this.cups.sort(function compare(a, b) {
            return a.name - b.name;
          });
          this.cups.forEach((cup) => {
            cup.select = `${cup.name} (${cup.year})`;
          });
          if (this.competition.isCupCompetition) {
            let temp_cup = this.cups.find((cup) => {
              return this.competition.cup_id === cup._id;
            });
            if (temp_cup) {
              this.cup = temp_cup;
            }
          }
        }
      } catch (err) {
        this.error = err.message;
      }
      this.loading_cups = false;
    },
    // Update competition data from database
    async refreshCompetition(competition_id) {
      this.loadingMessage = "Haetaan määrityksiä...";
      this.loading = true;
      this.inputs = [];
      try {
        //Get competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
        let competition = await CompetitionService.getCompetitions({
          _id: competition_id,
        });
        // IF competition found from database
        if (competition) {
          //TODO make a test for this?
          this.competition = competition;
          // Update to vuex, Assing variables from vuex (see client/store/index.js)
          this.$store.commit("refreshCompetition", competition);
          this.fish_specs = this.$store.getters.getCompetitionFishes;
          this.setOriginalValues();
          if (!this.cups.length) {
            this.getCups();
          }
        } else {
          console.log("No competition found on database...");
        }
      } catch (err) {
        console.error(err.message);
      }
      this.loading = false;
    },
    //filter other characters out for number inputs
    isNumber: isNumber,
    addInput() {
      this.inputs.push({
        id: this.inputs.length,
        name: "",
        multiplier: 1,
        minsize: "0",
        weights: 0,
        color: this.generateRandomColor(),
      });
    },
    deleteFish(index, fish_name, confirmed) {
      if (confirmed) {
        try {
          this.inputs.splice(index, 1);
          this.competition.signees.forEach((signee) => {
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
        this.$confirm("Oletko varma?", "Poista kala", "question")
          .then((r) => {
            if (r) {
              this.deleteFish(index, fish_name, r);
            }
          })
          .catch((error) => {
            if (error) {
              console.error(error);
            }
          });
      }
    },
    setOriginalValues() {
      this.inputs = [];
      this.fish_specs.forEach((fish, index) => {
        this.inputs.push({
          id: index,
          name: fish.name,
          multiplier: parseInt(fish.multiplier),
          minsize: fish.minsize,
          weights: parseInt(fish.weights),
          color: fish.color,
        });
      });
      this.name = this.competition.name;
      this.locality = this.competition.locality;

      this.isTeamCompetition = this.competition.isTeamCompetition
        ? "Kyllä"
        : "Ei";
      this.isCupCompetition = this.competition.isCupCompetition
        ? "Kyllä"
        : "Ei";

      if (this.competition.isCupCompetition) {
        this.placement_points_array = [
          ...this.competition.cup_placement_points,
        ];
        this.cup_participation_points =
          this.competition.cup_participation_points;
        this.cup_points_multiplier = this.competition.cup_points_multiplier;
      } else {
        this.placement_points_array = constants.placement_points;
        this.cup_participation_points = 5;
        this.cup_points_multiplier = 1;
      }
      this.start_date = new Date(this.competition.start_date)
        .toISOString()
        .substring(0, 10);
      this.end_date = new Date(this.competition.end_date)
        .toISOString()
        .substring(0, 10);
      this.start_time = this.competition.start_time;
      this.end_time = this.competition.end_time;
      this.basic_info_validated = true;
    },
    // Generate random colors for the fish chart in Result.vue (since adding fishes is dynamic)
    //TODO look for 8-15 good colors to add/choose from, maybe with color picker next to fish name
    generateRandomColor() {
      var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
      return randomColor;
    },
    // Add error to error array and direct user to it
    showError(error) {
      this.errors.push(error);
      this.$nextTick(() => {
        document.getElementById("error-list").scrollIntoView();
      });
    },
    // Check competitions basic information (Perustiedot)
    checkBasicInformation() {
      this.loadingMessage = "Päivitetään tietoja...";
      this.errors = [];
      this.basic_info_validated = false;
      this.validated = false;

      var isDateValid = !isNaN(new Date(this.start_date).getTime());
      var isEndDateValid = !isNaN(new Date(this.end_date).getTime());

      var isStartTimeValid = validateTime(this.start_time);
      var isEndTimeValid = validateTime(this.end_time);

      // Check other variables
      if (!this.name) {
        this.showError("errors.missing-comp-name");
      }

      // Check other variables
      if (!this.locality) {
        this.showError("errors.missing-comp-locality");
      }

      if (this.isCupCompetition === "Kyllä") {
        if (!this.cup._id) {
          this.showError("errors.cup-not-selected");
        }
        if (!this.placement_points_array.length) {
          this.showError("errors.missing-placement-points");
        }
        if (!this.cup_participation_points) {
          this.showError("errors.missing-participation-points");
        }
        if (!this.cup_points_multiplier) {
          this.showError("errors.missing-multiplier");
        }
        if (this.cup_points_multiplier < 0.1) {
          this.showError("errors.invalid-multiplier");
        }
      }

      if (!this.start_time || !isStartTimeValid) {
        !this.start_time == true
          ? this.showError("errors.missing-start-time")
          : this.showError("errors.invalid-time");
      }
      if (!this.end_time || !isEndTimeValid) {
        !this.end_time == true
          ? this.showError("errors.missing-end-time")
          : this.showError("errors.invalid-time");
      }
      if (!this.start_date || !isDateValid) {
        this.showError("errors.missing-start-date");
      }
      if (!this.end_date || !isEndDateValid) {
        this.showError("errors.missing-end-date");
      }

      // Check all the inputs
      this.inputs.forEach((input) => {
        if (!input.name) {
          this.showError("errors.missing-fish-name");
        }
        if (!input.multiplier) {
          this.showError(
            `${input.name ? input.name : this.$t("fish-genetive")} ${this.$t(
              "errors.invalid-fish-multiplier"
            )}`
          );
        }
        if (!input.minsize) {
          this.showError(
            `${input.name ? input.name : this.$t("fish-genetive")} ${this.$t(
              "errors.invalid-fish-minsize"
            )}`
          );
        }
      });

      // If all inputs validated
      if (!this.errors.length) {
        // If dates are valid, check that start_date is before end_date
        let start_date = new Date(this.start_date);
        let start_time = this.start_time.split(":").map(Number);
        start_date.setHours(start_time[0], start_time[1]);

        let end_date = new Date(this.end_date);
        let end_time = this.end_time.split(":").map(Number);
        end_date.setHours(end_time[0], end_time[1]);
        if (end_date < start_date) {
          this.showError("errors.invalid-times");
        } else {
          if (this.isCupCompetition === "Kyllä") {
            // Basic info, change all the competition variables with values from inputs
            this.competition.cup_id = this.cup._id;
            this.competition.cup_name = this.cup.name;
            this.competition.cup_participation_points = Number(
              this.cup_participation_points
            );
            let temp_placement_points = [];
            // IF the multiplier has been changed, and is different from 1, calculate new points, else just use template array
            if (
              this.competition.cup_points_multiplier !==
                this.cup_points_multiplier &&
              this.cup_points_multiplier !== 1.0
            ) {
              let temp_placement = 1;
              this.placement_points_array.forEach((placement_point) => {
                temp_placement_points.push({
                  placement: temp_placement,
                  points: placement_point.points * this.cup_points_multiplier,
                });
                temp_placement++;
              });
            } else {
              temp_placement_points = [...this.placement_points_array];
            }
            this.competition.cup_points_multiplier = this.cup_points_multiplier;
            this.competition.cup_placement_points = temp_placement_points;
          } else {
            delete this.competition.cup_id;
            delete this.competition.cup_name;
            delete this.competition.cup_points_multiplier;
            delete this.competition.cup_placement_points;
            delete this.competition.cup_participation_points;
          }

          if (this.isCupCompetition === "Ei") {
            delete this.competition.teams;
          }

          this.competition.name = this.name;
          this.competition.locality = this.locality;
          this.competition.isTeamCompetition =
            this.isTeamCompetition === "Ei" ? false : true;
          this.competition.isCupCompetition =
            this.isCupCompetition === "Ei" ? false : true;
          this.competition.start_date = start_date.toISOString();
          this.competition.end_date = end_date.toISOString();
          this.competition.start_time = this.start_time;
          this.competition.end_time = this.end_time;
          //Update to database, calculate current standings and points in case multipliers have been changed
          this.competition.fishes = this.fish_specs = this.inputs;
          this.updateCompetition(this.competition);
          this.basic_info_validated = true;
        }
      }
    },
    // Update competition to database
    async updateCompetition(competition) {
      try {
        this.$store.commit("refreshCompetition", competition);
        this.loading = true;
        await CompetitionService.updateCompetition(
          competition._id,
          competition
        );
        this.tab = "show-settings";
      } catch (err) {
        console.error(err.message);
      }
      this.loading = false;
      this.text = "notification.updated";
      this.snackbar = true;
    },
    // Delete competition
    async deleteCompetition(id, confirmed) {
      // If user clicked "OK" on confirmation box
      if (confirmed) {
        this.text = "notification.deleting";
        this.snackbar = true;
        try {
          //Delete competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
          await CompetitionService.deleteCompetition(id);
          // Competition deleted, remove it from localstorage and vuex
          this.$store.state.competition = null;
          localStorage.removeItem("competition");
          // Redirect to dashboard
          this.$router.push({ path: "/dashboard" });
        } catch (err) {
          this.error = err.message;
        }
      } else {
        this.$confirm(
          this.$t("confirm-dialog"),
          this.$t("button.delete-comp"),
          "question"
        )
          .then((r) => {
            if (r) {
              this.deleteCompetition(id, r);
            }
          })
          .catch((error) => {
            if (error) {
              console.error(error);
            }
          });
      }
    },
  },
};
</script>
