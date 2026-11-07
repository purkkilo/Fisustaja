<template>
  <!-- /register-comp -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container
    v-bind:class="{
      mobile: $vuetify.display.width < 800,
      browser: $vuetify.display.width >= 800,
      wide: $vuetify.display.width >= 1200,
    }"
  >
    <v-row>
      <v-col v-if="prevRoute">
        <v-btn
          v-if="prevRoute.name"
          rounded
          color="yellow"
          @click="$router.push({ path: prevRoute.path })"
          size="large"
          ><v-icon>mdi-keyboard-return</v-icon
          >{{ $t("button.return-back") }}</v-btn
        >
      </v-col>
    </v-row>
    <error-list :errors="errors"></error-list>

    <v-card style="background: transparent" elevation="3" variant="outlined">
      <h1 style="margin: 30px">{{ $t("comp.is") }} {{ $t("creation") }}</h1>

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
        <v-tab value="basic-info">1. {{ $t("basic-info") }}</v-tab>
        <v-tab :disabled="!basic_info_validated" value="fishes"
          >2. {{ $t("fish-species") }}</v-tab
        >
        <v-tab :disabled="!fish_species_validated" value="points"
          >3. {{ $t("multipliers") }} {{ $t("and") }} {{ $t("min-sizes") }}
        </v-tab>
        <v-tab :disabled="!fish_specs_validated" value="summary"
          >4. {{ $t("overview") }}</v-tab
        >
      </v-tabs>

      <v-window v-model="tab" style="background: rgba(1, 1, 1, 0.4)">
        <!-- "Perustiedot" tab -->
        <v-window-item :value="'basic-info'">
          <v-container v-if="!loading">
            <v-row>
              <v-col>
                <h2 class="text-white">{{ $t("basic-info") }}</h2>
                <p
                  v-if="basic_info_validated"
                  class="bg-yellow-lighten-1 text-black"
                >
                  {{ $t("create-competition.information-locked") }}
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-row class="justify-center" v-if="cup.name">
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

                <v-row class="justify-center" v-if="cup.name">
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
                <v-row class="justify-center align-center" v-if="cup.name">
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
                <v-row
                  class="justify-end align-center"
                  v-if="cup.name && isCupCompetition === 'Kyllä'"
                >
                  <v-col cols="6" class="input-fields">
                    <v-list-subheader class="text-white"
                      >{{ $t("choose") }} {{ $t("cup.normal") }}
                    </v-list-subheader>
                    <v-select
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
                  <v-col cols="3" style="margin-top: 20px">
                    <v-btn
                      tile
                      color="green-lighten-1"
                      @click="
                        $router.push({
                          path: '/dashboard',
                        })
                      "
                      size="large"
                      variant="outlined"
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
                        'text-white': store.getTheme,
                      }"
                    >
                      {{ $t("create-competition.no-cups-created") }}
                    </p>
                  </v-col>
                  <v-col md="2" style="margin-top: 20px">
                    <router-link to="/continue">
                      <v-btn tile color="blue-lighten-1"
                        ><v-icon>mdi-plus-circle</v-icon>{{ $t("create") }}
                        {{ $t("cup.normal") }}!</v-btn
                      >
                    </router-link>
                  </v-col>
                </v-row>
                <v-row
                  class="justify-center"
                  v-if="cup.name && isCupCompetition === 'Kyllä'"
                  style="margin-top: 20px; margin-bottom: 20px"
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
                          :color="editPoints ? 'green-darken-2' : 'grey'"
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
                  class="justify-center"
                  v-if="cup.name && isCupCompetition === 'Kyllä'"
                >
                  <v-col cols="6" class="input-fields">
                    <v-text-field
                      :label="
                        $t('cup.normal') + ' ' + $t('participation-points')
                      "
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
                  v-if="cup.name && isCupCompetition === 'Kyllä'"
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

                <v-row class="justify-center align-center" v-if="cup.name">
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
                  v-if="cup.name"
                  style="padding: 20px; margin-bottom: 20px"
                >
                  <v-col cols="12" xl="6" md="6">
                    <h2 class="text-white">{{ $t("starting-date") }}</h2>
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
                    <h2 class="text-white">{{ $t("ending-date") }}</h2>
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
                  v-if="cup.name"
                  style="padding: 20px; margin-bottom: 20px"
                >
                  <v-col cols="12" xl="6" md="6">
                    <h2 class="text-white">{{ $t("starting-time") }}</h2>

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
                    <h2 class="text-white">{{ $t("ending-time") }}</h2>
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

                <v-row v-if="!basic_info_validated">
                  <v-col md="6" offset-md="3" v-if="cup.name">
                    <v-btn
                      block
                      color="green"
                      @click="checkBasicInformation"
                      size="large"
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
                  <v-btn
                    tile
                    color="grey"
                    @click="disableInputs(false)"
                    size="large"
                    ><v-icon>mdi-pencil</v-icon>Muuta tietoja</v-btn
                  >
                </v-col>
                <v-col md="6">
                  <v-btn
                    tile
                    color="green"
                    @click="changeTab('fishes')"
                    size="large"
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
                    'text-white': store.getTheme,
                  }"
                >
                  Valmistellaan kilpailun luontia...
                </h2>
                <ProgressBarQuery />
              </v-col>
            </v-row>
          </v-container>
        </v-window-item>

        <!-- "Kilpailun kalalajit" tab -->
        <v-window-item
          v-bind:class="{
            inputarea: !store.getTheme,
            'inputarea-dark': store.getTheme,
          }"
          :value="'fishes'"
        >
          <v-container
            v-bind:class="{
              mobile: $vuetify.display.width < 800,
              browser: $vuetify.display.width >= 800,
              wide: $vuetify.display.width >= 1200,
            }"
          >
            <v-row>
              <v-col>
                <p
                  v-if="fish_species_validated"
                  class="bg-yellow-lighten-1 text-black"
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
                        'text-white': store.getTheme,
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
                      item-title="text"
                      :hide-no-data="!search"
                      :items="options"
                      return-object
                      :disabled="fish_species_validated"
                      hide-selected
                      :label="$t('fish-species-prompt')"
                      multiple
                      clearable
                      :rules="rules"
                      :maxlength="40"
                      variant="solo"
                      v-model:search="search"
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <span class="subheading"
                            >{{ $t("create") }} {{ $t("new") }} {{ $t("fish") }}
                            {{ $t("with-enter") }}:
                          </span>
                          <v-chip
                            :color="`${colors[nonce - 1]}`"
                            label
                            size="small"
                            variant="flat"
                          >
                            {{ search }}
                          </v-chip>
                        </v-list-item>
                      </template>
                      <template v-slot:selection="{ item }">
                        <v-chip
                          v-if="item === Object(item)"
                          :color="item.color"
                          label
                          variant="flat"
                        >
                          <span class="pr-2">
                            {{ item.text }}
                          </span>
                          <v-icon
                            @click.stop="removeSelected(item)"
                            size="small"
                          >
                            $delete
                          </v-icon>
                        </v-chip>
                      </template>
                      <template v-slot:item="{ index, item, props }">
                        <v-list-item v-bind="props" :title="undefined">
                          <v-text-field
                            v-if="editing === item"
                            v-model="editing.text"
                            autofocus
                            flat
                            bg-color="transparent"
                            :maxlength="40"
                            :rules="rules"
                            @click.stop
                            @keyup.enter="edit(index, item)"
                            variant="solo"
                          ></v-text-field>
                          <v-chip
                            v-else
                            :color="item.color"
                            label
                            variant="flat"
                          >
                            {{ item.text }}
                          </v-chip>
                          <template v-slot:append>
                            <v-btn
                              icon
                              @click.stop.prevent="edit(index, item)"
                              variant="text"
                            >
                              <v-icon>{{
                                editing !== item ? "mdi-pencil" : "mdi-check"
                              }}</v-icon>
                            </v-btn>
                          </template>
                        </v-list-item>
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
                    tile
                    color="blue-lighten-2"
                    @click="changeTab('basic-info')"
                    size="large"
                    ><v-icon>mdi-keyboard-return</v-icon>{{ $t("back") }}</v-btn
                  >
                </v-col>
                <v-col md="6">
                  <v-btn
                    tile
                    color="green"
                    @click="checkFishSpecies"
                    size="large"
                    ><v-icon>mdi-check</v-icon>{{ $t("continue") }}</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-else style="margin-bottom: 20px; margin-top: 20px">
                <v-col>
                  <v-btn
                    tile
                    color="blue-lighten-2"
                    @click="changeTab('basic-info')"
                    size="large"
                    ><v-icon>mdi-keyboard-return</v-icon>{{ $t("back") }}</v-btn
                  >
                </v-col>
                <v-col>
                  <v-btn
                    tile
                    color="grey"
                    @click="disableInputs(false)"
                    size="large"
                    ><v-icon>mdi-pencil</v-icon>{{ $t("modify-info") }}</v-btn
                  >
                </v-col>
                <v-col>
                  <v-btn
                    tile
                    color="green"
                    @click="changeTab('points')"
                    size="large"
                    ><v-icon>mdi-check</v-icon>{{ $t("continue") }}</v-btn
                  >
                </v-col>
              </v-row>
            </v-row>
          </v-container>
        </v-window-item>

        <!-- "Pistekertoimet ja alamitat" tab -->
        <v-window-item
          v-bind:class="{
            inputarea: !store.getTheme,
            'inputarea-dark': store.getTheme,
          }"
          :value="'points'"
        >
          <v-container
            v-bind:class="{
              mobile: $vuetify.display.width < 800,
              browser: $vuetify.display.width >= 800,
              wide: $vuetify.display.width >= 1200,
            }"
          >
            <v-row>
              <v-col>
                <p
                  class="flow-text center-align"
                  v-bind:class="{
                    'text-white': store.getTheme,
                  }"
                >
                  {{ $t("create-competition.multiplier-title") }}
                </p>
                <p
                  v-if="fish_specs_validated"
                  class="bg-yellow-lighten-1 text-black"
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
                            'text-white': store.getTheme,
                          }"
                          :id="'fish_' + (index + 1) + '_name'"
                          >{{ index + 1 }}. {{ fish.text }}</span
                        >
                      </v-col>
                      <v-col class="input-fields">
                        <v-text-field
                          :label="$t('multiplier')"
                          :id="'fish_' + (index + 1) + '_multiplier'"
                          maxlength="4"
                          model-value="1"
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
                          :label="$t('min-size')"
                          :id="'fish_' + (index + 1) + '_minsize'"
                          :maxlength="40"
                          model-value="0"
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
                    tile
                    color="blue-lighten-2"
                    @click="changeTab('fishes')"
                    size="large"
                    ><v-icon>mdi-keyboard-return</v-icon>{{ $t("back") }}</v-btn
                  >
                </v-col>
                <v-col md="6" style="margin-top: 20px">
                  <v-btn tile color="green" @click="checkFishSpecs" size="large"
                    ><v-icon>mdi-check</v-icon>{{ $t("continue") }}</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-else style="margin-bottom: 20px; margin-top: 20px">
                <v-col md="4">
                  <v-btn
                    tile
                    color="blue-lighten-2"
                    @click="changeTab('fishes')"
                    size="large"
                    ><v-icon>mdi-keyboard-return</v-icon>Takaisin</v-btn
                  >
                </v-col>
                <v-col md="4">
                  <v-btn
                    tile
                    color="grey"
                    @click="disableInputs(false)"
                    size="large"
                    ><v-icon>mdi-pencil</v-icon>{{ $t("modify-info") }}a</v-btn
                  >
                </v-col>
                <v-col md="4">
                  <v-btn
                    tile
                    color="green"
                    @click="changeTab('summary')"
                    size="large"
                    ><v-icon>mdi-check</v-icon>{{ $t("continue") }}</v-btn
                  >
                </v-col>
              </v-row>
            </v-row>
          </v-container>
        </v-window-item>

        <!-- "Yhteenveto" tab -->
        <v-window-item
          v-bind:class="{
            inputarea: !store.getTheme,
            'inputarea-dark': store.getTheme,
          }"
          :value="'summary'"
          v-if="basic_info"
        >
          <v-container v-if="!loading">
            <v-row>
              <v-col>
                <h2
                  v-bind:class="{
                    'text-white': store.getTheme,
                  }"
                >
                  {{ $t("basic-info") }}
                </h2>
              </v-col>
            </v-row>
            <v-row class="basic_summary">
              <v-col>
                <v-list elevation="5" border>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon>mdi-ferry</v-icon>
                    </template>
                    <v-list-item-title>{{
                      $t("comp.normal")
                    }}</v-list-item-title>
                    <v-list-item-subtitle class="blue-text">
                      <b>{{ basic_info.name }} ({{ basic_info.locality }})</b>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item v-if="basic_info.isCupCompetition">
                    <template v-slot:prepend>
                      <v-icon color="yellow-darken-1">mdi-medal</v-icon>
                    </template>
                    <v-list-item-title>{{
                      $t("cup.normal")
                    }}</v-list-item-title>
                    <v-list-item-subtitle class="blue-text">
                      <b>{{ cup.name }}</b>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider v-if="basic_info.isCupCompetition"></v-divider>
                  <v-list-item v-if="basic_info.isCupCompetition">
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
                  <v-divider v-if="basic_info.isCupCompetition"></v-divider>
                  <v-list-item v-if="basic_info.isCupCompetition">
                    <template v-slot:prepend>
                      <v-icon color="green-darken-1">mdi-scoreboard</v-icon>
                    </template>
                    <v-list-item-title
                      >{{ $t("cup.normal") + " " + $t("participation-points") }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="blue-text">
                      <b>{{ basic_info.cup_participation_points }}</b>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider v-if="basic_info.isCupCompetition"></v-divider>
                  <v-list-item v-if="basic_info.isCupCompetition">
                    <template v-slot:prepend>
                      <v-icon>mdi-close-outline</v-icon>
                    </template>
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
                    <template v-slot:prepend>
                      <v-icon>mdi-account-multiple-outline</v-icon>
                    </template>
                    <v-list-item-title>Onko Tiimikilpailua?</v-list-item-title>
                    <v-list-item-subtitle class="blue-text"
                      >{{ isTeamCompetition }}
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
                    'text-white': store.getTheme,
                  }"
                >
                  {{ $t("fish-specs") }}
                </h2>
              </v-col>
            </v-row>
            <v-row class="fishes_summary">
              <v-col md="12">
                <v-list elevation="5" border>
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
                        <v-tooltip location="bottom">
                          <template v-slot:activator="{ props }">
                            <span v-bind="props"
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
                  tile
                  color="blue-lighten-2"
                  @click="changeTab('points')"
                  size="large"
                  ><v-icon>mdi-keyboard-return</v-icon>{{ $t("back") }}</v-btn
                >
              </v-col>
              <v-col md="5" v-if="validated">
                <v-btn
                  tile
                  color="green"
                  @click="submitCompetition"
                  size="large"
                  ><v-icon>mdi-plus-circle</v-icon
                  >{{ $t("create-competition.submit-button") }}</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
          <v-container v-else>
            <h2
              v-bind:class="{
                'text-white': store.getTheme,
              }"
            >
              {{ $t("saving") }}...
            </h2>
            <ProgressBarQuery />
          </v-container>
        </v-window-item>
      </v-window>
    </v-card>
    <notification-bar :snackbar="snackbar" :text="text"></notification-bar>
  </v-container>
