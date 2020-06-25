<template>
  <div id="app">
    <div class="container">
      <Timedate/>
      <div id="errordiv" v-if="errors.length">
        <ul class="collection with-header">
          <li class="collection-header"><h4>Korjaa seuraavat virheet:</h4></li>
          <li
            class="collection-item flow-text"
            id="error"
            v-for="(error, index) in errors"
            v-bind:key="index"
          >
            {{ index + 1 }}. {{ error }}
          </li>
        </ul>
      </div>

      <div class="container-transparent">
        <div class="section">
          <div class="col s12 center-align"><h1>Kilpailun luonti</h1></div>
        </div>

        <div class="row">
          <div class="col s12">
            <ul class="tabs">
              <li class="tab col s3" id="info-tab">
                <a class="active" href="#basic-info">1. Perustiedot</a>
              </li>
              <li class="tab col s3 disabled" id="fishes-tab">
                <a href="#fishes">2. Kilpailun kalalajit</a>
              </li>
              <li class="tab col s3 disabled" id="points-tab">
                <a href="#points">3. Pistekertoimet ja alamitat</a>
              </li>
              <li class="tab col s3 disabled" id="summary-tab">
                <a href="#summary">4. Yhteenveto</a>
              </li>
            </ul>
          </div>
          <div id="basic-info" class="col s12 inputarea">
            <p class="center-align flow-text">Kilpailun perustiedot</p>
            <p
              v-if="basic_info_validated"
              class="flow-text yellow lighten-1 center-align"
            >
              Tiedot lukittuna, paina "Muuta tietoja" jos haluat vielä muokata
              tietoja
            </p>
            <div id="basic-inputs" class="row">
              <div class="row">
                <div class="input-fields col s8 push-s2">
                  <span class="flow-text black-text col s6"
                    >Kilpailun nimi</span
                  >                    
                  <input
                    id="name"
                    v-model="name"
                    name="name"
                    type="text"
                    class="validate col s6"
                    maxlength="40"
                  />
                </div>
              </div>

              <div class="row">
                <div class="input-fields col s8 push-s2">
                  <span class="flow-text black-text col s6"
                    >Cup nimi</span
                  >                     
                  <input
                    id="cup_name"
                    v-model="cup_name"
                    name="cup_name"
                    type="text"
                    class="validate col s6"
                    maxlength="40"
                  />
                </div>
              </div>

              <div class="row">
                <div class="input-fields col s8 push-s2">
                  <span class="flow-text black-text col s6"
                    >Kilpailun voittajan cup sijoittumispisteet</span
                  >                       
                  <input
                    id="cup_placement_points"
                    @paste.prevent
                    v-model="cup_placement_points"
                    @keypress="isNumber($event, true)"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    type="text"
                    maxlength="4"
                    class="validate col s6"
                  />
                </div>
              </div>

              <div class="row">
                <div class="input-fields col s8 push-s2">
                  <span class="flow-text black-text col s6"
                    >Kilpailun cup osallistumispisteet</span
                  >                   
                  <input
                    id="cup_participation_points"
                    @paste.prevent
                    v-model="cup_participation_points"
                    @keypress="isNumber($event, true)"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    type="text"
                    maxlength="4"
                    class="validate col s6"
                  />

                </div>
              </div>

              <div class="row">
                <div class="input-fields col s8 push-s2">
                  <span class="flow-text black-text col s6"
                    >Cup pistekerroin</span
                  > 
                  <input
                    id="cup_points_multiplier"
                    @paste.prevent
                    v-model="cup_points_multiplier"
                    @keypress="isNumber($event, true)"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    type="text"
                    maxlength="4"
                    class="validate col s6"
                    value="1"
                  />
                </div>
              </div>

              <div class="row">
                <div class="input-fields col s8 push-s2 valign-wrapper">
                    <span class="col s6 flow-text black-text">Onko Tiimikilpailua?</span>
                    <p class="col s3 push flow-text">
                      <label>
                        <input class="with-gap" name="group1" type="radio" value="Kyllä" v-model="team_competition"/>
                        <span class="flow-text black-text">Kyllä</span>
                      </label>
                    </p>
                    <p class="col s3 flow-text">
                      <label>
                        <input class="with-gap" name="group1" value="Ei" v-model="team_competition" type="radio"/>
                        <span class="black-text">Ei</span>
                      </label>
                    </p>
                </div>

              </div>



              <div class="row">
                <div class="input-fields col s8 push-s2" style="padding-top:10px">
                  <span class="flow-text black-text col s6"
                    >Aloituspäivä</span
                  >                  
                  <input
                    id="start_date"
                    v-model.lazy="start_date"
                    @paste.prevent
                    name="start_date"
                    type="text"
                    class="datepicker validate col s6"
                    maxlength="10"
                  />
                </div>
              </div>

              <div class="row">
                <div class="input-fields col s8 push-s2" style="padding-top:10px">
                  <span class="flow-text black-text col s6"
                    >Lopetuspäivä</span
                  >                  
                  <input
                    id="end_date"
                    v-model.lazy="end_date"
                    @paste.prevent
                    name="end_date"
                    type="text"
                    class="datepicker validate col s6"
                    maxlength="10"
                  />
                </div>
              </div>

              <div class="row">
                <div class="input-fields col s8 push-s2 valign-wrapper" style="padding:10px">
                  <span class="flow-text black-text col s6"
                    >Kilpailun alkamisaika</span
                  >
                  <input
                    id="start_time"
                    v-model.lazy="start_time"
                    @paste.prevent
                    @keypress="isNumber($event, false)"
                    name="time_of_competition"
                    type="text"
                    class="timepicker validate col s6"
                    maxlength="5"
                  />
                </div>
              </div>

              <div class="row">
                <div class="input-fields col s8 push-s2 valign-wrapper" style="padding:10px">
                  <span class="flow-text black-text col s6"
                    >Kilpailun loppumisaika</span
                  >
                  <input
                    id="end_time"
                    v-model.lazy="end_time"
                    @paste.prevent
                    @keypress="isNumber($event, false)"
                    name="end_time"
                    type="text"
                    class="timepicker validate col s6"
                    maxlength="5"
                  />
                </div>
              </div>
              <div class="row">
                <a
                  v-if="!basic_info_validated"
                  v-on:click="checkBasicInformation"
                  class="col s4 offset-s4 waves-effect waves-light green btn-large"
                  ><i class="material-icons left">check</i>Jatka</a
                >
              </div>
            </div>
            <div v-if="basic_info_validated" class="row center-align">
              <a
                v-on:click="disableInputs(false)"
                class="waves-effect waves-light grey btn-large col s4 offset-s2"
                ><i class="material-icons left">settings</i>Muuta tietoja</a
              >
              <a
                v-on:click="tabs.select('fishes')"
                class="waves-effect waves-light green btn-large col s3 offset-s1"
                ><i class="material-icons right">arrow_forward</i>Jatka</a
              >
            </div>
          </div>
          <div id="fishes" class="col s12 inputarea">
            <p class="flow-text center-align">
              Kalalajien valitseminen kilpailuun
            </p>
            <p
              v-if="fish_species_validated"
              class="flow-text yellow lighten-1 center-align"
            >
              Tiedot lukittuna, paina "Muuta tietoja" jos haluat vielä muokata
              tietoja
            </p>
            <div class="row section" id="fishes_select" style="height:400px;">
              <p class="center-align">
                Valitse allaolevasta laatikosta, voit myös lisätä oman kalalajin
                kirjoittamalla
              </p>
              <p class="center-align">
                (Yli 40 merkkiä pitkät nimet lyhennetään 40 merkkiin)
              </p>
              <v-select
                class="col s10 push-s1 flow-text"
                taggable
                multiple
                push-tags
                v-model="selected"
                :options="options"
              />
            </div>

            <div class="divider black"></div>

            <div class="section center-align">
              <div v-if="!fish_species_validated" class="row">
                <div class="col s1"></div>
                <a
                  class="waves-effect waves-light blue lighten-2 btn-large col s4"
                  v-on:click="tabs.select('basic-info')"
                  ><i class="material-icons left">arrow_back</i>Takaisin</a
                >
                <div class="col s1"></div>
                <a
                  v-on:click="checkFishSpecies"
                  class="waves-effect waves-light green btn-large col s4"
                  ><i class="material-icons left">check</i>Jatka</a
                >
              </div>
              <div v-else class="row">
                <div class="col s1"></div>
                <a
                  class="waves-effect waves-light blue lighten-2 btn-large col s2"
                  v-on:click="tabs.select('basic-info')"
                  ><i class="material-icons left">arrow_back</i>Takaisin</a
                >
                <div class="col s1"></div>
                <a
                  v-on:click="disableInputs(false)"
                  class="waves-effect waves-light grey btn-large col s3"
                  ><i class="material-icons left">settings</i>Muuta tietoja</a
                >
                <div class="col s1"></div>
                <a
                  class="waves-effect waves-light green btn-large col s2"
                  v-on:click="tabs.select('points')"
                  ><i class="material-icons right">arrow_forward</i>Jatka</a
                >
                <div class="col s1"></div>
              </div>
            </div>
          </div>

          <div id="points" class="col s12 inputarea">
            <p class="flow-text center-align">
              Syötä kaloille pistekertoimet ja alamitat
            </p>
            <p
              v-if="fish_specs_validated"
              class="flow-text yellow lighten-1 center-align"
            >
              Tiedot lukittuna, paina "Muuta tietoja" jos haluat vielä muokata
              tietoja
            </p>
            <div class="specs" id="select_specs">
              <ul id="fish_specs" v-if="selected.length">
                <li class="row"
                  id="fish_spec"
                  v-for="(fish, index) in selected"
                  :key="fish"
                >
                  <div class="row">
                    <span
                      class="flow-text"
                      :id="'fish_' + (index + 1) + '_name'"
                      >{{ index + 1 }}. {{ fish }}</span
                    >
                  </div>

                  <div class="row col s8 push-s2 input-fields">
                    <div class="col s8">
                      <span class="flow-text">Pistekerroin</span>
                    </div>
                    <div class="col s4">
                      <input
                        :id="'fish_' + (index + 1) + '_multiplier'"
                        type="text"
                        @paste.prevent
                        @keypress="isNumber($event, true)"
                        class="validate"
                        value="1"
                        maxlength="4"
                      />
                    </div>
                  </div>
                    <div class="row col s8 push-s2 input-fields">
                      <div class="col s8">
                        <span class="flow-text">Alamitta</span>
                      </div>
                      <div class="col s4">
                        <input
                          :id="'fish_' + (index + 1) + '_minsize'"
                          @keypress="isNumber($event, true)"
                          @paste.prevent
                          type="text"
                          class="validate"
                          value="0"
                          maxlength="4"
                        />
                      </div>
                    </div>
                </li>
              </ul>
              <p v-else class="flow-text center-align">
                Yhtään kalaa ei ole valittu!
              </p>
            </div>

            <div class="row section">
              <div v-if="selected.length && !validated" class="row">
                <div class="col s1"></div>
                <a
                  class="waves-effect waves-light blue lighten-2 btn-large col s4"
                  v-on:click="tabs.select('fishes')"
                  ><i class="material-icons left">arrow_back</i>Takaisin</a
                >
                <div class="col s1"></div>
                <a
                  class="waves-effect waves-light green btn-large col s4"
                  v-on:click="checkFishSpecs"
                  ><i class="material-icons left">check</i>Tarkista tiedot</a
                >
              </div>
              <div v-else class="row">
                <div class="col s1"></div>
                <a
                  class="waves-effect waves-light blue lighten-2 btn-large col s2"
                  v-on:click="tabs.select('fishes')"
                  ><i class="material-icons left">arrow_back</i>Takaisin</a
                >
                <div class="col s1"></div>
                <a
                  v-on:click="disableInputs(false)"
                  class="waves-effect waves-light grey btn-large col s3"
                  ><i class="material-icons left">settings</i>Muuta tietoja</a
                >
                <div class="col s1"></div>
                <a
                  class="waves-effect waves-light green btn-large col s2"
                  v-on:click="tabs.select('summary')"
                  ><i class="material-icons right">arrow_forward</i>Jatka</a
                >
                <div class="col s1"></div>
              </div>
            </div>
          </div>

          <div id="summary" class="col s12 inputarea">
            <div v-if="!loading">
              <div class="basic_summary row section">
                <div class="center-align col s8 push-s2">
                  <table class="striped centered responsive-table highlight">
                    <caption class="flow-text">
                      Perustiedot
                    </caption>
                    <tr>
                      <th style="border:1px solid black;">Kilpailu</th>
                      <td style="border:1px solid black;" class="center-align">
                        {{ name }}
                      </td>
                    </tr>
                    <tr>
                      <th style="border:1px solid black;">Cup</th>
                      <td style="border:1px solid black;" class="center-align">
                        {{ cup_name }}
                      </td>
                    </tr>
                    <tr>
                      <th style="border:1px solid black;">Voittajan Cup sijoittumispisteet</th>
                      <td style="border:1px solid black;" class="center-align">
                        {{ cup_placement_points }}
                      </td>
                    </tr>
                    <tr>
                      <th style="border:1px solid black;">Kilpailijoiden Cup osallistumispisteet</th>
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
                </div>
              </div>

              <div class="fishes_summary section col s8 push-s2">
                <div class="center-align">
                  <p class="flow-text">Kalojen määritykset</p>
                </div>
                <div class="center-align">
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
                </div>
                <div class="row section">
                  <div class="col s6">
                    <a
                      class="waves-effect waves-light blue lighten-2 btn-large"
                      v-on:click="tabs.select('points')"
                      ><i class="material-icons left">arrow_back</i>Takaisin</a
                    >
                  </div>
                  <div v-if="validated" class="col s6">
                    <a
                      class="waves-effect waves-light green lighten-2 btn-large"
                      v-on:click="submitCompetition"
                      ><i class="material-icons left">add_circle_outline</i>Luo
                      kilpailu näillä tiedoilla</a
                    >
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <h2>Tallennetaan kilpailua tietokantaan...</h2>
              <ProgressBarQuery />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import M from "materialize-css";
