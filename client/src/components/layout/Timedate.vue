<template>
    <div class="row section">
        <div class="col s4 left-align"><h4 id="date"> </h4></div>
        <div class="col s4 left-align"><h4 id="time_to_competition"></h4></div>
        <div class="col s4 right-align"><h4 id="clock"> </h4></div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
  name: "Timedate",
  data() {
      return {
        competition: null,
        fish_specs: null,
        competition_started: false,
        competition_ended: false,
        calculated_time: null,
      }
  },
  mounted () {
    //TODO update timer that shows if competition has started, how much competition is left etc.
    moment.locale('fi');
    if (this.$store.getters.getCompetition){
      this.fish_specs = this.$store.getters.getCompetitionFishes;
      this.competition = this.$store.getters.getCompetition;
      this.calculateRemainingTime();
    }
    else {
      console.log("No competition chosen yet");
    }
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
    calculateRemainingTime: function(){
        if (this.comeptition) {
            let now = moment().format();
            let start_dateTime = moment(`${this.competition.date_of_competition} ${this.competition.start_of_competition}`, 'DD.MM.YYYY HH:mm').format();
            let end_dateTime = moment(`${this.competition.date_of_competition} ${this.competition.end_of_competition}`, 'DD.MM.YYYY HH:mm').format();


            this.competition_started = moment(now).isAfter(start_dateTime);
            this.competition_ended = moment(now).isAfter(end_dateTime);

            if(!this.competition_started && !this.competition_ended) {
              this.calculated_time = moment(now).to(start_dateTime); // Time to competition start
              document.getElementById('time_to_competition').innerText = `Kilpailu alkaa ${this.calculated_time}`;
            }
            else if (this.competition_started && !this.competition_ended) {
              this.calculated_time = moment(now).to(end_dateTime); // Time to competition start
              document.getElementById('time_to_competition').innerText = `Kilpailua päättyy ${this.calculated_time}`;
            }
            else {
              this.calculated_time = moment(now).to(end_dateTime); // Competition ended
              document.getElementById('time_to_competition').innerText = `Kilpailu päättynyt ${this.calculated_time} sitten!`;
            }

            setTimeout(this.calculateRemainingTime, 60000); //Check every minute
        }
        else {
          document.getElementById('time_to_competition').innerText = "";
        }
    },
  }
}
</script>

<style scoped>
  .header {
    background: rgba(255, 255, 255, 0.411);
    color: #fff;
    text-align: center;
    padding: 10px;
  }
  .header a {
    padding-right: 5px;
    text-decoration: none;
  }
</style>
