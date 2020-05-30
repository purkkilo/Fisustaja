<template>
  <div class="container">
    <Timedate />
    <div class="container-transparent">
      <div class="section">
          <div class="col s12 center-align"><h1>Tulokset</h1></div>
      </div>
      <div class="section">
        <router-link to="/overview">
          <div class="col s12 center-align"><a class="waves-effect waves-light btn"><i class="material-icons left">info</i>Kilpailun yleisnäkymä</a></div>
        </router-link>
      </div>
      <div class="row">
        <div class="col s12">
          <ul class="tabs">
            <li class="tab col s3"><a class="active" href="#normal-competition">Normaalikilpailu</a></li>
            <li class="tab col s3"><a href="#team-competition">Tiimikilpailu</a></li>
            <li class="tab col s3"><a href="#biggest-fishes">Suurimmat Kalat</a></li>
            <li class="tab col s3"><a href="#biggest-fish-amounts">Suurimmat Kalasaaliit</a></li>
          </ul>
        </div>
        <div id="normal-competition" class="col s12 inputarea">
          <div class="section">
            <div class="row">
              <table id="normal-table"  class="highlight centered responsive-table tablearea">
                <thead style="background: rgb(0, 1, 34);color:#fff;">
                  <tr>
                    <th>Sijoitus</th>
                    <th>Nro</th>
                    <th>Kapteeni</th>
                    <th>Paikkakunta</th>
                    <th>Tulos</th>
                    <th>Cup sij. pisteet</th>
                    <th>Cup osal. pisteet</th>
                    <th>Cup pisteet yht.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(signee, index) in $store.getters.getResultSignees" :key="index">
                      <th class="center-align" style="border:1px solid black">{{ index + 1 }}</th>  
                      <td style="border:1px solid black">{{ signee.boat_number }}</td> 
                      <td style="border:1px solid black">{{ signee.captain_name }}</td>
                      <td style="border:1px solid black">{{ signee.locality }}</td>
                      <td style="border:1px solid black">{{ signee.total_points }}</td>
                      <td style="border:1px solid black">Todo</td> 
                      <td style="border:1px solid black">Todo</td> 
                      <td style="border:1px solid black">Todo</td>   
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div id="team-competition" class="col s12 inputarea">
          <div class="section">
            <div class="row">
              <table id="team-table"  class="highlight centered responsive-table tablearea">
                <thead style="background: rgb(0, 1, 34);color:#fff;">
                  <tr>
                    <th>Sijoitus</th>
                    <th>Nro</th>
                    <th>Kapteeni</th>
                    <th>Paikkakunta</th>
                    <th>Tulos</th>
                    <th>Cup sij. pisteet</th>
                    <th>Cup osal. pisteet</th>
                    <th>Cup pisteet yht.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(signee, index) in $store.getters.getResultSignees" :key="index">
                      <th class="center-align" style="border:1px solid black">{{ index + 1 }}</th>  
                      <td style="border:1px solid black">{{ signee.boat_number }}</td> 
                      <td style="border:1px solid black">{{ signee.captain_name }}</td>
                      <td style="border:1px solid black">{{ signee.locality }}</td>
                      <td style="border:1px solid black">{{ signee.total_points }}</td>
                      <td style="border:1px solid black">Todo</td> 
                      <td style="border:1px solid black">Todo</td> 
                      <td style="border:1px solid black">Todo</td>   
                  </tr>
                </tbody>
              </table>
            </div>
          </div>                
        </div>
        <div id="biggest-fishes" class="col s12 inputarea">
          <div class="section">
            <div class="row">
              <table id="biggest-fishes-table"  class="highlight centered responsive-table tablearea">
                <thead style="background: rgb(0, 1, 34);color:#fff;">
                  <tr>
                    <th>Kalalaji</th>
                    <th>Veneen nro</th>
                    <th>Kapteeni</th>
                    <th>Paino</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(signee, index) in $store.getters.getResultSignees" :key="index">
                      <th class="center-align" style="border:1px solid black">Todo</th>  
                      <td style="border:1px solid black">{{ signee.boat_number }}</td> 
                      <td style="border:1px solid black">{{ signee.captain_name }}</td>
                      <td style="border:1px solid black">Todo</td>  
                  </tr>
                </tbody>
              </table>
            </div>
          </div>                 
        </div>
        <div id="biggest-fish-amounts" class="col s12 inputarea">
          <div class="section">
            <div class="row">
              <table id="biggest-amounts-table"  class="highlight centered responsive-table tablearea">
                <thead style="background: rgb(0, 1, 34);color:#fff;">
                  <tr>
                    <th>Kalalaji</th>
                    <th>Veneen nro</th>
                    <th>Kapteeni</th>
                    <th>Paino</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(signee, index) in $store.getters.getResultSignees" :key="index">
                      <th class="center-align" style="border:1px solid black">Todo</th>  
                      <td style="border:1px solid black">{{ signee.boat_number }}</td> 
                      <td style="border:1px solid black">{{ signee.captain_name }}</td>
                      <td style="border:1px solid black">Todo</td> 
                  </tr>
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
    name: 'Results',
    components: {
      Timedate
    },
    data() {
        return {

        }
    },
    mounted() {
        //Init materialize elements
        M.AutoInit();
        /* eslint-disable no-unused-vars */
        var tabs = document.querySelectorAll('.tabs');
        var instance = M.Tabs.init(tabs, options_picker);
        /* eslint-enable no-unused-vars */
        var elem = document.querySelectorAll('.tabs')[0];
        this.tabs = M.Tabs.getInstance(elem);
    },
    methods: {
      
    },
}
</script>