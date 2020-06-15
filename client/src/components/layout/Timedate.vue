<template>
    <div class="row black-text valign-wrapper time">
        <div class="col s3 center-align"><h4 id="date"> </h4></div>
        <div class="col s6 center-align">
          <h4>{{ timer_string }}</h4>
        </div>
        <div class="col s3 center-align"><h4 id="clock"> </h4></div>
    </div>
    
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
        date_interval: 500,
        clock_interval: 500,
        remaining_interval: 500,
        clock: null,
        date_timer: null,
        timer: null,
        timer_string: "",
        amount: 40,
      }
  },
  mounted () {
    //TODO update timer that shows if competition has started, how much competition is left etc.
    moment.locale('fi');
    if (this.$store.getters.getCompetition){
      this.competition = this.$store.getters.getCompetition;
      this.remainingTime();
    }
    else {
      this.timer_string = "";
      this.setTime();
      this.setDate();   
      clearTimeout(this.remainingTime);
    }
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
        setTimeout(this.setTime, this.clock_interval); //timeout for a bit
    },
    setDate: function(){
        const today = new Date();
        let day = today.getDate();
        let month = today.getMonth() + 1; //month is zero indexed
        let year = today.getFullYear();
        day = this.checkZeros(day);
        month = this.checkZeros(month);
        document.getElementById('date').innerText =day + "." + month + "." + year;
        setTimeout(this.setDate, this.remaining_interval);
    },
    remainingTime: function(){
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

              setTimeout(this.remainingTime, this.remaining_interval); //Check every minute
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
  .md-progress-bar {
    margin: 24px;
  }
</style>
