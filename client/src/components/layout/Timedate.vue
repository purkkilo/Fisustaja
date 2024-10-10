<template>
  <v-row align="center" style="margin: 0">
    <v-col>
      <v-card
        style="background: transparent"
        elevation="5"
        outlined
        height="100"
        :dark="$store.getters.getTheme"
      >
        <v-row>
          <v-col>
            <h2 class="white--text" id="comp-state">Pvm. {{ date }}</h2>
          </v-col>
          <v-col>
            <h2 class="white--text" id="clock">Klo. {{ clock }}</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-row align="center">
            <v-col>
              <h3
                :class="
                  competition_state === 'Kilpailu päättynyt!'
                    ? 'red--text'
                    : 'green--text'
                "
                id="date"
              >
                {{ competition_state }}
              </h3>
            </v-col>
            <v-col>
              <h2
                :class="
                  competition_state === 'Kilpailu päättynyt!'
                    ? 'red--text'
                    : 'green--text'
                "
                id="comp-left"
                v-if="competitionChosen"
              >
                {{ timer_string }}
              </h2>
            </v-col>
          </v-row>
        </v-row>
      </v-card></v-col
    >
  </v-row>
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
    setTime() {
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
    setDate() {
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
    remainingTime() {
      if (document.getElementById("comp-left")) {
        if (this.competition) {
          let start_dateTime = new Date(this.competition.start_date);
          let end_dateTime = new Date(this.competition.end_date);
          let now = new Date();
          let formatted = "";
          let duration = null;

          this.competition_started = start_dateTime < now;
          this.competition_ended = end_dateTime < now;
          if (!this.competition_started && !this.competition_ended) {
            duration = this.getDuration(now, start_dateTime);
            formatted = this.durationToString(duration);
            if (duration.days < 1) {
              // under an 24 hours
              this.competition_state = "Kilpailun alkuun";
              this.timer_string = formatted;
            } else {
              this.competition_state = "Kilpailu alkaa";
              this.timer_string = `${duration.days}d ` + formatted;
            }
          } else if (this.competition_started && !this.competition_ended) {
            duration = this.getDuration(now, end_dateTime);
            let days = duration.days ? `${duration.days}d ` : ` `;
            formatted = days + this.durationToString(duration);
            this.remaining_interval = 300;
            this.competition_state = "Kilpailua jäljellä";
            this.timer_string = formatted;
          } else {
            this.timer_string = null;
            this.competition_state = `Kilpailu päättynyt!`;
          }
        }
      } else {
        clearInterval(this.timer);
      }
    },
    checkZeros(time) {
      if (time < 10) {
        time = "0" + time;
      }
      return time;
    },
    getDuration(startDate, endDate) {
      var seconds = Math.floor((endDate - startDate) / 1000);
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(minutes / 60);
      var days = Math.floor(hours / 24);
      hours = hours - days * 24;
      minutes = minutes - days * 24 * 60 - hours * 60;
      seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
      return { days, hours, minutes, seconds };
    },
    durationToString(duration) {
      return (
        this.checkZeros(duration.hours) +
        "h " +
        this.checkZeros(duration.minutes) +
        "m " +
        this.checkZeros(duration.seconds) +
        "s"
      );
    },
  },
};
</script>

<style scoped></style>
