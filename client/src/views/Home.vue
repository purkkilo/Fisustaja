<template>
  <div id="app">
    <div class="container">
      <Timedate/>
      <div class="container-transparent" style="margin-top:5px">
          <div class="section">
              <div class="col s12 center-align"><h1>Fisustaja - Kotisivu</h1></div>
          </div>
        
          <div class="section row inputarea">
            <div class="col s12">
                <h1><b>}-(((*></b></h1>
                <p class="flow-text">Sovellus kalastuskilpailujen järjestämistä varten</p>
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
</template>

<script>
import Vue from 'vue';
import Timedate from '../components/layout/Timedate';

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
    methods: {
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
