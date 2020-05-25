<template>
  <div class="container">
    <Timedate />
    <div class="container-transparent">
      <div class="section">
          <div class="col s12 center-align"><h1>Kilpailun määritykset</h1></div>
      </div>

      <div class="section">
        <router-link to="/overview">
          <div class="col s12 center-align"><a class="waves-effect waves-light btn"><i class="material-icons left">info</i>Kilpailun yleisnäkymä</a></div>
        </router-link>
      </div>

      <div id="settings-info" class="col s12 inputarea">
        <div class="section row">
          <p class="flow-text center-align">Määrityksiä</p>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import Timedate from '../components/layout/Timedate';

export default {
    name: 'CompSettings',
    components: {
      Timedate
    },
    data() {
        return {
          
        }
    },
    mounted() {

    },
    methods: {
      
    },
}
</script>