</template>

<script setup>
import { useMainStore } from "@/store";
import { nextTick, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { usePreviousRoute } from "@/composables/usePreviousRoute";
import CompetitionService from "../services/CompetitionService";
import CupService from "../services/CupService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
import { getRandomColors } from "@/utils/colors";
import { validateTime, formatDate } from "@/utils/format";
import constants from "../data/constants";
import NotificationBar from "../components/NotificationBar.vue";
import ErrorList from "../components/ErrorList.vue";

const store = useMainStore();
defineOptions({ name: "CreateComp" });
const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();

const prevRoute = usePreviousRoute();
const tab = ref(null);
const errors = ref([]);
const selected = ref([]);
const days_options = ref([1, 2, 3, 4, 5, 6, 7]);
const name = ref(null);
const locality = ref(null);
const cups = ref([]);
const cup = ref({});
const cup_participation_points = ref(5);
const cup_points_multiplier = ref(1.0);
const isTeamCompetition = ref("Ei");
const isCupCompetition = ref("Kyllä");
const start_date = ref(new Date().toISOString().substring(0, 10));
const end_date = ref(new Date().toISOString().substring(0, 10));
const start_time = ref(null);
const end_time = ref(null);
const basic_info = ref(null);
const completed_fish_specs = ref([]);
const basic_info_validated = ref(false);
const fish_species_validated = ref(false);
const fish_specs_validated = ref(false);
const validated = ref(false);
const loading = ref(false);
const max_input = ref(40);
const tabs = ref(null);
const rules = ref([
  (value) => !!value || t("rules.no-empty"),
  (value) => (value || "").length <= max_input.value || t("rules.max-len"),
]);
const number_rules = ref([
  (value) => !!value || t("rules.no-empty"),
  (value) => !isNaN(value || "") || t("rules.not-number"),
  (value) => (value || "") >= 0 || t("rules.must-be-positive"),
]);
const placement_points_array = ref([]);
const temp_placement_points_array = ref([]);
const activator = ref(null);
const attach = ref(null);
const colors = ref([
  "green-lighten-2",
  "purple-lighten-2",
  "indigo-lighten-2",
  "cyan-lighten-2",
  "teal-lighten-2",
  "orange-lighten-2",
]);
const options = ref([]);
const options_fi = ref([
  {
    text: "Ahven",
    color: "blue-lighten-1",
    id: 0,
  },
  {
    text: "Hauki",
    color: "red-lighten-1",
    id: 1,
  },
  {
    text: "Kuha",
    color: "green-lighten-1",
    id: 2,
  },
  {
    text: "Lohi",
    color: "purple-lighten-1",
    id: 3,
  },
  {
    text: "Taimen",
    color: "indigo-lighten-1",
    id: 4,
  },
]);
const options_en = ref([
  {
    text: "Perch",
    color: "blue-lighten-1",
    id: 0,
  },
  {
    text: "Pike",
    color: "red-lighten-1",
    id: 1,
  },
  {
    text: "Zander",
    color: "green-lighten-1",
    id: 2,
  },
  {
    text: "Salmon",
    color: "purple-lighten-1",
    id: 3,
  },
  {
    text: "Trout",
    color: "indigo-lighten-1",
    id: 4,
  },
]);
const editing = ref(null);
const editingIndex = ref(-1);
const nonce = ref(1);
const menu = ref(false);
const x = ref(0);
const search = ref(null);
const y = ref(0);
const snackbar = ref(false);
const text = ref("");
const editPoints = ref(false);
const error = ref(null);

watch(locale, (newValue) => {
  if (newValue) {
    let _options = options_fi.value;
    if (newValue === "en") {
      _options = options_en.value;
    }
    _options.forEach((o) => {
      let option = options.value.find((op) => o.id === op.id);
      if (!option) {
        _options.push(option);
      }
    });
    options.value = _options;
  }
});

watch(selected, (val, prev) => {
  if (val.length === prev.length) return;

  selected.value = val.map((v, i) => {
    if (typeof v === "string") {
      let colorIndex = 0;
      if (nonce.value >= 1) {
        colorIndex = nonce.value - 1;
      }

      v = {
        text: v,
        color: colors.value[colorIndex],
        id: i,
      };

      options.value.push(v);
      nonce.value++;
    }

    return v;
  });
});

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

function changeTab(id) {
  tab.value = id;
}

function edit(index, item) {
  if (!editing.value) {
    editing.value = item;
    editingIndex.value = index;
  } else {
    editing.value = null;
    editingIndex.value = -1;
  }
}

function removeSelected(item) {
  selected.value = selected.value.filter((s) => s !== item);
}

async function getCups() {
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user["_id"];
  loading.value = true;
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
      // If localstorage has cup, select it
      if (route.query.cup) {
        cup.value = cups.value.find((_cup) => _cup._id === route.query.cup);
      } else {
        cup.value = cups.value[cups.value.length - 1];
      }
    }
  } catch (err) {
    error.value = err.message;
  }
  loading.value = false;
}

