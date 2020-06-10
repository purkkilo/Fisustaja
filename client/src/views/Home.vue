<template>
  <div id="app">
    <div class="container">
      <Timedate />
      <div class="container-transparent">
          <div class="section">
              <div class="col s12 center-align"><h1>Fisustaja</h1></div>
          </div>
          <div class="section row inputarea">
                <div class="col s12">
                    <h1><b>}-(((*></b></h1>
                    <p class="flow-text">Sovellus kalastuskilpailujen järjestämistä varten</p>
                    <div class="divider black"></div>
                    <div class="section">
                        <div class="row">
                            
                            <div class="col s6 center-align">
                                <router-link to="/register-comp">
                                    <a class="waves-effect waves-light blue lighten-1 btn-large"><i class="material-icons left">add_circle_outline</i>Uusi kilpailu</a>
                                </router-link>
                            </div>
                            
                            <div class="col s6 center-align">
                                <router-link to="/continue">
                                <a class="waves-effect waves-light green lighten-1 btn-large"><i class="material-icons left">play_circle_filled</i>Jatka kilpailua</a>
                                </router-link>
                            </div>
                            
                        </div>
                    </div>
                    <div class="divider black"></div>
                    <div>
                        <p class="flow-text">Toteutettu käyttäen:</p>
                        <ul class="flow-text">
                            <li>
                                <div class="card row valign-wrapper">
                                    <div class="col s2">
                                    <img src="../assets/logo.png" alt="" class="circle responsive-img"> <!-- notice the "circle" class -->
                                    </div>
                                    <p class="flow-text">Frontend</p>
                                    <div class="col s8">
                                    <span class="black-text">
                                        <a href="https://vuejs.org/"><b>Vue</b> v{{vue_version}}</a><br>
                                        <a href="https://cli.vuejs.org/"><b>Vue CLI</b></a><br>
                                    </span>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="card row valign-wrapper">
                                    <div class="col s2">
                                    <img src="../assets/logo.png" alt="" class="circle responsive-img"> <!-- notice the "circle" class -->
                                    </div>
                                    <p class="flow-text">Backend</p>
                                    <div class="col s8">
                                    <span class="black-text">
                                        <a href="https://nodejs.org/en/"><b>Node.js</b></a><br>
                                        <a href="https://expressjs.com/"><b>Express</b></a><br>
                                    </span>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="card row valign-wrapper">
                                    <div class="col s2">
                                    <img src="../assets/logo.png" alt="" class="circle responsive-img"> <!-- notice the "circle" class -->
                                    </div>
                                    <p class="flow-text">Design, utilities</p>
                                    <div class="col s8">
                                    <span class="black-text">
                                        <a href="https://materializecss.com/"><b>Materialize</b></a><br>
                                        <a href="https://momentjs.com/"><b>Moment.js</b></a><br>
                                    </span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import Timedate from '../components/layout/Timedate';
import Vue from 'vue'

export default {
    name: 'Home',
    components: {
        Timedate
    },
    data() {
        return {
            vue_version: null,
        }
    },
    mounted() {
        this.vue_version = Vue.version;
    },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
    background-image: url('../assets/background_waterdrop.png');
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
}


#app .container-transparent {
    margin-top: 50px;
    background: rgba(149, 233, 248, 0.4);
    border-radius: 2%;
    border: white 1px solid;
}

#app h1 {
    -webkit-text-stroke: 1px black;
    color: white;
    text-shadow:
    -1px -1px 0 #000,  
     1px -1px 0 #000,
     -1px 1px 0 #000,
      1px 1px 0 #000;
 }


#app li.collection-item:nth-child(odd) {
    background: rgba(255, 255, 255, 0.63);
}

#app li.collection-item:nth-child(even) {
    background: rgba(169, 169, 255, 0.596);
}

#app .tabs .tab a:hover {
    background-color:rgba(0, 20, 75, 0.541);
    color:rgb(0, 0, 0);
} /*Text color on hover*/

#app .tabs .tab a.active {
    background-color:rgba(25, 72, 172, 0.301);
    color:rgb(0, 0, 0);
    border: 1px solid black;
} /*Background and text color when a tab is active*/

#app .tabs .tab a {
    color:rgb(53, 53, 53);
    border: 1px solid rgb(94, 94, 94);
} /*Background and text color when a tab is active*/

::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: rgb(114, 114, 114);
    opacity: 1; /* Firefox */
}

:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: rgb(114, 114, 114);
}

::-ms-input-placeholder { /* Microsoft Edge */
    color: rgb(114, 114, 114);
}

#app ul.tabs {
    background: rgba(41, 41, 107, 0.404);
}

#app .inputarea {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 2%;
}

#app .tablearea {
    background: rgb(156, 215, 255);
    border-radius: 2%;
}

#app table.highlight>tbody>tr:hover {
    background-color: rgb(0, 153, 255) !important;
    border: 1px solid black;
    cursor: pointer;
}

#app .selected {
    background-color: rgb(0, 114, 19) !important;
    color:white;
    border: 2px solid black;
}

#app .disabledbutton {
    pointer-events: none;
    opacity: 0.4;
}


#app li#fish_spec{
    margin:20px;
    padding:20px;
    border-radius: 2%;
    border:1px solid black;
}

#app li#fish_spec:nth-child(odd){
    background: rgba(180, 206, 255, 0.43);
}


#app .input-fields{
    background: rgba(160, 228, 255, 0.253);
    border-radius: 2%;
    border: 1px solid black;
}

#app .title {
    background: rgba(104, 112, 230, 0.212);
    border-radius: 2%;
    border: 1px solid rgb(0, 0, 61);
}
#app .fixed_header{
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
}

#app .fixed_header tbody{
  display:block;
  width: 100%;
  overflow: auto;
  max-height: 400px;
}

#app .fixed_header thead tr {
   display: block;
}

#app .fixed_header thead {
  background: rgb(0, 1, 34);
  color:#fff;
}


#app .fixed_header th, .fixed_header td {
  padding: 5px;
  width: 400px;
  height: 50px;
}


</style>
