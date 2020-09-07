<template>
  <!-- /cup-overview -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container
    style="margin-top:70px;margin-bottom:5px"
    v-bind:class="{
      'container-transparent': !$store.getters.getTheme,
      'container-transparent-dark': $store.getters.getTheme,
    }"
  >
    <MainHeader />
    <v-row id="errordiv" v-if="errors.length">
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
          <p
            class="flow-text"
            v-bind:class="{
              'white--text': $store.getters.getTheme,
            }"
          >
            {{ index + 1 }}. {{ error }}
          </p>
        </li>
      </ul>
    </v-row>
    <v-row class="section">
      <v-col md="6" offset-md="3">
        <h1>Cuppien tuloksia</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="3" offset-md="8">
        <router-link to="/public-results">
          <v-btn large rounded color="green" class="white--text">
            <i class="material-icons left">emoji_events</i>Kilpailujen tuloksia
          </v-btn>
        </router-link>
      </v-col>
    </v-row>
    <v-row v-if="cups.length" class="scroll_table">
      <v-col md="4" offset-md="4">
        <v-autocomplete
          :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
          :dark="$store.getters.getTheme"
          v-model="selected_cup"
          :items="cups"
          item-text="select"
          item-value="_id"
          label="Valitse näytettävä Cup"
          outlined
          @input="pickCup"
          return-object
          single-line
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-if="!loading">
        <h2
          v-bind:class="{
            'white--text': $store.getters.getTheme,
          }"
        >
          Haetaan cuppeja...
        </h2>
        <ProgressBarQuery />
      </v-col>
      <v-col v-else>
        <h2
          v-bind:class="{
            'white--text': $store.getters.getTheme,
          }"
        >
          Ei cuppeja saatavilla :(
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          large
          tile
          color="yellow"
          @click="
            selected_cup = null;
            competitions = [];
            results = [];
          "
          :disabled="!selected_cup"
        >
          <i class="material-icons left">remove_circle</i>Peruuta valinta
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="!loading">
      <v-col>
        <v-row v-if="results.length">
          <v-col>
            <h1>Cupin kokonaispisteet</h1>
          </v-col>
        </v-row>
        <v-row
          v-if="results.length"
          v-bind:class="{
            inputarea: !$store.getters.getTheme,
            'inputarea-dark': $store.getters.getTheme,
          }"
          style="padding-top:25px;"
        >
          <v-col class="d-flex" md="4">
            <v-select
              :items="header_options"
              :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
              :dark="$store.getters.getTheme"
              label="Kilpailun otsikko"
              outlined
              v-model="header_selection"
              @input="changeHeaders"
            ></v-select>
          </v-col>
          <v-col class="d-flex" md="4">
            <v-select
              :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
              :dark="$store.getters.getTheme"
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
              @click="saveAsPDF(`Cupin Kokonaistulokset`)"
              :loading="loading"
            >
              <i class="material-icons left">picture_as_pdf</i>Lataa pdf
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="results.length && not_finished_count > 0">
          <v-col>
            <p
              class="flow-text"
              v-bind:class="{
                'white--text': $store.getters.getTheme,
              }"
            >
              *Punaisella merkityt kilpailut ovat vielä kesken! ({{
                not_finished_count
              }}
              kpl)
            </p>
          </v-col>
        </v-row>
        <v-row v-if="competitions.length">
          <v-col>
            <v-card :dark="$store.getters.getTheme">
              <v-card-title>
                <p class="flow-text">Cupin kokonaispisteet</p>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Hae kilpailijaa"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                id="normal-table"
                :headers="headers"
                :items="results"
                :search="search"
              >
                <template
                  v-for="(h, index) in headers"
                  v-slot:[`header.${h.value}`]="{ header }"
                >
                  <v-chip
                    v-if="header.highlight"
                    :key="index"
                    :outlined="$store.getters.getTheme"
                    :color="getCompetitionFinishedColor(header.isFinished)"
                    >{{ header.text }}</v-chip
                  >
                  <v-chip
                    v-else
                    :key="index"
                    :outlined="$store.getters.getTheme"
                    >{{ header.text }}</v-chip
                  >
                </template>
                <template v-slot:[`item.placement`]="{ item }">
                  <v-chip
                    :outlined="$store.getters.getTheme"
                    :color="getColor(item.placement)"
                    >{{ item.placement }}.</v-chip
                  >
                </template>
                <template
                  v-for="(c, index) in competitions.length"
                  v-slot:[`item.cup_results[${c}].points`]="{ item }"
                >
                  <div v-if="item.cup_results[c]" v-bind:key="c">
                    <!-- Points which are the same as competition participation points == not that important -->
                    <span
                      v-if="
                        item.cup_results[c].points ===
                          competitions[index].cup_participation_points
                      "
                      >{{ item.cup_results[c].points }}p ({{
                        item.cup_results[c].placement
                      }}.)</span
                    >
                    <!-- Highlight pointsthat matter -->
                    <v-chip
                      :outlined="$store.getters.getTheme"
                      :color="getColor(item.cup_results[c].placement)"
                      v-else
                      >{{ item.cup_results[c].points }}p ({{
                        item.cup_results[c].placement
                      }}.)</v-chip
                    >
                  </div>
                  <!-- No points, show '-' -->
                  <span v-else v-bind:key="c">
                    -
                  </span>
                </template>
                <template v-slot:[`item.final_cup_points`]="{ item }">
                  <v-chip color="indigo darken-3 white--text"
                    >{{ item.final_cup_points }}p</v-chip
                  >
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="competitions.length && selected_cup">
          <v-col v-if="loading">
            <p
              class="flow-text"
              v-bind:class="{
                'white--text': $store.getters.getTheme,
              }"
            >
              Päivitetään tuloksia...
            </p>
          </v-col>
        </v-row>
        <v-row v-if="competitions.length && selected_cup">
          <v-col>
            <v-btn
              id="updatebtn"
              large
              tile
              :loading="loading"
              color="blue darken-4"
              @click="refreshCup(selected_cup)"
              class="white--text"
            >
              <i class="material-icons left">update</i>Päivitä cupin tulokset
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col>
            <h2
              v-if="selected_cup && !competitions.length"
              v-bind:class="{
                'white--text': $store.getters.getTheme,
              }"
            >
              Cupissa ei vielä kilpailuja!
            </h2>
            <h2
              v-if="!selected_cup"
              v-bind:class="{
                'white--text': $store.getters.getTheme,
              }"
            >
              Cuppia ei vielä valittuna!
            </h2>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-row>
        <v-col>
          <h2
            v-bind:class="{
              'white--text': $store.getters.getTheme,
            }"
          >
            Haetaan cupin kilpailuja...
          </h2>
          <ProgressBarQuery />
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>
<script>
"use strict";
import M from "materialize-css";
import CupService from "../CupService";
import CompetitionService from "../CompetitionService";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import MainHeader from "../components/layout/MainHeader";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";