//filter other characters out for number inputs

function isNumber(evt, isDate) {
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
      let temp_placement_points = [];
      if (cup_points_multiplier.value !== 1) {
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

      basic_info.value = {
        name: name.value,
        locality: locality.value,
        isTeamCompetition: isTeamCompetition.value === "Ei" ? false : true,
        isCupCompetition: isCupCompetition.value === "Ei" ? false : true,
        start_date: _start_date.toISOString(),
        end_date: _end_date.toISOString(),
        start_time: start_time.value,
        end_time: end_time.value,
      };
      if (isCupCompetition.value === "Kyllä") {
        basic_info.value = {
          ...basic_info.value,
          cup_id: cup.value._id,
          cup_name: cup.value.name,
          cup_participation_points: Number(cup_participation_points.value),
          cup_placement_points: temp_placement_points,
          cup_points_multiplier: Number(cup_points_multiplier.value),
        };
      }

      // Enable next tab and open it
      // Disable current tab's inputs
      disableInputs(true);
      // Open next tab
      tab.value = "fishes";
    }
  }
}

// Check chosen fish species (Kilpailun Kalalajit)

function checkFishSpecies() {
  errors.value = [];
  fish_species_validated.value = false;
  validated.value = false;

  // If there are at least one fish chosen from v-select
  if (selected.value.length) {
    //TODO better solution for long names, change to vuetify combobox(https://vuetifyjs.com/en/components/combobox/) or vuetify select(https://vuetifyjs.com/en/components/selects/)
    selected.value.forEach((fish) => {
      if (fish.text.length > 40) {
        fish.text = fish.text.slice(0, 40);
      }
    });
    // Enable next tab
    // Disable current tab's inputs
    disableInputs(true);
    // Open next tab
    tab.value = "points";
  } else {
    fish_species_validated.value = false;
    showError("errors.missing-fishes");
  }
}