import "vue-select/dist/vue-select.css";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import Timedate from '../components/layout/Timedate';
import { options_picker } from "../i18n";
import CompetitionService from "../CompetitionService";
import moment from "moment";

export default {
  name: "RegisterComp",
  components: {
    ProgressBarQuery,
    Timedate
  },
  data() {
    return {
      errors: [],
      options: ["Ahven", "Hauki", "Kuha", "Lohi", "Taimen"],
      selected: [],
      days_options: [1,2,3,4,5,6,7],
      name: null,
      cup_name: null,
      cup_placement_points: 30,
      cup_participation_points: 5,
      cup_points_multiplier: 1.0,
      team_competition: "Ei",
      start_date: null, //FIXME yhteenvedossa kuukausi oikein, muualla ei !?!?
      end_date: null,
      start_time: null,
      end_time: null,
      basic_info: null,
      completed_fish_specs: [],
      basic_info_validated: false,
      fish_species_validated: false,
      fish_specs_validated: false,
      validated: false,
      loading: false,
      tabs: null,
    };
  },
  mounted() {
    this.checkLogin();
    M.AutoInit();
    /* eslint-disable no-unused-vars */
    var tabs = document.querySelectorAll(".tabs");
    var instance = M.Tabs.init(tabs, options_picker);

    var datepicker = document.querySelectorAll(".datepicker");
    var instances = M.Datepicker.init(datepicker, options_picker);

    var timepicker = document.querySelectorAll(".timepicker");
    var instances2 = M.Timepicker.init(timepicker, options_picker);

    var collabs = document.querySelectorAll(".collapsible");
    var instances3 = M.Collapsible.init(collabs, options_picker);
    /* eslint-enable no-unused-vars */
    var elem = document.querySelectorAll(".tabs")[0];
    this.tabs = M.Tabs.getInstance(elem);

    moment.locale("fi");
  },
  methods: {
    checkLogin: function() {
        if(localStorage.getItem('jwt') != null){
            this.$store.state.logged_in = true;
            let user = JSON.parse(localStorage.getItem('user'));
            user.is_admin == true ? this.$store.state.is_admin = true : this.$store.state.is_admin = false;
        }
        else {
            this.$store.state.logged_in = false;
            this.$store.state.is_admin = false;
        }
    },
    //filter other other characters out for number inputs
    isNumber: function(evt, isDate) {
      var charToCheckCode = 46; //dot --> .
      var charToCheck = ".";

      if (!isDate) {
        charToCheckCode = 58; // colon --> :
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
    showError: function(error) {
      this.errors.push(error);
      M.toast({ html: error });
      location.href = "#";
      location.href = "#app";
    },
    checkBasicInformation: function() {
      this.errors = [];
      this.basic_info_validated = false;
      this.validated = false;
      var isDateValid = moment(
        this.start_date,
        "D.M.YYYY",
        true
      ).isValid();
      var isStartTimeValid = moment(
        this.start_time,
        "H:mm",
        true
      ).isValid();
      var isEndTimeValid = moment(
        this.end_time,
        "H:mm",
        true
      ).isValid();

      if (!this.name) {
        this.showError("Kilpailun nimi puuttuu!");
      }
      if (!this.cup_name) {
        this.showError("Cupin nimi puuttuu!");
      }
      if (!this.cup_placement_points) {
        this.showError("Määritä kilpailun voittajalle Cup sijoittumispisteet (Voittaja saa pisteet: Sijoittumispisteet + Osallistumispisteet)!");
      }
      if (!this.cup_participation_points) {
        this.showError("Määritä kilpailun Cup osallistumispisteet!");
      }
      if (!this.cup_points_multiplier) {
        this.showError("Kilpailun pistekerroin puuttuu!");
      }
      if (!this.start_date || !isDateValid) {
        !this.start_date == true
          ? this.showError("Päivämäärää ei ole valittu!")
          : this.showError(
              'Syötä päivämäärä muodossa "PP.KK.VVVV (esim: 06.02.2020)'
            );
      }
      if (!this.start_time || !isStartTimeValid) {
        !this.start_time == true
          ? this.showError("Kilpailun alkamisnaika puuttuu!")
          : this.showError('Syötä aika muodossa "hh:mm" (esim: 13:00)');
      }
      if (!this.end_time || !isEndTimeValid) {
        !this.end_time == true
          ? this.showError("Kilpailun loppumisaika puuttuu!")
          : this.showError('Syötä aika muodossa "hh:mm" (esim: 13:00)');
      }

      // If all inputs validated
      if (!this.errors.length) {
        let start_date = moment(`${this.start_date} ${this.start_time}`, 'D.M.YYYY HH:mm');
        let end_date = moment(`${this.end_date} ${this.end_time}`, 'D.M.YYYY HH:mm');

        this.basic_info = {
          name: this.name,
          cup_name: this.cup_name,
          cup_placement_points: Number(this.cup_placement_points),
          cup_participation_points: Number(this.cup_participation_points),
          cup_points_multiplier: Number(this.cup_points_multiplier),
          team_competition: this.team_competition === "Ei" ? false : true,
          start_date: start_date,
          end_date: end_date,
          start_time: this.start_time,
          end_time: this.end_time,
        };
        document.getElementById("fishes-tab").classList.remove("disabled");
        this.disableInputs(true);
        this.tabs.select("fishes");
      }
    },
    checkFishSpecies: function() {
      this.errors = [];
      this.fish_species_validated = false;
      this.validated = false;
      if (this.selected.length) {
        let temp_array = [];
        //TODO better solution for long names, temp fix
        this.selected.forEach(fish => {
          if(fish.length > 40) {
            let shortened = fish.slice(0,40);
            temp_array.push(shortened);
          }
          else {temp_array.push(fish)}
        });
        this.selected = temp_array.sort();
        document.getElementById("points-tab").classList.remove("disabled");
        this.disableInputs(true);
        this.tabs.select("points");
      } else {
        this.errors.push("Yhtään kalalajia ei ole valittu!");
        M.toast({ html: "Yhtään kalalajia ei ole valittu!" });
        this.fish_species_validated = false;
        location.href = "#";
        location.href = "#app";
      }
    },
    checkFishSpecs: function() {
      this.completed_fish_specs = [];
      for (let i = 1; i < this.selected.length + 1; i++) {
        let fish_spec = {
          name: document.getElementById(`fish_${i}_name`).innerHTML.replace(`${i}. `, ""),
          multiplier: document.getElementById(`fish_${i}_multiplier`).value,
          minsize: document.getElementById(`fish_${i}_minsize`).value,
          weights: 0,
        };

        if (!fish_spec.multiplier || !fish_spec.minsize) {
          this.errors = [];
          M.toast({
            html: `Syötä kalan '${fish_spec.name}' kaikki tiedot! (Pistekerroin = 1, Alamitta = 0 oletusarvot)`,
          });
          this.errors.push(
            `Syötä kalan '${fish_spec.name}' kaikki tiedot! (Pistekerroin = 1, Alamitta = 0 oletusarvot)`
          );
          location.href = "#";
          location.href = "#app";
        } else {
          this.completed_fish_specs.push(fish_spec);
        }
      }

      if (
        !this.errors.length &&
        this.completed_fish_specs.length == this.selected.length &&
        this.completed_fish_specs.length > 0
      ) {
        this.fish_specs_validated = true;

        if (
          this.basic_info_validated &&
          this.fish_species_validated &&
          this.fish_specs_validated
        ) {
          document.getElementById("summary-tab").classList.remove("disabled");
          this.disableInputs(true);
          this.tabs.select("summary");
        } else {
          this.validated = false;
          this.basic_info_validated == false
            ? this.errors.push("Tarkista kilpailun perustiedot!")
            : console.log("Perustiedot kunnossa!");
          this.fish_specs_validated == false
            ? this.errors.push("Tarkista kalojen tiedot!")
            : console.log("Kalojen tiedot kunnossa!");
          location.href = "#";
          location.href = "#app";
        }
      } else {
        M.toast({ html: "Joitain tietoja puuttuu vielä!" });
        location.href = "#";
        location.href = "#app";
      }
    },
    disableInputs: function(disable) {
      if (this.tabs.index == 0) {
        if (disable) {
          document
            .getElementById("basic-inputs")
            .classList.add("disabledbutton");
          this.basic_info_validated = true;
        } else {
          document
            .getElementById("basic-inputs")
            .classList.remove("disabledbutton");
          document
            .getElementById("select_specs")
            .classList.remove("disabledbutton");
          this.basic_info_validated = false;
          this.validated = false;
        }
      }
      if (this.tabs.index == 1) {
        if (disable) {
          document
            .getElementById("fishes_select")
            .classList.add("disabledbutton");
          this.fish_species_validated = true;
        } else {
          document
            .getElementById("fishes_select")
            .classList.remove("disabledbutton");
          document
            .getElementById("select_specs")
            .classList.remove("disabledbutton");
          this.fish_species_validated = false;
          this.validated = false;
        }
      }
      if (this.tabs.index == 2) {
        if (disable) {
          document
            .getElementById("select_specs")
            .classList.add("disabledbutton");
          this.fish_specs_validated = true;
          this.validated = true;
        } else {
          document
            .getElementById("select_specs")
            .classList.remove("disabledbutton");
          this.fish_specs_validated = false;
          this.validated = false;
        }
      }
    },
    async submitCompetition() {
      // TODO  better input validation
      if (this.validated) {
        this.loading = true;

        const user = JSON.parse(localStorage.getItem('user'));
        const user_id = user["id"];
        //temp id to get correct competition from array, even if somehow there is comp with same name etc.
        const comp_id =
          Math.random()
            .toString(36)
            .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15);

        const competition = {
          competition_id: comp_id,
          user_id: user_id,
          name: this.basic_info.name,
          cup_name: this.basic_info.cup_name,
          cup_placement_points: this.basic_info.cup_placement_points,
          cup_participation_points: this.basic_info.cup_participation_points,
          cup_points_multiplier: this.basic_info.cup_points_multiplier,
          team_competition: this.basic_info.team_competition,
          start_date: this.basic_info.start_date,
          end_date: this.basic_info.end_date,
          duration:this.basic_info.duration,
          start_time: this.basic_info.start_time,
          end_time: this.basic_info.end_time,
          fishes: this.completed_fish_specs,
          state: "Rekisteröity",
          total_weights: 0,
          signees: [],
          results: [],
          teams:[],
          biggest_fishes: {},
          biggest_amounts: {},
        };
        try {
          await CompetitionService.insertCompetition(competition);
          M.toast({ html: "Kilpailu lisätty tietokantaan!" });
          this.$store.commit("refreshCompetition", competition);
          this.$router.push({ path: "/overview" });
        } catch (err) {
          this.errors.push(err.message);
        }
      } else {
        this.errors.push("Not validated somehow?");
      }
    },
  },
};
</script>

<style></style>