export default {
  name: "PublicCups",
  components: {
    ProgressBarQuery,
    MainHeader,
  },
  data() {
    return {
      cup: null,
      cups: [],
      competitions: [],
      headers: [],
      results: [],
      loading: false,
      errors: [],
      select_numbers: [],
      header_options: ["Paikkakunta", "Kilpailun nimi"],
      header_selection: "Paikkakunta",
      selected_competitions: 0,
      selected_cup: null,
      tab: null,
      search: "",
      not_finished_count: 0,
    };
  },
  async mounted() {
    //Check if user is logged in has admin status, update header
    this.checkLogin();
    let cups = await CupService.getAllCups();
    if (cups.length) {
      this.cups = cups.filter((cup) => {
        return cup.isPublic;
      });
      this.cups.forEach((cup) => {
        cup.select = `${cup.name} (${cup.year})`;
      });
    }

    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
  },
  methods: {
    pickCup: function() {
      this.$store.commit("refreshCup", this.selected_cup);
      this.refreshCup(this.selected_cup);
    },
    // Calculate all the cup points, and limit the number of races taken into account
    // If limit = 4, 4 races with highest points will be calculated, other races will have 5 points where the signee has participated
    calculateAll: function(competitions, limit) {
      let all_results = [];
      this.isResults = false;
      competitions.forEach((competition) => {
        // Dynamic headers, because competition names change
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
              found_signee.cup_results[competition.key_name] = {
                points: signee.cup_points_total,
                placement: signee.placement,
              };
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
              signee.cup_results[competition.key_name] = {
                points: signee.cup_points_total,
                placement: signee.placement,
              };
              all_results.push(signee);
            }
          });
        }
      });
      if (all_results.length) {
        this.isResults = true;
        // limits the amount of competitions are taken into account in the cup
        all_results = this.limitCompetitions(all_results, limit);
        // Sort the array based on total cup points
        this.results = all_results.sort(function compare(a, b) {
          return (
            parseInt(b.cup_results["Total"]) - parseInt(a.cup_results["Total"])
          );
        });
        this.changeHeaders();

        let placement = 1;
        let last_points = -1;
        let last_placement = -1;
        this.results.forEach((signee) => {
          if (last_points === signee.cup_results["Total"]) {
            signee.placement = last_placement;
          } else {
            signee.placement = placement;
            last_points = signee.cup_results["Total"];
            last_placement = signee.placement;
          }
          signee.final_cup_points = signee.cup_results["Total"];
          placement++;
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
            if (signee.cup_results[competition.key_name]) {
              // If signee's points are less than the limit points from the array
              // check which placement the points would have from array, and pair it with points, the signee.placement isn't accurate anymore if competitions are limited
              signee.cup_results[
                competition.key_name
              ].placement = competition.cup_placement_points_array.find(
                (placement_point) => {
                  return (
                    placement_point.points ===
                    signee.cup_results[competition.key_name].points
                  );
                }
              ).placement;
              if (
                signee.cup_results[competition.key_name].points <
                signee.points_compare[limit]
              ) {
                // Give signee only participation points
                signee.cup_results[competition.key_name].points =
                  competition.cup_participation_points;
                signee.cup_results["Total"] +=
                  competition.cup_participation_points;
              }
              // If the competition points are same as the limit
              if (
                signee.cup_results[competition.key_name].points ===
                signee.points_compare[limit]
              ) {
                // If there are more than 1 competitions as the limit, reset one of them
                if (counter === 1) {
                  signee.cup_results["Total"] += parseInt(
                    signee.cup_results[competition.key_name].points
                  );

                  // Give signee only participation points
                }
                // Else give full points
                else {
                  // Points are greater than the limit points, give full points
                  signee.cup_results[competition.key_name].points =
                    competition.cup_participation_points;

                  signee.cup_results["Total"] +=
                    competition.cup_participation_points;
                }
                counter++;
              } else {
                // Points are greater than the limit points, give full points
                signee.cup_results["Total"] += parseInt(
                  signee.cup_results[competition.key_name].points
                );
              }
            }
          });
        }
        // No need to do anything if limit is bigger
      });
      // Return sorted results
      return results;
    },
    async refreshCup(cup) {
      this.loading = true;
      this.errors = [];

      // Returns an array, get first result (there shouldn't be more than one in any case, since id's are unique)
      //TODO make a test for this?
      // Update to vuex, Assing variables from vuex (see client/store/index.js)
      this.$store.commit("refreshCup", cup);
      try {
        this.competitions = await CompetitionService.getCupCompetitions(cup.id);
        // Convert dates to moment objects
        let counter = 1;
        this.competitions = this.competitions.filter((competition) => {
          return competition.isPublic;
        });
        this.competitions.forEach((competition) => {
          this.select_numbers.push(counter);
          competition.start_date = moment(competition.start_date);
          competition.end_date = moment(competition.end_date);
          // Index for competition
          competition.key_name = counter;
          counter++;
        });
        this.competitions.sort(function compare(a, b) {
          return moment(b.start_date).isBefore(moment(a.start_date));
        });
        this.selected_competitions = this.competitions.length;
        this.calculateAll(this.competitions, this.selected_competitions);
        M.toast({ html: "Tiedot ajantasalla!" });
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
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
    getColor(placement) {
      if (placement > 30) return "red";
      if (placement > 20) return "orange";
      else if (placement > 5) return "yellow";
      else return "green";
    },
    getCompetitionFinishedColor(isFinished) {
      if (isFinished) return "red";
      else return "primary";
    },
    replaceAllChars: function(text, obj) {
      return [...text]
        .map((each) => {
          for (const o in obj) {
            each == o ? (each = obj[o]) : o;
          }
          return each;
        })
        .join("");
    },
    changeHeaders: function() {
      this.headers = [];
      this.headers.push({
        text: "Sijoitus",
        highlight: false,
        align: "center",
        value: "placement",
      });
      this.headers.push({
        text: "Kilp. Nro",
        align: "center",
        highlight: false,
        value: "boat_number",
      });
      this.headers.push({
        text: "Kippari",
        align: "center",
        highlight: false,
        value: "captain_name",
      });
      this.headers.push({
        text: "Paikkakunta",
        align: "center",
        highlight: false,
        value: "locality",
      });
      this.not_finished_count = 0;
      this.competitions.forEach((competition) => {
        // Keep track if there are unfinished competitions
        if (!competition.isFinished) {
          this.not_finished_count++;
        }
        // Dynamic headers, because competition names change
        if (this.header_selection === "Paikkakunta") {
          // Check if there are competitions with same locality, if so, add identifier
          let found_headers = this.headers.filter((header) => {
            return competition.locality === header.text;
          });
          if (found_headers.length) {
            let new_header_text = ` ${
              competition.locality
            } #${found_headers.length + 1}`;
            this.headers.push({
              text: new_header_text,
              align: "center",
              highlight: true,
              isFinished: !competition.isFinished,
              value: `cup_results[${competition.key_name}].points`,
            });
          } else {
            this.headers.push({
              text: competition.locality,
              align: "center",
              highlight: true,
              isFinished: !competition.isFinished,
              value: `cup_results[${competition.key_name}].points`,
            });
          }
        } else {
          this.headers.push({
            text: competition.name,
            align: "center",
            highlight: true,
            isFinished: !competition.isFinished,
            value: `cup_results[${competition.key_name}].points`,
          });
        }
      });
      this.headers.push({
        text: "Yhteensä",
        align: "center",
        highlight: false,
        value: "final_cup_points",
      });
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
    // Parses dictionary/json to array, for pdf autotables
    dictToArray: function(dict) {
      const temp_arr = Object.entries(dict);
      const arr = [];

      temp_arr.forEach((element) => {
        let values = Object.values(element[1]);
        let cup_results = values[9];
        values[0] = String(values[0]) + ".";
        values[1] = "(" + String(values[1]) + ")";
        values[3] = values[4];
        let counter = 4;
        this.competitions.forEach((competition) => {
          if (cup_results[competition.key_name]) {
            values[counter] = `${cup_results[competition.key_name].points}p (${
              cup_results[competition.key_name].placement
            }.)`;
          } else {
            values[counter] = "-";
          }
          counter++;
        });
        values[counter] = `${cup_results["Total"]}p`;
        arr.push(values);
      });
      return arr;
    },
    // Convert the charts and the tables to pdf
    saveAsPDF: function(table_title) {
      // Format dates for easier reding
      // PDF creation
      let doc = new jsPDF("landscape");

      // Title
      const title = `${this.selected_cup.name} (${this.selected_cup.year})`;
      const last_competition = this.competitions[this.competitions.length - 1];
      const start_date = moment(last_competition.start_date);
      const formatted_date = `${start_date.date()}.${start_date.month() +
        1}.${start_date.year()}`;
      const sub_title = `Tilanne ${formatted_date}, ${last_competition.name} (${last_competition.locality}) jälkeen`;
      doc.setFontSize(24);
      doc.text(13, 10, title, { align: "left" });
      doc.line(0, 15, 400, 15);
      doc.setFontSize(14);

      // Table, based on given table_id, and table title based on competition_type
      doc.text(13, 25, sub_title, { align: "left" });
      doc.text(
        13,
        35,
        table_title +
          ` (${this.selected_competitions}/${this.competitions.length} parasta kilpailua otettu huomioon)`,
        { align: "left" }
      );
      let columns = [];
      this.headers.forEach((header) => {
        columns.push(header.text);
      });
      let rows = this.dictToArray(this.results);
      doc.autoTable({
        head: [columns],
        body: rows,
        styles: {
          overflow: "linebreak",
          halign: "justify",
          fontSize: "8",
          lineColor: "100",
          lineWidth: ".25",
        },
        columnStyles: { text: { cellwidth: "auto" } },
        headStyles: { text: { cellwidth: "wrap" } },
        theme: "striped",
        pageBreak: "auto",
        tableWidth: "auto",
        startY: 40,
        margin: { top: 20 },
      });

      // Save the pdf
      doc.save(
        `${this.selected_cup.year}_${this.replaceAll(
          "Cup",
          " ",
          ""
        )}_${this.replaceAll(this.capitalize_words(table_title), " ", "")}.pdf`
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