// Validate fish specifications from "Pistekertoimet ja alamitat" tab

function checkFishSpecs() {
  completed_fish_specs.value = [];
  let colors = getRandomColors(selected.value.length);
  errors.value = [];
  // Create fish objects
  for (let i = 1; i < selected.value.length + 1; i++) {
    // Fish object
    let fish_spec = {
      id: i - 1,
      name: document
        .getElementById(`fish_${i}_name`)
        .innerHTML.replace(`${i}. `, ""),
      multiplier: Number(document.getElementById(`fish_${i}_multiplier`).value),
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
      showError(
        `${t("input-fish-genetive")} '${fish_spec.name} ${t(
          "all-correct-info",
        )}! (${t("multiplier")} > 0, ${t("min-size")} >= 0 )`,
      );
    } else {
      // If all the inputs are validated, push the validated fish to an array
      completed_fish_specs.value.push(fish_spec);
    }
  }

  // If there aren't any errors AND
  // If there is as much validated fishes as selected fishes AND
  // If there are at least one validated fish
  if (
    !errors.value.length &&
    completed_fish_specs.value.length == selected.value.length &&
    completed_fish_specs.value.length > 0
  ) {
    // Every fish is validated
    fish_specs_validated.value = true;

    // If "Perustiedot", "Kalalajit", "Pistekertoimet ja alamitat" are validated
    if (
      basic_info_validated.value &&
      fish_species_validated.value &&
      fish_specs_validated.value
    ) {
      // Enable summary tab
      // Disable current tab's inputs
      disableInputs(true);
      // Open next tab
      tab.value = "summary";
    } else {
      // there is some info that is not validated,
      // notify user what is wrong
      validated.value = false;

      if (!basic_info_validated.value) showError("errors.check-basic-info");
      if (!fish_species_validated.value) showError("errors.check-fish-info");
      if (!fish_specs_validated.value) showError("errors.check-multiplier");
    }
  } else {
    showError("errors.missing-some-info");
  }
}

