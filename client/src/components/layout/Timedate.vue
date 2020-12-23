<template>
  <v-card outlined elevation="20">
    <v-row>
      <v-col>
        <h3 id="comp-state">Pvm. {{ date }}</h3>
      </v-col>
      <v-col>
        <h3 id="clock">Klo. {{ clock }}</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined>
          <v-row>
            <v-col cols="12" xs="6" sm="6" md="3" offset-md="2">
              <h4
                :class="
                  competition_state === 'Kilpailu päättynyt!'
                    ? 'fred-text'
                    : 'green-text'
                "
                id="date"
              >
                {{ competition_state }}
              </h4>
            </v-col>
            <v-col cols="12" xs="6" sm="6" md="6">
              <h4 class="green-text" id="comp-left" v-if="competitionChosen">
                {{ timer_string }}
              </h4>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "Timedate",
  data() {
    return {
      competition: null,
      competition_started: false,
      competition_ended: false,
      calculated_time: null,
      date_interval: 100,
      clock_interval: 100,
      remaining_interval: 100,
      clock: null,
      date: null,
      timer: null,
      timer_date: null,
      timer_clock: null,
      timer_string: "",
      competition_state: "",
      amount: 40,
    };
  },
  computed: {
    competitionChosen() {
      return localStorage.getItem("competition") != null;
    },
  },
  mounted() {
    //TODO Fix timers to that they are in sync
    this.setTime();
    this.setDate();
    this.timer_clock = setInterval(this.setTime, this.clock_interval);
    this.timer_date = setInterval(this.setDate, this.date_interval);

    if (localStorage.getItem("competition") != null) {
      let comp = JSON.parse(localStorage.getItem("competition"));
      this.competition = {
        id: comp["id"],
        start_date: comp["start_date"],
        end_date: comp["end_date"],
      };
      this.remainingTime();
      this.timer = setInterval(this.remainingTime, this.remaining_interval);
    } else {
      this.timer_string = "";
      clearInterval(this.timer);
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.timer_clock);
    clearInterval(this.timer_date);
  },
  methods: {
    setTime: function() {
      if (document.getElementById("clock")) {
        // Get time, parse it and change the text of the clock
        const today = new Date();
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();
        m = this.checkZeros(m);
        s = this.checkZeros(s);
        this.clock = `${h}:${m}:${s}`;
        this.clock_interval = 300;
        //document.getElementById('clock').innerText = h + ":" + m + ":" + s;
      } else {
        clearInterval(this.timer_clock);
      }
    },
    setDate: function() {
      if (document.getElementById("date")) {
        const today = new Date();
        let day = today.getDate();
        let month = today.getMonth() + 1; //month is zero indexed
        let year = today.getFullYear();
        day = this.checkZeros(day);
        month = this.checkZeros(month);
        this.date = `${day}.${month}.${year}`;
        this.date_interval = 60000;
      } else {
        clearInterval(this.timer_date);
      }
    },
    remainingTime: function() {
      if (document.getElementById("comp-left")) {
        if (this.competition) {
          let start_dateTime = this.$moment(this.competition.start_date);
          let end_dateTime = this.$moment(this.competition.end_date);

          let timeLeft = 0;
          let formatted = "";
          this.competition_started = this.$moment(this.$moment()).isAfter(
            start_dateTime
          );
          this.competition_ended = this.$moment(this.$moment()).isAfter(
            end_dateTime
          );

          if (!this.competition_started && !this.competition_ended) {
            timeLeft = this.$moment.duration(
              start_dateTime.diff(this.$moment())
            ); // get difference between now and timestamp
            formatted =
              this.checkZeros(timeLeft.hours()) +
              "h " +
              this.checkZeros(timeLeft.minutes()) +
              "m " +
              this.checkZeros(timeLeft.seconds()) +
              "s";

            if (timeLeft < 60000 * 60 * 24) {
              // under an 24 hours
              this.competition_state = "Kilpailun alkuun";
              this.timer_string = formatted;
            } else {
              this.calculated_time = this.$moment(this.$moment()).to(
                start_dateTime
              ); // Time to competition start
              this.competition_state = "Kilpailu alkaa";
              this.timer_string = this.calculated_time;
            }
          } else if (this.competition_started && !this.competition_ended) {
            timeLeft = this.$moment.duration(end_dateTime.diff(this.$moment())); // get difference between now and timestamp
            let days = timeLeft.days() ? `${timeLeft.days()}d ` : ` `;
            formatted =
              days +
              this.checkZeros(timeLeft.hours()) +
              "h " +
              this.checkZeros(timeLeft.minutes()) +
              "m " +
              this.checkZeros(timeLeft.seconds()) +
              "s";

            this.remaining_interval = 300;
            this.competition_state = "Kilpailua jäljellä";
            this.timer_string = `${formatted}`;
          } else {
            this.timer_string = null;
            this.competition_state = `Kilpailu päättynyt!`;
          }
        }
      } else {
        clearInterval(this.timer);
      }
    },
    checkZeros: function(time) {
      if (time < 10) {
        time = "0" + time;
      }
      return time;
    },
  },
};
</script>

<style scoped>
.valign-wrapper.time {
  margin-top: 50px;
  min-height: 100px;
}
</style>
