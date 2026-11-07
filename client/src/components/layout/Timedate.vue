<template>
  <v-row class="align-center" style="margin: 0">
    <v-col>
      <v-card
        style="background: transparent"
        elevation="2"
        height="100"
        variant="outlined"
      >
        <v-row>
          <v-col>
            <h2 class="text-white" id="comp-state">
              {{ $t("timer.date") }} {{ date }}
            </h2>
          </v-col>
          <v-col>
            <h2 class="text-white" id="clock">
              {{ $t("timer.at") }} {{ clock }}
            </h2>
          </v-col>
        </v-row>
        <v-row>
          <v-row class="align-center">
            <v-col>
              <h3
                :class="
                  competition_state === 'comp-ended' ? 'text-red' : 'text-green'
                "
                id="date"
              >
                {{ $t(competition_state) }}
              </h3>
            </v-col>
            <v-col>
              <h2
                :class="
                  competition_state === 'comp-ended' ? 'text-red' : 'text-green'
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

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

defineOptions({ name: "Timedate" });

const competition = ref(null);
const competition_started = ref(false);
const competition_ended = ref(false);
const calculated_time = ref(null);
const date_interval = ref(100);
const clock_interval = ref(100);
const remaining_interval = ref(100);
const clock = ref(null);
const date = ref(null);
const timer = ref(null);
const timer_date = ref(null);
const timer_clock = ref(null);
const timer_string = ref("");
const competition_state = ref("");
const amount = ref(40);

const competitionChosen = computed(() => {
  return localStorage.getItem("competition") != null;
});

function setTime() {
  if (document.getElementById("clock")) {
    // Get time, parse it and change the text of the clock
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkZeros(m);
    s = checkZeros(s);
    clock.value = `${h}:${m}:${s}`;
    clock_interval.value = 300;
    //document.getElementById('clock').innerText = h + ":" + m + ":" + s;
  } else {
    clearInterval(timer_clock.value);
  }
}

function setDate() {
  if (document.getElementById("date")) {
    const today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1; //month is zero indexed
    let year = today.getFullYear();
    day = checkZeros(day);
    month = checkZeros(month);
    date.value = `${day}.${month}.${year}`;
    date_interval.value = 60000;
  } else {
    clearInterval(timer_date.value);
  }
}

function remainingTime() {
  if (document.getElementById("comp-left")) {
    if (competition.value) {
      let start_dateTime = new Date(competition.value.start_date);
      let end_dateTime = new Date(competition.value.end_date);
      let now = new Date();
      let formatted = "";
      let duration = null;

      competition_started.value = start_dateTime < now;
      competition_ended.value = end_dateTime < now;
      if (!competition_started.value && !competition_ended.value) {
        duration = getDuration(now, start_dateTime);
        formatted = durationToString(duration);
        competition_state.value = "timer.to-start";
        if (duration.days < 1) {
          // under an 24 hours
          timer_string.value = formatted;
        } else {
          timer_string.value = `${duration.days}d ` + formatted;
        }
      } else if (competition_started.value && !competition_ended.value) {
        duration = getDuration(now, end_dateTime);
        let days = duration.days ? `${duration.days}d ` : ` `;
        formatted = days + durationToString(duration);
        remaining_interval.value = 300;
        competition_state.value = "timer.comp-left";
        timer_string.value = formatted;
      } else {
        timer_string.value = null;
        competition_state.value = "timer.comp-ended";
      }
    }
  } else {
    clearInterval(timer.value);
  }
}

function checkZeros(time) {
  if (time < 10) {
    time = "0" + time;
  }
  return time;
}

function getDuration(startDate, endDate) {
  var seconds = Math.floor((endDate - startDate) / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  hours = hours - days * 24;
  minutes = minutes - days * 24 * 60 - hours * 60;
  seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
  return { days, hours, minutes, seconds };
}

function durationToString(duration) {
  return (
    checkZeros(duration.hours) +
    "h " +
    checkZeros(duration.minutes) +
    "m " +
    checkZeros(duration.seconds) +
    "s"
  );
}

onMounted(() => {
  setTime();
  setDate();
  timer_clock.value = setInterval(setTime, clock_interval.value);
  timer_date.value = setInterval(setDate, date_interval.value);

  if (localStorage.getItem("competition") != null) {
    let comp = JSON.parse(localStorage.getItem("competition"));
    competition.value = {
      id: comp["id"],
      start_date: comp["start_date"],
      end_date: comp["end_date"],
    };
    remainingTime();
    timer.value = setInterval(remainingTime, remaining_interval.value);
  } else {
    timer_string.value = "";
    clearInterval(timer.value);
  }
});

onBeforeUnmount(() => {
  clearInterval(timer.value);
  clearInterval(timer_clock.value);
  clearInterval(timer_date.value);
});
</script>

<style scoped></style>
