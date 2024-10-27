<template>
  <!-- /register-comp -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container
    v-bind:class="{
      mobile: $vuetify.breakpoint.width < 800,
      browser: $vuetify.breakpoint.width >= 800,
      wide: $vuetify.breakpoint.width >= 1200,
    }"
  >
    <v-row>
      <v-col v-if="prevRoute">
        <v-btn
          v-if="prevRoute.name"
          large
          rounded
          color="yellow"
          @click="$router.push({ path: prevRoute.path })"
          ><v-icon>mdi-keyboard-return</v-icon
          >{{ $t("button.return-back") }}</v-btn
        >
      </v-col>
    </v-row>
    <error-list :errors="errors"></error-list>

    <v-card
      style="background: transparent"
      elevation="10"
      outlined
      :dark="$store.getters.getTheme"
    >
      <h1 style="margin: 30px">{{ $t("comp.is") }} {{ $t("creation") }}</h1>

      <!-- Tabs -->
      <v-tabs
        v-model="tab"
        background-color="blue lighten-2"
        color="blue darken-4"
        grow
        show-arrows
        next-icon="mdi-arrow-right-bold-box-outline"
        prev-icon="mdi-arrow-left-bold-box-outline"
        center-active
      >
        <v-tabs-slider color="blue darken-4"></v-tabs-slider>
        <v-tab href="#basic-info">1. {{ $t("basic-info") }}</v-tab>
        <v-tab href="#fishes" :disabled="!basic_info_validated"
          >2. {{ $t("fish-species") }}</v-tab
        >
        <v-tab href="#points" :disabled="!fish_species_validated"
          >3. {{ $t("multipliers") }} {{ $t("and") }} {{ $t("min-sizes") }}
        </v-tab>
        <v-tab href="#summary" :disabled="!fish_specs_validated"
          >4. {{ $t("overview") }}</v-tab
        >
      </v-tabs>

      <v-tabs-items v-model="tab" style="background: rgba(1, 1, 1, 0.4)">
        <!-- "Perustiedot" tab -->
        <v-tab-item :value="'basic-info'">
          <v-container v-if="!loading">
            <v-row>
              <v-col>
                <h2 class="white--text">{{ $t("basic-info") }}</h2>
                <p
                  v-if="basic_info_validated"
                  class="yellow lighten-1 black--text"
                >
                  {{ $t("create-competition.information-locked") }}
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-row v-if="cup.name" justify="center">
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

                <v-row v-if="cup.name" justify="center">
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
                <v-row v-if="cup.name" justify="center" align="center">
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
                <v-row
                  v-if="cup.name && isCupCompetition === 'Kyllä'"
                  align="center"
                  justify="end"
                >
                  <v-col cols="6" class="input-fields">
                    <v-subheader class="white--text"
                      >{{ $t("choose") }} {{ $t("cup.normal") }}
                    </v-subheader>
                    <v-select
                      :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
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
                  <v-col cols="3" style="margin-top: 20px">
                    <v-btn
                      tile
                      color="green lighten-1"
                      outlined
                      large
                      @click="
                        $router.push({
                          path: '/dashboard',
                        })
                      "
                      ><v-icon>mdi-plus-circle</v-icon>{{ $t("create") }}
                      {{ $t("new") }} {{ $t("cup.normal") }}</v-btn
                    >
                  </v-col>
                </v-row>
                <v-row
                  v-if="!cup.name && isCupCompetition === 'Kyllä'"
                  class="valign-wrapper"
                >
                  <v-col md="6" offset-md="2" style="margin-top: 20px">
                    <p
                      class="flow-text"
                      v-bind:class="{
                        'white--text': $store.getters.getTheme,
                      }"
                    >
                      {{ $t("create-competition.no-cups-created") }}
                    </p>
                  </v-col>
                  <v-col md="2" style="margin-top: 20px">
                    <router-link to="/continue">
                      <v-btn tile color="blue lighten-1"
                        ><v-icon>mdi-plus-circle</v-icon>{{ $t("create") }}
                        {{ $t("cup.normal") }}!</v-btn
                      >
                    </router-link>
                  </v-col>
                </v-row>
                <v-row
                  v-if="cup.name && isCupCompetition === 'Kyllä'"
                  justify="center"
                  style="margin-top: 20px; margin-bottom: 20px"
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
                                :label="$t('points')"
                                v-model="p.points"
                                :rules="number_rules"
                                :disabled="basic_info_validated || !editPoints"
                                @blur="sortPlacements"
                              />
                            </v-col>
                            <v-col v-if="editPoints"
                              ><v-btn
                                @click="removePlacement(index)"
                                color="red"
                              >
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
                          ><v-icon>mdi-plus</v-icon
                          >{{ $t("add-placement") }}</v-btn
                        >
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col v-if="editPoints">
                        <v-btn block color="yellow" @click="cancelPoints"
                          ><v-icon>mdi-cancel</v-icon>{{ $t("cancel") }}</v-btn
                        >
                      </v-col>
                      <v-col>
                        <v-btn
                          block
                          :color="editPoints ? 'green darken-2' : 'grey'"
                          @click="confirmPoints"
                          ><v-icon>mdi-check</v-icon
                          >{{
                            editPoints ? $t("confirm") : $t("modify")
                          }}</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="2" v-if="editPoints">
                    <div style="margin-top: 200px">
                      <p>
                        {{ $t("restore-original-points") }}:<br />#1 = 30, #2 =
                        28, #3 = 26...
                      </p>
                      <v-btn color="red" @click="resetPoints">{{
                        $t("restore")
                      }}</v-btn>
                    </div>
                  </v-col>
                </v-row>

                <v-row
                  v-if="cup.name && isCupCompetition === 'Kyllä'"
                  justify="center"
                >
                  <v-col cols="6" class="input-fields">
                    <v-text-field
                      :dark="$store.getters.getTheme"
                      :label="
                        $t('cup.normal') + ' ' + $t('participation-points')
                      "
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
                  v-if="cup.name && isCupCompetition === 'Kyllä'"
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

                <v-row v-if="cup.name" justify="center" align="center">
                  <v-col cols="6" class="input-fields">
                    <span class="white--text"
                      >{{ $t("is-there") }} {{ $t("comp.is-team") }}?</span
                    >
                    <v-row justify="center" align="center">
                      <v-spacer></v-spacer>
                      <v-col>
                        <v-radio-group
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
                  v-if="cup.name"
                  style="padding: 20px; margin-bottom: 20px"
                  justify="center"
                  align="center"
                >
                  <v-col cols="12" xl="6" l="6" md="6" s="10" xs="12">
                    <h2 class="white--text">{{ $t("starting-date") }}</h2>
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
                    <h2 class="white--text">{{ $t("ending-date") }}</h2>
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
                  v-if="cup.name"
                  style="padding: 20px; margin-bottom: 20px"
                  justify="center"
                  align="center"
                >
                  <v-col cols="12" xl="6" l="6" md="6" s="10" xs="12">
                    <h2 class="white--text">{{ $t("starting-time") }}</h2>

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
                    <h2 class="white--text">{{ $t("ending-time") }}</h2>
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

                <v-row v-if="!basic_info_validated">
                  <v-col md="6" offset-md="3" v-if="cup.name">
                    <v-btn
                      large
                      block
                      color="green"
                      @click="checkBasicInformation"
                      ><v-icon>mdi-check</v-icon>{{ $t("continue") }}</v-btn
                    >
                  </v-col>
                </v-row>
              </v-col>
              <v-row
                v-if="basic_info_validated"
                style="margin-bottom: 20px; margin-top: 20px"
              >
                <v-col md="6">
                  <v-btn large tile color="grey" @click="disableInputs(false)"
                    ><v-icon>mdi-pencil</v-icon>Muuta tietoja</v-btn
                  >
                </v-col>
                <v-col md="6">
                  <v-btn large tile color="green" @click="changeTab('fishes')"
                    ><v-icon>mdi-check</v-icon>Jatka</v-btn
                  >
                </v-col>
              </v-row>
            </v-row>
          </v-container>
          <v-container v-else>
            <v-row>
              <v-col>
                <h2
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Valmistellaan kilpailun luontia...
                </h2>
                <ProgressBarQuery />
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>

        <!-- "Kilpailun kalalajit" tab -->
        <v-tab-item
          v-bind:class="{
            inputarea: !$store.getters.getTheme,
            'inputarea-dark': $store.getters.getTheme,
          }"
          :value="'fishes'"
        >
          <v-container
            v-bind:class="{
              mobile: $vuetify.breakpoint.width < 800,
              browser: $vuetify.breakpoint.width >= 800,
              wide: $vuetify.breakpoint.width >= 1200,
            }"
          >
            <v-row>
              <v-col>
                <p
                  v-if="fish_species_validated"
                  class="yellow lighten-1 black--text"
                >
                  Tiedot lukittuna, paina "Muuta tietoja" jos haluat vielä
                  muokata tietoja
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-row>
                  <v-col>
                    <h3
                      v-bind:class="{
                        'white--text': $store.getters.getTheme,
                      }"
                    >
                      {{ $t("fish-species-choose") }}
                    </h3>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col md="10" offset-md="1">
                    <v-combobox
                      v-model="selected"
                      :filter="filter"
                      :hide-no-data="!search"
                      :items="options"
                      return-object
                      :search-input.sync="search"
                      :disabled="fish_species_validated"
                      hide-selected
                      :label="$t('fish-species-prompt')"
                      multiple
                      solo
                      clearable
                      :rules="rules"
                      :maxlength="40"
                      :dark="$store.getters.getTheme"
                      :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <span class="subheading"
                            >{{ $t("create") }} {{ $t("new") }}
                            {{ $t("fish") }} {{ $t("with-enter") }}:
                          </span>
                          <v-chip :color="`${colors[nonce - 1]}`" label small>
                            {{ search }}
                          </v-chip>
                        </v-list-item>
                      </template>
                      <template
                        v-slot:selection="{ attrs, item, parent, selected }"
                      >
                        <v-chip
                          v-if="item === Object(item)"
                          v-bind="attrs"
                          :color="item.color"
                          :input-value="selected"
                          label
                        >
                          <span class="pr-2">
                            {{ item.text }}
                          </span>
                          <v-icon small @click="parent.selectItem(item)">
                            $delete
                          </v-icon>
                        </v-chip>
                      </template>
                      <template v-slot:item="{ index, item }">
                        <v-text-field
                          v-if="editing === item"
                          v-model="editing.text"
                          autofocus
                          flat
                          background-color="transparent"
                          solo
                          :maxlength="40"
                          :rules="rules"
                          @keyup.enter="edit(index, item)"
                        ></v-text-field>
                        <v-chip v-else :color="item.color" dark label>
                          {{ item.text }}
                        </v-chip>
                        <v-spacer></v-spacer>
                        <v-list-item-action @click.stop>
                          <v-btn icon @click.stop.prevent="edit(index, item)">
                            <v-icon>{{
                              editing !== item ? "mdi-pencil" : "mdi-check"
                            }}</v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </template>
                    </v-combobox>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row style="margin-top: 50px; margin-bottom: 20px">
              <v-row v-if="!fish_species_validated">
                <v-col md="6">
                  <v-btn
                    large
                    tile
                    color="blue lighten-2"
                    @click="changeTab('basic-info')"
                    ><v-icon>mdi-keyboard-return</v-icon>{{ $t("back") }}</v-btn
                  >
                </v-col>
                <v-col md="6">
                  <v-btn large tile color="green" @click="checkFishSpecies"
                    ><v-icon>mdi-check</v-icon>{{ $t("continue") }}</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-else style="margin-bottom: 20px; margin-top: 20px">
                <v-col>
                  <v-btn
                    large
                    tile
                    color="blue lighten-2"
                    @click="changeTab('basic-info')"
                    ><v-icon>mdi-keyboard-return</v-icon>{{ $t("back") }}</v-btn
                  >
                </v-col>
                <v-col>
                  <v-btn large tile color="grey" @click="disableInputs(false)"
                    ><v-icon>mdi-pencil</v-icon>{{ $t("modify-info") }}</v-btn
                  >
                </v-col>
                <v-col>
                  <v-btn large tile color="green" @click="changeTab('points')"
                    ><v-icon>mdi-check</v-icon>{{ $t("continue") }}</v-btn
                  >
                </v-col>
              </v-row>
            </v-row>
          </v-container>
        </v-tab-item>

        <!-- "Pistekertoimet ja alamitat" tab -->
        <v-tab-item
          v-bind:class="{
            inputarea: !$store.getters.getTheme,
            'inputarea-dark': $store.getters.getTheme,
          }"
          :value="'points'"
        >
          <v-container
            v-bind:class="{
              mobile: $vuetify.breakpoint.width < 800,
              browser: $vuetify.breakpoint.width >= 800,
              wide: $vuetify.breakpoint.width >= 1200,
            }"
          >
            <v-row>
              <v-col>
                <p
                  class="flow-text center-align"
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  {{ $t("create-competition.multiplier-title") }}
                </p>
                <p
                  v-if="fish_specs_validated"
                  class="yellow lighten-1 black--text"
                >
                  {{ $t("create-competition.information-locked") }}
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="specs" id="select_specs">
                <ul v-if="selected.length">
                  <li
                    class="row"
                    id="fish_spec"
                    v-for="(fish, index) in selected"
                    :key="index"
                  >
                    <v-row>
                      <v-col>
                        <span
                          class="flow-text"
                          v-bind:class="{
                            'white--text': $store.getters.getTheme,
                          }"
                          :id="'fish_' + (index + 1) + '_name'"
                          >{{ index + 1 }}. {{ fish.text }}</span
                        >
                      </v-col>
                      <v-col class="input-fields">
                        <v-text-field
                          :dark="$store.getters.getTheme"
                          :label="$t('multiplier')"
                          :id="'fish_' + (index + 1) + '_multiplier'"
                          maxlength="4"
                          value="1"
                          type="number"
                          min="0"
                          @paste.prevent
                          :counter="4"
                          @keypress="isNumber($event, true)"
                          :rules="number_rules"
                          :disabled="fish_specs_validated"
                        />
                      </v-col>
                      <v-col class="input-fields">
                        <v-text-field
                          :dark="$store.getters.getTheme"
                          :label="$t('min-size')"
                          :id="'fish_' + (index + 1) + '_minsize'"
                          :maxlength="40"
                          value="0"
                          @paste.prevent
                          :counter="40"
                          :rules="rules"
                          :disabled="fish_specs_validated"
                        />
                      </v-col>
                    </v-row>
                  </li>
                </ul>
                <p v-else class="flow-text center-align">
                  {{ $t("errors.no-fish-selected") }}
                </p>
              </v-col>
            </v-row>

            <v-row style="margin-bottom: 20px">
              <v-row v-if="selected.length && !validated">
                <v-col md="6" style="margin-top: 20px">
                  <v-btn
                    large
                    tile
                    color="blue lighten-2"
                    @click="changeTab('fishes')"
                    ><v-icon>mdi-keyboard-return</v-icon>{{ $t("back") }}</v-btn
                  >
                </v-col>
                <v-col md="6" style="margin-top: 20px">
                  <v-btn large tile color="green" @click="checkFishSpecs"
                    ><v-icon>mdi-check</v-icon>{{ $t("continue") }}</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-else style="margin-bottom: 20px; margin-top: 20px">
                <v-col md="4">
                  <v-btn
                    large
                    tile
                    color="blue lighten-2"
                    @click="changeTab('fishes')"
                    ><v-icon>mdi-keyboard-return</v-icon>Takaisin</v-btn
                  >
                </v-col>
                <v-col md="4">
                  <v-btn large tile color="grey" @click="disableInputs(false)"
                    ><v-icon>mdi-pencil</v-icon>{{ $t("modify-info") }}a</v-btn
                  >
                </v-col>
                <v-col md="4">
                  <v-btn large tile color="green" @click="changeTab('summary')"
                    ><v-icon>mdi-check</v-icon>{{ $t("continue") }}</v-btn
                  >
                </v-col>
              </v-row>
            </v-row>
          </v-container>
        </v-tab-item>

        <!-- "Yhteenveto" tab -->
        <v-tab-item
          v-bind:class="{
            inputarea: !$store.getters.getTheme,
            'inputarea-dark': $store.getters.getTheme,
          }"
          :value="'summary'"
          v-if="basic_info"
        >
          <v-container v-if="!loading">
            <v-row>
              <v-col>
                <h2
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  {{ $t("basic-info") }}
                </h2>
              </v-col>
            </v-row>
            <v-row class="basic_summary">
              <v-col>
                <v-list outlined elevation="20" :dark="$store.getters.getTheme">
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-ferry</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{
                      $t("comp.normal")
                    }}</v-list-item-title>
                    <v-list-item-subtitle class="blue-text">
                      <b>{{ basic_info.name }} ({{ basic_info.locality }})</b>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item v-if="basic_info.isCupCompetition">
                    <v-list-item-icon>
                      <v-icon color="yellow darken-1">mdi-medal</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{
                      $t("cup.normal")
                    }}</v-list-item-title>
                    <v-list-item-subtitle class="blue-text">
                      <b>{{ cup.name }}</b>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider v-if="basic_info.isCupCompetition"></v-divider>
                  <v-list-item v-if="basic_info.isCupCompetition">
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
                  <v-divider v-if="basic_info.isCupCompetition"></v-divider>
                  <v-list-item v-if="basic_info.isCupCompetition">
                    <v-list-item-icon>
                      <v-icon color="green darken-1">mdi-scoreboard</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title
                      >{{ $t("cup.normal") + " " + $t("participation-points") }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="blue-text">
                      <b>{{ basic_info.cup_participation_points }}</b>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider v-if="basic_info.isCupCompetition"></v-divider>
                  <v-list-item v-if="basic_info.isCupCompetition">
                    <v-list-item-icon>
                      <v-icon>mdi-close-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{
                      $t("comp.is") +
                      " " +
                      $t("cup.normal") +
                      " " +
                      $t("multiplier")
                    }}</v-list-item-title>
                    <v-list-item-subtitle class="blue-text">
                      <b>{{ basic_info.cup_points_multiplier }}</b>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider v-if="basic_info.isCupCompetition"></v-divider>
                  <v-list-item v-if="basic_info.isTeamCompetition">
                    <v-list-item-icon>
                      <v-icon>mdi-account-multiple-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Onko Tiimikilpailua?</v-list-item-title>
                    <v-list-item-subtitle class="blue-text"
                      >{{ isTeamCompetition }}
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
                        >{{ formatDate(basic_info.start_date) }} -
                        {{ formatDate(basic_info.end_date) }}</b
                      >
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider v-if="basic_info.isTeamCompetition"></v-divider>
                </v-list>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <h2
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  {{ $t("fish-specs") }}
                </h2>
              </v-col>
            </v-row>
            <v-row class="fishes_summary">
              <v-col md="12">
                <v-list outlined elevation="20" :dark="$store.getters.getTheme">
                  <div
                    v-for="(fish, index) in completed_fish_specs"
                    :key="index"
                  >
                    <v-list-item>
                      <v-list-item-title>{{ fish.name }}</v-list-item-title>
                      <v-divider vertical></v-divider>
                      <v-list-item-subtitle class="green-text">
                        <b> x {{ fish.multiplier }}</b>
                      </v-list-item-subtitle>
                      <v-divider vertical></v-divider>
                      <v-list-item-subtitle class="blue-text">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on"
                              ><b>{{ fish.minsize }} cm</b></span
                            >
                          </template>
                          <span>{{ fish.minsize }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </div>
                </v-list>
              </v-col>
            </v-row>

            <v-row style="margin-top: 20px; margin-bottom: 10px">
              <v-col md="5" offset-md="1">
                <v-btn
                  large
                  tile
                  color="blue lighten-2"
                  @click="changeTab('points')"
                  ><v-icon>mdi-keyboard-return</v-icon>{{ $t("back") }}</v-btn
                >
              </v-col>
              <v-col md="5" v-if="validated">
                <v-btn large tile color="green" @click="submitCompetition"
                  ><v-icon>mdi-plus-circle</v-icon
                  >{{ $t("create-competition.submit-button") }}</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
          <v-container v-else>
            <h2
              v-bind:class="{
                'white--text': $store.getters.getTheme,
              }"
            >
              {{ $t("saving") }}...
            </h2>
            <ProgressBarQuery />
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <notification-bar :snackbar="snackbar" :text="text"></notification-bar>
  </v-container>
