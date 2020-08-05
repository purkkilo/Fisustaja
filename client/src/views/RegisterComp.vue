<template>
  <!-- /register-comp -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div class="container">
    <Header />
    <Timedate />
    <!-- if errors, show errors -->
    <div id="errordiv" v-if="errors.length">
      <ul class="collection with-header" style="border:1px solid red;">
        <li class="collection-header" style="background: rgba(0,0,0,0);">
          <v-alert type="error">
            Korjaa seuraavat virheet:
          </v-alert>
        </li>
        <li
          class="collection-item"
          id="error"
          v-for="(error, index) in errors"
          v-bind:key="index"
        >
          <p class="flow-text">{{ index + 1 }}. {{ error }}</p>
        </li>
      </ul>
    </div>

    <div class="container-transparent">
      <div class="section">
        <div class="col s12 center-align"><h1>Kilpailun luonti</h1></div>
      </div>

      <!-- Tabs -->
      <v-tabs
        v-model="tab"
        background-color="blue lighten-2"
        color="basil"
        grow
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

      <v-tabs-items v-model="tab" style="background: rgba(1,1,1,0.4);">
        <!-- "Perustiedot" tab -->
        <v-tab-item class="inputarea" :value="'basic-info'">
          <v-container v-if="!loading">
            <v-row>
              <v-col>
                <p class="center-align flow-text black--text">
                  Kilpailun perustiedot
                </p>
                <p
                  v-if="basic_info_validated"
                  class="flow-text yellow lighten-1 center-align"
                >
                  Tiedot lukittuna, paina "Muuta tietoja" jos haluat vielä
                  muokata tietoja
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <v-row v-if="cup.name">
                  <v-col md="6" offset-md="3" class="input-fields">
                    <v-text-field
                      label="Kilpailun nimi"
                      v-model="name"
                      :maxlength="max_input"
                      :disabled="basic_info_validated"
                      :rules="rules"
                      :counter="max_input"
                    />
                  </v-col>
                </v-row>

                <v-row v-if="cup.name">
                  <v-col md="6" offset-md="3" class="input-fields">
                    <v-text-field
                      label="Paikkakunta"
                      v-model="locality"
                      :maxlength="max_input"
                      :disabled="basic_info_validated"
                      :rules="rules"
                      :counter="max_input"
                    />
                  </v-col>
                </v-row>

                <v-row v-if="cup.name">
                  <v-col md="3">
                    <p class="center-align flow-text black--text">
                      Valitse Cup
                    </p>
                  </v-col>
                  <v-col class="d-flex" md="6">
                    <v-select
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
                  <v-col md="3">
                    <router-link to="/continue">
                      <v-btn tile color="green lighten-1"
                        ><i class="material-icons left">add_circle_outline</i
                        >Luo uusi cup!</v-btn
                      >
                    </router-link>
                  </v-col>
                </v-row>
                <v-row v-else class="valign-wrapper">
                  <v-col md="6" offset-md="2">
                    <p class="flow-text">
                      Ei luotuja cuppeja, Luo cup ensin "Jatka Kilpailuja
                      sivulla" (Voit myös luoda cupin kilpailuille, jotka ei ole
                      missään cupissa")
                    </p>
                  </v-col>
                  <v-col md="2">
                    <router-link to="/continue">
                      <v-btn tile color="blue lighten-1"
                        ><i class="material-icons left">add_circle_outline</i
                        >Luo cup!</v-btn
                      >
                    </router-link>
                  </v-col>
                </v-row>
                <v-row v-if="cup.name">
                  <v-col md="6" offset-md="3" class="input-fields">
                    <v-text-field
                      label="Kilpailun voittajan cup sijoittumispisteet"
                      v-model="cup_placement_points"
                      append-outer-icon="add"
                      maxlength="6"
                      @click:append-outer="
                        cup_placement_points >= 0
                          ? cup_placement_points++
                          : (cup_placement_points = 1)
                      "
                      prepend-icon="remove"
                      @click:prepend="
                        cup_placement_points >= 1
                          ? cup_placement_points--
                          : (cup_placement_points = 0)
                      "
                      @paste.prevent
                      :counter="6"
                      @keypress="isNumber($event, true)"
                      :rules="number_rules"
                      :disabled="basic_info_validated"
                    />
                  </v-col>
                </v-row>

                <v-row v-if="cup.name">
                  <v-col md="6" offset-md="3" class="input-fields">
                    <v-text-field
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

                <v-row v-if="cup.name">
                  <v-col md="6" offset-md="3" class="input-fields">
                    <v-text-field
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

                <v-row v-if="cup.name">
                  <v-col md="6" offset-md="3" class="input-fields">
                    <v-col>
                      <span class="flow-text black-text"
                        >Onko Tiimikilpailua?</span
                      >
                    </v-col>
                    <v-col offset-md="4">
                      <v-radio-group
                        v-model="team_competition"
                        row
                        :disabled="basic_info_validated"
                      >
                        <v-radio label="Kyllä" value="Kyllä"></v-radio>
                        <v-radio label="Ei" value="Ei"></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-col>
                </v-row>

                <v-row v-if="cup.name">
                  <v-col cols="12" md="5">
                    <v-row align="center">
                      <span class="flow-text black-text col s6"
                        >Kilpailun Aloituspäivä</span
                      >
                    </v-row>
                    <v-row align="center">
                      <v-date-picker
                        style="height:480px"
                        v-model="start_date"
                        full-width
                        elevation="15"
                        locale="fi"
                        class="mt-4"
                        :disabled="basic_info_validated"
                      ></v-date-picker>
                    </v-row>
                  </v-col>
                  <v-col
                    cols="12"
                    md="5"
                    offset-md="2"
                    style="margin-bottom:50px"
                  >
                    <v-row align="center">
                      <span class="flow-text black-text col s6"
                        >Kilpailun Lopetuspäivä</span
                      >
                    </v-row>
                    <v-row>
                      <v-date-picker
                        style="height:480px"
                        v-model="end_date"
                        full-width
                        elevation="15"
                        locale="fi"
                        class="mt-4"
                        :disabled="basic_info_validated"
                      ></v-date-picker>
                    </v-row>
                  </v-col>
                </v-row>

                <v-row v-if="cup.name">
                  <v-col cols="12" md="5">
                    <v-row align="center">
                      <v-col>
                        <span class="flow-text black-text"
                          >Kilpailun alkamismisaika</span
                        >
                      </v-col>
                    </v-row>
                    <v-row align="center">
                      <v-col>
                        <v-time-picker
                          v-model="start_time"
                          format="24hr"
                          full-width
                          scrollable
                          elevation="15"
                          :disabled="basic_info_validated"
                        ></v-time-picker>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="5" offset-md="1">
                    <v-row align="center">
                      <v-col md="12" offset-md="2">
                        <span class="flow-text black-text"
                          >Kilpailun loppumisaika</span
                        >
                      </v-col>
                    </v-row>
                    <v-row align="center">
                      <v-col md="12" offset-md="2">
                        <v-time-picker
                          v-model="end_time"
                          format="24hr"
                          full-width
                          scrollable
                          elevation="15"
                          :disabled="basic_info_validated"
                        ></v-time-picker>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <v-row v-if="!basic_info_validated">
                  <v-col md="6" offset-md="3" v-if="cup.name">
                    <v-btn
                      large
                      block
                      color="green"
                      @click="checkBasicInformation"
                      ><i class="material-icons left">check</i>Jatka</v-btn
                    >
                  </v-col>
                </v-row>
              </v-col>
              <v-row v-if="basic_info_validated">
                <v-col md="6">
                  <v-btn large tile color="grey" @click="disableInputs(false)"
                    ><i class="material-icons left">settings</i>Muuta
                    tietoja</v-btn
                  >
                </v-col>
                <v-col md="6">
                  <v-btn large tile color="green" @click="changeTab('fishes')"
                    ><i class="material-icons right">arrow_forward</i
                    >Jatka</v-btn
                  >
                </v-col>
              </v-row>
            </v-row>
          </v-container>
          <v-container v-else>
            <v-row>
              <v-col>
                <h2>Valmistellaan kilpailun luontia...</h2>
                <ProgressBarQuery />
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>

        <!-- "Kilpailun kalalajit" tab -->
        <v-tab-item class="inputarea" :value="'fishes'">
          <v-container>
            <v-row>
              <v-col>
                <p
                  v-if="fish_species_validated"
                  class="flow-text yellow lighten-1 center-align"
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
                    <h3>
                      Kalalajien valinta
                    </h3>
                    <p>
                      (Yli 40 merkkiä pitkät nimet lyhennetään 40 merkkiin)
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col md="10" offset-md="1">
                    <v-combobox
                      v-model="selected"
                      :items="options"
                      label="Valitse kalalaji, tai luo oma kirjoittamalla"
                      :disabled="fish_species_validated"
                      multiple
                      chips
                    >
                      <template v-slot:selection="data">
                        <v-chip
                          :key="JSON.stringify(data.item)"
                          v-bind="data.attrs"
                          :input-value="data.selected"
                          :disabled="data.disabled"
                          @click:close="data.parent.selectItem(data.item)"
                        >
                          <v-avatar
                            class="accent white--text"
                            left
                            v-text="data.item.slice(0, 1).toUpperCase()"
                          ></v-avatar>
                          {{ data.item }}
                        </v-chip>
                      </template>
                    </v-combobox>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row style="margin-top:50px">
              <v-row v-if="!fish_species_validated">
                <v-col md="6">
                  <v-btn
                    large
                    tile
                    color="blue lighten-2"
                    @click="changeTab('basic-info')"
                    ><i class="material-icons left">arrow_back</i
                    >Takaisin</v-btn
                  >
                </v-col>
                <v-col md="6">
                  <v-btn large tile color="green" @click="checkFishSpecies"
                    ><i class="material-icons left">check</i>Jatka</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col>
                  <v-btn
                    large
                    tile
                    color="blue lighten-2"
                    @click="changeTab('basic-info')"
                    ><i class="material-icons left">arrow_back</i
                    >Takaisin</v-btn
                  >
                </v-col>
                <v-col>
                  <v-btn large tile color="grey" @click="disableInputs(false)"
                    ><i class="material-icons left">settings</i>Muuta
                    tietoja</v-btn
                  >
                </v-col>
                <v-col>
                  <v-btn large tile color="green" @click="changeTab('points')"
                    ><i class="material-icons right">arrow_forward</i
                    >Jatka</v-btn
                  >
                </v-col>
              </v-row>
            </v-row>
          </v-container>
        </v-tab-item>

        <!-- "Pistekertoimet ja alamitat" tab -->
        <v-tab-item class="inputarea" :value="'points'">
          <v-container>
            <v-row>
              <v-col>
                <p class="flow-text center-align">
                  Syötä kaloille pistekertoimet ja alamitat
                </p>
                <p
                  v-if="fish_specs_validated"
                  class="flow-text yellow lighten-1 center-align"
                >
                  Tiedot lukittuna, paina "Muuta tietoja" jos haluat vielä
                  muokata tietoja
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="specs" id="select_specs">
                <ul id="fish_specs" v-if="selected.length">
                  <li
                    class="row"
                    id="fish_spec"
                    v-for="(fish, index) in selected"
                    :key="fish"
                  >
                    <v-row>
                      <v-col>
                        <span
                          class="flow-text"
                          :id="'fish_' + (index + 1) + '_name'"
                          >{{ index + 1 }}. {{ fish }}</span
                        >
                      </v-col>
                      <v-col class="input-fields">
                        <v-text-field
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
                          label="Alamitta"
                          :id="'fish_' + (index + 1) + '_minsize'"
                          maxlength="4"
                          value="0"
                          type="number"
                          @paste.prevent
                          :counter="4"
                          @keypress="isNumber($event, true)"
                          :rules="number_rules"
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

            <v-row>
              <v-row v-if="selected.length && !validated">
                <v-col md="6">
                  <v-btn
                    large
                    tile
                    color="blue lighten-2"
                    @click="changeTab('fishes')"
                    ><i class="material-icons left">arrow_back</i
                    >Takaisin</v-btn
                  >
                </v-col>
                <v-col md="6">
                  <v-btn large tile color="green" @click="checkFishSpecs"
                    ><i class="material-icons left">check</i>Tarkista
                    tiedot</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col md="4">
                  <v-btn
                    large
                    tile
                    color="blue lighten-2"
                    @click="changeTab('fishes')"
                    ><i class="material-icons left">arrow_back</i
                    >Takaisin</v-btn
                  >
                </v-col>
                <v-col md="4">
                  <v-btn large tile color="grey" @click="disableInputs(false)"
                    ><i class="material-icons left">settings</i>Muuta
                    tietoja</v-btn
                  >
                </v-col>
                <v-col md="4">
                  <v-btn large tile color="green" @click="changeTab('summary')"
                    ><i class="material-icons right">arrow_forward</i
                    >Jatka</v-btn
                  >
                </v-col>
              </v-row>
            </v-row>
          </v-container>
        </v-tab-item>

        <!-- "Yhteenveto" tab -->
        <v-tab-item class="inputarea" :value="'summary'">
          <v-container v-if="!loading">
            <v-row class="basic_summary">
              <v-col>
                <table class="striped centered responsive-table highlight">
                  <caption class="flow-text">
                    Perustiedot
                  </caption>
                  <tr>
                    <th style="border:1px solid black;">Kilpailu</th>
                    <td style="border:1px solid black;" class="center-align">
                      {{ name }} ({{ locality }})
                    </td>
                  </tr>
                  <tr>
                    <th style="border:1px solid black;">Cup</th>
                    <td style="border:1px solid black;" class="center-align">
                      {{ cup.name }}
                    </td>
                  </tr>
                  <tr>
                    <th style="border:1px solid black;">
                      Voittajan Cup sijoittumispisteet
                    </th>
                    <td style="border:1px solid black;" class="center-align">
                      {{ cup_placement_points }}
                    </td>
                  </tr>
                  <tr>
                    <th style="border:1px solid black;">
                      Kilpailijoiden Cup osallistumispisteet
                    </th>
                    <td style="border:1px solid black;" class="center-align">
                      {{ cup_participation_points }}
                    </td>
                  </tr>
                  <tr>
                    <th style="border:1px solid black;">
                      Kilpailun Cup pistekerroin
                    </th>
                    <td style="border:1px solid black;" class="center-align">
                      {{ cup_points_multiplier }}
                    </td>
                  </tr>
                  <tr>
                    <th style="border:1px solid black;">
                      Onko Tiimikilpailua?
                    </th>
                    <td style="border:1px solid black;" class="center-align">
                      {{ team_competition }}
                    </td>
                  </tr>
                  <tr>
                    <th style="border:1px solid black;">Aloituspäivä</th>
                    <td style="border:1px solid black;" class="center-align">
                      {{ start_date }}
                    </td>
                  </tr>
                  <tr>
                    <th style="border:1px solid black;">Lopetuspäivä</th>
                    <td style="border:1px solid black;" class="center-align">
                      {{ end_date }}
                    </td>
                  </tr>
                  <tr>
                    <th style="border:1px solid black;">Kilpailuajankohta</th>
                    <td style="border:1px solid black;" class="center-align">
                      {{ start_time }} - {{ end_time }}
                    </td>
                  </tr>
                </table>
              </v-col>
            </v-row>
            <v-row class="fishes_summary">
              <v-col md="12">
                <p class="flow-text">Kalojen määritykset</p>
              </v-col>
              <v-col md="12">
                <table class="striped highlight centered responsive-table">
                  <thead>
                    <tr>
                      <th>Kalalaji</th>
                      <th>Pistekerroin</th>
                      <th>Alamitta</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(fish, index) in completed_fish_specs"
                      :key="index"
                    >
                      <th style="border:1px solid black;" scope="row">
                        {{ fish.name }}
                      </th>
                      <td style="border:1px solid black;">
                        x {{ fish.multiplier }}
                      </td>
                      <td style="border:1px solid black;">
                        {{ fish.minsize }} cm
                      </td>
                    </tr>
                  </tbody>
                </table>
              </v-col>
            </v-row>
            <v-row>
              <v-row>
                <v-col md="5" offset-md="1">
                  <v-btn
                    large
                    tile
                    color="blue lighten-2"
                    @click="changeTab('points')"
                    ><i class="material-icons left">arrow_back</i
                    >Takaisin</v-btn
                  >
                </v-col>
                <v-col md="5" v-if="validated">
                  <v-btn large tile color="green" @click="submitCompetition"
                    ><i class="material-icons left">add_circle_outline</i>Luo
                    kilpailu näillä tiedoilla</v-btn
                  >
                </v-col>
              </v-row>
            </v-row>
          </v-container>
          <v-container v-else>
            <h2>Tallennetaan kilpailua tietokantaan...</h2>
            <ProgressBarQuery />
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
"use strict";
import M from "materialize-css";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import Timedate from "../components/layout/Timedate";
import Header from "../components/layout/Header";
import { options_picker } from "../i18n";
import CompetitionService from "../CompetitionService";
import CupService from "../CupService";
import moment from "moment";

