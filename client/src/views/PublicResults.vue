<template>
  <!-- /public-results -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container
    style="margin-top:70px;margin-bottom:5px"
    v-bind:class="{
      'container-transparent': !$store.getters.getTheme,
      'container-transparent-dark': $store.getters.getTheme,
    }"
  >
    <MainHeader />
    <v-row>
      <v-col>
        <v-row>
          <v-col md="6" offset-md="3">
            <h1>Kilpailujen tuloksia</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="3" offset-md="8">
            <router-link to="/public-cups">
              <v-btn large rounded color="blue" class="white--text">
                <i class="material-icons left">emoji_events</i>Cuppien tuloksia
              </v-btn>
            </router-link>
          </v-col>
        </v-row>
        <v-row v-if="competitions.length" class="scroll_table">
          <v-col md="4" offset-md="4">
            <!-- TODO add v-autocompelete, but so that it popsup the keyboad on mobile only when pressing search button? -->
            <v-select
              :dark="$store.getters.getTheme"
              :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
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
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="3" offset-md="4" style="margin-bottom:20px">
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
          <v-col md="3" offset-md="1">
            <v-dialog v-model="dialog" scrollable max-width="300px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="green darken-4"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  large
                  class="white--text"
                  :loading="loading_competition"
                  :disabled="!biggest_amounts_results.length || !competition"
                >
                  <i class="material-icons left">picture_as_pdf</i>Lataa kaikki
                  tulokset
                </v-btn>
              </template>
              <v-card :dark="$store.getters.getTheme">
                <v-card-title>Valitse mitä lataus sisältää</v-card-title>
                <v-divider></v-divider>
                <v-card-text style="height: 300px;width:100%;">
                  <v-checkbox
                    v-model="selected_print"
                    label="Tilastoja"
                    :disabled="!biggest_amounts_results.length"
                    color="indigo darken-3"
                    value="stats"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="selected_print"
                    :disabled="!biggest_amounts_results.length"
                    label="Normaalikilpailun tulokset"
                    color="indigo darken-3"
                    value="normal"
                  ></v-checkbox>
                  <v-checkbox
                    v-if="isTeamCompetition"
                    :disabled="!team_results.length"
                    v-model="selected_print"
                    label="Tiimikilpailun tulokset"
                    color="indigo darken-3"
                    value="team"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="selected_print"
                    :disabled="!biggest_fishes_results.length"
                    label="Suurimmat yksittäiset kalat"
                    color="indigo darken-3"
                    value="biggest_fishes"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="selected_print"
                    :disabled="!biggest_amounts_results.length"
                    label="Suurimmat kalasaaliit"
                    color="indigo darken-3"
                    value="biggest_amounts"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="selected_print"
                    :disabled="
                      !biggest_amounts_results.length &&
                        !biggest_amounts_results.length
                    "
                    label="Suurimmat yksittäiset kalat / kalasaaliit (Voittajat)"
                    color="indigo darken-3"
                    value="biggest_winners"
                  ></v-checkbox>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-col>
                    <v-btn
                      outlined
                      color="red darken-4"
                      text
                      @click="dialog = false"
                      >Sulje</v-btn
                    >
                  </v-col>
                  <v-col>
                    <v-btn
                      outlined
                      color="green darken-4"
                      text
                      @click="choosePrints"
                      >Lataa</v-btn
                    >
                  </v-col>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
        <v-row v-if="loading">
          <v-col>
            <h2
              v-bind:class="{
                'white--text': $store.getters.getTheme,
              }"
            >
              Haetaan kilpailuja...
            </h2>
            <ProgressBarQuery />
          </v-col>
        </v-row>
        <!-- Tabs -->
        <v-tabs
          v-model="tab"
          background-color="blue lighten-2"
          color="blue darken-4"
          grow
          show-arrows
          next-icon="mdi-arrow-right-bold-box-outline"
          prev-icon="mdi-arrow-left-bold-box-outline"
          center-active
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
          <v-tab-item
            v-bind:class="{
              inputarea: !$store.getters.getTheme,
              'inputarea-dark': $store.getters.getTheme,
            }"
            :value="'stats'"
          >
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
            <v-row v-if="competition">
              <v-row
                style="min-height:400px;"
                v-if="competition.normal_points.length"
              >
                <v-col
                  md="6"
                  class="d-flex align-content-start"
                  style="margin-bottom:50px;"
                >
                  <div
                    class="chart-container"
                    style="position: relative; height:30vh; width:60vw"
                  >
                    <canvas id="fishesChart"></canvas>
                  </div>
                </v-col>
                <v-col md="6" class="d-flex align-content-start">
                  <div
                    class="chart-container"
                    style="position: relative; height:30vh; width:60vw"
                  >
                    <canvas id="signeesChart"></canvas>
                  </div>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col md="12">
                  <p
                    class="flow-text"
                    v-bind:class="{
                      'white--text': $store.getters.getTheme,
                    }"
                  >
                    Ei tuloksia, vielä...
                  </p>
                </v-col>
              </v-row>
            </v-row>
            <v-row v-if="competition">
              <v-col md="8" offset-md="2">
                <v-row>
                  <v-col>
                    <h3
                      v-bind:class="{
                        'white--text': $store.getters.getTheme,
                      }"
                    >
                      Kalalajien määritykset
                    </h3>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="scroll_table">
                    <table
                      id="fish-weights-table"
                      class="highlight centered responsive-table table_header"
                      v-bind:class="{
                        'white--text': $store.getters.getTheme,
                      }"
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
                    <h3
                      v-bind:class="{
                        'white--text': $store.getters.getTheme,
                      }"
                    >
                      Yleisiä tilastoja
                    </h3>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col md="10" offset-md="1">
                    <table
                      id="misc-table"
                      class="centered responsive-table highlight"
                      v-bind:class="{
                        'white--text': $store.getters.getTheme,
                      }"
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
          <v-tab-item
            v-bind:class="{
              inputarea: !$store.getters.getTheme,
              'inputarea-dark': $store.getters.getTheme,
            }"
            :value="'normal-competition'"
          >
            <v-row>
              <v-col
                md="10"
                offset-md="1"
                style="padding-top:50px;padding-bottom:20px"
              >
                <v-row>
                  <v-col md="4" offset-md="4">
                    <v-select
                      :dark="$store.getters.getTheme"
                      :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
                      label="Valitse näytettävät tulokset"
                      outlined
                      :items="normal_options"
                      @input="switchNormalResults"
                      v-model="selected_normal"
                    />
                  </v-col>
                  <v-col
                    v-if="
                      normal_points.length ||
                        (signees.length &&
                          selected_normal === 'Ilmoittautuneet')
                    "
                    md="3"
                    offset-md="1"
                  >
                    <v-btn
                      large
                      tile
                      color="green darken-4"
                      class="white--text"
                      :loading="loading_competition"
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
                <v-row
                  class="row"
                  v-if="
                    normal_points.length ||
                      (signees.length && selected_normal === 'Ilmoittautuneet')
                  "
                >
                  <v-col md="12">
                    <v-card :dark="$store.getters.getTheme">
                      <v-card-title>
                        <p class="flow-text">
                          Normaalikilpailu ({{ selected_normal }})
                        </p>
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
                        :headers="headers"
                        :items="results"
                        :search="search"
                      >
                        <template v-slot:[`item.placement`]="{ item }">
                          <v-chip
                            :outlined="$store.getters.getTheme"
                            :color="getColor(item.placement)"
                            >{{ item.placement }}.</v-chip
                          >
                        </template>
                        <template
                          v-if="selected_normal === 'Ilmoittautuneet'"
                          v-slot:[`item.boat_number`]="{ item }"
                        >
                          <v-chip>{{ item.boat_number }}</v-chip>
                        </template>
                        <template v-slot:[`item.total_points`]="{ item }">
                          <v-chip
                            >{{ item.total_points.toLocaleString() }} p</v-chip
                          >
                        </template>
                        <template v-slot:[`item.cup_points_total`]="{ item }">
                          <v-chip
                            :color="getColorPoints(item.cup_points_total)"
                            >{{ item.cup_points_total }}</v-chip
                          >
                        </template>
                      </v-data-table>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row v-else>
                  <v-col v-if="!loading">
                    <p
                      class="flow-text"
                      v-bind:class="{
                        'white--text': $store.getters.getTheme,
                      }"
                    >
                      Ei tuloksia, vielä...
                    </p>
                  </v-col>
                  <v-col v-else>
                    <h2
                      v-bind:class="{
                        'white--text': $store.getters.getTheme,
                      }"
                    >
                      Päivitetään tuloksia tietokannasta...
                    </h2>
                    <ProgressBarQuery />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-tab-item>

          <!-- Tiimikilpailu -->
          <v-tab-item
            v-bind:class="{
              inputarea: !$store.getters.getTheme,
              'inputarea-dark': $store.getters.getTheme,
            }"
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
                  :loading="loading_competition"
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
              >
                <v-card :dark="$store.getters.getTheme">
                  <v-card-title>
                    <p
                      class="flow-text"
                      v-bind:class="{
                        'white--text': $store.getters.getTheme,
                      }"
                    >
                      Tiimikilpailu
                    </p>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search_team"
                      append-icon="mdi-magnify"
                      label="Hae kilpailijaa"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-card-title>
                  <v-data-table
                    :headers="team_headers"
                    :items="team_results"
                    :search="search_team"
                  >
                    <template v-slot:[`item.placement`]="{ item }">
                      <v-chip
                        :outlined="$store.getters.getTheme"
                        :color="getColor(item.placement)"
                        >{{ item.placement }}.</v-chip
                      >
                    </template>
                    <template v-slot:[`item.points`]="{ item }">
                      <v-chip>{{ item.points.toLocaleString() }} p</v-chip>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
              <v-col v-else>
                <v-col v-if="!loading"> </v-col>
                <p
                  v-if="!loading"
                  class="flow-text"
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Ei tuloksia, vielä...
                </p>
                <v-col v-else>
                  <h2
                    v-bind:class="{
                      'white--text': $store.getters.getTheme,
                    }"
                  >
                    Päivitetään tuloksia tietokannasta...
                  </h2>
                  <ProgressBarQuery />
                </v-col>
              </v-col>
            </v-row>
          </v-tab-item>

          <!-- Suurimmat kalat -->
          <v-tab-item
            v-bind:class="{
              inputarea: !$store.getters.getTheme,
              'inputarea-dark': $store.getters.getTheme,
            }"
            :value="'biggest-fishes'"
          >
            <v-row style="padding-top:50px">
              <v-col md="3" offset-md="4">
                <v-select
                  :dark="$store.getters.getTheme"
                  :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
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
                  :loading="loading_competition"
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
              <v-col md="10" offset-md="1" style="margin-bottom:40px">
                <v-card :dark="$store.getters.getTheme">
                  <v-card-title>
                    <p v-if="results_found_fishes" class="flow-text">
                      Suurimmat kalat ({{ selected_biggest_fish }}
                      {{ results_found_fishes }})
                    </p>
                    <p v-else class="flow-text">
                      Suurimmat kalat ({{ selected_biggest_fish }})
                    </p>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search_fishes"
                      append-icon="mdi-magnify"
                      label="Hae kilpailijaa"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-card-title>
                  <v-data-table
                    :headers="biggest_fishes_headers"
                    :items="biggest_fishes_results"
                    :search="search_fishes"
                  >
                    <template v-slot:[`item.placement`]="{ item }">
                      <v-chip
                        :outlined="$store.getters.getTheme"
                        :color="getColor(item.placement)"
                        >{{ item.placement }}.</v-chip
                      >
                    </template>
                    <template v-slot:[`item.name`]="{ item }">
                      <v-chip>{{ item.name }}</v-chip>
                    </template>
                    <template v-slot:[`item.weight`]="{ item }">
                      <v-chip>{{ item.weight.toLocaleString() }} g</v-chip>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col v-if="!loading">
                <p
                  class="flow-text"
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Ei tuloksia, vielä...
                </p>
              </v-col>
              <v-col v-else>
                <h2
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Päivitetään tuloksia tietokannasta...
                </h2>
                <ProgressBarQuery />
              </v-col>
            </v-row>
          </v-tab-item>

          <!-- Suurimmat kalasaaliit -->
          <v-tab-item
            v-bind:class="{
              inputarea: !$store.getters.getTheme,
              'inputarea-dark': $store.getters.getTheme,
            }"
            :value="'biggest-fish-amounts'"
          >
            <v-row style="padding-top:50px">
              <v-col md="3" offset-md="4">
                <v-select
                  :dark="$store.getters.getTheme"
                  :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
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
                  :loading="loading_competition"
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
            <v-row v-if="biggest_amounts_results.length"
              >>
              <v-col>
                <p
                  v-if="results_found_amounts"
                  class="flow-text"
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Suurimmat kalasaaliit ({{ selected_biggest_amount }}
                  {{ results_found_amounts }})
                </p>
                <p
                  v-else
                  class="flow-text"
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Suurimmat kalasaaliit ({{ selected_biggest_amount }})
                </p>
              </v-col>
            </v-row>
            <v-row v-if="biggest_amounts_results.length">
              <v-col md="10" offset-md="1" style="margin-bottom:40px">
                <v-card :dark="$store.getters.getTheme">
                  <v-card-title>
                    <p v-if="results_found_amounts" class="flow-text">
                      Suurimmat kalasaaliit ({{ selected_biggest_amount }}
                      {{ results_found_amounts }})
                    </p>
                    <p v-else class="flow-text">
                      Suurimmat kalasaaliit ({{ selected_biggest_amount }})
                    </p>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search_amounts"
                      append-icon="mdi-magnify"
                      label="Hae kilpailijaa"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-card-title>
                  <v-data-table
                    :headers="biggest_amounts_headers"
                    :items="biggest_amounts_results"
                    :search="search_amounts"
                  >
                    <template v-slot:[`item.placement`]="{ item }">
                      <v-chip
                        :outlined="$store.getters.getTheme"
                        :color="getColor(item.placement)"
                        >{{ item.placement }}.</v-chip
                      >
                    </template>
                    <template v-slot:[`item.name`]="{ item }">
                      <v-chip>{{ item.name }}</v-chip>
                    </template>
                    <template v-slot:[`item.weight`]="{ item }">
                      <v-chip>{{ item.weight.toLocaleString() }} g</v-chip>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col v-if="!loading" md="8" offset-md="2">
                <p
                  class="flow-text"
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Ei tuloksia, vielä...
                </p>
              </v-col>
              <v-col v-else md="8" offset-md="2">
                <h2
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Päivitetään tuloksia tietokannasta...
                </h2>
                <ProgressBarQuery />
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
        <v-row v-else>
          <v-col v-if="!loading_competition && !loading">
            <h2
              v-bind:class="{
                'white--text': $store.getters.getTheme,
              }"
            >
              Kilpailua ei valittuna
            </h2>
          </v-col>
        </v-row>
        <div v-if="competition">
          <v-row v-if="!loading_competition">
            <v-col>
              <v-btn
                id="updatebtn"
                large
                tile
                :loading="loading_competition"
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
              <h2
                v-bind:class="{
                  'white--text': $store.getters.getTheme,
                }"
              >
                Päivitetään tuloksia tietokannasta...
              </h2>
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

