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
    <!-- if errors, show errors -->
    <v-card
      :dark="$store.getters.getTheme"
      id="errordiv"
      elevation="20"
      v-if="errors.length"
    >
      <v-alert type="error"> Korjaa seuraavat virheet: </v-alert>
      <v-list>
        <v-list-item v-for="(error, index) in errors" v-bind:key="index">
          <v-list-item-icon>
            <v-icon color="red">mdi-alert-circle</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ error }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>

    <v-card
      style="background: transparent"
      elevation="10"
      outlined
      :dark="$store.getters.getTheme"
    >
      <h1 style="margin: 30px">Kilpailun luonti</h1>

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
        <v-tab href="#basic-info">1. Perustiedot</v-tab>
        <v-tab href="#fishes" :disabled="!basic_info_validated"
          >2. Kilpailun kalalajit</v-tab
        >
        <v-tab href="#points" :disabled="!fish_species_validated"
          >3. Pistekertoimet ja alamitat</v-tab
        >
        <v-tab href="#summary" :disabled="!fish_specs_validated"
          >4. Yhteenveto</v-tab
        >
      </v-tabs>

      <v-tabs-items v-model="tab" style="background: rgba(1, 1, 1, 0.4)">
        <!-- "Perustiedot" tab -->
        <v-tab-item :value="'basic-info'">
          <v-container v-if="!loading">
            <v-row>
              <v-col>
                <p class="white--text">Kilpailun perustiedot</p>
                <p
                  v-if="basic_info_validated"
                  class="yellow lighten-1 black--text"
                >
                  Tiedot lukittuna, paina "Muuta tietoja" jos haluat vielä
                  muokata tietoja
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-row v-if="cup.name" justify="center">
                  <v-col cols="6" class="input-fields">
                    <v-text-field
                      :dark="$store.getters.getTheme"
                      label="Kilpailun nimi"
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
                      label="Paikkakunta"
                      v-model="locality"
                      :maxlength="max_input"
                      :disabled="basic_info_validated"
                      :rules="rules"
                      :counter="max_input"
                    />
                  </v-col>
                </v-row>

                <v-row v-if="cup.name" align="center" justify="end">
                  <v-col cols="6" class="input-fields">
                    <v-subheader class="white--text"> Valitse Cup </v-subheader>
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
                          path: '/continue',
                          query: { tab: 'create' },
                        })
                      "
                      ><v-icon>mdi-plus-circle</v-icon>Luo uusi cup!</v-btn
                    >
                  </v-col>
                </v-row>
                <v-row v-else class="valign-wrapper">
                  <v-col md="6" offset-md="2" style="margin-top: 20px">
                    <p
                      class="flow-text"
                      v-bind:class="{
                        'white--text': $store.getters.getTheme,
                      }"
                    >
                      Ei luotuja cuppeja, Luo cup ensin "Jatka Kilpailuja
                      sivulla" (Voit myös luoda cupin kilpailuille, jotka ei ole
                      missään cupissa")
                    </p>
                  </v-col>
                  <v-col md="2" style="margin-top: 20px">
                    <router-link to="/continue">
                      <v-btn tile color="blue lighten-1"
                        ><v-icon>mdi-plus-circle</v-icon>Luo cup!</v-btn
                      >
                    </router-link>
                  </v-col>
                </v-row>
                <v-row
                  v-if="cup.name"
                  justify="center"
                  style="margin-top: 20px; margin-bottom: 20px"
                >
                  <v-col cols="6">
                    <h2 class="white--text">Kilpailun sijoittumispisteet</h2>
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
                          ><v-icon>mdi-plus</v-icon>Lisää pistesija</v-btn
                        >
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col v-if="editPoints">
                        <v-btn block color="yellow" @click="cancelPoints"
                          ><v-icon>mdi-cancel</v-icon>Peruuta</v-btn
                        >
                      </v-col>
                      <v-col>
                        <v-btn
                          block
                          :color="editPoints ? 'green darken-2' : 'grey'"
                          @click="confirmPoints"
                          ><v-icon>mdi-check</v-icon
                          >{{ editPoints ? "Valmis" : "Muokkaa" }}</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="2" v-if="editPoints">
                    <div style="margin-top: 200px">
                      <p>
                        Palauta alkuperäiset pisteet:<br />#1 = 30, #2 = 28, #3
                        = 26...
                      </p>
                      <v-btn color="red" @click="resetPoints">Palauta</v-btn>
                    </div>
                  </v-col>
                </v-row>

                <v-row v-if="cup.name" justify="center">
                  <v-col cols="6" class="input-fields">
                    <v-text-field
                      :dark="$store.getters.getTheme"
                      label="Kilpailun cup osallistumispisteet"
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

                <v-row v-if="cup.name" justify="center">
                  <v-col cols="6" class="input-fields">
                    <v-text-field
                      :dark="$store.getters.getTheme"
                      label="Cup pistekerroin"
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
                    <span class="white--text">Onko Tiimikilpailua?</span>
                    <v-row justify="center" align="center">
                      <v-spacer></v-spacer>
                      <v-col>
                        <v-radio-group
                          v-model="team_competition"
                          row
                          :disabled="basic_info_validated"
                        >
                          <v-radio label="Kyllä" value="Kyllä"></v-radio>
                          <v-radio label="Ei" value="Ei"></v-radio>
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
                    <span class="white--text">Kilpailun Aloituspäivä</span>
                    <v-date-picker
                      :dark="$store.getters.getTheme"
                      style="height: 480px"
                      v-model="start_date"
                      full-width
                      elevation="15"
                      locale="fi"
                      class="mt-4"
                      first-day-of-week="1"
                      :disabled="basic_info_validated"
                    ></v-date-picker>
                  </v-col>
                  <v-col cols="12" xl="6" l="6" md="6" s="10" xs="12">
                    <span class="white--text">Kilpailun Lopetuspäivä</span>
                    <v-date-picker
                      :dark="$store.getters.getTheme"
                      style="height: 480px"
                      v-model="end_date"
                      full-width
                      elevation="15"
                      locale="fi"
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
                    <span class="white--text">Kilpailun alkamismisaika</span>

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
                    <span class="white--text">Kilpailun loppumisaika</span>
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
                      ><v-icon>mdi-check</v-icon>Jatka</v-btn
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
                      Kalalajien valinta
                    </h3>
                    <p
                      v-bind:class="{
                        'white--text': $store.getters.getTheme,
                      }"
                    >
                      (Yli 40 merkkiä pitkät nimet lyhennetään 40 merkkiin)
                    </p>
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
                      label="Valitse kalalaji, tai luo oma kirjoittamalla"
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
                            >Luo uusi kalalaji painamalla Enter:
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
                    ><v-icon>mdi-keyboard-return</v-icon>Takaisin</v-btn
                  >
                </v-col>
                <v-col md="6">
                  <v-btn large tile color="green" @click="checkFishSpecies"
                    ><v-icon>mdi-check</v-icon>Jatka</v-btn
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
                    ><v-icon>mdi-keyboard-return</v-icon>Takaisin</v-btn
                  >
                </v-col>
                <v-col>
                  <v-btn large tile color="grey" @click="disableInputs(false)"
                    ><v-icon>mdi-pencil</v-icon>Muuta tietoja</v-btn
                  >
                </v-col>
                <v-col>
                  <v-btn large tile color="green" @click="changeTab('points')"
                    ><v-icon>mdi-check</v-icon>Jatka</v-btn
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
                  Syötä kaloille pistekertoimet ja alamitat
                </p>
                <p
                  v-if="fish_specs_validated"
                  class="yellow lighten-1 black--text"
                >
                  Tiedot lukittuna, paina "Muuta tietoja" jos haluat vielä
                  muokata tietoja
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
                          label="Pistekerroin"
                          :id="'fish_' + (index + 1) + '_multiplier'"
                          maxlength="4"
                          value="1"
                          type="number"
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
                          label="Alamitta"
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
                  Yhtään kalaa ei ole valittu!
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
                    ><v-icon>mdi-keyboard-return</v-icon>Takaisin</v-btn
                  >
                </v-col>
                <v-col md="6" style="margin-top: 20px">
                  <v-btn large tile color="green" @click="checkFishSpecs"
                    ><v-icon>mdi-check</v-icon>Jatka</v-btn
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
                    ><v-icon>mdi-pencil</v-icon>Muuta tietoja</v-btn
                  >
                </v-col>
                <v-col md="4">
                  <v-btn large tile color="green" @click="changeTab('summary')"
                    ><v-icon>mdi-check</v-icon>Jatka</v-btn
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
        >
          <v-container v-if="!loading">
            <v-row>
              <v-col>
                <h2
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Perustiedot
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
                    <v-list-item-title>Kilpailu</v-list-item-title>
                    <v-list-item-subtitle class="blue-text">
                      <b>{{ name }} ({{ locality }})</b>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon color="yellow darken-1">mdi-medal</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Cup</v-list-item-title>
                    <v-list-item-subtitle class="blue-text">
                      <b>{{ cup.name }}</b>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon color="green">mdi-clipboard-check</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        >Kilpailun sijoittumispisteet</v-list-item-title
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
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon color="green darken-1">mdi-scoreboard</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title
                      >Kilpailijoiden Cup osallistumispisteet
                    </v-list-item-title>
                    <v-list-item-subtitle class="blue-text">
                      <b>{{ cup_participation_points }}</b>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-close-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title
                      >Kilpailun Cup pistekerroin</v-list-item-title
                    >
                    <v-list-item-subtitle class="blue-text">
                      <b>{{ cup_points_multiplier }}</b>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-account-multiple-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Onko Tiimikilpailua?</v-list-item-title>
                    <v-list-item-subtitle class="blue-text"
                      >{{ team_competition }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-calendar-today</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Päivämäärä</v-list-item-title>
                    <v-list-item-subtitle class="blue-text">
                      <b>{{ start_date }} - {{ end_date }}</b>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-clock-time-four</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Kilpailuaika</v-list-item-title>
                    <v-list-item-subtitle class="blue-text">
                      <b>{{ start_time }} - {{ end_time }}</b>
                    </v-list-item-subtitle>
                  </v-list-item>
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
                  Kalojen määritykset
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
                  ><v-icon>mdi-keyboard-return</v-icon>Takaisin</v-btn
                >
              </v-col>
              <v-col md="5" v-if="validated">
                <v-btn large tile color="green" @click="submitCompetition"
                  ><v-icon>mdi-plus-circle</v-icon>Luo kilpailu näillä
                  tiedoilla</v-btn
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
              Tallennetaan kilpailua tietokantaan...
            </h2>
            <ProgressBarQuery />
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
"use strict";

import CompetitionService from "../CompetitionService";
import CupService from "../CupService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import shared from "@/shared";
import constants from "@/constants";

export default {
  name: "RegisterComp",
  components: {
    ProgressBarQuery,
  },
  data() {
    return {
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
      team_competition: "Ei",
      start_date: new Date().toISOString().substr(0, 10),
      end_date: new Date().toISOString().substr(0, 10),
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
        (value) => !!value || "Kenttä ei voi jäädä tyhjäksi!",
        (value) =>
          (value || "").length <= this.max_input || "Enintään 40 merkkiä",
      ],
      number_rules: [
        (value) => !!value || "Kenttä ei voi jäädä tyhjäksi!",
        (value) => !isNaN(value || "") || "Ei ole numero!",
        (value) => (value || "") >= 0 || "Numeron pitää olla positiivinen!",
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
      options: [
        {
          text: "Ahven",
          color: "blue lighten-1",
          index: 0,
        },
        {
          text: "Hauki",
          color: "red lighten-1",
          index: 1,
        },
        {
          text: "Kuha",
          color: "green lighten-1",
          index: 2,
        },
        {
          text: "Lohi",
          color: "purple lighten-1",
          index: 3,
        },
        {
          text: "Taimen",
          color: "indigo lighten-1",
          index: 4,
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
      timeout: 5000,
      editPoints: false,
    };
  },
  // Runs everytime this page loads
  mounted() {
    this.getCups();

    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
    this.placement_points_array = JSON.parse(
      JSON.stringify(constants.placement_points)
    );
  },
  watch: {
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
            index: i,
          };

          this.options.push(v);
          this.nonce++;
        }

        return v;
      });
    },
  },
  methods: {
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
              (cup) => cup.id === this.$route.query.cup
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
    isNumber: function (evt, isDate) {
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
    showError: function (error) {
      this.errors.push(error);
      location.href = "#";
      location.href = "#app";
    },
    // Check competitions basic information (Perustiedot)
    checkBasicInformation: function () {
      this.errors = [];
      this.basic_info_validated = false;
      this.validated = false;
      // Check if the given dates and times are valid with moment
      var isDateValid = this.$moment(
        this.start_date,
        "YYYY-M-D",
        true
      ).isValid();

      var isEndDateValid = this.$moment(
        this.end_date,
        "YYYY-M-D",
        true
      ).isValid();

      var isStartTimeValid = this.$moment(
        this.start_time,
        "H:mm",
        true
      ).isValid();

      var isEndTimeValid = this.$moment(this.end_time, "H:mm", true).isValid();

      // Check other variables
      if (!this.name) {
        this.showError("Kilpailun nimi puuttuu!");
      }

      // Check other variables
      if (!this.locality) {
        this.showError("Kilpailun paikkakunta puuttuu!");
      }

      if (!this.cup.id) {
        this.showError("Cuppia ei valittuna!");
      }
      if (!this.cup_participation_points) {
        this.showError("Määritä kilpailun Cup osallistumispisteet!");
      }
      if (!this.cup_points_multiplier) {
        this.showError("Kilpailun pistekerroin puuttuu!");
      }
      if (this.cup_points_multiplier < 0.1) {
        this.showError("Kilpailun pistekerroin pitää olla vähintään 0.1!");
      }
      if (!this.start_time || !isStartTimeValid) {
        !this.start_time == true
          ? this.showError("Kilpailun alkamisnaika puuttuu!")
          : this.showError(
              'Syötä aika muodossa "hh:mm" (esim: 13:00). Syötetty aika oli: ' +
                this.start_time
            );
      }
      if (!this.end_time || !isEndTimeValid) {
        !this.end_time == true
          ? this.showError("Kilpailun loppumisaika puuttuu!")
          : this.showError(
              'Syötä aika muodossa "hh:mm" (esim: 13:00). Syötetty aika oli: ' +
                this.end_time
            );
      }
      if (!this.start_date || !isDateValid) {
        !this.start_date == true
          ? this.showError("Päivämäärää ei ole valittu!")
          : this.showError(
              'Syötä päivämäärä muodossa "PP.KK.VVVV (esim: 06.02.2020)'
            );
      }
      if (!this.end_date || !isEndDateValid) {
        !this.end_date == true
          ? this.showError("Päivämäärää ei ole valittu!")
          : this.showError(
              'Syötä päivämäärä muodossa "PP.KK.VVVV (esim: 06.02.2020)'
            );
      } else {
        let temp_start = this.$moment(this.start_date).format("DD.MM.YYYY");
        let temp_end = this.$moment(this.end_date).format("DD.MM.YYYY");
        // If dates are valid, check that start_date is before end_date
        let start_date = this.$moment(
          `${temp_start} ${this.start_time}`,
          "DD.MM.YYYY HH:mm"
        );
        let end_date = this.$moment(
          `${temp_end} ${this.end_time}`,
          "DD.MM.YYYY HH:mm"
        );

        if (end_date.isBefore(start_date, "minutes")) {
          this.showError(
            "Kilpailun päättymispäivämäärä ja kellonaika ei voi olla ennen alkamispäivämäärää!"
          );
        }
      }
      // If all inputs validated
      if (!this.errors.length) {
        let temp_start = this.$moment(this.start_date).format("DD.MM.YYYY");
        let temp_end = this.$moment(this.end_date).format("DD.MM.YYYY");
        let start_date = this.$moment(
          `${temp_start} ${this.start_time}`,
          "DD.MM.YYYY HH:mm"
        );
        let end_date = this.$moment(
          `${temp_end} ${this.end_time}`,
          "DD.MM.YYYY HH:mm"
        );

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

        // Competition object, basic info
        this.basic_info = {
          name: this.name,
          locality: this.locality,
          cup_name: this.cup.name,
          cup_participation_points: Number(this.cup_participation_points),
          cup_placement_points_array: temp_placement_points,
          cup_points_multiplier: Number(this.cup_points_multiplier),
          team_competition: this.team_competition === "Ei" ? false : true,
          start_date: start_date,
          end_date: end_date,
          start_time: this.start_time,
          end_time: this.end_time,
        };
        // Enable next tab and open it
        // Disable current tab's inputs
        this.disableInputs(true);
        // Open next tab
        this.tab = "fishes";
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
        this.showError("Yhtään kalalajia ei ole valittu!");
      }
    },

    // Validate fish specifications from "Pistekertoimet ja alamitat" tab
    checkFishSpecs: function () {
      this.completed_fish_specs = [];
      let colors = shared.getRandomColors(this.selected.length);
      this.errors = [];
      // Create fish objects
      for (let i = 1; i < this.selected.length + 1; i++) {
        // Fish object
        let fish_spec = {
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
            `Syötä kalan '${fish_spec.name}' kaikki tiedot oikein! (Pistekerroin > 0, Alamitta >= 0 )`
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
          this.basic_info_validated == false
            ? this.showError("Tarkista kilpailun perustiedot!")
            : console.log("Perustiedot kunnossa!");

          this.fish_species_validated == false
            ? this.showError("Tarkista kalojen tiedot!")
            : console.log("Kalojen tiedot kunnossa!");

          this.fish_specs_validated == false
            ? this.showError("Tarkista kalojen pistekertoimet ja alamitat!")
            : console.log("Kalojen pistekertoimet ja alamitat kunnossa!");
        }
      } else {
        this.showError("Joitain tietoja puuttuu vielä!");
      }
    },
    // Check current tab, and disable it's inputs
    /*
            <v-tab href="#basic-info">1. Perustiedot</v-tab>
            <v-tab href="#fishes">2. Kilpailun kalalajit</v-tab>
            <v-tab href="#points">3. Pistekertoimet ja alamitat</v-tab>
            <v-tab href="#summary">4. Yhteenveto</v-tab>
        */
    disableInputs: function (disable) {
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
        let cup_id = this.cup.id;
        const competition = {
          cup_id: cup_id,
          user_id: user_id,
          name: this.basic_info.name,
          locality: this.basic_info.locality,
          cup_name: this.basic_info.cup_name,
          cup_placement_points_array:
            this.basic_info.cup_placement_points_array,
          cup_participation_points: this.basic_info.cup_participation_points,
          cup_points_multiplier: this.basic_info.cup_points_multiplier,
          team_competition: this.basic_info.team_competition,
          start_date: this.basic_info.start_date,
          end_date: this.basic_info.end_date,
          duration: this.basic_info.duration,
          start_time: this.basic_info.start_time,
          end_time: this.basic_info.end_time,
          fishes: this.completed_fish_specs,
          state: "Rekisteröity",
          total_weights: 0,
          signees: [],
          results: [],
          teams: [],
          biggest_fishes: {},
          biggest_amounts: {},
        };
        try {
          //Submit competition to database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
          await CompetitionService.insertCompetition(competition);
          this.text = "Kilpailu lisätty tietokantaan!";
          this.snackbar = true;
          this.$router.push({ path: "/continue" });
        } catch (err) {
          this.errors.push(err.message);
        }
      } else {
        this.errors.push("Not validated somehow?"); // Submit button should only be available when everything is validated
      }
    },
  },
};
</script>
<style></style>
