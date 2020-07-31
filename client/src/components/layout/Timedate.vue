<template>
    <v-row class="valign-wrapper time">
      <v-col md="3">
        <h4 id="date">{{ date }}</h4>
      </v-col>
      <v-col md="6">
        <h4 id="comp-left" v-if="competitionChosen">{{ timer_string }}</h4>
      </v-col>
      <v-col md="3">
        <h4 id="clock">{{ clock }}</h4>
      </v-col>
    </v-row>
    
</template>

<script>
import moment from 'moment';

export default {
  name: "Timedate",
  data() {
      return {
        competition: null,
        competition_started: false,
        competition_ended: false,
        calculated_time: null,
        date_interval: 3000,
        clock_interval: 500,
        remaining_interval: 500,
        clock: null,
        date: null,
        timer: null,
        timer_string: "",
        amount: 40,
      }
  },
  computed: {
      competitionChosen() {
        return this.$store.getters.getCompetition;
      },
  },
  mounted () {
    //TODO Fix timers to that they are in sync
    moment.locale('fi');
    if(localStorage.getItem('competition') != null) {
        this.competition = this.$store.getters.getCompetition;
        this.remainingTime();
        setInterval(this.remainingTime, this.remaining_interval);
    }
    else {
      this.timer_string = "";
      this.setTime();
      this.setDate();
      setInterval(this.setTime, this.clock_interval);
      setInterval(this.setDate, this.date_interval);
      clearInterval(this.remainingTime);
    }
  },
  beforeDestroy() {
    clearInterval(this.setTime);
    clearInterval(this.setDate);
    clearInterval(this.remainingTime);
  },
  methods: {
    setTime: function(){
        if(document.getElementById('clock')){
          // Get time, parse it and change the text of the clock
          const today = new Date();
          let h = today.getHours();
          let m = today.getMinutes();
          let s = today.getSeconds();
          m = this.checkZeros(m);
          s = this.checkZeros(s);
          this.clock = `${h}:${m}:${s}`
          //document.getElementById('clock').innerText = h + ":" + m + ":" + s;
        }
        else {
          clearInterval(this.setTime);
        }
    },
    setDate: function(){
      if(document.getElementById('date')){
          const today = new Date();
          let day = today.getDate();
          let month = today.getMonth() + 1; //month is zero indexed
          let year = today.getFullYear();
          day = this.checkZeros(day);
          month = this.checkZeros(month);
          this.date = `${day}.${month}.${year}`
      }
      else {
        clearInterval(this.setDate);
      }
    },
    remainingTime: function(){
      if(document.getElementById('comp-left')) {
          if (this.competition) {
              let start_dateTime = moment(this.competition.start_date);
              let end_dateTime = moment(this.competition.end_date);

              let timeLeft = 0;
              let formatted = "";
              this.competition_started = moment(moment()).isAfter(start_dateTime);
              this.competition_ended = moment(moment()).isAfter(end_dateTime);

              if(!this.competition_started && !this.competition_ended) {
                timeLeft = moment.duration(start_dateTime.diff(moment())); // get difference between now and timestamp
                formatted =
                  this.checkZeros(timeLeft.hours()) + 'h '
                  + this.checkZeros(timeLeft.minutes()) + 'm '
                  + this.checkZeros(timeLeft.seconds()) +'s';
                
                if (timeLeft < 60000 * 60 * 24) { // under an 24 hours
                    this.timer_string = `Kilpailun alkuun: ${formatted}`;
                }
                else {
                    this.calculated_time = moment(moment()).to(start_dateTime); // Time to competition start
                    this.timer_string = `Kilpailu alkaa: ${this.calculated_time}`;
                }
              }
              else if (this.competition_started && !this.competition_ended) {
                timeLeft = moment.duration(end_dateTime.diff(moment())); // get difference between now and timestamp
                let days = timeLeft.days() ? `${timeLeft.days()}d ` : ` `
                formatted =
                  days
                  + this.checkZeros(timeLeft.hours()) + 'h '
                  + this.checkZeros(timeLeft.minutes()) + 'm '
                  + this.checkZeros(timeLeft.seconds()) +'s';

                  this.remaining_interval = 500;
                  this.timer_string = `Kilpailua jäljellä: ${formatted}`;
              }
              else {
                this.timer_string = `Kilpailu päättynyt!`;
              }
          }
        }
        else {
          clearInterval(this.remainingTime);
        }
    },
    checkZeros: function(time){
        if (time < 10) {
            time = "0" + time;
        }
        return time;
    },
  }
}
</script>

<style scoped>

</style>