function disableInputs(disable) {
  if (tab.value === "basic-info") {
    if (disable) {
      basic_info_validated.value = true;
    } else {
      basic_info_validated.value = false;
      validated.value = false;
    }
  }
  if (tab.value === "fishes") {
    if (disable) {
      fish_species_validated.value = true;
    } else {
      fish_species_validated.value = false;
      validated.value = false;
    }
  }
  if (tab.value === "points") {
    if (disable) {
      fish_specs_validated.value = true;
      validated.value = true;
    } else {
      fish_specs_validated.value = false;
      validated.value = false;
    }
  }
}

// Submit competition to database

async function submitCompetition() {
  // TODO server side input validation
  if (validated.value) {
    loading.value = true;

    // Get user id from localstorage
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user["_id"];

    // Whole competition object
    const competition = {
      user_id: user_id,
      ...basic_info.value,
      fishes: completed_fish_specs.value,
      state: "signing",
    };

    try {
      //Submit competition to database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
      await CompetitionService.insertCompetitions([competition]);
      text.value = "notification.updated";
      snackbar.value = true;
      router.push({ path: "/dashboard" });
    } catch (err) {
      errors.value.push(err.message);
    }
  }
}

onMounted(() => {
  getCups();
  placement_points_array.value = JSON.parse(
    JSON.stringify(constants.placement_points),
  );
  locale.value === "en"
    ? (options.value = options_en.value)
    : (options.value = options_fi.value);
});
</script>
<style></style>
