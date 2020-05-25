<template>
  <div class="container">
    <Timedate />
    <div class="container-transparent">
      <div class="section">
          <div class="col s12 center-align"><h1>Punnitus</h1></div>
      </div>
      <div class="section">
        <router-link to="/overview">
          <div class="col s12 center-align"><a class="waves-effect waves-light btn"><i class="material-icons left">info</i>Kilpailun yleisnäkymä</a></div>
        </router-link>
      </div>
      <div class="row">
        <div class="col s12">
          <ul class="tabs">
            <li class="tab col s3"><a class="active" href="#weighting">Punnitus</a></li>
            <li class="tab col s3"><a href="#situation">Tilannekatsaus</a></li>
            <li class="tab col s3"><a href="#stats">Tilastoja</a></li>
            <li class="tab col s3"><a href="#still-on-water">Vielä vesillä</a></li>
          </ul>
        </div>

        <div id="weighting" class="col s12 inputarea">
          <div class="section">
            <div class="row center-align">
              <p class="flow-text">Punnitus</p>
            </div>
            <div class="row title">
              <div class="row col s12">
                <div class="col s4">
                  <p class="flow-text">Venekunnan numero</p>
                </div>
                <div class="input-field col s4 push-s2">
                  <input
                    id="boat_number_input"
                    v-model="boat_number_input"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    type = "number"
                    maxlength = "6"
                    class="validate"
                    step=1
                    min=0
                  >
                  <label for="boat_number_input">Numero</label>
                </div>
              </div>
              <div class="row">
                <a class="waves-effect waves-light blue btn black-text col s4 push-s6" v-on:click="fetchFromDatabase"><i class="material-icons left">search</i>Hae numerolla</a>
              </div>
            </div>

            <div v-if="competition_boat" class="row center-align">
              <p class="flow-text">Venekunta</p>
      
              <div class="row">              
                <div class="col s4 center-align">
                  <p class="flow-text">({{ competition_boat.boat_number }})</p>
                </div>
                <div class="col s4 center-align">
                  <p class="flow-text">{{ competition_boat.captain_name }}</p>
                </div>
                <div class="col s4 center-align">
                  <p class="flow-text">{{ competition_boat.temp_captain_name }}</p>
                </div>
              </div>
              <div class="row center-align">
                <a class="col s4 push-s4 waves-effect waves-light yellow btn black-text" v-on:click="clearInputs"><i class="material-icons left">backspace</i>Peruuta valinta</a>
              </div>
              <div class="divider black"></div>
              <div class="section">
                <div class="" id="fishes">
                  <ul id="fish_weights" v-if="fishes_list.length">
                    <li v-for="(fish, index) in fishes_list" :key="fish.name">
                      <div class="section row">
                        <div class="col s6 center-align">
                          <span class="flow-text" :id="'fish_'+ (index + 1) +'_name'">{{ index+1 }}. {{ fish.name }}</span>
                        </div>
                        <div class="col s6 pull-s1 center-align">                    
                          <input
                            :id="'fish_' + (index + 1) + '_weight'"
                            type="number"
                            class="validate"
                            value=0
                            step=5
                            min=0
                          >
                          <label for="'fish_' + (index + 1) + '_weight'">Paino grammoina</label>
                        </div>

                      </div>
                      <div class="divider black"></div>
                    </li>
                  </ul>
                </div>

                <div class="section center-align">
                  <div class="col s1"></div>
                  <a class="col s4 waves-effect waves-light red btn-large black-text" v-on:click="deleteFromDatabase"><i class="material-icons left">delete_forever</i>Poista</a>
                  <div class="col s2"></div>
                  <a class="col s4 waves-effect waves-light green btn-large black-text" v-on:click="saveToDatabase"><i class="material-icons left">check</i>Tallenna</a>
                  <div class="col s1"></div>
                </div>
              </div>

            </div>
            <div v-else class="center-align">
              <p v-if="!searched" class="flow-text">Venekuntaa ei valittuna</p>
              <p v-else class="flow-text">Numerolla ei löytynyt venekuntaa tietokannasta!</p>
            </div>

          </div>



        </div>
            
        <div id="situation" class="col s12 inputarea">
          <div class="section">
            <div class="row col s12">
              <p class="flow-text col s4 push-s5">Tilannekatsaus</p>
            </div>

            <div class="col s12 center-align">
              <table id="situation-table" class="highlight centered responsive-table fixed_header tablearea">
                <thead>
                  <tr>
                    <th>Sijoitus</th>
                    <th>Numero</th>
                    <th>Kapteeni</th>
                    <th>Pisteet</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div id="stats" class="col s12 inputarea">
          <div class="section" style="margin-bottom: 50px;">
            <div class="row col s12 center-align">
              <p class="flow-text">Tilastoja</p>
            </div>
          </div>
          <div class="section">
            <ul class="collapsible">
              <li>
                <div class="collapsible-header"><i class="material-icons">filter_drama</i>Kertoimet</div>
                <div class="collapsible-body white"><span>Lorem ipsum dolor sit amet.</span></div>
              </li>
              <li>
                <div class="collapsible-header"><i class="material-icons">place</i>Muita tilastoja</div>
                <div class="collapsible-body white"><span>Lorem ipsum dolor sit amet.</span></div>
              </li>
            </ul>
          </div>                
        </div>

        <div id="still-on-water" class="col s12 inputarea">
          <div class="section">
            <div class="row col s12">
              <p class="flow-text col s8 push-s3">Venekunnat, jotka ovat vielä vesillä</p>
            </div>
            <div class="col s12 center-align">
              <table id="on-water-table" class="highlight centered responsive-table fixed_header tablearea">
                <thead>
                  <tr>
                    <th>Nmrto</th>
                    <th>Kapteeni</th>
                    <th>Varakapteeni</th>
                    <th>Lähtöpaikka</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>              
        </div>
      </div>            
    </div>
  </div>
