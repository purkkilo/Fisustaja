<template>
  <div id="app">
    <div class="container">
      <div class="row section time" id="timers">
        <div class="col s4 center-align"><h4 id="date"> </h4></div>
        <div class="col s4 center-align"><h4></h4></div>
        <div class="col s4 center-align"><h4 id="clock"> </h4></div>
      </div>
      <CompetitionComponent />
    </div>
  </div>
</template>

<script>
import CompetitionComponent from '../components/CompetitionComponent.vue'

export default {
    name: 'ContinueComp',
    components: {
      CompetitionComponent,
    },
    mounted() {
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

</style>