export default {
  name: "PublicResults",
  components: {
    ProgressBarQuery,
    MainHeader,
  },
  data() {
    return {
      competitions: [],
      competition: null,
      selected_competition: null,
      loading: false,
      loading_competition: false,
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
      normal_options: ["Pisteet", "Kalat", "Ilmoittautuneet"],
      headers: [],
      biggest_fishes_headers: [],
      biggest_amounts_headers: [],
      normal_headers: [
        { text: "Sijoitus", value: "placement" },
        { text: "Kilp. numero", value: "boat_number" },
        { text: "Kippari", value: "captain_name" },
        { text: "Varakippari", value: "temp_captain_name" },
        { text: "Paikkakunta", value: "locality" },
        { text: "Tulos", value: "total_points" },
        { text: "Cup sij. pisteet", value: "cup_placement_points" },
        { text: "Cup osal. pisteet", value: "cup_participation_points" },
        { text: "Yht.", value: "cup_points_total" },
      ],
      signee_headers: [],
      team_headers: [
        { text: "Sijoitus", value: "placement" },
        { text: "Tiimi", value: "name" },
        { text: "Jäsen 1", value: "captain_name_1" },
        { text: "Jäsen 2", value: "captain_name_2" },
        { text: "Jäsen 3", value: "captain_name_3" },
        { text: "Pisteet", value: "points" },
      ],
      winner_headers: [
        { text: "Kalalaji", value: "name" },
        { text: "Kilp. numero", value: "boat_number" },
        { text: "Kippari", value: "captain_name" },
        { text: "Paino", value: "weight" },
      ],
      biggest_headers: [
        { text: "Sijoitus", value: "placement" },
        { text: "Kilp. numero", value: "boat_number" },
        { text: "Kippari", value: "captain_name" },
        { text: "Paino", value: "weight" },
      ],
      search: "",
      search_team: "",
      search_fishes: "",
      search_amounts: "",
      selected_print: [],
      dialog: false,
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
    getColor(placement) {
      if (placement > 30) return "red";
      if (placement > 20) return "orange";
      else if (placement > 5) return "yellow";
      else return "green";
    },
    getColorPoints(points) {
      if (points > 5) return "primary darken-2";
      else return "red";
    },
    // Close dialog, print all the chosen tables to pdf
    choosePrints: function() {
      // Close dialog
      this.dialog = false;
      // Move to printing
      this.saveAllAsPDF(this.tab);
    },
    // Fetch competition from database, and update all the arrays
    async refreshCompetition(reload) {
      if (this.competition) {
        this.loading_competition = true;
        // Load from database
        if (reload) {
          //Get competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
          let competitions = await CompetitionService.getCompetition(
            this.competition._id
          );
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
        this.selected_print = [];
        this.signee_headers = [
          { text: "Kilp. numero", value: "boat_number" },
          { text: "Kippari", value: "captain_name" },
          { text: "Varakippari", value: "temp_captain_name" },
          { text: "Paikkakunta", value: "locality" },
          { text: "Lähtöpaikka", value: "starting_place" },
        ];
        let placement = 1;
        try {
          this.isTeamCompetition = this.$store.getters.isTeamCompetition;
          this.signees = this.$store.getters.getResultSignees;
          this.normal_points = this.competition.normal_points;
          this.normal_weights = this.competition.normal_weights;
          if (this.isTeamCompetition) {
            this.signee_headers.push({ text: "Tiimi", value: "team" });
            this.team_results = this.competition.team_results;
            let last_points = -1;
            let last_placement = -1;
            this.team_results.forEach((team) => {
              if (last_points === team.points) {
                team.placement = last_placement;
              } else {
                team.placement = last_placement = placement;
                last_points = team.points;
              }
              placement++;
            });
          }
          this.biggest_fishes = this.$store.getters.getBiggestFishes;
          this.biggest_amounts = this.$store.getters.getBiggestAmounts;
          this.calculated_total_weights = this.$store.getters.getCompetitionTotalWeights;
          this.calculated_fish_weights = this.competition.fishes;
          this.selected_normal = "Pisteet";
          let temp_fish_names = this.$store.getters.getCompetitionFishes;
          this.fish_names.push("Voittajat");
          this.fish_amount_names.push("Voittajat");
          temp_fish_names.forEach((fish) => {
            this.fish_names.push(fish.name);
            this.fish_amount_names.push(fish.name);
            this.table_fish_names.push(fish.name);
          });
          this.calculateAll();

          if (this.fishes_chart && this.signees_chart) {
            this.fishes_chart.destroy();
            this.signees_chart.destroy();
          }
          this.$nextTick(() => this.drawCharts(this.tab));

          if (this.normal_points.length) {
            this.results = this.normal_points;
            this.headers = this.normal_headers;
          } else {
            this.results = this.$store.getters.getSignees;
            this.headers = this.signee_headers;
            this.selected_normal = "Ilmoittautuneet";
          }
          if (reload) {
            M.toast({ html: "Tiedot ajantasalla!" });
          }
        } catch (err) {
          console.error(err);
        }

        this.loading_competition = false;
      }
    },
    pickCompetition: function() {
      this.$store.commit("refreshCompetition", this.selected_competition);
      this.competition = this.selected_competition;
      this.refreshCompetition(false);
    },
    // Parse data, define charts, draw them
    drawCharts: function(tab) {
      let current_tab = tab;
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

              fontColor: "#000",
              fontFamily: '"Lucida Console", Monaco, monospace',
            },
          },
          title: {
            display: true,
            text: "Kaloja saatu yhteensä",
            fontSize: 28,
            fontColor: this.$store.getters.getTheme ? "white" : "black",
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
            fontColor: this.$store.getters.getTheme ? "white" : "black",
          },
        },
      };
      /* eslint-disable no-unused-vars */
      // Draw the charts to canvas
      let charts_drawn = true;
      try {
        var fishes_ctx = document
          .getElementById("fishesChart")
          .getContext("2d");
        var signees_ctx = document
          .getElementById("signeesChart")
          .getContext("2d");
      } catch (error) {
        this.tab = "stats";
        charts_drawn = false;
        if (this.competition.normal_points.length) {
          setTimeout(() => this.drawCharts(current_tab), 1000);
          M.toast({ html: "Piirretään kaaviot..." });
        } else {
          M.toast({
            html: "Ei tuloksia vielä, joten ei voida piirtää kaavioita...",
          });
        }
      }

      /* eslint-disable no-unused-vars */
      if (charts_drawn) {
        this.fishes_chart = new Chart(fishes_ctx, fishes_chart_data);
        this.signees_chart = new Chart(signees_ctx, signee_chart_data);
        this.tab = current_tab;
        M.toast({
          html: "Kaaviot piirretty!",
        });
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
        this.headers = this.normal_headers;
        this.results = this.normal_points;
      }
      // If "Kalat" selected in v-select, update headers and this.results (table data)
      if (this.selected_normal === "Kalat") {
        (this.headers = [
          { text: "Sijoitus", value: "placement" },
          { text: "Kilp. numero", value: "boat_number" },
          { text: "Kippari", value: "captain_name" },
        ]),
          (this.results = this.normal_weights);
        // Get fish names and add them to headers
        this.table_fish_names.forEach((name) => {
          this.headers.push({ text: name, value: name });
        });
        this.headers.push({ text: "Tulos", value: "total_points" });
      }
      if (this.selected_normal === "Ilmoittautuneet") {
        this.headers = this.signee_headers;
        this.results = this.$store.getters.getSignees;
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
      let placement = 1;
      this.results_found_fishes = null;

      // Check v-select value, don't allow it to go null because it shows error
      if (!this.selected_biggest_fish) {
        this.selected_biggest_fish = "Voittajat";
      }
      if (this.selected_biggest_fish === "Voittajat") {
        this.biggest_fishes_headers = this.winner_headers;
        this.biggest_fishes,
          (this.biggest_fishes_results = this.sortDict(fishes));
      } else {
        // If v-select (this.selected_biggest_fish) not "Voittajat", get fish related results and sort them
        // based on the v-select fish name
        let fish_results = [];
        this.biggest_fishes_headers = this.biggest_headers;
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
        let last_weight = -1;
        let last_placement = -1;
        this.biggest_fishes_results = fish_results;
        this.biggest_fishes_results.forEach((result) => {
          if (last_weight === result.weight) {
            result.placement = last_placement;
          } else {
            result.placement = last_placement = placement;
            last_weight = result.weight;
          }
          placement++;
        });
      }
    },
    // Calculate "Suurimmat kalasaaliit", works exactly like the calculateBiggestFishes
    //TODO make these 2 to one function
    calculateBiggestAmounts: function() {
      let fishes = this.biggest_amounts;
      let placement = 1;
      this.results_found_amount = "";
      if (!this.selected_biggest_amount) {
        this.selected_biggest_amount = "Voittajat";
      }
      if (this.selected_biggest_amount === "Voittajat") {
        this.biggest_amounts_headers = this.winner_headers;
        this.biggest_amounts,
          (this.biggest_amounts_results = this.sortDict(fishes));
      } else {
        this.biggest_amounts_headers = this.biggest_headers;
        let fish_results = [];
        if (fishes[this.selected_biggest_amount]) {
          fish_results = fishes[this.selected_biggest_amount].sort(
            function compare(a, b) {
              return parseInt(b.weight) - parseInt(a.weight);
            }
          );
          fish_results = fish_results.filter(
            (result) => parseInt(result.weight) > 0
          );
          this.results_found_amounts = "";
        } else {
          this.results_found_amount = "- Ei tuloksia";
        }
        let last_weight = -1;
        let last_placement = -1;
        this.biggest_amounts_results = fish_results;
        this.biggest_amounts_results.forEach((result) => {
          if (last_weight === result.weight) {
            result.placement = last_placement;
          } else {
            result.placement = last_placement = placement;
            last_weight = result.weight;
          }
          placement++;
        });
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
            if (parseInt(values[i]) > 0) {
              values[i] = values[i].toLocaleString() + " g";
            } else {
              values[i] = "-";
            }
          }
          values[values.length - 1] =
            values[values.length - 1].toLocaleString() + " p";
        }
        // Suurimmat kalat, suurimmat kalasaaliit
        if (type === 3) {
          let temp_placement = values[3];
          let temp_bnumber = values[0];
          let temp_captain = values[1];
          let temp_points = values[2].toLocaleString() + " g";
          values[0] = String(temp_placement) + ".";
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
          let place = values[5];
          let team = values[0];
          let captain_1 = values[1];
          let captain_2 = values[2];
          let captain_3 = values[3];
          let points = values[4];
          values[0] = String(place) + ".";
          values[1] = team;
          values[2] = captain_1;
          values[3] = captain_2;
          values[4] = captain_3;
          values[5] = points.toLocaleString() + " p";
        }
        //Normaalikilpailu, Ilmoittautuneet
        if (type === 6) {
          let b_number = values[1];
          let captain = values[3];
          let temp_captain = values[4];
          let startin_place = values[2];
          let locality = values[5];
          let team = values[6];
          values[0] = "(" + String(b_number) + ")";
          values[1] = captain;
          values[2] = temp_captain;
          values[3] = startin_place;
          values[4] = locality;
          values[5] = team;
        }
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
      let rows;
      let columns;
      let pdf_competition_type;
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

      if (table_id === "#normal-table") {
        pdf_competition_type = `Normaalikilpailu${this.selected_normal}`;
        // Other tables are generated in code so no need to wait for rendering to html
        if (this.selected_normal === "Pisteet") {
          columns = [
            "Sijoitus",
            "Nro.",
            "Kippari",
            "Varakippari",
            "Paikkakunta",
            "Tulos",
            "Sij. pisteet",
            "Osal. pisteet",
            "Yht.",
          ];
          // Format dictionary/json to format that autotable understands (arrays in arrays);
          rows = this.dictToArray(this.normal_points, 1);
        }
        if (this.selected_normal === "Kalat") {
          columns = ["Sijoitus", "Nro.", "Kippari"];
          // Get fish names for columns
          this.table_fish_names.forEach((name) => {
            columns.push(name);
          });
          columns.push("Tulos");
          // Format dictionary/json to format that autotable understands (arrays in arrays);
          rows = this.dictToArray(this.normal_weights, 2);
        }
        if (this.selected_normal === "Ilmoittautuneet") {
          columns = [
            "Kilp. numero",
            "Kippari",
            "Varakippari",
            "Paikkakunta",
            "Lähtöpaikka",
          ];
          if (this.isTeamCompetition) {
            columns.push("Tiimi");
          }
          // Format dictionary/json to format that autotable understands (arrays in arrays);
          rows = this.dictToArray(this.$store.getters.getSignees, 6);
        }
      }

      if (table_id === "#team-table") {
        pdf_competition_type = `Tiimikilpailu`;
        // Other tables are generated in code so no need to wait for rendering to html
        columns = [
          "Sijoitus",
          "Tiimi",
          "Jäsen 1",
          "Jäsen 2",
          "Jäsen 3",
          "Pisteet",
        ];
        // Format dictionary/json to format that autotable understands (arrays in arrays);
        rows = this.dictToArray(this.team_results, 5);
      }

      if (table_id === "#biggest-fishes-table") {
        pdf_competition_type = `SuurimmatKalat${this.selected_biggest_fish}`;

        if (this.selected_biggest_fish === "Voittajat") {
          columns = ["Kalalaji", "Veneen nro", "Kippari", "Paino"];
          rows = this.dictToArray(this.biggest_fishes_results, 4);
        } else {
          columns = ["Sijoitus", "Veneen nro", "Kippari", "Paino"];
          rows = this.dictToArray(this.biggest_fishes_results, 3);
        }
      }

      if (table_id === "#biggest-amounts-table") {
        pdf_competition_type = `SuurimmatSaaliit${this.selected_biggest_amount}`;

        if (this.selected_biggest_amount === "Voittajat") {
          columns = ["Kalalaji", "Veneen nro", "Kippari", "Paino"];
          rows = this.dictToArray(this.biggest_amounts_results, 4);
        } else {
          columns = ["Sijoitus", "Veneen nro", "Kippari", "Paino"];
          rows = this.dictToArray(this.biggest_amounts_results, 3);
        }
      }

      // Table, based on given table_id, and table title based on competition_type
      doc.text(100, 50, competition_type, { align: "center" });
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

      // Save the pdf
      doc.save(
        `${moment(this.competition.start_date).year()}_${this.replaceAll(
          this.competition.name,
          " ",
          ""
        )}_${pdf_competition_type}.pdf`
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
      // Resize charts to be better looking on a pdf
      this.fishes_chart.canvas.parentNode.style.height = "500px";
      this.fishes_chart.canvas.parentNode.style.width = "1000px";
      this.fishes_chart.resize();

      this.signees_chart.canvas.parentNode.style.height = "500px";
      this.signees_chart.canvas.parentNode.style.width = "1000px";
      this.signees_chart.resize();
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

      // Set charts to be responsive again
      this.fishes_chart.canvas.parentNode.style.height = "30vh";
      this.fishes_chart.canvas.parentNode.style.width = "60vw";
      this.fishes_chart.resize();
      this.signees_chart.canvas.parentNode.style.height = "30vh";
      this.signees_chart.canvas.parentNode.style.width = "60vw";
      this.signees_chart.resize();

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
    // Saves all the chosen tables to pdf
    saveAllAsPDF: function(tab) {
      let current_tab = tab;
      let charts_loaded = true;
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
      // start_coord needed to keep track of y coordinates for tables (if there are no results -> no table drawn to pdf -> varying coordinates)
      let start_coord;
      let rows;
      let columns;
      //Normaalikilpailu (Pisteet), saved to pdf if it's inclued in this.selected_print array
      if (this.selected_print.includes("normal")) {
        // Other tables are generated in code so no need to wait for rendering to html
        columns = [
          "Sijoitus",
          "Nro.",
          "Kippari",
          "Varakippari",
          "Paikkakunta",
          "Tulos",
          "Sij. pisteet",
          "Osal. pisteet",
          "Yht.",
        ];
        // Format dictionary/json to format that autotable understands (arrays in arrays);
        rows = this.dictToArray(this.normal_points, 1);
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
        columns = ["Sijoitus", "Nro.", "Kippari"];
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
      }

      // Tiimikilpailu, drawn to pdf if it exists and , if it's inclued in this.selected_print array
      if (this.isTeamCompetition && this.selected_print.includes("team")) {
        // If there is "Normaalikilpailun tulokset" selected also, start from new page
        if (this.selected_print.includes("normal")) {
          doc.addPage();
        }
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
          columns = [
            "Sijoitus",
            "Tiimi",
            "Jäsen 1",
            "Jäsen 2",
            "Jäsen 3",
            "Pisteet",
          ];
          // Format dictionary/json to format that autotable understands (arrays in arrays);
          rows = this.dictToArray(this.normal_points, 1);
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

      //"Suurimmat kalat" to pdf if it's inclued in this.selected_print array
      if (this.selected_print.includes("biggest_fishes")) {
        // If there is content before, start from new page
        if (
          this.selected_print.includes("normal") ||
          this.selected_print.includes("team")
        ) {
          doc.addPage();
        }
        let counter = 0;
        // For each fish, generate tables for "Suurimmat Kalat (Kala)" and "Suurimmat Kalasaaliit (Kala)"
        this.table_fish_names.forEach((name) => {
          // Same process as above, but for every fish instead of only winners
          this.selected_biggest_fish = name;
          this.calculateBiggestFishes();
          start_coord = 10;

          if (this.biggest_fishes_results.length) {
            // So it doesn't add unnecessary page on the first loop
            if (counter > 0) {
              doc.addPage();
            }
            doc.setFontSize(24);
            doc.text(10, 10, title, { align: "left" });
            doc.setFontSize(14);
            doc.text(10, 20, this.competition.cup_name, { align: "left" });
            doc.text(10, 30, time, { align: "left" });
            doc.line(0, 35, 400, 35);
            doc.setFontSize(18);
            start_coord = 50;

            columns = ["Sijoitus", "Veneen nro", "Kippari", "Paino"];
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
            counter++;
          }
        });
      }

      // Suurimmat kalasaaliit to pdf if it's inclued in this.selected_print array
      if (this.selected_print.includes("biggest_amounts")) {
        // If there is content before, start from new page
        if (
          this.selected_print.includes("normal") ||
          this.selected_print.includes("team") ||
          this.selected_print.includes("biggest_fishes")
        ) {
          doc.addPage();
        }
        let counter = 0;
        columns = ["Sijoitus", "Veneen nro", "Kippari", "Paino"];
        this.table_fish_names.forEach((name) => {
          this.selected_biggest_amount = name;
          this.calculateBiggestAmounts();
          start_coord = 10;

          if (this.biggest_amounts[name].length) {
            // So it doesn't add unnecessary page on the first loop
            if (counter > 0) {
              doc.addPage();
            }
            doc.setFontSize(24);
            doc.text(10, 10, title, { align: "left" });
            doc.setFontSize(14);
            doc.text(10, 20, this.competition.cup_name, { align: "left" });
            doc.text(10, 30, time, { align: "left" });
            doc.line(0, 35, 400, 35);
            doc.setFontSize(18);
            start_coord = 50;
            columns = ["Sijoitus", "Veneen nro", "Kippari", "Paino"];
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
            counter++;
          }
        });
      }

      // "Suurimmat Kalat (Voittajat) / Suurimmat kalasaaliit (Voittajat)"" to pdf if it's inclued in this.selected_print array
      if (this.selected_print.includes("biggest_winners")) {
        // If there is content before, start from new page
        if (
          this.selected_print.includes("normal") ||
          this.selected_print.includes("team") ||
          this.selected_print.includes("biggest_fishes") ||
          this.selected_print.includes("biggest_amounts")
        ) {
          doc.addPage();
        }
        // Suurimmat Kalat  (Voittajat)
        // Select these for calculations
        this.selected_biggest_fish = this.selected_biggest_amount = "Voittajat";
        columns = ["Kalalaji", "Veneen nro", "Kippari", "Paino"];
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
      }
      // "Tilastoja" to pdf if it's inclued in this.selected_print array
      if (this.selected_print.includes("stats")) {
        // If there is content before, start from new page
        if (
          this.selected_print.includes("normal") ||
          this.selected_print.includes("team") ||
          this.selected_print.includes("biggest_fishes") ||
          this.selected_print.includes("biggest_amounts") ||
          this.selected_print.includes("biggest_winners")
        ) {
          doc.addPage();
        }
        doc.setFontSize(24);
        doc.text(10, 10, title, { align: "left" });
        doc.setFontSize(14);
        doc.text(10, 20, this.competition.cup_name, { align: "left" });
        doc.text(10, 30, time, { align: "left" });
        doc.line(0, 35, 400, 35);
        doc.setFontSize(18);
        // "Tilastot"
        // Resize charts to be better looking on a pdf
        this.fishes_chart.canvas.parentNode.style.height = "500px";
        this.fishes_chart.canvas.parentNode.style.width = "1000px";
        this.fishes_chart.resize();

        this.signees_chart.canvas.parentNode.style.height = "500px";
        this.signees_chart.canvas.parentNode.style.width = "1000px";
        this.signees_chart.resize();
        var fishesImg = document
          .getElementById("fishesChart")
          .toDataURL("image/png", 1.0);
        var signeeImg = document
          .getElementById("signeesChart")
          .toDataURL("image/png", 1.0);
        try {
          doc.addImage(fishesImg, "PNG", -30, 40, 180, 90);
          doc.addImage(signeeImg, "PNG", 70, 40, 180, 90);
        } catch (err) {
          charts_loaded = false;
          this.tab = "stats";
          // Try again after 1 sec
          setTimeout(() => this.saveAllAsPDF(current_tab), 1000);
        }
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
        // Set charts to be responsive again
        this.fishes_chart.canvas.parentNode.style.height = "30vh";
        this.fishes_chart.canvas.parentNode.style.width = "60vw";
        this.fishes_chart.resize();
        this.signees_chart.canvas.parentNode.style.height = "30vh";
        this.signees_chart.canvas.parentNode.style.width = "60vw";
        this.signees_chart.resize();
      }

      // Reset variables
      this.selected_biggest_fish = temp_selected_biggest_fish;
      this.selected_biggest_amount = temp_selected_biggest_amount;
      this.selected_normal = temp_selected_normal;
      this.calculateBiggestFishes();
      this.calculateBiggestAmounts();

      // Save to pdf
      if (charts_loaded) {
        this.tab = current_tab;
        doc.save(
          `${year}_${this.replaceAll(
            this.competition.name,
            " ",
            ""
          )}Tulokset.pdf`
        );
      } else {
        M.toast({ html: "Kaaviot ei ruudulla, yritetään uudelleen..." });
      }
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
