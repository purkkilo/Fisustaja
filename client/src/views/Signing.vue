<template>
  <div class="container">
    <Timedate />
    <div id="errordiv" v-if="errors.length">
      <ul class="collection with-header">
        <li class="collection-header"><h4>Korjaa seuraavat virheet:</h4></li>
        <li class="collection-item" id="error" v-for="(error,index) in errors" v-bind:key="index">{{ index+1}}. {{ error }}</li>
      </ul>
    </div>

    <div class="container-transparent">
      <div class="section">
          <div class="col s12 center-align"><h1>Ilmoittautuminen</h1></div>
      </div>
      <div class="section">
        <router-link to="/overview">
          <div class="col s12 center-align"><a class="waves-effect waves-light btn"><i class="material-icons left">info</i>Kilpailun yleisnäkymä</a></div>
        </router-link>
      </div>
      <div class="">
        <ul class="tabs row">
          <li class="tab col s6" id="signing-tab"><a class="active" href="#signing">Ilmoittautuminen</a></li>
          <li class="tab col s6" id="signees-tab"><a href="#signees-div">Ilmoittautuneet</a></li>
        </ul>
      </div>

      <div id="signing" class="col s12 inputarea">
        <div class="section center-align">
          <p class="flow-text">Ilmoittautuminen</p>
        </div>

        <div v-if="notification" class="section center-align">
          <p class="flow-text green lighten-1 center-align" id="notification">{{ notification }}</p>
        </div>

        <div id="signing-inputs" class="row">
          <div class="row">
            <div class="input-fields col s8 push-s2">
              <input
                id="boat_number"
                v-model="boat_number"
                name="boat_number"
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                type = "number"
                maxlength = "6"
                min="1"
                step="1"
                class="validate"
              >
              <label for="boat_number" class="flow-text black-text">Venekunnan numero</label>
            </div>
            <div class="col s12" style="margin-top: 20px;">
              <a class="waves-effect waves-light blue btn col s4 push-s4" v-on:click="searchSelected"><i class="material-icons left">info</i>Hae numerolla</a>
            </div>
            
          </div>

          <div class="row">
            <div class="input-fields col s8 push-s2">
              <input
                id="starting_place"
                v-model="starting_place"
                name="starting_place"
                placeholder="Ei pakollinen"
                type="text"
                class="validate"
                maxlength="40"
              >
              <label for="starting_place" class="flow-text black-text">Lähtöpaikka</label>
            </div>
          </div>
          <div class="row">
            <div class="input-fields col s8 push-s2">
              <input
                id="captain_name"
                v-model="captain_name"
                type="text"
                class="validate"
                maxlength="40"
              >
              <label for="captain_name" class="flow-text black-text">Kapteeni</label>
            </div>
          </div>

          <div class="row">
            <div class="input-fields col s8 push-s2">
              <input
                id="temp_captain_name"
                v-model="temp_captain_name"
                placeholder="Ei pakollinen"
                type="text"
                class="validate"
                maxlength="40"
              >
              <label for="temp_captain_name" class="flow-text black-text">Varakapteeni</label>
            </div>
          </div>

          <div class="row">
            <div class="input-fields col s8 push-s2">
              <input
                id="locality"
                v-model="locality"
                type="text"
                class="validate"
                maxlength="40"
              >
              <label for="locality" class="flow-text black-text">Seura/Paikkakunta</label>
            </div>
          </div>

          <div class="row">
            <div class="input-fields col s8 push-s2">
              <input
                id="team"
                v-model="team"
                type="text"
                placeholder="Ei pakollinen"
                class="validate"
                maxlength="40"
              >
              <label for="team" class="flow-text black-text">Joukkue</label>
            </div>
          </div>
        </div>
        <div class="row center-align">
          <a v-on:click="clearInputs" class="waves-effect waves-light yellow black-text btn-large col s4 offset-s2"><i class="material-icons left">backspace</i>Pyyhi Kentät</a>
          <a v-on:click="saveBoatToDatabase" class="waves-effect waves-light green black-text btn-large col s3 offset-s1"><i class="material-icons right">save_alt</i>Tallenna</a>
        </div>
      </div>
      <div id="signees-div" class="col s12">
        <div class="center-align col s4 inputarea">
          <ProgressBarQuery />
          <p class="flow-text">Ilmoittautuneita yhteensä: <b>{{ signees.length }}</b></p>
        </div>
        <div>
          <table id="signees-table" class="highlight centered responsive-table fixed_header tablearea">
            <thead>
              <tr>
                <th>Nro.</th>
                <th>Kapteeni</th>
                <th>Varakapteeni</th>
                <th>Seura/Paikkakunta</th>
              </tr>
            </thead>
            <tbody>
              <tr @click="selectRow(signee.id)" :class="{ selected : selected_id == signee.id }" v-for="(signee, index) in signees" :key="index">
                  <th class="center-align" style="border:1px solid black">{{ signee.boat_number  }}</th>  
                  <td style="border:1px solid black">{{ signee.captain_name }}</td> 
                  <td style="border:1px solid black">{{ signee.temp_captain_name }}</td>
                  <td style="border:1px solid black">{{ signee.locality }}</td>   
              </tr>
              </tbody>
          </table>
        </div>
        <div v-if="selected_id" class="section inputarea">
          <div class="col s12 center-align"><a class="waves-effect waves-light blue btn" v-on:click="searchSelected"><i class="material-icons left">info</i>Näytä valitun ilmoittautumistiedot</a></div>
        </div>
        <div v-else class="section inputarea center-align">
          <p v-if="signees.length" class="flow-text">Voit katsella venekunnan tietoja myös klikkaamalla haluamaasi riviä taulukosta ja painamalla ilmestyvää nappulaa</p>
          <h3 v-else class="center-align">Ei ilmoittautuneita!</h3>
        </div>
      </div>
      
    </div>
  </div>
