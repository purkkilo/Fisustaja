<template>
  <!-- /public-results -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container>
    <MainHeader />
    <v-row class="container-transparent">
      <v-col>
        <v-row>
          <v-col>
            <h1>Kilpailujen tuloksia</h1>
          </v-col>
        </v-row>
        <v-row v-if="competitions.length" class="scroll_table">
          <v-col md="6" offset-md="3">
            <v-autocomplete
              v-model="selected_competition"
              :items="competitions"
              item-text="select"
              item-value="_id"
              label="Valitse näytettävä kilpailu"
              :loading="loading"
              outlined
              @input="pickCompetition"
              return-object
              single-line
            ></v-autocomplete>
          </v-col>
          <v-col md="3">
            <router-link to="/public-cups">
              <v-btn large rounded color="green darken-4" class="white--text">
                <i class="material-icons left">emoji_events</i>Cuppien tuloksia
              </v-btn>
            </router-link>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="3" offset-md="4">
            <v-btn
              large
              tile
              color="yellow"
              @click="
                competition = null;
                selected_competition = null;
              "
              :disabled="!competition"
            >
              <i class="material-icons left">remove_circle</i>Peruuta valinta
            </v-btn>
          </v-col>
          <v-col md="3" offset-md="2">
            <v-btn
              large
              tile
              color="green darken-4"
              class="white--text"
              @click="saveAllAsPDF"
              :disabled="!biggest_amounts_results.length || !competition"
            >
              <i class="material-icons left">picture_as_pdf</i>Lataa kaikki
              tulokset
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="loading">
          <v-col>
            <h2>Haetaan kilpailuja...</h2>
            <ProgressBarQuery />
          </v-col>
        </v-row>
        <!-- Tabs -->
        <v-tabs
          v-if="!loading"
          v-model="tab"
          background-color="blue lighten-2"
          color="basil"
          grow
        >
          <v-tabs-slider color="blue darken-4"></v-tabs-slider>
          <v-tab href="#stats">Tilastoja</v-tab>
          <v-tab href="#normal-competition" :disabled="!selected_competition"
            >Normaalikilpailu</v-tab
          >
          <v-tab
            v-if="isTeamCompetition"
            href="#team-competition"
            :disabled="!selected_competition"
            >Tiimikilpailu</v-tab
          >
          <v-tab v-else href="#team-competition" disabled
            >Ei Tiimikilpailua</v-tab
          >
          <v-tab href="#biggest-fishes" :disabled="!selected_competition"
            >Suurimmat Kalat</v-tab
          >
          <v-tab href="#biggest-fish-amounts" :disabled="!selected_competition"
            >Suurimmat Kalasaaliit</v-tab
          >
        </v-tabs>

        <v-tabs-items
          v-model="tab"
          style="background: rgba(0,0,0,0.4);"
          v-if="!loading && selected_competition"
        >
          <!-- Tilastoja -->
          <v-tab-item class="inputarea" :value="'stats'">
            <!-- Save as pdf button, is disabled if there are no results -->
            <v-row style="padding-top:50px">
              <v-col md="3" offset-md="8">
                <v-btn
                  large
                  tile
                  color="green darken-4"
                  class="white--text"
                  @click="saveStatsAsPDF(`Tilastoja`)"
                  :disabled="!biggest_amounts_results.length"
                  style="margin-bottom:20px"
                  ><i class="material-icons left">picture_as_pdf</i>Lataa
                  pdf</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-row>
                <v-col md="12">
                  <div
                    class="chart-container"
                    style="position: relative;height:100%,width:100%;"
                  >
                    <canvas id="fishesChart"></canvas>
                  </div>
                </v-col>
                <v-col md="12">
                  <div
                    class="chart-container"
                    style="position: relative;height:100%,width:100%;"
                  >
                    <canvas id="signeesChart"></canvas>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col style="margin-top:50px">
                  <v-divider class="black"></v-divider>
                </v-col>
              </v-row>
            </v-row>
            <v-row v-if="competition">
              <v-col md="8" offset-md="2">
                <v-row>
                  <v-col>
                    <h3>Kalalajien määritykset</h3>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="scroll_table">
                    <table
                      id="fish-weights-table"
                      class="striped highlight centered responsive-table"
                    >
                      <thead>
                        <tr>
                          <th>Kalalaji</th>
                          <th>Pistekerroin</th>
                          <th>Alamitta</th>
                          <th>Punnittu</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(fish, index) in calculated_fish_weights"
                          :key="index"
                        >
                          <th style="border:1px solid black;" scope="row">
                            {{ fish.name }}
                          </th>
                          <td style="border:1px solid black;">
                            x {{ fish.multiplier }}
                          </td>
                          <td style="border:1px solid black;">
                            {{ fish.minsize }} cm
                          </td>
                          <td style="border:1px solid black;">
                            {{
                              fish.weights
                                ? Math.round(
                                    (fish.weights / 1000 + Number.EPSILON) * 100
                                  ) / 100
                                : 0
                            }}
                            kg
                          </td>
                        </tr>
                        <tr>
                          <th scope="row"></th>
                          <th></th>
                          <th style="border:1px solid black;">
                            Saalista yhteensä
                          </th>
                          <td style="border:1px solid black;">
                            <b
                              >{{
                                Math.round(
                                  (calculated_total_weights / 1000 +
                                    Number.EPSILON) *
                                    100
                                ) / 100
                              }}
                              kg</b
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <h3>Yleisiä tilastoja</h3>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <table
                      id="misc-table"
                      class="striped centered responsive-table highlight col s8 push-s2"
                    >
                      <tr>
                        <th
                          style="border:1px solid black;"
                          class="center-align"
                        >
                          <b>Cup pistekerroin</b>
                        </th>
                        <td
                          style="border:1px solid black;"
                          class="center-align"
                        >
                          <b>x {{ competition.cup_points_multiplier }}</b>
                        </td>
                      </tr>
                      <tr>
                        <th
                          style="border:1px solid black;"
                          class="center-align"
                        >
                          <b>Ilmoittautuneita yhteensä</b>
                        </th>
                        <td
                          style="border:1px solid black;"
                          class="center-align"
                        >
                          <b>{{ signees.length }}</b> venettä
                        </td>
                      </tr>
                      <tr>
                        <th
                          style="border:1px solid black;"
                          class="center-align"
                        >
                          <b>Saalista saaneita</b>
                        </th>
                        <td
                          style="border:1px solid black;"
                          class="center-align"
                          v-if="$store.getters.getPointSignees.length"
                        >
                          <b
                            >{{
                              Math.round(
                                ($store.getters.getPointSignees.length /
                                  competition.signees.length) *
                                  100 *
                                  100
                              ) / 100
                            }}% ({{ $store.getters.getPointSignees.length }} /
                            {{ signees.length }})</b
                          >
                        </td>
                        <td
                          style="border:1px solid black;"
                          class="center-align"
                          v-else
                        >
                          <b>0% (0/0)</b>
                        </td>
                      </tr>
                    </table>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-tab-item>

          <!-- Normaalikilpailu -->
          <v-tab-item class="inputarea" :value="'normal-competition'">
            <v-row>
              <v-col
                md="10"
                offset-md="1"
                style="padding-top:50px;padding-bottom:20px"
              >
                <v-row>
                  <v-col md="4" offset-md="4">
                    <v-select
                      label="Valitse näytettävät tulokset"
                      outlined
                      :items="normal_options"
                      @input="switchNormalResults"
                      v-model="selected_normal"
                    />
                  </v-col>
                  <v-col v-if="normal_points.length" md="3" offset-md="1">
                    <v-btn
                      large
                      tile
                      color="green darken-4"
                      class="white--text"
                      @click="
                        saveAsPDF(
                          `Normaalikilpailun tulokset (${selected_normal})`,
                          '#normal-table'
                        )
                      "
                    >
                      <i class="material-icons left">picture_as_pdf</i>Lataa pdf
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row class="row" v-if="normal_points.length">
                  <v-col class="scroll_table">
                    <!--TODO Possibly change tables to https://vuetifyjs.com/en/components/data-tables/#data-tables ? or implement on vue-->
                    <table
                      id="normal-table"
                      class="highlight centered responsive-table tablearea table_header scroll_table"
                    >
                      <caption
                        v-if="normal_points.length"
                        class="center-align flow-text"
                      >
                        Normaalikilpailu ({{
                          selected_normal
                        }})
                      </caption>
                      <thead>
                        <tr>
                          <th
                            v-for="(header, index) in normal_headers"
                            :key="index"
                          >
                            {{ header }}
                          </th>
                        </tr>
                      </thead>
                      <tbody v-if="selected_normal == 'Pisteet'">
                        <tr
                          v-for="(signee, index) in normal_points"
                          :key="index"
                        >
                          <th
                            class="center-align"
                            style="border:1px solid black"
                          >
                            {{ signee.placement }}.
                          </th>
                          <td style="border:1px solid black">
                            ({{ signee.boat_number }})
                          </td>
                          <td style="border:1px solid black">
                            {{ signee.captain_name }}
                          </td>
                          <td style="border:1px solid black">
                            {{ signee.temp_captain_name }}
                          </td>
                          <td style="border:1px solid black">
                            {{ signee.locality }}
                          </td>
                          <td style="border:1px solid black">
                            {{ signee.total_points.toLocaleString() }} p
                          </td>
                          <td style="border:1px solid black">
                            {{ signee.cup_placement_points }}
                          </td>
                          <td style="border:1px solid black">
                            {{ signee.cup_participation_points }}
                          </td>
                          <td style="border:1px solid black">
                            {{ signee.cup_points_total }}
                          </td>
                        </tr>
                      </tbody>
                      <tbody v-else>
                        <tr
                          v-for="(signee, index) in normal_weights"
                          :key="index"
                        >
                          <th
                            class="center-align"
                            style="border:1px solid black"
                          >
                            {{ signee.placement }}.
                          </th>
                          <td style="border:1px solid black">
                            ({{ signee.boat_number }})
                          </td>
                          <td style="border:1px solid black">
                            {{ signee.captain_name }}
                          </td>
                          <td
                            v-for="(name, index) in table_fish_names"
                            :key="index"
                            style="border:1px solid black"
                          >
                            {{ signee[name].toLocaleString() }} g
                          </td>
                          <td style="border:1px solid black">
                            {{ signee.total_points.toLocaleString() }} p
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </v-col>
                </v-row>
                <v-row v-else>
                  <v-col v-if="!loading">
                    <p class="flow-text">Ei tuloksia, vielä...</p>
                  </v-col>
                  <v-col v-else>
                    <h2>Päivitetään tuloksia tietokannasta...</h2>
                    <ProgressBarQuery />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-tab-item>

          <!-- Tiimikilpailu -->
          <v-tab-item
            class="inputarea"
            :value="'team-competition'"
            v-if="isTeamCompetition"
          >
            <v-row v-if="team_results.length">
              <v-col style="padding-top:50px;" md="3" offset-md="8">
                <v-btn
                  large
                  tile
                  color="green darken-4"
                  class="white--text"
                  @click="saveAsPDF(`Tiimikilpailun tulokset`, '#team-table')"
                >
                  <i class="material-icons left">picture_as_pdf</i>Lataa pdf
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                md="10"
                offset-md="1"
                style="padding-bottom:20px"
                v-if="team_results.length"
                class="scroll_table"
              >
                <table
                  id="team-table"
                  class="highlight centered responsive-table tablearea"
                >
                  <caption
                    v-if="team_results.length"
                    class="center-align flow-text"
                  >
                    Tiimikilpailu
                  </caption>
                  <thead style="background: rgb(0, 1, 34);color:#fff;">
                    <tr>
                      <th>Sijoitus</th>
                      <th>Tiimi</th>
                      <th>Jäsen 1</th>
                      <th>Jäsen 2</th>
                      <th>Jäsen 3</th>
                      <th>Pisteet</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(team, index) in team_results" :key="index">
                      <th class="center-align" style="border:1px solid black">
                        {{ index + 1 }}.
                      </th>
                      <td style="border:1px solid black">{{ team.name }}</td>
                      <td style="border:1px solid black">
                        {{ team.captain_name_1 }}
                      </td>
                      <td style="border:1px solid black">
                        {{ team.captain_name_2 }}
                      </td>
                      <td style="border:1px solid black">
                        {{ team.captain_name_3 }}
                      </td>
                      <td style="border:1px solid black">
                        {{ team.points.toLocaleString() }} p
                      </td>
                    </tr>
                  </tbody>
                </table>
              </v-col>
              <v-col v-else>
                <v-col v-if="!loading"> </v-col>
                <p v-if="!loading" class="flow-text">Ei tuloksia, vielä...</p>
                <v-col v-else>
                  <h2>Päivitetään tuloksia tietokannasta...</h2>
                  <ProgressBarQuery />
                </v-col>
              </v-col>
            </v-row>
          </v-tab-item>

          <!-- Suurimmat kalat -->
          <v-tab-item class="inputarea" :value="'biggest-fishes'">
            <v-row style="padding-top:50px">
              <v-col md="3" offset-md="4">
                <v-select
                  label="Valitse näytettävät tulokset"
                  outlined
                  @input="calculateBiggestFishes"
                  v-model="selected_biggest_fish"
                  :items="fish_names"
                />
              </v-col>
              <v-col md="3" offset-md="1" v-if="biggest_fishes_results.length">
                <v-btn
                  large
                  tile
                  color="green darken-4"
                  class="white--text"
                  @click="
                    saveAsPDF(
                      `Suurimmat kalat (${selected_biggest_fish})`,
                      '#biggest-fishes-table'
                    )
                  "
                >
                  <i class="material-icons left">picture_as_pdf</i>Lataa pdf
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-if="biggest_fishes_results.length">
              <v-col class="scroll_table" md="10" offset-md="1">
                <table
                  id="biggest-fishes-table"
                  class="highlight centered responsive-table tablearea"
                  style="margin-bottom:40px"
                >
                  <caption
                    v-if="results_found_fishes"
                    class="center-align flow-text"
                  >
                    Suurimmat kalat ({{
                      selected_biggest_fish
                    }}
                    {{
                      results_found_fishes
                    }})
                  </caption>
                  <caption v-else class="center-align flow-text">
                    Suurimmat kalat ({{
                      selected_biggest_fish
                    }})
                  </caption>
                  <thead style="background: rgb(0, 1, 34);color:#fff;">
                    <tr>
                      <th v-if="selected_biggest_fish == 'Voittajat'">
                        Kalalaji
                      </th>
                      <th v-else>Sijoitus</th>
                      <th>Veneen nro</th>
                      <th>Kapteeni</th>
                      <th>Paino</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(fish, index) in biggest_fishes_results"
                      :key="index"
                    >
                      <th
                        v-if="selected_biggest_fish == 'Voittajat'"
                        class="center-align"
                        style="border:1px solid black"
                      >
                        {{ fish.name }}
                      </th>
                      <th
                        v-else
                        class="center-align"
                        style="border:1px solid black"
                      >
                        {{ index + 1 }}.
                      </th>
                      <td style="border:1px solid black">
                        ({{ fish.boat_number }})
                      </td>
                      <td style="border:1px solid black">
                        {{ fish.captain_name }}
                      </td>
                      <td style="border:1px solid black">
                        {{ fish.weight }} g
                      </td>
                    </tr>
                  </tbody>
                </table>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col v-if="!loading">
                <p class="flow-text">Ei tuloksia, vielä...</p>
              </v-col>
              <v-col v-else>
                <h2>Päivitetään tuloksia tietokannasta...</h2>
                <ProgressBarQuery />
              </v-col>
            </v-row>
          </v-tab-item>

          <!-- Suurimmat kalasaaliit -->
          <v-tab-item class="inputarea" :value="'biggest-fish-amounts'">
            <v-row style="padding-top:50px">
              <v-col md="3" offset-md="4">
                <v-select
                  label="Valitse näytettävät tulokset"
                  outlined
                  @input="calculateBiggestAmounts"
                  v-model="selected_biggest_amount"
                  :items="fish_amount_names"
                />
              </v-col>
              <v-col md="3" offset-md="1" v-if="biggest_amounts_results.length">
                <v-btn
                  large
                  tile
                  color="green darken-4"
                  class="white--text"
                  @click="
                    saveAsPDF(
                      `Suurimmat kalat (${selected_biggest_amount})`,
                      '#biggest-amounts-table'
                    )
                  "
                  :disabled="!biggest_amounts_results.length"
                >
                  <i class="material-icons left">picture_as_pdf</i>Lataa pdf
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-if="biggest_amounts_results.length">
              <v-col class="scroll_table" md="10" offset-md="1">
                <table
                  id="biggest-amounts-table"
                  class="highlight centered responsive-table tablearea"
                  style="margin-bottom:40px"
                >
                  <caption
                    v-if="results_found_amounts"
                    class="center-align flow-text"
                  >
                    Suurimmat kalasaaliit ({{
                      selected_biggest_amount
                    }}
                    {{
                      results_found_amounts
                    }})
                  </caption>
                  <caption v-else class="center-align flow-text">
                    Suurimmat kalasaaliit ({{
                      selected_biggest_amount
                    }})
                  </caption>
                  <thead style="background: rgb(0, 1, 34);color:#fff;">
                    <tr>
                      <th v-if="selected_biggest_amount == 'Voittajat'">
                        Kalalaji
                      </th>
                      <th v-else>Sijoitus</th>
                      <th>Veneen nro</th>
                      <th>Kapteeni</th>
                      <th v-if="selected_biggest_amount == 'Pisteet'">
                        Kalalaji
                      </th>
                      <th v-if="selected_biggest_amount == 'Pisteet'">
                        Paino
                      </th>
                      <th v-if="selected_biggest_amount == 'Pisteet'">
                        Pisteet
                      </th>
                      <th v-else>Paino</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(result, index) in biggest_amounts_results"
                      :key="index"
                    >
                      <th
                        v-if="selected_biggest_amount == 'Voittajat'"
                        class="center-align"
                        style="border:1px solid black"
                      >
                        {{ result.name }}
                      </th>
                      <th
                        v-else
                        class="center-align"
                        style="border:1px solid black"
                      >
                        {{ index + 1 }}.
                      </th>
                      <td style="border:1px solid black">
                        ({{ result.boat_number }})
                      </td>
                      <td style="border:1px solid black">
                        {{ result.captain_name }}
                      </td>
                      <td
                        v-if="selected_biggest_amount == 'Pisteet'"
                        style="border:1px solid black"
                      >
                        {{ result.fish_name }}
                      </td>
                      <td style="border:1px solid black">
                        {{ result.weight }} g
                      </td>
                      <td
                        v-if="selected_biggest_amount == 'Pisteet'"
                        style="border:1px solid black"
                      >
                        {{ result.points }} p
                      </td>
                    </tr>
                  </tbody>
                </table>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col v-if="!loading" md="8" offset-md="2">
                <p class="flow-text">Ei tuloksia, vielä...</p>
              </v-col>
              <v-col v-else md="8" offset-md="2">
                <h2>Päivitetään tuloksia tietokannasta...</h2>
                <ProgressBarQuery />
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
        <v-row v-else>
          <v-col v-if="!loading">
            <h2>Kilpailua ei valittuna</h2>
          </v-col>
        </v-row>
        <div v-if="competition">
          <v-row v-if="!loading">
            <v-col>
              <v-btn
                id="updatebtn"
                large
                tile
                :loading="loading"
                color="blue darken-4"
                @click="refreshCompetition(true)"
                class="white--text"
              >
                <i class="material-icons left">update</i>Päivitä tulokset
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col>
              <h2>Päivitetään tuloksia tietokannasta...</h2>
              <ProgressBarQuery />
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
"use strict";
import MainHeader from "../components/layout/MainHeader";
import M from "materialize-css";
import moment from "moment";
import CompetitionService from "../CompetitionService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import Chart from "chart.js";
import "chartjs-plugin-labels";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  name: "PublicResults",
  components: {
    MainHeader,
    ProgressBarQuery,
  },
  data() {
    return {
      competitions: [],
      competition: null,
      selected_competition: null,
      loading: false,
      tab: null,
      signees: [],
      fish_names: [],
      fish_amount_names: [],
      table_fish_names: [],
      results: [],
      normal_points: [],
      normal_weights: [],
      team_results: [],
      biggest_fishes: {},
      biggest_fishes_results: [],
      selected_biggest_fish: null,
      biggest_amounts: {},
      biggest_amounts_results: [],
      selected_biggest_amount: null,
      results_found_fishes: "",
      results_found_amounts: "",
      isTeamCompetition: true,
      calculated_total_weights: null,
      calculated_fish_weights: null,
      selected_normal: null,
      fishes_chart: null,
      signees_chart: null,
      normal_options: ["Pisteet", "Kalat"],
      normal_headers: [
        "Sijoitus",
        "Nro.",
        "Kapteeni",
        "Varakapteeni",
        "Paikkakunta",
        "Tulos",
        "Cup sij. pisteet",
        "Cup osal. pisteet",
        "Yht.",
      ],
    };
  },
  async mounted() {
    //Init materialize elements
    M.AutoInit();
    /* eslint-disable no-unused-vars */

    try {
      this.loading = true;
      // Query competition with id
      //TODO move the filtering of public competitions to Competitionservice.js and competitions.js
      // this.competitions = await CompetitionService.getPublicCompetitions();
      this.competitions = await CompetitionService.getAllCompetitions();
      if (this.competitions.length) {
        this.competitions = this.competitions.filter((competition) => {
          return competition.isPublic;
        });
        this.competitions.forEach((competition) => {
          competition.start_date = moment(competition.start_date);
          competition.end_date = moment(competition.end_date);
          competition.select = `${
            competition.name
          }, ${competition.start_date.year()}  (${competition.cup_name})`;
        });
        // Sort them based on start_date so the oldest competitions are the last
        this.competitions.sort(function compare(a, b) {
          return moment(b.start_date).isAfter(moment(a.start_date));
        });
        // Update to vuex, Assing variables and arrays from vuex (see client/store/index.js)
        this.$store.commit("refreshCompetition", this.competition);
        this.refreshCompetition(false);
      } else {
        this.signees = [];
        this.biggest_fishes = [];
        this.biggest_amounts = [];
      }
    } catch (error) {
      console.error(error.message);
    }
    this.loading = false;
    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
  },
  methods: {
    // Fetch competition from database, and update all the arrays
    async refreshCompetition(reload) {
      if (this.competition) {
        this.loading = true;
        // Load from database
        if (reload) {
          //Get competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
          let competitions = await CompetitionService.getCompetition(
            this.competition._id
          );
          this.loading = false;
          // IF competition found from database
          if (competitions.length) {
            // Returns an array, get first result (there shouldn't be more than one in any case, since id's are unique)
            //TODO make a test for this?
            this.competition = competitions[0];
            this.$store.commit("refreshCompetition", competitions[0]);
          }
        }
        // Else update and calculate from picked competition
        this.fish_names = []; // Fish names, including "Voittajat"
        this.fish_amount_names = [];
        this.table_fish_names = []; // only fish names
        try {
          this.isTeamCompetition = this.$store.getters.isTeamCompetition;
          this.signees = this.$store.getters.getResultSignees;
          this.normal_points = this.competition.normal_points;
          this.normal_weights = this.competition.normal_weights;
          if (this.isTeamCompetition) {
            this.team_results = this.competition.team_results;
          }
          this.biggest_fishes = this.$store.getters.getBiggestFishes;
          this.biggest_amounts = this.$store.getters.getBiggestAmounts;
          this.calculated_total_weights = this.$store.getters.getCompetitionTotalWeights;
          this.calculated_fish_weights = this.competition.fishes;
          this.selected_normal = "Pisteet";
          let temp_fish_names = this.$store.getters.getCompetitionFishes;
          this.fish_names.push("Voittajat");
          this.fish_amount_names.push("Voittajat");
          this.fish_amount_names.push("Pisteet");
          temp_fish_names.forEach((fish) => {
            this.fish_names.push(fish.name);
            this.fish_amount_names.push(fish.name);
            this.table_fish_names.push(fish.name);
          });
          // TODO update all the results with some time interval from database
          this.calculateAll();
          if (this.fishes_chart && this.signees_chart) {
            this.fishes_chart.destroy();
            this.signees_chart.destroy();
          }
          this.$nextTick(() => this.drawCharts());
          if (reload) {
            M.toast({ html: "Tiedot ajantasalla!" });
            this.tab = "stats";
          }
        } catch (err) {
          console.error(err);
        }

        this.loading = false;
      }
    },
    pickCompetition: function() {
      this.$store.commit("refreshCompetition", this.selected_competition);
      this.competition = this.selected_competition;
      this.refreshCompetition(false);
    },
    // Parse data, define charts, draw them
    drawCharts: function() {
      let temp_weights = [];
      let colors = [];

      // Get fish weights, and color from array for fishesChart
      this.calculated_fish_weights.forEach((fish) => {
        temp_weights.push(fish.weights);
        colors.push(fish.color);
      });

      // Get data for signeesChart (total signees, and signees who have more than 0 points)
      let signee_data = [];
      let point_signees = this.$store.getters.getPointSignees.length;
      let no_points_signees = this.signees.length - point_signees;
      signee_data.push(point_signees);
      signee_data.push(no_points_signees);

      // Define fishesChart
      const fishes_chart_data = {
        type: "doughnut",
        data: {
          labels: this.table_fish_names, // Fish names
          datasets: [
            {
              label: "Paino (g)",
              backgroundColor: colors, // Colors
              data: temp_weights, // Weights
            },
          ],
        },
        options: {
          maintainAspectRatio: true,
          responsive: true,
          plugins: {
            labels: {
              // convert grams to kilograms and add "kg" to end of the label
              render: function(args) {
                return (
                  ((args.value / (1000 + Number.EPSILON)) * 100) / 100 + " kg"
                );
              },
              // Other options
              fontSize: 14,
              fontStyle: "bold",
              // draw text shadows under labels, default is false
              textShadow: true,
              position: "border",
              textmargin: 1,
              // text shadow intensity, default is 6
              shadowBlur: 1,
              // text shadow X offset, default is 3
              shadowOffsetX: 2,
              // text shadow Y offset, default is 3
              shadowOffsetY: 2,
              // text shadow color, default is 'rgba(0,0,0,0.3)'
              shadowColor: "rgba(0,0,0,1)",
              fontColor: "white",
              fontFamily: '"Lucida Console", Monaco, monospace',
            },
          },
          title: {
            display: true,
            text: "Kaloja saatu yhteensä",
            fontSize: 28,
          },
        },
      };

      // Define signeesChart
      const signee_chart_data = {
        type: "pie",
        data: {
          labels: ["Kyllä", "Ei saalista"],
          datasets: [
            {
              label: "Lukumäärä (kpl)",
              backgroundColor: ["#7fbf7f", "#ff7f7f"], // Green and red
              data: signee_data, // Data
            },
          ],
        },
        options: {
          maintainAspectRatio: true,
          responsive: true,
          plugins: {
            labels: {
              render: "percentage",
              fontSize: 26,
              fontStyle: "bold",
              fontColor: "#000",
              fontFamily: '"Lucida Console", Monaco, monospace',
              precision: 2,
            },
          },
          title: {
            display: true,
            text: "Saalista saaneita",
            fontSize: 28,
          },
        },
      };
      /* eslint-disable no-unused-vars */
      // Draw the charts to canvas
      if (document.getElementById("fishesChart")) {
        var fishes_ctx = document
          .getElementById("fishesChart")
          .getContext("2d");
        let fishes_chart = new Chart(fishes_ctx, fishes_chart_data);
        var signees_ctx = document
          .getElementById("signeesChart")
          .getContext("2d");
        let signees_chart = new Chart(signees_ctx, signee_chart_data);
        /* eslint-disable no-unused-vars */

        this.fishes_chart = fishes_chart;
        this.signees_chart = signees_chart;
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

    // "Wrapper" to calculate all the results at once
    async calculateAll() {
      this.calculateBiggestFishes();
      this.calculateBiggestAmounts();
    },

    // Switch table headers and columns based on this.selected_normal value (v-select)
    switchNormalResults: function() {
      // Prevent v-select having no value, would show error
      if (!this.selected_normal) {
        this.selected_normal = "Pisteet";
      }
      // If "Pisteet" selected in v-select, update headers and this.results (table data)
      if (this.selected_normal === "Pisteet") {
        this.normal_headers = [
          "Sijoitus",
          "Nro.",
          "Kapteeni",
          "Varakapteeni",
          "Paikkakunta",
          "Tulos",
          "Cup sij. pisteet",
          "Cup osal. pisteet",
          "Yht.",
        ];
      }
      // If "Kalat" selected in v-select, update headers and this.results (table data)
      else {
        this.normal_headers = ["Sijoitus", "Nro.", "Kapteeni"];
        // Get fish names and add them to headers
        this.table_fish_names.forEach((name) => {
          this.normal_headers.push(name);
        });
        this.normal_headers.push("Tulos");
      }
    },
    // Sorts the dictionary based on weights
    sortDict: function(fishes) {
      if (fishes) {
        let all_results = [];
        let temp_results = [];
        let placement = 1;
        this.fish_names.forEach((name) => {
          // If fish name is not "Voittajat"
          if (name !== "Voittajat") {
            // For every fish name, sort the array
            if (fishes[name]) {
              temp_results = fishes[name].sort(function compare(a, b) {
                return parseInt(b.weight) - parseInt(a.weight);
              });
              fishes[name] = temp_results.filter((result) => result.weight > 0);
              // Now it's sorted so first element is fine for "voittajat" table
              if (fishes[name].length) {
                all_results.push({
                  name: name,
                  boat_number: temp_results[0].boat_number,
                  captain_name: temp_results[0].captain_name,
                  weight: temp_results[0].weight.toLocaleString(),
                });
              }
            }
          }
        });

        return fishes, all_results;
      } else {
        return {}, [];
      }
    },
    // Calculate "Suurimmat Kalat"
    calculateBiggestFishes: function() {
      let fishes = this.biggest_fishes;
      this.results_found_fishes = null;

      // Check v-select value, don't allow it to go null because it shows error
      if (!this.selected_biggest_fish) {
        this.selected_biggest_fish = "Voittajat";
      }
      if (this.selected_biggest_fish === "Voittajat") {
        this.biggest_fishes,
          (this.biggest_fishes_results = this.sortDict(fishes));
      } else {
        // If v-select (this.selected_biggest_fish) not "Voittajat", get fish related results and sort them
        // based on the v-select fish name
        let fish_results = [];
        if (fishes[this.selected_biggest_fish]) {
          fish_results = fishes[this.selected_biggest_fish].sort(
            function compare(a, b) {
              return parseInt(b.weight) - parseInt(a.weight);
            }
          );
          this.results_found_amounts = "";
        } else {
          this.results_found_fishes = "- Ei tuloksia";
        }
        this.biggest_fishes_results = fish_results;
      }
    },
    // Calculate "Suurimmat kalasaaliit", works exactly like the calculateBiggestFishes
    //TODO make these 2 to one function
    calculateBiggestAmounts: function() {
      let fishes = this.biggest_amounts;
      this.results_found_amount = "";
      if (!this.selected_biggest_amount) {
        this.selected_biggest_amount = "Voittajat";
      }
      if (this.selected_biggest_amount === "Voittajat") {
        this.biggest_amounts,
          (this.biggest_amounts_results = this.sortDict(fishes));
      } else {
        let fish_results = [];
        fishes["Pisteet"] = [];
        // Generate Pisteet (Add all amounts together and sort)
        if (this.selected_biggest_amount === "Pisteet") {
          let competition_fishes = this.$store.getters.getCompetitionFishes;
          this.table_fish_names.forEach((name) => {
            if (fishes[name]) {
              fishes[name].forEach((signee) => {
                let points_multiplier = competition_fishes.find(
                  (fish) => fish.name === name
                ).multiplier;
                let result = {
                  boat_number: signee.boat_number,
                  captain_name: signee.captain_name,
                  fish_name: name,
                  weight: signee.weight,
                  points: signee.weight * points_multiplier,
                };
                fishes["Pisteet"].push(result);
              });
            }
          });
        }
        if (fishes[this.selected_biggest_amount]) {
          if (this.selected_biggest_amount === "Pisteet") {
            fish_results = fishes[this.selected_biggest_amount].sort(
              function compare(a, b) {
                return parseInt(b.points) - parseInt(a.points);
              }
            );

            fish_results = fish_results.filter(
              (result) => parseInt(result.points) > 0
            );
          } else {
            fish_results = fishes[this.selected_biggest_amount].sort(
              function compare(a, b) {
                return parseInt(b.weight) - parseInt(a.weight);
              }
            );
            fish_results = fish_results.filter(
              (result) => parseInt(result.weight) > 0
            );
          }

          this.results_found_amounts = "";
        } else {
          this.results_found_amount = "- Ei tuloksia";
        }

        this.biggest_amounts_results = fish_results;
      }
    },
    // For naming the pdf, replace certain characters
    replaceAll: function(string, search, replace) {
      return string.split(search).join(replace);
    },
    // Parses dictionary/json to array, for pdf autotables
    dictToArray: function(dict, type) {
      const temp_arr = Object.entries(dict);
      const arr = [];
      let placement = 1;
      temp_arr.forEach((element) => {
        let values = Object.values(element[1]);
        // Normaalikilpailu, pisteet
        if (type === 1) {
          values[0] = String(values[0]) + ".";
          values[1] = "(" + String(values[1]) + ")";
          values[5] = values[5].toLocaleString() + " p";
        }
        // Normaalikilpailu, kalat
        if (type === 2) {
          values[0] = String(values[0]) + ".";
          values[1] = "(" + String(values[1]) + ")";
          for (let i of range(3, values.length - 2)) {
            values[i] = values[i].toLocaleString() + " g";
          }
          values[values.length - 1] =
            values[values.length - 1].toLocaleString() + " p";
        }
        // Suurimmat kalat, suurimmat kalasaaliit
        if (type === 3) {
          let temp_bnumber = values[0];
          let temp_captain = values[1];
          let temp_points = values[2].toLocaleString() + " g";
          values[0] = String(placement) + ".";
          values[1] = "(" + String(temp_bnumber) + ")";
          values[2] = temp_captain;
          values[3] = temp_points;
        }
        //Voittajat
        if (type === 4) {
          values[1] = "(" + String(values[1]) + ")";
          values[3] = values[values.length - 1].toLocaleString() + " g";
        }
        //Tiimikilpailu
        if (type === 5) {
          values[0] = String(values[0]) + ".";
          values[values.length - 1] =
            values[values.length - 1].toLocaleString() + " p";
        }
        //Pisteet
        if (type === 6) {
          let temp_bnumber = values[0];
          let temp_captain = values[1];
          let temp_fish_name = values[2];
          let temp_weight = values[3];
          let temp_points = values[4];
          values[0] = String(placement) + ".";
          values[1] = "(" + String(temp_bnumber) + ")";
          values[2] = temp_captain;
          values[3] = temp_fish_name;
          values[4] = temp_weight.toLocaleString() + " g";
          values[5] = temp_points.toLocaleString() + " p";
        }
        placement++;
        arr.push(values);
      });
      return arr;
    },
    // Returns date in format dd/mm/yyyy as string
    formatDate: function(start_date) {
      start_date = moment(start_date);
      let formatted_date = `${start_date.date()}.${start_date.month() +
        1}.${start_date.year()}`;

      return formatted_date;
    },
    capitalize_words: function(str) {
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    },
    // Convert the charts and the tables to pdf
    saveAsPDF: function(competition_type, table_id) {
      // Format dates for easier reding
      let temp_start_date = this.formatDate(this.competition.start_date);
      let temp_end_date = this.formatDate(this.competition.end_date);

      // PDF creation
      let doc = new jsPDF();
      // Title
      const title = `${this.competition.name}`;
      const date =
        temp_start_date === temp_end_date
          ? String(temp_start_date)
          : `${temp_start_date} - ${temp_end_date}`;
      const time = `${date}, Klo. ${this.competition.start_time} - ${this.competition.end_time}`;
      doc.setFontSize(24);
      doc.text(10, 10, title, { align: "left" });
      doc.setFontSize(14);
      doc.text(10, 20, this.competition.cup_name, { align: "left" });
      doc.text(10, 30, time, { align: "left" });
      doc.line(0, 35, 400, 35);
      doc.setFontSize(20);

      // Table, based on given table_id, and table title based on competition_type
      doc.text(100, 50, competition_type, { align: "center" });
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
        startY: 55,
        margin: { top: 20 },
      });

      // Save the pdf
      doc.save(
        `${moment(this.competition.start_date).year()}_${this.replaceAll(
          this.competition.name,
          " ",
          ""
        )}_${this.replaceAll(
          this.capitalize_words(competition_type),
          " ",
          ""
        )}.pdf`
      );
    },
    saveStatsAsPDF: function(competition_type) {
      // Format dates for easier reding
      let temp_start_date = this.formatDate(this.competition.start_date);
      let temp_end_date = this.formatDate(this.competition.end_date);

      let doc = new jsPDF();

      // Title
      const title = `${this.competition.name}`;
      const date =
        temp_start_date === temp_end_date
          ? String(temp_start_date)
          : `${temp_start_date} - ${temp_end_date}`;
      const time = `${date}, Klo. ${this.competition.start_time} - ${this.competition.end_time}`;
      doc.setFontSize(24);
      doc.text(10, 10, title, { align: "left" });
      doc.setFontSize(14);
      doc.text(10, 20, this.competition.cup_name, { align: "left" });
      doc.text(10, 30, time, { align: "left" });
      doc.line(0, 35, 400, 35);
      doc.setFontSize(18);

      // "Tilastot"
      var fishesImg = document
        .getElementById("fishesChart")
        .toDataURL("image/png", 1.0);
      var signeeImg = document
        .getElementById("signeesChart")
        .toDataURL("image/png", 1.0);
      doc.addImage(fishesImg, "PNG", -30, 40, 180, 90);
      doc.addImage(signeeImg, "PNG", 70, 40, 180, 90);
      doc.text(100, 145, "Kalalajien määritykset", { align: "center" });
      // Table straight from html
      doc.autoTable({
        html: "#fish-weights-table",
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
        startY: 150,
        margin: { top: 20 },
      });

      doc.text(100, doc.autoTable.previous.finalY + 20, "Yleisiä tilastoja", {
        align: "center",
      });
      doc.autoTable({
        html: "#misc-table",
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
        margin: { top: 20 },
        startY: doc.autoTable.previous.finalY + 25,
      });

      // Save to pdf
      doc.save(
        `${moment(this.competition.start_date).year()}_${this.replaceAll(
          this.competition.name,
          " ",
          ""
        )}_${this.replaceAll(
          this.capitalize_words(competition_type),
          " ",
          ""
        )}.pdf`
      );
    },
    saveAllAsPDF: function() {
      let temp_selected_biggest_fish = this.selected_biggest_fish;
      let temp_selected_biggest_amount = this.selected_biggest_amount;
      let temp_selected_normal = this.selected_normal;
      // Format dates for easier reding
      let temp_start_date = this.formatDate(this.competition.start_date);
      let temp_end_date = this.formatDate(this.competition.end_date);
      let year = moment(this.competition.start_date).year();

      let doc = new jsPDF();

      // Title
      const title = `${this.competition.name}`;
      const date =
        temp_start_date === temp_end_date
          ? String(temp_start_date)
          : `${temp_start_date} - ${temp_end_date}`;
      const time = `${date}, Klo. ${this.competition.start_time} - ${this.competition.end_time}`;
      doc.setFontSize(24);
      doc.text(10, 10, title, { align: "left" });
      doc.setFontSize(14);
      doc.text(10, 20, this.competition.cup_name, { align: "left" });
      doc.text(10, 30, time, { align: "left" });
      doc.line(0, 35, 400, 35);
      doc.setFontSize(18);

      //Normaalikilpailu (Pisteet)

      // start_coord needed to keep track of y coordinates for tables (if there are no results -> no table drawn to pdf -> varying coordinates)
      let start_coord;

      // Other tables are generated in code so no need to wait for rendering to html
      let columns = [
        "Sijoitus",
        "Nro.",
        "Kapteeni",
        "Varakapteeni",
        "Paikkakunta",
        "Tulos",
        "Sij. pisteet",
        "Osal. pisteet",
        "Yht.",
      ];
      // Format dictionary/json to format that autotable understands (arrays in arrays);
      let rows = this.dictToArray(this.normal_points, 1);
      doc.text(100, 50, "Normaalikilpailun tulokset (Pisteet)", {
        align: "center",
      });
      // Table generated in code
      doc.autoTable({
        head: [columns],
        body: rows,
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
        startY: 55,
        margin: { top: 20 },
      });

      //Normaalikilpailu (Kalat)
      doc.addPage();

      columns = ["Sijoitus", "Nro.", "Kapteeni"];
      // Get fish names for columns
      this.table_fish_names.forEach((name) => {
        columns.push(name);
      });
      columns.push("Tulos");

      rows = this.dictToArray(this.normal_weights, 2);
      doc.text(100, 10, "Normaalikilpailun tulokset (Kalat)", {
        align: "center",
      });
      // Table generated in code
      doc.autoTable({
        head: [columns],
        body: rows,
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
        margin: { top: 20 },
        startY: 20,
      });

      // Tiimikilpailu, drawn to pdf if it exists
      if (this.isTeamCompetition) {
        doc.addPage();
        doc.setFontSize(24);
        doc.text(10, 10, title, { align: "left" });
        doc.setFontSize(14);
        doc.text(10, 20, this.competition.cup_name, { align: "left" });
        doc.text(10, 30, time, { align: "left" });
        doc.line(0, 35, 400, 35);
        doc.setFontSize(18);
        doc.text(100, 50, "Tiimikilpailun tulokset", { align: "center" });
        // Add results, if there are any
        if (this.team_results.length) {
          // Other tables are generated in code so no need to wait for rendering to html
          let columns = [
            "Sijoitus",
            "Tiimi",
            "Jäsen 1",
            "Jäsen 2",
            "Jäsen 3",
            "Pisteet",
          ];
          // Format dictionary/json to format that autotable understands (arrays in arrays);
          let rows = this.dictToArray(this.normal_points, 1);
          //TODO generate table in code instead of html, like the others
          doc.autoTable({
            head: [columns],
            body: rows,
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
            margin: { top: 20 },
            startY: 55,
          });
        }
      }

      doc.addPage();

      // Suurimmat Kalat  (Voittajat)
      // Select these for calculations
      this.selected_biggest_fish = this.selected_biggest_amount = "Voittajat";
      columns = ["Kalalaji", "Veneen nro", "Kapteeni", "Paino"];
      // Calculate data
      this.calculateBiggestFishes();
      this.calculateBiggestAmounts();
      // If there are any results, add title
      if (
        this.biggest_fishes_results.length ||
        this.biggest_amounts_results.length
      ) {
        doc.setFontSize(24);
        doc.text(10, 10, title, { align: "left" });
        doc.setFontSize(14);
        doc.text(10, 20, this.competition.cup_name, { align: "left" });
        doc.text(10, 30, time, { align: "left" });
        doc.line(0, 35, 400, 35);
        doc.setFontSize(18);
      }

      // If there are biggest fishes
      if (this.biggest_fishes_results.length) {
        rows = this.dictToArray(this.biggest_fishes_results, 4);
        doc.text(
          100,
          50,
          "Suurimmat kalat" + ` (${this.selected_biggest_fish})`,
          { align: "center" }
        );
        // Table generated in code
        doc.autoTable({
          head: [columns],
          body: rows,
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
          margin: { top: 20 },
          startY: 55,
        });
        // Keep track of y coordinate
        start_coord = doc.autoTable.previous.finalY + 25;
      } else {
        // If no biggest fishes, biggest amounts table starts from 50 instead
        start_coord = 50;
      }

      //Suurimmat kalasaaliit (Voittajat)
      // If there are any amounts --> if someone has gotten any fish
      if (this.biggest_amounts_results.length) {
        rows = this.dictToArray(this.biggest_amounts_results, 4);
        doc.text(
          100,
          start_coord,
          "Suurimmat kalasaaliit" + ` (${this.selected_biggest_fish})`,
          { align: "center" }
        );
        // Table generated in code
        doc.autoTable({
          head: [columns],
          body: rows,
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
          margin: { top: 20 },
          startY: start_coord + 5,
        });
      }

      this.selected_biggest_amount = "Pisteet";
      this.calculateBiggestAmounts();
      // If there are any amounts --> if someone has gotten any fish
      if (this.biggest_amounts_results.length) {
        doc.addPage();
        doc.setFontSize(24);
        doc.text(10, 10, title, { align: "left" });
        doc.setFontSize(14);
        doc.text(10, 20, this.competition.cup_name, { align: "left" });
        doc.text(10, 30, time, { align: "left" });
        doc.line(0, 35, 400, 35);
        doc.setFontSize(18);
        columns = [
          "Sijoitus",
          "Veneen nro",
          "Kapteeni",
          "Kalalaji",
          "Paino",
          "Pisteet",
        ];
        rows = this.dictToArray(this.biggest_amounts_results, 6);
        doc.text(
          100,
          50,
          "Suurimmat kalasaaliit" + ` (${this.selected_biggest_amount})`,
          { align: "center" }
        );
        // Table generated in code
        doc.autoTable({
          head: [columns],
          body: rows,
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
          margin: { top: 20 },
          startY: 55,
        });
      }
      // For each fish, generate tables for "Suurimmat Kalat (Kala)" and "Suurimmat Kalasaaliit (Kala)"
      this.table_fish_names.forEach((name) => {
        // Same process as above, but for every fish instead of only winners
        this.selected_biggest_fish = name;
        this.calculateBiggestFishes();
        start_coord = 10;

        if (
          this.biggest_amounts[name].length ||
          this.biggest_fishes_results.length
        ) {
          doc.addPage();
          doc.setFontSize(24);
          doc.text(10, 10, title, { align: "left" });
          doc.setFontSize(14);
          doc.text(10, 20, this.competition.cup_name, { align: "left" });
          doc.text(10, 30, time, { align: "left" });
          doc.line(0, 35, 400, 35);
          doc.setFontSize(18);
          start_coord = 50;
        }

        columns = ["Sijoitus", "Veneen nro", "Kapteeni", "Paino"];

        // Suurimmat kalat
        if (this.biggest_fishes_results.length) {
          rows = this.dictToArray(this.biggest_fishes_results, 3);
          doc.text(100, start_coord, "Suurimmat kalat" + ` (${name})`, {
            align: "center",
          });
          doc.autoTable({
            head: [columns],
            body: rows,
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
            margin: { top: 20 },
            startY: start_coord + 5,
          });
        }

        // Suurimmat kalasaaliit
        this.calculateBiggestAmounts();
        if (this.biggest_amounts[name].length) {
          if (!this.biggest_fishes_results.length) {
            start_coord = 50;
          } else {
            start_coord = doc.autoTable.previous.finalY + 20;
          }

          rows = this.dictToArray(this.biggest_amounts[name], 3);
          doc.text(100, start_coord, "Suurimmat kalasaaliit" + ` (${name})`, {
            align: "center",
          });

          doc.autoTable({
            head: [columns],
            body: rows,
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
            startY: start_coord + 5,
          });
        }
      });

      doc.addPage();
      doc.setFontSize(24);
      doc.text(10, 10, title, { align: "left" });
      doc.setFontSize(14);
      doc.text(10, 20, this.competition.cup_name, { align: "left" });
      doc.text(10, 30, time, { align: "left" });
      doc.line(0, 35, 400, 35);
      doc.setFontSize(18);
      // "Tilastot"
      var fishesImg = document
        .getElementById("fishesChart")
        .toDataURL("image/png", 1.0);
      var signeeImg = document
        .getElementById("signeesChart")
        .toDataURL("image/png", 1.0);
      doc.addImage(fishesImg, "PNG", -30, 40, 180, 90);
      doc.addImage(signeeImg, "PNG", 70, 40, 180, 90);
      doc.text(100, 165, "Kalalajien määritykset", { align: "center" });
      // Table generated straight from html
      doc.autoTable({
        html: "#fish-weights-table",
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
        startY: 170,
        margin: { top: 20 },
      });

      doc.text(100, doc.autoTable.previous.finalY + 20, "Yleisiä tilastoja", {
        align: "center",
      });
      // Table generated straight from html
      doc.autoTable({
        html: "#misc-table",
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
        margin: { top: 20 },
        startY: doc.autoTable.previous.finalY + 25,
      });

      // Reset variables
      this.selected_biggest_fish = temp_selected_biggest_fish;
      this.selected_biggest_amount = temp_selected_biggest_amount;
      this.selected_normal = temp_selected_normal;
      this.calculateBiggestFishes();
      this.calculateBiggestAmounts();
      // Save to pdf

      doc.save(
        `${year}_${this.replaceAll(
          this.competition.name,
          " ",
          ""
        )}_KaikkiTulokset.pdf`
      );
    },
  },
};

// Custom range function for for loop, with recursion which is more efficient
function* range(start, end) {
  yield start;
  if (start === end) return;
  yield* range(start + 1, end);
}
</script>
