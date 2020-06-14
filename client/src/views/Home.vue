<template>
  <div id="app">
    <div class="container">
      <div class="row section time" id="timers">
        <div class="col s4 center-align"><h4 id="date"> </h4></div>
        <div class="col s4 center-align"><h4></h4></div>
        <div class="col s4 center-align"><h4 id="clock"> </h4></div>
      </div>
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
                        <p class="flow-text">Käyttää:</p>
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
import Vue from 'vue'

export default {
    name: 'Home',
    components: {},
    data() {
        return {
            vue_version: null,
        }
    },
    mounted() {
        this.vue_version = Vue.version;
        this.setTime();
        this.setDate();
    },
    methods: {
        setTime: function(){
            // Get time, parse it and change the text of the clock
            const today = new Date();
            let h = today.getHours();
            let m = today.getMinutes();
            let s = today.getSeconds();
            m = this.checkZeros(m);
            s = this.checkZeros(s);
            document.getElementById('clock').innerText = h + ":" + m + ":" + s;
            setTimeout(this.setTime, 500); //timeout for a bit
        },
        setDate: function(){
            const today = new Date();
            let day = today.getDate();
            let month = today.getMonth() + 1; //month is zero indexed
            let year = today.getFullYear();
            day = this.checkZeros(day);
            month = this.checkZeros(month);
            document.getElementById('date').innerText =day + "." + month + "." + year;
            setTimeout(this.setDate, 60000);
        },
        checkZeros: function(time){
            if (time < 10) {
                time = "0" + time;
            }
            return time;
        },
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

</style>