</template>
<script>
import Timedate from '../components/layout/Timedate';
import ProgressBarQuery from '../components/layout/ProgressBarQuery';
import M from 'materialize-css';
import { options_picker } from '../i18n';

export default {
    name: 'Signing',
    components: {
      Timedate,
      ProgressBarQuery
    },
    data() {
      return {
          errors: [],
          boat_number: null,
          starting_place: null,
          captain_name: null,
          temp_captain_name: null,
          locality: null,
          team: null,
          signees: [],
          selected_id:null,
          id: 1,
          new_signee:null,
          notification: null,      
      }
    },
    mounted() {
        M.AutoInit();
        /* eslint-disable no-unused-vars */
        var tabs = document.querySelectorAll('.tabs');
        var instance = M.Tabs.init(tabs, options_picker);
        var elem = document.querySelectorAll('.tabs')[0];
        /* eslint-enable no-unused-vars */
        this.tabs = M.Tabs.getInstance(elem);  
        this.boat_number = 1;       
    },
    methods: {
        clearInputs: function() {
            this.boat_number = null;
            this.starting_place = null;
            this.captain_name = null;
            this.temp_captain_name = null;
            this.locality = null;
            this.team = null;
            this.notification = null;
            this.errors = [];
        },
        searchSelected: function() {
            this.notification = null;

            if(this.tabs.index == 0) {
                console.log("Signing tab");
                if(this.boat_number){
                    let found_signee = this.searchBoatNumber(this.boat_number);
                    if(found_signee){
                        this.notification = `Venekunta löydetty!\n(${found_signee.boat_number}) : ${found_signee.captain_name}, ${found_signee.temp_captain_name}`;
                        this.boat_number = found_signee.boat_number;
                        this.starting_place = found_signee.starting_place;
                        this.captain_name = found_signee.captain_name;
                        this.temp_captain_name = found_signee.temp_captain_name;
                        this.locality = found_signee.locality;
                        this.team = found_signee.team;                   
                    }
                    else {
                        let temp_boat_number = this.boat_number;
                        this.clearInputs();
                        this.boat_number = temp_boat_number;
                        this.notification = "Tällä numerolla ei ole vielä ilmoitettu venekuntaa!"
                    }
                }
                else {
                    this.notification = `Syötä venekunnan numero ennen hakemista!`;
                }
            }

            else {
                console.log("Signees tab");
                if(this.selected_id){
                    let search_id = this.selected_id;
                    if(search_id){
                        var found_signee = this.signees.find(function(element) {
                            return parseInt(element.id) == parseInt(search_id); 
                        });
                        if (found_signee){
                            this.notification = `Venekunta löydetty!\n(${found_signee.boat_number}) : ${found_signee.captain_name}, ${found_signee.temp_captain_name}`;
                            this.boat_number = found_signee.boat_number;
                            this.starting_place = found_signee.starting_place;
                            this.captain_name = found_signee.captain_name;
                            this.temp_captain_name = found_signee.temp_captain_name;
                            this.locality = found_signee.locality;
                            this.team = found_signee.team; 
                            this.tabs.select('signing');
                        }
                        else {
                            this.clearInputs();
                            this.notification = "Tällä numerolla ei ole vielä ilmoitettu venekuntaa!";
                        }
                    }
                    else {
                        this.errors = [];
                        this.showError("Valitse ilmoittautuneideiden listalta venekunta ennen hakemista!");
                    }
                }
                else {
                    this.errors = [];
                    this.showError("Valitse ilmoittautuneideiden listalta venekunta ennen hakemista!");
                }

            }
        },
        selectRow:function(id){
            if(id == this.selected_id){
                this.selected_id = null;
            }
            else {
                this.selected_id = id;
            }

        },
        searchBoatNumber: function(boat_number) {
            var search_boat_number = parseInt(boat_number);
            var found_signee = this.signees.find(function(element) {
                return parseInt(element.boat_number) == search_boat_number; 
            });
            return found_signee;
        },
        showError: function(error) {
            this.errors.push(error);
            M.toast({html: error});
            location.href = "#";
            location.href = "#app";
        },
        saveBoatToDatabase: function() {
            M.toast({html: 'Todo: Tallenna tietokantaan'});
            this.notification = null;
            this.errors = [];

            if (!this.boat_number) {
                this.showError('Venekunnan kilpailunumero puuttuu!');
            }

            if (!this.captain_name) {
                this.showError('Kapteenin nimi puuttuu!');
            }

            if (!this.temp_captain_name) {
                this.temp_captain_name = "-";
            }

            if (!this.locality) {
                this.showError('Seura/Paikkakunta puuttuu!');
            }

            if(!this.errors.length) {
                const found_signee = this.searchBoatNumber(this.boat_number);
    
                if (found_signee) {
                    found_signee.starting_place = this.starting_place;
                    found_signee.captain_name = this.captain_name;
                    found_signee.temp_captain_name = this.temp_captain_name;
                    found_signee.locality = this.locality;
                    found_signee.team = this.team;
                    this.new_signee = found_signee;
                    // note - findIndex might be replaced with some(), filter(), forEach() 
                    // or any other function/approach if you need 
                    // additional browser support, or you might use a polyfill
                    const index = this.signees.findIndex(item => {
                        return (parseInt(found_signee.id) === parseInt(item.id));
                    })
                    this.signees.splice(index, 1, found_signee);
                    console.log("Found old signee, updating info...");
                    this.notification =`Päivitetty venekunnan (Nro: ${found_signee.boat_number}, Kapteeni: ${found_signee.captain_name}) Tiedot!`;
                    
                }
                else {
                    this.new_signee = {
                        id: this.id,
                        boat_number: parseInt(this.boat_number),
                        starting_place: this.starting_place,
                        captain_name: this.captain_name,
                        temp_captain_name: this.temp_captain_name,
                        locality: this.locality,
                        team: this.team
                    };
                    console.log("New signee info ok!");
                    this.signees.push(this.new_signee);
                    this.notification =`Venekunta ilmoitettu kisaan! (Nro: ${this.new_signee.boat_number}, Kapteeni: ${this.new_signee.captain_name})`;
                    this.id++;
                }

                this.clearInputs();
                this.boat_number = this.new_signee.boat_number + 1;
            }


        },
    },
}
</script>