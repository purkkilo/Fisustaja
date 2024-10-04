<template>
  <!-- /cup-overview -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div>
    <v-container
      v-bind:class="{
        mobile: $vuetify.breakpoint.width < 800,
        browser: $vuetify.breakpoint.width >= 800,
        wide: $vuetify.breakpoint.width >= 1200,
      }"
    >
      <v-card
        style="background: transparent"
        elevation="10"
        outlined
        :dark="$store.getters.getTheme"
      >
        <v-row>
          <v-col md="6" offset-md="3">
            <h1>Cuppien tuloksia</h1>
          </v-col>
        </v-row>
        <v-row v-if="cups.length" class="scroll_table">
          <v-col md="4" offset-md="4">
            <!-- TODO add v-autocompelete, but so that it popsup the keyboad on mobile only when pressing search button? -->
            <v-autocomplete
              :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
              dark
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
            <h2 class="white--text">Haetaan cuppeja...</h2>
            <ProgressBarQuery />
          </v-col>
          <v-col v-else>
            <h2 class="white--text">Ei cuppeja saatavilla :(</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              large
              outlined
              color="yellow"
              @click="
                selected_cup = null;
                competitions = [];
                results = [];
              "
              :disabled="!selected_cup"
            >
              <v-icon>mdi-cancel</v-icon>Peruuta valinta
            </v-btn>
          </v-col>
        </v-row>
        <cup-points
          v-if="selected_cup && !loading"
          :competitions="competitions"
          :allCompetitions="allCompetitions"
          :headers="headers"
          :cup="selected_cup"
          :isResults="isResults"
          :loading="loading"
          :notFinishedCount="notFinishedCount"
          :results="results"
          :selectNumbers="selectNumbers"
          @change="(selection) => changeHeaders(selection)"
          @refresh="(cup) => refreshCup(cup)"
          @calculate="
            (selectedCompetitions) =>
              calculateAll(competitions, selectedCompetitions)
          "
          @save="
            (options) => {
              selectedCompetitions = options.selectedCompetitions;
              isLandscape = options.isLandscape;
              showInfoInPdf = options.showInfoInPdf;
              saveAsPDF(`Tulokset`);
            }
          "
          @sort="
            (show) => {
              showUnfinishedCompetitions = show;
              sortUnfinished();
            }
          "
        ></cup-points>
        <v-row v-if="loading" style="margin: 20px">
          <v-row>
            <v-col>
              <h2 class="white--text">Haetaan cupin kilpailuja...</h2>
              <ProgressBarQuery />
            </v-col>
          </v-row>
        </v-row>
        <v-snackbar v-model="snackbar" :timeout="timeout">
          {{ text }}

          <template v-slot:action="{ attrs }">
            <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-card>
    </v-container>
  </div>
</template>
<script>
"use strict";

import CupService from "../services/CupService";
import CompetitionService from "../services/CompetitionService";
import ResultService from "../services/ResultService";
import FishService from "../services/FishService";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";

import CupPoints from "../components/CupPoints.vue";
import { sortBy, openPdfOnNewTab, cupDictToArray } from "@/shared";

export default {
  name: "PublicCups",
  components: {
    ProgressBarQuery,
    CupPoints,
  },
  data() {
    return {
      dialog: false,
      isLandscape: false,
      cup: null,
      cups: [],
      competitions: [],
      allCompetitions: [],
      all_signees: [],
      biggest_amounts: [],
      biggest_fishes: [],
      headers: [],
      results: [],
      loading: false,
      selectNumbers: [],
      selectedCompetitions: 0,
      selected_cup: null,
      tab: null,
      search: "",
      notFinishedCount: 0,
      selectedItem: 1,
      items: [
        {
          text: "Kilpailujen tuloksia",
          icon: "mdi-seal",
          path: "/public-results",
          disabled: false,
        },
        {
          text: "Cuppien tuloksia",
          icon: "mdi-trophy",
          path: "/public-cups",
          disabled: true,
        },
      ],
      snackbar: false,
      text: "",
      timeout: 5000,
      isResults: false,
      showInfoInPdf: true,
      showUnfinishedCompetitions: false,
    };
  },
  async mounted() {
    this.cups = await CupService.getCups({
      isPublic: true,
    });
    if (this.cups.length) {
      this.cups.forEach((cup) => {
        cup.select = `${cup.name} (${cup.year})`;
      });
    }
  },
  methods: {
    selectTableData() {
      if (this.selected === "Kilpailut") {
        this.selected_items = this.allCompetitions;
        this.selected_headers = this.headers_comp;
      } else {
        this.selected_items = this.signees;
        this.selected_headers = this.headers_signees;
      }
    },
    sortUnfinished() {
      this.setCompetitionData(this.cup);
    },
    pickCup() {
      this.refreshCup(this.selected_cup);
    },

    changePage(route) {
      if (this.$router.currentRoute.path !== route) {
        this.$router.push(route);
        this.drawer = !this.drawer;
      } else {
        this.text = "Olet jo tällä sivulla!";
        this.snackbar = true;
      }
    },
    // Calculate all the cup points, and limit the number of races taken into account
    // If limit = 4, 4 races with highest points will be calculated, other races will have 5 points where the signee has participated
    async calculateAll(competitions, limit) {
      let all_results = [];
      this.isResults = false;
      competitions.forEach((competition) => {
        let signees = this.all_signees.filter(
          (s) => s.competition_id === competition._id
        );

        competition.total_weights = 0;
        signees.forEach((s) => {
          s.total_points = 0;
          if (s.fishes.length) {
            s.fishes.forEach((f) => {
              let fish = competition.fishes.find((cf) => cf.id === f.id);
              s.total_points += f.weights * fish.multiplier;
              competition.total_weights += f.weights;
              fish.weights += f.weights;
            });
          } else {
            // Fix for pdf
            competition.fishes.forEach((cf) => {
              s.fishes.push({ id: cf.id, name: cf.name, weights: "-" });
            });
          }
        });
        competition.normal_points = this.calculateNormalResults(
          competition,
          signees
        ).normal_points;
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
              found_signee.cup_results[competition.key_name] = {
                competition: competition._id,
                key_name: competition.key_name,
                points: signee.cup_points_total,
                placement: signee.placement,
              };
              // For tracking total points
              all_results.splice(index, 1, found_signee);
            }
            // Not any points on cup_results yet
            else {
              // Get the data that is stored in the cup's signees array
              let cup_signee = this.signees.find(
                (element) => element.boat_number === signee.boat_number
              );
              if (cup_signee) {
                // Add original names from the first instance
                signee.captain_name = cup_signee.captain_name;
                signee.temp_captain_name = cup_signee.temp_captain_name;
                signee.locality = cup_signee.locality;
              } else {
                // TODO: Figure out a better way to notify
                console.log(
                  `(${signee.boat_number}) - ${signee.captain_name} ei löytynyt cupin ilmoittautumislistalta`
                );
                alert(
                  `(${signee.boat_number}) - ${signee.captain_name} ei löytynyt cupin ilmoittautumislistalta`
                );
              }
              // Initialize variables and add first points
              signee.cup_results = [];
              // Array for comparing points with limit
              signee.cup_results[competition.key_name] = {
                competition: competition._id,
                key_name: competition.key_name,
                points: signee.cup_points_total,
                placement: signee.placement,
              };
              all_results.push(signee);
            }
          });
        }

        all_results.length ? (this.isResults = true) : (this.isResults = false);

        if (all_results.length) {
          // limits the amount of competitions are taken into account in the cup
          all_results = this.limitCompetitions(all_results, limit);
          // Sort the array based on total cup points
          all_results = all_results.sort(function compare(a, b) {
            return (
              parseInt(b.cup_results["total"]) -
              parseInt(a.cup_results["total"])
            );
          });
          this.changeHeaders("Paikkakunta");

          let final_placement = 1;
          let last_points = -1;
          let last_placement = -1;

          all_results.forEach((signee) => {
            if (last_points === signee.cup_results["total"]) {
              signee.final_placement = last_placement;
            } else {
              signee.final_placement = final_placement;
              last_points = signee.cup_results["total"];
              last_placement = signee.final_placement;
            }
            signee.final_cup_points = signee.cup_results["total"];
            final_placement++;
          });
          this.results = all_results;
        }
      });
    },
    // "Normaalikilpailu" results
    calculateNormalResults(competition, signees) {
      const placement_points = competition.cup_placement_points;
      let cup_placement_points = placement_points[0];
      const cup_participation_points = competition.cup_participation_points;
      let last_points = 0;
      let last_placement = 1;

      let placement = 1;
      let cup_points_total = 0;
      let normal_points = [];
      let normal_weights = [];
      signees = signees.filter((signee) => signee.returned == true);
      signees = signees.sort(function compare(a, b) {
        return parseInt(b.total_points) - parseInt(a.total_points);
      });
      // For every signee, calculate their cup points and placing
      //TODO rework the structure, seems more complex than it should be
      // Placements and points now saved in every competition to cup_placement_points_array, based on placement fetch from there?
      signees.forEach((signee, index) => {
        // If competitor has same points as last competitor
        if (signee.total_points === last_points) {
          placement = last_placement;
        }
        // If no tie, add tied_competitors to placement, to give correct placement to next not tied competitor
        else {
          placement = index + 1;
        }

        // Find the placement points according to the placement
        let p = placement_points.find((e) => e.placement === placement);
        // If placement isn't found (placement > than provided placements), or points = 0 (no points from competition)
        if (!p || signee.total_points === 0) {
          cup_placement_points = 0;
        } else {
          cup_placement_points = p.points * competition.cup_points_multiplier;
        }
        // Calculate total cup points, cup points multiplier only scales the placement points
        cup_points_total = cup_placement_points + cup_participation_points;
        //For showing cup points, "Pisteet" on v-select
        normal_points.push({
          placement: placement,
          boat_number: signee.boat_number,
          captain_name: signee.captain_name,
          temp_captain_name: signee.temp_captain_name,
          locality: signee.locality,
          total_points: signee.total_points,
          cup_placement_points: cup_placement_points,
          cup_participation_points: cup_participation_points,
          cup_points_total: cup_points_total,
        });
        //For showing fish weights, "Kalat" on v-select
        signee.placement = placement;
        // For the data-table
        signee.fishes.forEach((f) => {
          signee[f.id] = f.weights;
        });
        normal_weights.push(signee);

        last_placement = placement;
        last_points = signee.total_points;
      });

      return { normal_points, normal_weights };
    },
    limitCompetitions(results, limit) {
      results.forEach((signee) => {
        // If there are more or equal amount of competitions than the limit, limit remaining competitions after the limit
        if (this.competitions.length >= limit) {
          // Initialize total points to 0
          signee.cup_results["total"] = 0;
          // sort the array that points are compared to
          let temp = [...signee.cup_results];
          temp.sort(function compare(a, b) {
            return parseInt(b.points) - parseInt(a.points);
          });

          // Add all the limited points to total points
          temp.forEach((element, index) => {
            if (element) {
              if (index + 1 <= limit) {
                signee.cup_results["total"] += element.points;
              } else {
                const comp = this.competitions.find(
                  (c) => element.competition === c._id
                );
                signee.cup_results[element.key_name].points =
                  comp.cup_participation_points;
                signee.cup_results["total"] += comp.cup_participation_points;
              }
            }
          });
        }
      });

      // Return sorted results
      return results;
    },
    setCompetitionData(cup) {
      this.selectNumbers = [];
      // Convert dates to moment objects
      let counter = 1;
      this.allCompetitions.forEach((competition) => {
        competition.start_date = this.$moment(competition.start_date);
        competition.end_date = this.$moment(competition.end_date);
        // Index for competition
        competition.key_name = counter;
        counter++;
      });
      this.allCompetitions.sort((a, b) => {
        return b.start_date.isBefore(a.start_date);
      });
      this.signees = this.cup.signees.sort(sortBy("boat_number", true));
      this.signees.forEach((signee) => {
        signee.dialog = false;
      });

      this.competitions = [...this.allCompetitions];
      if (!this.showUnfinishedCompetitions) {
        this.competitions = this.competitions.filter((comp) => comp.isFinished);
      }
      this.competitions.forEach((_, i) => {
        this.selectNumbers.push(i + 1);
      });
      if (cup.meaningful_competitions > 0)
        this.selectedCompetitions = cup.meaningful_competitions;
      else this.selectedCompetitions = this.competitions.length;
      this.calculateAll(this.competitions, this.selectedCompetitions);
    },
    async refreshCup(cup) {
      if (this.selected_cup) {
        this.cup = cup;
        this.loading = true;
        // Returns an array, get first result (there shouldn't be more than one in any case, since id's are unique)
        //TODO make a test for this?
        // Update to vuex, Assing variables from vuex (see client/store/index.js)
        this.$store.commit("refreshCup", this.cup);
        try {
          this.allCompetitions = await CompetitionService.getCompetitions({
            cup_id: cup._id,
            isPublic: true,
          });

          this.biggest_fishes = await FishService.getFishes({
            cup_id: cup._id,
          });
          this.biggest_fishes = this.biggest_fishes.sort(
            (a, b) => b.weight - a.weight
          );

          await ResultService.getResults({ cup_id: cup._id })
            .then((r) => {
              r.forEach((s) => {
                if (s.fishes.length) {
                  s.fishes.forEach((f) => {
                    let comp = this.allCompetitions.find(
                      (c) => c._id === s.competition_id
                    );
                    let fish = comp.fishes.find((cf) => cf.id === f.id);

                    this.biggest_amounts.push({
                      id: fish.id,
                      competition_id: comp._id,
                      competition_name: comp.name,
                      boat_number: s.boat_number,
                      captain_name: s.captain_name,
                      name: fish.name,
                      weight: f.weights,
                    });
                  });
                }
              });

              this.all_signees = r;
              this.biggest_amounts = this.biggest_amounts.sort(
                (a, b) => b.weight - a.weight
              );
            })
            .catch((e) => {
              console.log(e);
            })
            .finally(() => {
              this.setCompetitionData(this.cup);
              this.selectTableData();
              this.loading = false;
              this.text = "Tiedot ajantasalla!";
              this.snackbar = true;
            });
        } catch (error) {
          console.error(error);
        }
      }
    },
    getCompetitionFinishedColor(isFinished) {
      if (isFinished) return "red";
      else return "primary";
    },
    replaceAllChars(text, obj) {
      return [...text]
        .map((each) => {
          for (const o in obj) {
            each == o ? (each = obj[o]) : o;
          }
          return each;
        })
        .join("");
    },
    changeHeaders(headerSelection) {
      this.headers = [];
      this.headers.push({
        text: "Sijoitus",
        highlight: false,
        align: "center",
        value: "final_placement",
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
      this.notFinishedCount = 0;
      this.competitions.forEach((competition) => {
        // Keep track if there are unfinished competitions
        if (!competition.isFinished) {
          this.notFinishedCount++;
        }
        // Dynamic headers, because competition names change
        if (headerSelection === "Paikkakunta") {
          // Check if there are competitions with same locality, if so, add identifier
          let found_headers = this.headers.filter((header) => {
            return competition.locality === header.text;
          });
          if (found_headers.length) {
            let new_header_text = ` ${competition.locality} #${
              found_headers.length + 1
            }`;
            this.headers.push({
              text: new_header_text,
              align: "center",
              highlight: true,
              isFinished: competition.isFinished,
              value: `cup_results[${competition.key_name}].points`,
            });
          } else {
            this.headers.push({
              text: competition.locality,
              align: "center",
              highlight: true,
              isFinished: competition.isFinished,
              value: `cup_results[${competition.key_name}].points`,
            });
          }
        } else {
          this.headers.push({
            text: competition.name,
            align: "center",
            highlight: true,
            isFinished: competition.isFinished,
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
    pickCompetition: function (competition) {
      // Pick competition for the app to use
      //NOTE Store competition to vuex, redundant?
      this.$store.state.competition = competition;
      // Set competition._id to localstorage for database queries
      localStorage.setItem(
        "competition",
        JSON.stringify({
          _id: competition._id,
          start_date: competition.start_date,
          end_date: competition.end_date,
        })
      );
      // redirect to /overview
      this.$router.push({ path: "/overview" });
    },
    // For naming the pdf, replace certain characters
    replaceAll: function (string, search, replace) {
      return string.split(search).join(replace);
    },
    // Capitalize all the words in given string. Takes account all the characters like "-", "'" etc.
    capitalize_words: function (str) {
      return str.replace(
        /(?:^|\s|['`‘’.-])[^\x60^\x7B-\xDF](?!(\s|$))/g,
        function (txt) {
          return txt.toUpperCase();
        }
      );
    },
    // Convert the charts and the tables to pdf
    async saveAsPDF(table_title) {
      // Format dates for easier reding
      // PDF creation
      let doc = new jsPDF({
        orientation: this.isLandscape ? "landscape" : "portrait",
      });

      // Title
      const title = `${this.selected_cup.name} (${this.selected_cup.year})`;
      let sub_title;
      let columns = [];
      let rows;
      let startY;
      // Find last competition from the array which has finished
      let temp_array = [...this.competitions];
      var index = temp_array
        .slice()
        .reverse()
        .findIndex((competition) => competition.isFinished === true);
      var count = temp_array.length - 1;
      var finalIndex = index >= 0 ? count - index : index;
      const last_competition = temp_array[finalIndex];
      const start_date = this.$moment(last_competition.start_date);
      const formatted_date = `${start_date.date()}.${
        start_date.month() + 1
      }.${start_date.year()}`;
      doc.setFontSize(24);
      doc.text(13, 15, title, { align: "left" });
      doc.line(0, 20, 400, 20);
      doc.setFontSize(14);
      // Table, based on given table_id, and table title based on competition_type
      let finished_competitions = 0;
      let unfinished_competitions = 0;
      this.competitions.forEach((competition) => {
        competition.isFinished
          ? finished_competitions++
          : unfinished_competitions++;
      });

      if (unfinished_competitions === 0) {
        sub_title = `Tulokset ${formatted_date}`;
      } else {
        sub_title = `Tilanne ${formatted_date}, ${last_competition.name} (${last_competition.locality}) jälkeen (${unfinished_competitions} kpl kilpailuja kesken)`;
      }
      doc.text(13, 30, sub_title, { align: "left" });
      if (this.showInfoInPdf) {
        doc.text(
          13,
          40,
          table_title +
            ` (${this.selectedCompetitions}/${this.competitions.length} parasta kilpailua otettu huomioon)`,
          { align: "left" }
        );
      }
      this.headers.forEach((header) => {
        columns.push(header.text);
      });
      rows = cupDictToArray(
        this.results,
        this.competitions,
        "cup_total_points"
      );
      startY = 45;

      doc.autoTable({
        head: [columns],
        body: rows,
        styles: {
          overflow: "linebreak",
          halign: "justify",
          fontSize: "8",
          lineColor: 100,
          lineWidth: 0.25,
        },
        columnStyles: { cellwidth: "auto" },
        headStyles: {
          cellwidth: "wrap",
        },
        theme: "striped",
        pageBreak: "auto",
        tableWidth: "auto",
        startY: startY,
        margin: { top: 20 },
      });

      // Save the pdf
      const fileName = `${this.selected_cup.year}_${this.replaceAll(
        "Cup",
        " ",
        ""
      )}_${this.replaceAll(this.capitalize_words(table_title), " ", "")}.pdf`;
      openPdfOnNewTab(doc, fileName);
    },
  },
};
</script>
<style scoped>
.isFinished {
  background-color: rgb(117, 23, 0);
}
tbody tr :hover {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