export default {
  name: "RegisterComp",
  components: {
    ProgressBarQuery,
    Header,
    Timedate,
  },
  data() {
    return {
      tab: null,
      errors: [],
      options: ["Ahven", "Hauki", "Kuha", "Lohi", "Taimen"],
      selected: [],
      days_options: [1, 2, 3, 4, 5, 6, 7],
      name: null,
      locality: null,
      cups: [],
      cup: {},
      cup_placement_points: 30,
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
    };
  },
  // Runs everytime this page loads
  mounted() {
    //Check if user is logged in has admin status, update header
    this.checkLogin();
    M.AutoInit();
    // options_picker variable loads from client\src\i18n.js and contains finnish translations
    /* eslint-disable no-unused-vars */
    var collabs = document.querySelectorAll(".collapsible");
    var instances3 = M.Collapsible.init(collabs, options_picker);
    /* eslint-enable no-unused-vars */
    moment.locale("fi"); //FIXME redundant declaration?
    this.getCups();

    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
  },
  methods: {
    changeTab: function(id) {
      this.tab = id;
    },
    async getCups() {
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user["id"];
      this.loading = true;
      // Get Cups
      try {
        this.cups = await CupService.getCups(user_id);
        if (this.cups.length) {
          this.cups.sort(function compare(a, b) {
            return a.name - b.name;
          });
          this.cups.forEach((cup) => {
            cup.select = `${cup.name} (${cup.year})`;
          });
          this.cup = this.cups[this.cups.length - 1];
        }
      } catch (err) {
        this.error = err.message;
      }
      this.loading = false;
    },
    //Check if user is logged in has admin status, update values to vuex (Header.vue updates based on these values)
    checkLogin: function() {
      // If login token present --> user is logged in
      if (localStorage.getItem("jwt") != null) {
        this.$store.state.logged_in = true;
        let user = JSON.parse(localStorage.getItem("user"));
        // Check if user is admin
        //TODO safer way to check this than use localstorage?
        user.is_admin == true
          ? (this.$store.state.is_admin = true)
          : (this.$store.state.is_admin = false);
      } else {
        //Not logger in, so not admin either
        this.$store.state.logged_in = false;
        this.$store.state.is_admin = false;
      }
    },
    //filter other characters out for number inputs
    isNumber: function(evt, isDate) {
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
    showError: function(error) {
      this.errors.push(error);
      M.toast({ html: error });
      location.href = "#";
      location.href = "#app";
    },
    // Check competitions basic information (Perustiedot)
    checkBasicInformation: function() {
      this.errors = [];
      this.basic_info_validated = false;
      this.validated = false;
      // Check if the given dates and times are valid with moment
      var isDateValid = moment(this.start_date, "YYYY-M-D", true).isValid();

      var isEndDateValid = moment(this.end_date, "YYYY-M-D", true).isValid();

      var isStartTimeValid = moment(this.start_time, "H:mm", true).isValid();

      var isEndTimeValid = moment(this.end_time, "H:mm", true).isValid();

      // Check other variables
      if (!this.name) {
        this.showError("Kilpailun nimi puuttuu!");
      }

      // Check other variables
      if (!this.locality) {
        this.showError("Kilpailun paikkakunta puuttuu!");
      }

      if (!this.cup._id) {
        this.showError("Cuppia ei valittuna!");
      }
      if (!this.cup_placement_points) {
        this.showError(
          "Määritä kilpailun voittajalle Cup sijoittumispisteet (Voittaja saa pisteet: Sijoittumispisteet + Osallistumispisteet)!"
        );
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
        let temp_start = moment(this.start_date).format("DD.MM.YYYY");
        let temp_end = moment(this.end_date).format("DD.MM.YYYY");
        // If dates are valid, check that start_date is before end_date
        let start_date = moment(
          `${temp_start} ${this.start_time}`,
          "DD.MM.YYYY HH:mm"
        );
        let end_date = moment(
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
        let temp_start = moment(this.start_date).format("DD.MM.YYYY");
        let temp_end = moment(this.end_date).format("DD.MM.YYYY");
        let start_date = moment(
          `${temp_start} ${this.start_time}`,
          "DD.MM.YYYY HH:mm"
        );
        let end_date = moment(
          `${temp_end} ${this.end_time}`,
          "DD.MM.YYYY HH:mm"
        );

        // Competition object, basic info
        this.basic_info = {
          name: this.name,
          locality: this.locality,
          cup_name: this.cup.name,
          cup_placement_points: Number(this.cup_placement_points),
          cup_participation_points: Number(this.cup_participation_points),
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
    checkFishSpecies: function() {
      this.errors = [];
      this.fish_species_validated = false;
      this.validated = false;

      // If there are at least one fish chosen from v-select
      if (this.selected.length) {
        let temp_array = [];
        //TODO better solution for long names, change to vuetify combobox(https://vuetifyjs.com/en/components/combobox/) or vuetify select(https://vuetifyjs.com/en/components/selects/)
        this.selected.forEach((fish) => {
          if (fish.length > 40) {
            let shortened = fish.slice(0, 40);
            temp_array.push(shortened);
          } else {
            temp_array.push(fish);
          }
        });
        // Sort names based on alphabet
        this.selected = temp_array.sort();
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
    // Generate random colors for the fish chart in Result.vue (since adding fishes is dynamic)
    //TODO look for 8-15 good colors to add/choose from, maybe with color picker next to fish name
    generateRandomColor: function() {
      var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
      return randomColor;
    },

    // Validate fish specifications from "Pistekertoimet ja alamitat" tab
    checkFishSpecs: function() {
      this.completed_fish_specs = [];
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
          color: this.generateRandomColor(),
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
    disableInputs: function(disable) {
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
        const user_id = user["id"];

        // Whole competition object
        let cup_id = this.cup._id;
        const competition = {
          cup_id: cup_id,
          user_id: user_id,
          name: this.basic_info.name,
          locality: this.basic_info.locality,
          cup_name: this.basic_info.cup_name,
          cup_placement_points: this.basic_info.cup_placement_points,
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
          isPublic: false,
        };
        try {
          //Submit competition to database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
          await CompetitionService.insertCompetition(competition);
          M.toast({ html: "Kilpailu lisätty tietokantaan!" });
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