</template>

<script>
import CompetitionService from "../services/CompetitionService";
import CupService from "../services/CupService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import { getRandomColors, validateTime, formatDate } from "../shared";
import constants from "../data/constants";
import NotificationBar from "../components/NotificationBar.vue";
import ErrorList from "../components/ErrorList.vue";

export default {
  name: "CreateComp",
  components: {
    ProgressBarQuery,
    NotificationBar,
    ErrorList,
  },
  data() {
    return {
      prevRoute: null,
      tab: null,
      errors: [],
      selected: [],
      days_options: [1, 2, 3, 4, 5, 6, 7],
      name: null,
      locality: null,
      cups: [],
      cup: {},
      cup_participation_points: 5,
      cup_points_multiplier: 1.0,
      isTeamCompetition: "Ei",
      isCupCompetition: "Kyllä",
      start_date: new Date().toISOString().substring(0, 10),
      end_date: new Date().toISOString().substring(0, 10),
      start_time: null,
      end_time: null,
      basic_info: null,
      completed_fish_specs: [],
      basic_info_validated: false,
      fish_species_validated: false,
      fish_specs_validated: false,
      validated: false,
      loading: false,
      max_input: 40,
      tabs: null,
      rules: [
        (value) => !!value || this.$t("rules.no-empty"),
        (value) =>
          (value || "").length <= this.max_input || this.$t("rules.max-len"),
      ],
      number_rules: [
        (value) => !!value || this.$t("rules.no-empty"),
        (value) => !isNaN(value || "") || this.$t("rules.not-number"),
        (value) => (value || "") >= 0 || this.$t("rules.must-be-positive"),
      ],
      placement_points_array: [],
      temp_placement_points_array: [],
      activator: null,
      attach: null,
      colors: [
        "green lighten-2",
        "purple lighten-2",
        "indigo lighten-2",
        "cyan lighten-2",
        "teal lighten-2",
        "orange lighten-2",
      ],
      options: [],
      options_fi: [
        {
          text: "Ahven",
          color: "blue lighten-1",
          id: 0,
        },
        {
          text: "Hauki",
          color: "red lighten-1",
          id: 1,
        },
        {
          text: "Kuha",
          color: "green lighten-1",
          id: 2,
        },
        {
          text: "Lohi",
          color: "purple lighten-1",
          id: 3,
        },
        {
          text: "Taimen",
          color: "indigo lighten-1",
          id: 4,
        },
      ],
      options_en: [
        {
          text: "Perch",
          color: "blue lighten-1",
          id: 0,
        },
        {
          text: "Pike",
          color: "red lighten-1",
          id: 1,
        },
        {
          text: "Zander",
          color: "green lighten-1",
          id: 2,
        },
        {
          text: "Salmon",
          color: "purple lighten-1",
          id: 3,
        },
        {
          text: "Trout",
          color: "indigo lighten-1",
          id: 4,
        },
      ],
      editing: null,
      editingIndex: -1,
      nonce: 1,
      menu: false,
      x: 0,
      search: null,
      y: 0,
      snackbar: false,
      text: "",

      editPoints: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  // Runs everytime this page loads
  mounted() {
    this.getCups();
    this.placement_points_array = JSON.parse(
      JSON.stringify(constants.placement_points)
    );
    this.$i18n.locale === "en"
      ? (this.options = this.options_en)
      : (this.options = this.options_fi);
  },
  watch: {
    "$i18n.locale"(newValue) {
      if (newValue) {
        let options = this.options_fi;
        if (newValue === "en") {
          options = this.options_en;
        }
        options.forEach((o) => {
          let option = this.options.find((op) => o.id === op.id);
          if (!option) {
            options.push(option);
          }
        });
        this.options = options;
      }
    },
    selected(val, prev) {
      if (val.length === prev.length) return;

      this.selected = val.map((v, i) => {
        if (typeof v === "string") {
          let colorIndex = 0;
          if (this.nonce >= 1) {
            colorIndex = this.nonce - 1;
          }

          v = {
            text: v,
            color: this.colors[colorIndex],
            id: i,
          };

          this.options.push(v);
          this.nonce++;
        }

        return v;
      });
    },
  },
  methods: {
    formatDate: formatDate,
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
    changeTab(id) {
      this.tab = id;
    },
    edit(index, item) {
      if (!this.editing) {
        this.editing = item;
        this.editingIndex = index;
      } else {
        this.editing = null;
        this.editingIndex = -1;
      }
    },
    filter(item, queryText, itemText) {
      if (item.header) return false;

      const hasValue = (val) => (val != null ? val : "");

      const text = hasValue(itemText);
      const query = hasValue(queryText);

      return (
        text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) >
        -1
      );
    },
    async getCups() {
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user["_id"];
      this.loading = true;
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
          // If localstorage has cup, select it
          if (this.$route.query.cup) {
            this.cup = this.cups.find(
              (cup) => cup._id === this.$route.query.cup
            );
          } else {
            this.cup = this.cups[this.cups.length - 1];
          }
        }
      } catch (err) {
        this.error = err.message;
      }
      this.loading = false;
    },
    //filter other characters out for number inputs
    isNumber(evt, isDate) {
      var charToCheckCode = 46; // --> .
      var charToCheck = ".";

      if (!isDate) {
        charToCheckCode = 58; // --> :
        charToCheck = ":";
      }

      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== charToCheckCode
      ) {
        evt.preventDefault();
      } else {
        if (charCode == charToCheckCode) {
          if (evt.target.value.indexOf(charToCheck) >= 0) {
            evt.preventDefault();
          } else {
            return true;
          }
        } else {
          return true;
        }
      }
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
          let temp_placement_points = [];
          if (this.cup_points_multiplier !== 1) {
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

          this.basic_info = {
            name: this.name,
            locality: this.locality,
            isTeamCompetition: this.isTeamCompetition === "Ei" ? false : true,
            isCupCompetition: this.isCupCompetition === "Ei" ? false : true,
            start_date: start_date.toISOString(),
            end_date: end_date.toISOString(),
            start_time: this.start_time,
            end_time: this.end_time,
          };
          if (this.isCupCompetition === "Kyllä") {
            this.basic_info = {
              ...this.basic_info,
              cup_id: this.cup._id,
              cup_name: this.cup.name,
              cup_participation_points: Number(this.cup_participation_points),
              cup_placement_points: temp_placement_points,
              cup_points_multiplier: Number(this.cup_points_multiplier),
            };
          }

          // Enable next tab and open it
          // Disable current tab's inputs
          this.disableInputs(true);
          // Open next tab
          this.tab = "fishes";
        }
      }
    },
    // Check chosen fish species (Kilpailun Kalalajit)
    checkFishSpecies() {
      this.errors = [];
      this.fish_species_validated = false;
      this.validated = false;

      // If there are at least one fish chosen from v-select
      if (this.selected.length) {
        //TODO better solution for long names, change to vuetify combobox(https://vuetifyjs.com/en/components/combobox/) or vuetify select(https://vuetifyjs.com/en/components/selects/)
        this.selected.forEach((fish) => {
          if (fish.text.length > 40) {
            fish.text = fish.text.slice(0, 40);
          }
        });
        // Enable next tab
        // Disable current tab's inputs
        this.disableInputs(true);
        // Open next tab
        this.tab = "points";
      } else {
        this.fish_species_validated = false;
        this.showError("errors.missing-fishes");
      }
    },

    // Validate fish specifications from "Pistekertoimet ja alamitat" tab
    checkFishSpecs() {
      this.completed_fish_specs = [];
      let colors = getRandomColors(this.selected.length);
      this.errors = [];
      // Create fish objects
      for (let i = 1; i < this.selected.length + 1; i++) {
        // Fish object
        let fish_spec = {
          id: i - 1,
          name: document
            .getElementById(`fish_${i}_name`)
            .innerHTML.replace(`${i}. `, ""),
          multiplier: Number(
            document.getElementById(`fish_${i}_multiplier`).value
          ),
          minsize: document.getElementById(`fish_${i}_minsize`).value,
          weights: 0,
          color: colors[i - 1],
        };

        // If there are some missing inputs
        if (
          !fish_spec.multiplier ||
          !fish_spec.minsize ||
          parseInt(fish_spec.multiplier) < 1 ||
          parseInt(fish_spec.minsize) < 0
        ) {
          this.showError(
            `${this.$t("input-fish-genetive")} '${fish_spec.name} ${this.$t(
              "all-correct-info"
            )}! (${this.$t("multiplier")} > 0, ${this.$t("min-size")} >= 0 )`
          );
        } else {
          // If all the inputs are validated, push the validated fish to an array
          this.completed_fish_specs.push(fish_spec);
        }
      }

      // If there aren't any errors AND
      // If there is as much validated fishes as selected fishes AND
      // If there are at least one validated fish
      if (
        !this.errors.length &&
        this.completed_fish_specs.length == this.selected.length &&
        this.completed_fish_specs.length > 0
      ) {
        // Every fish is validated
        this.fish_specs_validated = true;

        // If "Perustiedot", "Kalalajit", "Pistekertoimet ja alamitat" are validated
        if (
          this.basic_info_validated &&
          this.fish_species_validated &&
          this.fish_specs_validated
        ) {
          // Enable summary tab
          // Disable current tab's inputs
          this.disableInputs(true);
          // Open next tab
          this.tab = "summary";
        } else {
          // there is some info that is not validated,
          // notify user what is wrong
          this.validated = false;

          if (!this.basic_info_validated)
            this.showError("errors.check-basic-info");
          if (!this.fish_species_validated)
            this.showError("errors.check-fish-info");
          if (!this.fish_specs_validated)
            this.showError("errors.check-multiplier");
        }
      } else {
        this.showError("errors.missing-some-info");
      }
    },
    disableInputs(disable) {
      if (this.tab === "basic-info") {
        if (disable) {
          this.basic_info_validated = true;
        } else {
          this.basic_info_validated = false;
          this.validated = false;
        }
      }
      if (this.tab === "fishes") {
        if (disable) {
          this.fish_species_validated = true;
        } else {
          this.fish_species_validated = false;
          this.validated = false;
        }
      }
      if (this.tab === "points") {
        if (disable) {
          this.fish_specs_validated = true;
          this.validated = true;
        } else {
          this.fish_specs_validated = false;
          this.validated = false;
        }
      }
    },

    // Submit competition to database
    async submitCompetition() {
      // TODO server side input validation
      if (this.validated) {
        this.loading = true;

        // Get user id from localstorage
        const user = JSON.parse(localStorage.getItem("user"));
        const user_id = user["_id"];

        // Whole competition object
        const competition = {
          user_id: user_id,
          ...this.basic_info,
          fishes: this.completed_fish_specs,
          state: "signing",
        };

        try {
          //Submit competition to database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
          await CompetitionService.insertCompetitions([competition]);
          this.text = "notification.updated";
          this.snackbar = true;
          this.$router.push({ path: "/dashboard" });
        } catch (err) {
          this.errors.push(err.message);
        }
      }
    },
  },
};
</script>
<style></style>
