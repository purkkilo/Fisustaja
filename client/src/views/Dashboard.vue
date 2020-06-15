<template>
  <div id="app">
    <div class="container">
      <Timedate/>
      <div class="container-transparent">
          <div class="section">
              <div class="col s12 center-align"><h1>Fisustaja - Dashboard</h1></div>
          </div>
        
          <div class="section row inputarea">
                <div class="col s12">
                    <h1><b>}-(((*></b></h1>
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
                </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import Timedate from '../components/layout/Timedate';

export default {
    name: 'Home',
    components: {
      Timedate
    },
    data() {
        return {
        }
    },
    mounted() {
        this.$store.commit('refreshCompetition', null);
    },
    methods: {},
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
