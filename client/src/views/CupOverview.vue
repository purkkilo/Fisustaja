<template>
  <!-- /cup-overview -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container class="container">
    <Header />
    <Timedate style="margin-top:0" />
    <div id="errordiv" v-if="errors.length">
      <ul class="collection with-header" style="border:1px solid red;">
        <li class="collection-header" style="background: rgba(0,0,0,0);">
          <v-alert type="error">
            Korjaa seuraavat virheet:
          </v-alert>
        </li>
        <li
          class="collection-item"
          id="error"
          v-for="(error, index) in errors"
          v-bind:key="index"
        >
          <p class="flow-text">{{ index + 1 }}. {{ error }}</p>
        </li>
      </ul>
    </div>
    <v-tabs
      v-model="tab"
      background-color="blue lighten-2"
      color="basil"
      grow
      show-arrows
    >
      <v-tabs-slider color="blue darken-4"></v-tabs-slider>
      <v-tab href="#overview">Yleisnäkymä</v-tab>
      <v-tab href="#points" :disabled="!competitions.length">Cup pisteet</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" style="background: rgba(0,0,0,0.4);">
      <v-tab-item :value="'overview'">
        <v-row class="container-transparent">
          <v-row v-if="!loading">
            <v-row class="section">
              <v-col v-if="cup">
                <h1>{{ cup.name }}, {{ cup.year }}</h1>
              </v-col>
              <v-col v-else>
                <p class="flow-text">Ei kuppia valittuna</p>
              </v-col>
            </v-row>
            <v-row v-if="competitions.length">
              <v-col>
                <v-row v-if="competitions.length" class="scroll_table">
                  <table
                    border="1"
                    id="competitions-table"
                    class="centered responsive-table tablearea highlight"
                  >
                    <caption class="flow-text white--text">
                      Cupin kilpailut
                    </caption>
                    <thead class="title">
                      <tr>
                        <th>Kilpailun Päivämäärä</th>
                        <th>Nimi</th>
                        <th>Pistekerroin</th>
                        <th>Tila</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(competition, index) in competitions"
                        v-bind:item="competition"
                        v-bind:index="index"
                        v-bind:key="competition._id"
                      >
                        <th class="center-align" scope="row">
                          {{
                            `${competition.start_date.date()}.${competition.start_date.month() +
                              1}.${competition.start_date.year()} - ${competition.end_date.date()}.${competition.end_date.month() +
                              1}.${competition.end_date.year()}`
                          }}
                        </th>
                        <td>{{ competition.name }}</td>
                        <td>x {{ competition.cup_points_multiplier }}</td>
                        <td>{{ competition.state }}</td>
                        <td>
                          <v-btn
                            tile
                            color="primary"
                            @click="pickCompetition(competition)"
                            ><i class="material-icons left">check</i
                            >Valitse</v-btn
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </v-row>
                <v-row v-if="competitions.length">
                  <v-col>
                    <router-link to="/register-comp">
                      <v-btn tile color="blue lighten-1"
                        ><i class="material-icons left">add_circle_outline</i
                        >Luo kilpailu!</v-btn
                      >
                    </router-link>
                  </v-col>
                  <v-col v-if="cup.isPublic">
                    <v-btn
                      large
                      tile
                      color="grey darken-4"
                      @click="publishCup(false)"
                      :loading="publishing"
                      class="white--text"
                    >
                      <i class="material-icons left">unpublished</i>Aseta cup
                      salaiseksi
                    </v-btn>
                  </v-col>
                  <v-col v-else>
                    <v-btn
                      large
                      tile
                      color="green darken-4"
                      @click="publishCup(true)"
                      :loading="publishing"
                      class="white--text"
                    >
                      <i class="material-icons left">published_with_changes</i
                      >Aseta cup julkiseksi
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row v-else>
                  <v-col v-if="!loading">
                    <h2>Ei kilpailuja!</h2>
                    <router-link to="/register-comp">
                      <v-btn tile color="blue lighten-1"
                        ><i class="material-icons left">add_circle_outline</i
                        >Luo kilpailu!</v-btn
                      >
                    </router-link>
                  </v-col>
                  <h2 v-else-if="error" class="error">{{ error }}</h2>
                  <v-col v-else>
                    <h2>Ladataan kilpailuja...</h2>
                    <ProgressBarQuery />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-row></v-row>
              <v-col md="12">
                <h2>Ei kilpailuja!</h2>
              </v-col>
              <v-col md="12">
                <router-link to="/register-comp">
                  <v-btn tile color="blue lighten-1"
                    ><i class="material-icons left">add_circle_outline</i>Luo
                    kilpailu!</v-btn
                  >
                </router-link>
              </v-col>
            </v-row>
          </v-row>
          <v-row v-else>
            <v-row>
              <v-col>
                <h2>Valmistellaan Cuppia...</h2>
                <ProgressBarQuery />
              </v-col>
            </v-row>
          </v-row>
        </v-row>
      </v-tab-item>
      <v-tab-item :value="'points'">
        <v-row class="container-transparent">
          <v-col>
            <v-row v-if="results.length">
              <v-col>
                <h1>Cupin kokonaispisteet</h1>
              </v-col>
            </v-row>
            <v-row
              v-if="results.length"
              class="inputarea"
              style="padding-top:25px;"
            >
              <v-col class="d-flex" md="4">
                <v-select
                  :items="header_options"
                  label="Kilpailun otsikko"
                  outlined
                  v-model="header_selection"
                  @input="changeHeaders"
                ></v-select>
              </v-col>
              <v-col class="d-flex" md="4">
                <v-select
                  :items="select_numbers"
                  label="Cup sijoittumispisteisiin vaikuttavien kilpailujen määrä"
                  outlined
                  v-model="selected_competitions"
                  @input="calculateAll(competitions, selected_competitions)"
                ></v-select>
              </v-col>
              <v-col md="4">
                <v-btn
                  large
                  tile
                  color="green darken-4"
                  class="white--text"
                  @click="saveAsPDF(`Cupin Kokonaistulokset`, '#normal-table')"
                >
                  <i class="material-icons left">picture_as_pdf</i>Lataa pdf
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-if="isResults">
              <v-col md="6" offset-md="3">
                <p class="flow-text">
                  Punaisella värillä merkatut kilpailut ovat vielä kesken!
                </p>
              </v-col>
            </v-row>
            <v-row v-if="isResults">
              <v-col class="scroll_table">
                <table
                  id="normal-table"
                  class="highlight centered responsive-table tablearea table_header"
                >
                  <thead>
                    <tr>
                      <th
                        v-for="(header, index) in headers"
                        :key="index"
                        v-bind:class="{ isFinished: header.highlight }"
                      >
                        {{ header.title }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(signee, index) in results" :key="index">
                      <th style="border:1px solid black;" scope="row">
                        {{ index + 1 }}.
                      </th>
                      <td style="border:1px solid black;">
                        ({{ signee.boat_number }})
                      </td>
                      <td style="border:1px solid black;">
                        {{ signee.captain_name }}
                      </td>
                      <td style="border:1px solid black;">
                        {{ signee.locality }}
                      </td>
                      <td
                        style="border:1px solid black;"
                        v-for="(competition, index) in competitions"
                        :key="index"
                      >
                        {{
                          signee.cup_results[competition.name]
                            ? signee.cup_results[competition.name]
                            : 0
                        }}
                      </td>
                      <td style="border:1px solid black;">
                        {{
                          signee.cup_results["Total"]
                            ? signee.cup_results["Total"]
                            : 0
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col>
                <h2>Kilpailuissa ei vielä tuloksia!</h2>
              </v-col>
            </v-row>
            <v-row v-if="competitions.length && cup">
              <v-col v-if="loading">
                <p class="flow-text">Päivitetään tuloksia...</p>
              </v-col>
            </v-row>
            <v-row v-if="competitions.length && cup">
              <v-col>
                <v-btn
                  id="updatebtn"
                  large
                  tile
                  :loading="loading"
                  :disabled="!isResults"
                  color="blue darken-4"
                  @click="refreshCup(cup.id)"
                  class="white--text"
                >
                  <i class="material-icons left">update</i>Päivitä cupin
                  tulokset
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col>
                <h2>Ei kilpailuja rekisteröitynä!</h2>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>
<script>
"use strict";
import M from "materialize-css";
import Timedate from "../components/layout/Timedate";
import Header from "../components/layout/Header";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import CupService from "../CupService";
import CompetitionService from "../CompetitionService";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  name: "CupOverview",
  components: {
    Timedate,
    Header,
    ProgressBarQuery,
  },
  data() {
    return {
      cup: null,
      competitions: [],
      headers: [],
      results: [],
      isResults: false,
      loading: false,
      publishing: false,
      errors: [],
      select_numbers: [],
      header_options: ["Paikkakunta", "Kilpailun nimi"],
      header_selection: "Paikkakunta",
      selected_competitions: 0,
      tab: null,
    };
  },
  created() {},
  mounted() {
    //Check if user is logged in has admin status, update header
    this.checkLogin();

    // IF competition on localstorage
    if (localStorage.getItem("cup") != null) {
      // update from database
      this.refreshCup(localStorage.getItem("cup"));
      this.$store.state.cup = this.cup;
    } else {
      console.log("No cup in localstorage!");
    }

    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
  },
  methods: {
    changeHeaders: function() {
      this.headers = [];
      this.headers.push({ title: "Sijoitus", highlight: false });
      this.headers.push({ title: "Kilp. Nro", highlight: false });
      this.headers.push({ title: "Kippari", highlight: false });
      this.headers.push({ title: "Paikkakunta", highlight: false });
      this.competitions.forEach((competition) => {
        // Dynamic headers, because competition names change
        if (this.header_selection === "Paikkakunta") {
          this.headers.push({
            title: competition.locality,
            highlight: !competition.isFinished,
          });
        } else {
          this.headers.push({
            title: competition.name,
            highlight: !competition.isFinished,
          });
        }
      });
      this.headers.push({ title: "Yhteensä", highlight: false });
    },
    async publishCup(isPublic) {
      this.cup.isPublic = isPublic;

      try {
        //TODO update only this one variable (competition.normal_points) to database, not the whole competition
        this.$store.state.cup = this.cup;
        this.publishing = true;
        await CupService.updateCup(this.cup.id, this.cup);
      } catch (err) {
        console.error(err.message);
      }
      this.publishing = false;
    },
    // Calculate all the cup points, and limit the number of races taken into account
    // If limit = 4, 4 races with highest points will be calculated, other races will have 5 points where the signee has participated
    calculateAll: function(competitions, limit) {
      let all_results = [];
      this.isResults = false;
      this.headers = [];
      this.headers.push({ title: "Sijoitus", highlight: false });
      this.headers.push({ title: "Kilp. Nro", highlight: false });
      this.headers.push({ title: "Kippari", highlight: false });
      this.headers.push({ title: "Paikkakunta", highlight: false });
      competitions.forEach((competition) => {
        // Dynamic headers, because competition names change
        this.headers.push({
          title: competition.locality,
          highlight: !competition.isFinished, // Highlight if not finished yet
        });
        //If there are any results in the competition
        if (competition.normal_points.length) {
          //Loop through each competition's results
          competition.normal_points.forEach((signee) => {
            // Get each signee's results from array that has all the results
            let index = all_results.findIndex((item) => {
              return (
                parseInt(signee.boat_number) === parseInt(item.boat_number)
              );
            });
            //If the signee is found there
            if (index > -1) {
              // Get the signee, and add competitions results to array, under the competition.name key
              let found_signee = all_results[index];
              found_signee.points_compare.push(signee.cup_points_total); // For comparing
              found_signee.cup_results[competition.name] =
                signee.cup_points_total;
              // For tracking total points
              all_results.splice(index, 1, found_signee);
            }
            // Not any points on cup_results yet
            else {
              // Initialize variables and add first points
              signee.cup_results = [];
              // Array for comparing points with limit
              signee.points_compare = [];
              signee.points_compare.push(signee.cup_points_total); // For comparing
              signee.cup_results[competition.name] = signee.cup_points_total;
              all_results.push(signee);
            }
          });
        }
      });
      if (all_results.length) {
        this.isResults = true;
        // limits the amount of competitions are taken into account in the cup
        all_results = this.limitCompetitions(all_results, limit);

        this.headers.push({ title: "Yhteensä", highlight: false });
        // Sort the array based on total cup points
        this.results = all_results.sort(function compare(a, b) {
          return (
            parseInt(b.cup_results["Total"]) - parseInt(a.cup_results["Total"])
          );
        });
      }
    },
    limitCompetitions: function(results, limit) {
      limit = limit < 0 ? 0 : limit; // Make sure limit is at least 1

      results.forEach((signee) => {
        // If there are more or equal amount of competitions than the limit, limit remaining competitions after the limit
        if (this.competitions.length >= limit) {
          // sort the array that points are compared to
          // so first "limit" amount of competitions are only taken into account
          signee.points_compare.sort(function compare(a, b) {
            return parseInt(b) - parseInt(a);
          });
          // Initialize total points to 0
          signee.cup_results["Total"] = 0;
          let counter = 0; // counter for competitions that have same points as the limit
          // Check each competition
          //FIXME doesn't handle tied points if they happen to be on the limit, like here: https://gyazo.com/387d88f42fc38b3de8ef336fe82ecc49
          this.competitions.forEach((competition) => {
            // If signee has points for this competition
            if (signee.cup_results[competition.name]) {
              // If signee's points are less than the limit points from the array
              if (
                signee.cup_results[competition.name] <
                signee.points_compare[limit]
              ) {
                // Give signee only participation points
                signee.cup_results[competition.name] =
                  competition.cup_participation_points;
                signee.cup_results["Total"] +=
                  competition.cup_participation_points;
              }
              // If the competition points are same as the limit
              if (
                signee.cup_results[competition.name] ===
                signee.points_compare[limit]
              ) {
                // If there are more than 1 competitions as the limit, reset one of them
                if (counter === 1) {
                  signee.cup_results["Total"] +=
                    signee.cup_results[competition.name];
                }
                // Else give full points
                else {
                  // Points are greater than the limit points, give full points
                  signee.cup_results[competition.name] =
                    competition.cup_participation_points;
                  signee.cup_results["Total"] +=
                    competition.cup_participation_points;
                }
                counter++;
              } else {
                // Points are greater than the limit points, give full points
                signee.cup_results["Total"] +=
                  signee.cup_results[competition.name];
              }
            }
          });
        }
        // No need to do anything if limit is bigger
      });
      // Return sorted results
      return results;
    },
    async refreshCup(cup_id) {
      this.loading = true;
      this.errors = [];
      try {
        //Get competition from database (check 'client\src\CupService.js' and 'server\routes\api\cups.js' to see how this works)
        let cups = await CupService.getCup(cup_id);
        // IF competition found from database
        if (cups.length) {
          // Returns an array, get first result (there shouldn't be more than one in any case, since id's are unique)
          //TODO make a test for this?
          this.cup = cups[0];
          // Update to vuex, Assing variables from vuex (see client/store/index.js)
          this.$store.commit("refreshCup", cups[0]);
          try {
            this.competitions = await CompetitionService.getCupCompetitions(
              cup_id
            );
            // Convert dates to moment objects
            let counter = 1;
            this.competitions.forEach((competition) => {
              this.select_numbers.push(counter);
              competition.start_date = moment(competition.start_date);
              competition.end_date = moment(competition.end_date);
              counter++;
            });
            this.competitions.sort(function compare(a, b) {
              return moment(b.start_date).isBefore(moment(a.start_date));
            });
            this.selected_competitions = this.competitions.length;
            this.calculateAll(this.competitions, this.selected_competitions);
            M.toast({ html: "Tiedot ajantasalla!" });
          } catch (error) {
            console.error(error.message);
          }
        }
      } catch (err) {
        console.log(err.message);
      }
      this.loading = false;
    },
    //Check if user is logged in has admin status, update values to vuex (Header.vue updates based on these values)
    checkLogin: function() {
      // If login token present --> user is logged in
      if (localStorage.getItem("jwt") != null) {
        this.$store.state.logged_in = true;
        let user = JSON.parse(localStorage.getItem("user"));
        // Check if user is admin
        //TODO safer way to check this than use localstorage?
        user.is_admin == true
          ? (this.$store.state.is_admin = true)
          : (this.$store.state.is_admin = false);
      } else {
        //Not logger in, so not admin either
        this.$store.state.logged_in = false;
        this.$store.state.is_admin = false;
      }
    },
    pickCompetition: function(competition) {
      // Pick competition for the app to use
      //NOTE Store competition to vuex, redundant?
      this.$store.state.competition = competition;
      // Set competition._id to localstorage for database queries
      localStorage.setItem(
        "competition",
        JSON.stringify({
          id: competition._id,
          start_date: competition.start_date,
          end_date: competition.end_date,
        })
      );
      // redirect to /overview
      this.$router.push({ path: "/overview" });
    },
    // For naming the pdf, replace certain characters
    replaceAll: function(string, search, replace) {
      return string.split(search).join(replace);
    },
    capitalize_words: function(str) {
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    },
    // Convert the charts and the tables to pdf
    saveAsPDF: function(table_title, table_id) {
      // Format dates for easier reding
      // PDF creation
      let doc = new jsPDF();
      // Title
      const title = `${this.cup.name} (${this.cup.year})`;
      const last_competition = this.competitions[this.competitions.length - 1];
      const start_date = moment(last_competition.start_date);
      const formatted_date = `${start_date.date()}.${start_date.month() +
        1}.${start_date.year()}`;
      const sub_title = `Tilanne ${formatted_date}, ${last_competition.name} (${last_competition.locality}) jälkeen`;
      doc.setFontSize(24);
      doc.text(10, 10, title, { align: "left" });
      doc.line(0, 15, 400, 15);
      doc.setFontSize(14);

      // Table, based on given table_id, and table title based on competition_type
      doc.text(100, 25, sub_title, { align: "center" });
      doc.text(
        100,
        35,
        table_title +
          ` (${this.selected_competitions}/${this.competitions.length} parasta kilpailua otettu huomioon)`,
        { align: "center" }
      );
      doc.autoTable({
        html: table_id,
        styles: {
          overflow: "linebreak",
          cellWidth: "wrap",
          rowPageBreak: "avoid",
          halign: "justify",
          fontSize: "8",
          lineColor: "100",
          lineWidth: ".25",
        },
        columnStyles: { text: { cellwidth: "auto" } },
        theme: "striped",
        pageBreak: "auto",
        tableWidth: "auto",
        startY: 40,
        margin: { top: 20 },
      });

      // Save the pdf
      doc.save(
        `${this.cup.year}_${this.replaceAll("Cup", " ", "")}_${this.replaceAll(
          this.capitalize_words(table_title),
          " ",
          ""
        )}.pdf`
      );
    },
  },
};
</script>
<style scoped>
.isFinished {
  background-color: rgb(117, 23, 0);
}
</style>