</template>
<script>
import Timedate from '../components/layout/Timedate';
import M from 'materialize-css';
import { options_picker } from '../i18n';

export default {
    name: 'Weighting',
    components: {
      Timedate
    },
    data() {
        return {
            competition_boats: [{boat_number: 1, captain_name: "Jori Kosonen", temp_captain_name: "Lauri Kosonen"}],
            fishes_list: [{"name": "Ahven", "weight": 0},{"name": "Hauki", "weight": 0},{"name": "Kuha", "weight": 0}],
            boat_number_input: null,
            competition_boat: null,
            searched: false,          
        }
    },
    mounted() {
        //Init materialize elements
        M.AutoInit();
        /* eslint-disable no-unused-vars */
        var tabs = document.querySelectorAll('.tabs');
        var instance = M.Tabs.init(tabs, options_picker);

        var collabs = document.querySelectorAll('.collapsible');
        var instances2 = M.Collapsible.init(collabs, options_picker);
        /* eslint-enable no-unused-vars */
        var elem = document.querySelectorAll('.tabs')[0];
        this.tabs = M.Tabs.getInstance(elem);
    },
    methods: {
        searchBoatNumber: function(boat_number) {
            var search_boat_number = parseInt(boat_number);
            var found_boat = this.competition_boats.find(function(element) {
                return parseInt(element.boat_number) == search_boat_number; 
            });
            return found_boat;
        },
        fetchFromDatabase: function() {
            this.searched = true;
            M.toast({html: 'Todo: Hae tietokannasta (jos pisteitä valmiina)'});
            this.competition_boat = this.searchBoatNumber(this.boat_number_input);
            if(this.competition_boat) {
                console.log("Boat found!");
                console.log(this.competition_boat);
            }
            else {
                console.log("No such boat in list!");
                console.log(this.competition_boat);
            }
        },
        saveToDatabase: function() {
            M.toast({html: 'Todo: Tallenna tietokantaan'});

        },
        clearInputs: function() {
            M.toast({html: 'Todo: Pyyhi inputit...'});
            for (let i=1; i < this.fishes_list.length+1; i++) {
                document.getElementById(`fish_${i}_weight`).value = 0;
            }
            this.competition_boat = null;
            this.boat_number_input = null;
            this.searched = false;
        },
        deleteFromDatabase: function() {
            M.toast({html: 'Todo: Poista pisteet tietokannasta'});
        },
    },
}
</script>