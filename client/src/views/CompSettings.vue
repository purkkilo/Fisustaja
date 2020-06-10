<template>
  <div class="container">
    <Timedate />
    <div class="container-transparent">
      <div class="section">
        <div class="col s12 center-align"><h1>Kilpailun määritykset</h1></div>
      </div>

      <div class="row">
        <router-link to="/overview">
          <div class="col s4 push-s4">
            <a class="waves-effect waves-light btn"
              ><i class="material-icons left">info</i>Kilpailun yleisnäkymä</a
            >
          </div>
        </router-link>
        <router-link to="/signing">
          <div class="col s4 push-s4"><a class="waves-effect waves-light blue btn" ><i class="material-icons left">edit</i>Ilmoittautuminen</a></div>
        </router-link>
      </div>

      <div id="settings-info" class="section inputarea">
        <div id="summary">
          <div class="basic_summary row section">
            <div class="center-align col s8 push-s2">
              <table class="striped centered responsive-table highlight">
                <caption class="flow-text">
                  Perustiedot
                </caption>
                <tr>
                  <th style="border:1px solid black;">Kilpailu</th>
                  <td style="border:1px solid black;" class="center-align">
                    {{ competition.competition_name }}
                  </td>
                </tr>
                <tr>
                  <th style="border:1px solid black;">Cup</th>
                  <td style="border:1px solid black;" class="center-align">
                    {{ competition.cup_name }}
                  </td>
                </tr>
                    <tr>
                      <th style="border:1px solid black;">Voittajan Cup sijoittumispisteet</th>
                      <td style="border:1px solid black;" class="center-align">
                        {{ competition.cup_placement_points }}
                      </td>
                    </tr>
                    <tr>
                      <th style="border:1px solid black;">Kilpailijoiden Cup osallistumispisteet</th>
                      <td style="border:1px solid black;" class="center-align">
                        {{ competition.cup_participation_points }}
                      </td>
                    </tr>
                <tr>
                  <th style="border:1px solid black;">
                    Kilpailun pistekerroin
                  </th>
                  <td style="border:1px solid black;" class="center-align">
                    {{ competition.cup_points_multiplier }}
                  </td>
                </tr>
                <tr>
                  <th style="border:1px solid black;">Järjestetään</th>
                  <td style="border:1px solid black;" class="center-align">
                    {{ competition.date_of_competition }}
                  </td>
                </tr>
                <tr>
                  <th style="border:1px solid black;">Kilpailupäiviä</th>
                  <td style="border:1px solid black;" class="center-align">
                    {{ competition.competition_duration }}
                  </td>
                </tr>
                <tr>
                  <th style="border:1px solid black;">Ajankohta</th>
                  <td style="border:1px solid black;" class="center-align">
                    {{ competition.start_of_competition }} -
                    {{ competition.end_of_competition }}
                  </td>
                </tr>
                <tr v-if="!competition_started">
                  <th style="border:1px solid black;">Kilpailun alkaa</th>
                  <td style="border:1px solid black;" class="center-align">
                    {{ calculated_time }}
                  </td>
                </tr>
                <tr v-else-if="competition_started && !competition_ended">
                  <th style="border:1px solid black;">Kilpailu loppuu</th>
                  <td style="border:1px solid black;" class="center-align">
                    {{ calculated_time }}
                  </td>
                </tr>
                <tr v-else>
                  <th style="border:1px solid black;">Kilpailu loppunut</th>
                  <td style="border:1px solid black;" class="center-align">
                    {{ calculated_time }}
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div class="fishes_summary row">
            <div class="center-align">
              <p class="flow-text">Kalojen määritykset</p>
            </div>
            <div class="col s8 push-s2">
              <table class="striped highlight centered responsive-table">
                <thead>
                  <tr>
                    <th>Kalalaji</th>
                    <th>Pistekerroin</th>
                    <th>Alamitta</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(fish, index) in fish_specs" :key="index">
                    <th style="border:1px solid black;" scope="row">
                      {{ fish.name }}
                    </th>
                    <td style="border:1px solid black;">
                      x {{ fish.multiplier }}
                    </td>
                    <td style="border:1px solid black;">{{ fish.minsize }} cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Timedate from "../components/layout/Timedate";
import moment from "moment";

export default {
  name: "CompSettings",
  components: {
    Timedate,
  },
  data() {
    return {
      competition: null,
      fish_specs: null,
      competition_started: false,
      competition_ended: false,
      calculated_time: null,
    };
  },
  mounted() {
    this.calculateRemainingTime();
  },
  methods: {
    calculateRemainingTime: function() {
      let now = moment().format();
      let start_dateTime = moment(
        `${this.competition.date_of_competition} ${this.competition.start_of_competition}`,
        "DD.MM.YYYY HH:mm"
      ).format();
      let end_dateTime = moment(
        `${this.competition.date_of_competition} ${this.competition.end_of_competition}`,
        "DD.MM.YYYY HH:mm"
      ).format();

      this.competition_started = moment(now).isAfter(start_dateTime);
      this.competition_ended = moment(now).isAfter(end_dateTime);

      if (!this.competition_started && !this.competition_ended) {
        this.calculated_time = moment(now).to(start_dateTime); // Time to competition start
      } else if (this.competition_started && !this.competition_ended) {
        this.calculated_time = moment(now).to(end_dateTime); // Time to competition start
      } else {
        this.calculated_time = moment(now).to(end_dateTime); // Competition ended
      }
      setTimeout(this.calculateRemainingTime, 60000); //Check every minute
    },
  },
  created() {
    moment.locale("fi");
    if (this.$store.getters.getCompetition) {
      this.fish_specs = this.$store.getters.getCompetitionFishes;
      this.competition = this.$store.getters.getCompetition;
    }
  },
};
</script>
