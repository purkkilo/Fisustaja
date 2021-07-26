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
    <Header v-if="$store.state.logged_in" />
    <MainHeader v-else />
    <v-row>
      <v-col md="3" offset-md="8">
        <v-card
          class="mx-auto"
          max-width="400"
          tile
          :dark="$store.getters.getTheme"
        >
          <v-list dense>
            <p>Navigointi</p>
            <v-list-item-group v-model="selectedItem" color="primary">
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                @click="changePage(item.path)"
                :disabled="item.disabled"
              >
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-row>
          <v-col md="6" offset-md="3">
            <h1>Kilpailujen tuloksia</h1>
          </v-col>
        </v-row>
        <v-row v-if="competitions.length" class="scroll_table">
          <v-col md="6" offset-md="3">
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
            >
              <template v-slot:item="data">
                <v-list-item-icon>
                  <v-icon v-if="data.item.isFinished" color="green"
                    >mdi-trophy</v-icon
                  >
                  <v-icon v-else color="yellow">mdi-trophy</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    v-html="data.item.name + ', ' + data.item.locality"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    class="green--text"
                    v-html="
                      data.item.cup_name +
                        ' (' +
                        $moment(data.item.start_date).format('YYYY') +
                        ')'
                    "
                  ></v-list-item-subtitle>
                  <v-list-item-subtitle
                    class="blue--text"
                    v-html="$moment(data.item.start_date).format('DD.MM.YYYY')"
                  ></v-list-item-subtitle>
                  <v-list-item-subtitle v-if="!data.item.isFinished"
                    >Kesken!</v-list-item-subtitle
                  >
                </v-list-item-content>
              </template>
            </v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="3" offset-md="4" style="margin-bottom:20px">
            <v-btn
              large
              tile
              color="yellow"
              @click="cancelSelection"
              :disabled="!competition"
            >
              <i class="material-icons left">remove_circle</i>Peruuta valinta
            </v-btn>
          </v-col>
          <v-col md="3" offset-md="1">
            <v-dialog v-model="dialog" scrollable max-width="300px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  :dark="$store.getters.getTheme"
                  large
                  outlined
                  :loading="loading_competition"
                  :disabled="!biggest_amounts_results.length || !competition"
                >
                  <v-icon color="red">mdi-file-pdf-outline</v-icon> Lataa kaikki
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
                  outlined
                  :dark="$store.getters.getTheme"
                  :loading="loading_competition"
                  @click="saveStatsAsPDF(`Tilastoja`)"
                  :disabled="!biggest_amounts_results.length"
                  style="margin-bottom:20px"
                >
                  <v-icon color="red">mdi-file-pdf-outline</v-icon> Lataa
                  pdf</v-btn
                >
              </v-col>
            </v-row>
            <v-row v-if="competition">
              <v-col>
                <v-row
                  style="min-height:400px;"
                  v-if="competition.normal_points.length"
                >
                  <v-col
                    sm="12"
                    md="5"
                    offset-md="1"
                    style="margin-bottom:50px;"
                  >
                    <div v-if="fishes_chart_data">
                      <v-hover v-slot="{ hover }">
                        <v-card
                          :dark="$store.getters.getTheme"
                          :elevation="hover ? 20 : 5"
                          :class="{ 'on-hover': hover }"
                          style="padding:20px"
                        >
                          <v-card-title
                            ><h4 class="headline mb-1">
                              {{ fishes_chart_title }}
                            </h4></v-card-title
                          >
                          <doughnut-chart
                            :chart-data="fishes_chart_data"
                            chart-id="fishes_chart"
                            v-bind:title="fishes_chart_title"
                          />
                        </v-card>
                      </v-hover>
                    </div>
                  </v-col>
                  <v-col sm="12" md="5">
                    <div v-if="signee_chart_data">
                      <v-hover v-slot="{ hover }">
                        <v-card
                          :dark="$store.getters.getTheme"
                          :elevation="hover ? 20 : 5"
                          :class="{ 'on-hover': hover }"
                          style="padding:20px"
                        >
                          <v-card-title
                            ><h4 class="headline mb-1">
                              {{ signee_chart_title }}
                            </h4></v-card-title
                          >
                          <pie-chart
                            :chart-data="signee_chart_data"
                            chart-id="signee_chart"
                            v-bind:title="signee_chart_title"
                          />
                        </v-card>
                      </v-hover>
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
              </v-col>
            </v-row>
            <v-row v-if="competition">
              <v-col md="8" offset-md="2">
                <v-hover v-slot="{ hover }">
                  <v-card
                    :dark="$store.getters.getTheme"
                    :elevation="hover ? 20 : 5"
                    :class="{ 'on-hover': hover }"
                    style="padding:20px"
                  >
                    <v-row>
                      <v-col>
                        <v-card
                          :dark="$store.getters.getTheme"
                          elevation="20"
                          outlined
                        >
                          <v-card-title class="text-center"
                            ><p class="display-1">
                              Kalalajien määritykset
                            </p></v-card-title
                          >
                          <v-list outlined elevation="10">
                            <div
                              v-for="(fish, index) in calculated_fish_weights"
                              :key="index"
                            >
                              <v-list-item>
                                <v-list-item-title>{{
                                  fish.name
                                }}</v-list-item-title>
                                <v-divider vertical></v-divider>
                                <v-list-item-subtitle class="green-text">
                                  <b> x {{ fish.multiplier }}</b>
                                </v-list-item-subtitle>
                                <v-divider vertical></v-divider>
                                <v-list-item-subtitle class="blue-text">
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                      <span v-bind="attrs" v-on="on"
                                        ><b>{{ fish.minsize }} cm</b></span
                                      >
                                    </template>
                                    <span>{{ fish.minsize }}</span>
                                  </v-tooltip>
                                </v-list-item-subtitle>
                                <v-divider vertical></v-divider>
                                <v-list-item-subtitle class="green-text">
                                  {{
                                    fish.weights
                                      ? Math.round(
                                          (fish.weights / 1000 +
                                            Number.EPSILON) *
                                            100
                                        ) / 100
                                      : 0
                                  }}
                                  kg
                                </v-list-item-subtitle>
                              </v-list-item>
                              <v-divider></v-divider>
                            </div>
                            <v-list-item>
                              <v-list-item-title>
                                Saalista yhteensä
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                <h4 class="green-text">
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
                                </h4></v-list-item-subtitle
                              >
                            </v-list-item>
                          </v-list>
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-card
                          :dark="$store.getters.getTheme"
                          elevation="20"
                          outlined
                        >
                          <v-card-title class="text-center"
                            ><p class="display-1">
                              Yleisiä tilastoja
                            </p></v-card-title
                          >
                          <v-list outlined elevation="10">
                            <v-list-item>
                              <v-list-item-title
                                >Cup pistekerroin</v-list-item-title
                              >
                              <v-divider vertical></v-divider>
                              <v-list-item-subtitle class="green-text">
                                <b>x {{ competition.cup_points_multiplier }}</b>
                              </v-list-item-subtitle>
                            </v-list-item>
                            <v-divider></v-divider>
                            <v-list-item>
                              <v-list-item-title>
                                <b>Ilmoittautuneita yhteensä</b>
                              </v-list-item-title>
                              <v-divider vertical></v-divider>
                              <v-list-item-subtitle class="green-text">
                                <b>{{ signees.length }}</b> venettä
                              </v-list-item-subtitle>
                            </v-list-item>
                            <v-divider></v-divider>
                            <v-list-item>
                              <v-list-item-title>
                                <b>Saalista saaneita</b>
                              </v-list-item-title>
                              <v-divider vertical></v-divider>
                              <v-list-item-subtitle
                                v-if="$store.getters.getPointSignees.length"
                                class="green-text"
                              >
                                <b
                                  >{{
                                    Math.round(
                                      ($store.getters.getPointSignees.length /
                                        competition.signees.length) *
                                        100 *
                                        100
                                    ) / 100
                                  }}% ({{
                                    $store.getters.getPointSignees.length
                                  }}
                                  / {{ signees.length }})</b
                                >
                              </v-list-item-subtitle>
                              <v-list-item-subtitle class="red-text" v-else
                                ><b>0% (0/0)</b></v-list-item-subtitle
                              >
                            </v-list-item>
                          </v-list>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-hover>
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
                      outlined
                      :dark="$store.getters.getTheme"
                      :loading="loading_competition"
                      @click="
                        saveAsPDF(
                          `Normaalikilpailun tulokset (${selected_normal})`,
                          '#normal-table'
                        )
                      "
                    >
                      <v-icon color="red">mdi-file-pdf-outline</v-icon>
                      Lataa pdf
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
                  outlined
                  :dark="$store.getters.getTheme"
                  :loading="loading_competition"
                  @click="saveAsPDF(`Tiimikilpailun tulokset`, '#team-table')"
                >
                  <v-icon color="red">mdi-file-pdf-outline</v-icon> Lataa pdf
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
                  outlined
                  :dark="$store.getters.getTheme"
                  :loading="loading_competition"
                  @click="
                    saveAsPDF(
                      `Suurimmat kalat (${selected_biggest_fish})`,
                      '#biggest-fishes-table'
                    )
                  "
                >
                  <v-icon color="red">mdi-file-pdf-outline</v-icon> Lataa pdf
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
                  outlined
                  :dark="$store.getters.getTheme"
                  :loading="loading_competition"
                  @click="
                    saveAsPDF(
                      `Suurimmat kalat (${selected_biggest_amount})`,
                      '#biggest-amounts-table'
                    )
                  "
                  :disabled="!biggest_amounts_results.length"
                >
                  <v-icon color="red">mdi-file-pdf-outline</v-icon> Lataa pdf
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
import Header from "../components/layout/Header";
import MainHeader from "../components/layout/MainHeader";
import M from "materialize-css";
import CompetitionService from "../CompetitionService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import PieChart from "@/components/PieChart";
import DoughnutChart from "../components/DoughnutChart.vue";
import shared from "@/shared";

export default {
  name: "PublicResults",
  components: {
    ProgressBarQuery,
    Header,
    MainHeader,
    PieChart,
    DoughnutChart,
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
      signee_chart_data: null,
      fishes_chart_data: null,
      fishes_chart_title: null,
      signee_chart_title: null,
      selectedItem: 0,
      items: [
        {
          text: "Kilpailujen tuloksia",
          icon: "mdi-seal",
          path: "/public-results",
          disabled: true,
        },
        {
          text: "Cuppien tuloksia",
          icon: "mdi-trophy",
          path: "/public-cups",
          disabled: false,
        },
      ],
    };
  },
  created() {
    this.saveAllAsPDF = shared.saveAllAsPDF;
    this.saveStatsAsPDF = shared.saveStatsAsPDF;
    this.saveAsPDF = shared.saveAsPDF;
    this.dictToArray = shared.dictToArray;
    this.capitalize_words = shared.capitalize_words;
    this.replaceAll = shared.replaceAll;
    this.formatDate = shared.formatDate;
    this.range = shared.range;
    this.getColorPoints = shared.getColorPoints;
    this.getColor = shared.getColor;
    this.drawCharts = shared.drawCharts;
    this.checkLogin = shared.checkLogin;
    this.sortDict = shared.sortDict;
    this.onafterprint = shared.onafterprint;
    this.onbeforeprint = shared.onbeforeprint;
  },
  async mounted() {
    //Init materialize elements
    M.AutoInit();
    /* eslint-disable no-unused-vars */

    try {
      this.loading = true;
      // Query competitions that are public
      const query = { isPublic: true };
      this.competitions = await CompetitionService.getCompetitions(query);
      if (this.competitions.length) {
        this.competitions.forEach((competition) => {
          competition.start_date = this.$moment(competition.start_date);
          competition.end_date = this.$moment(competition.end_date);
          competition.select = `${
            competition.name
          }, ${competition.start_date.year()}  (${competition.cup_name})`;
        });
        // Sort them based on start_date so the oldest competitions are the last
        this.competitions.sort((a, b) => {
          return b.start_date.isAfter(a.start_date);
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
    choosePrints() {
      this.dialog = false;
      this.saveAllAsPDF(this.tab);
    },
    changePage: function(route) {
      if (this.$router.currentRoute.path !== route) {
        this.$router.push(route);
        this.drawer = !this.drawer;
      } else {
        M.toast({ html: "Olet jo tällä sivulla!" });
      }
    },
    cancelSelection() {
      this.competition = null;
      this.selected_competition = null;
      localStorage.removeItem("competition");
    },
    // Calculate "Suurimmat Kalat"
    calculateBiggestFishes() {
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
    calculateBiggestAmounts() {
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

    // "Wrapper" to calculate all the results at once
    async calculateAll() {
      this.calculateBiggestFishes();
      this.calculateBiggestAmounts();
    },
    // Switch table headers and columns based on this.selected_normal value (v-select)
    switchNormalResults() {
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
    // Fetch competition from database, and update all the arrays
    async refreshCompetition(reload) {
      if (this.competition) {
        this.loading_competition = true;
        // Load from database
        if (reload) {
          //Get competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
          let competition = await CompetitionService.getCompetitions({
            _id: this.competition._id,
          });
          // IF competition found from database
          if (competition) {
            // Returns an array, get first result (there shouldn't be more than one in any case, since id's are unique)
            //TODO make a test for this?
            this.competition = competition;
            this.$store.commit("refreshCompetition", this.competition);
            localStorage.setItem(
              "competition",
              JSON.stringify({
                id: competition._id,
                start_date: competition.start_date,
                end_date: competition.end_date,
              })
            );
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
      localStorage.setItem(
        "competition",
        JSON.stringify({
          id: this.competition._id,
          start_date: this.competition.start_date,
          end_date: this.competition.end_date,
        })
      );
      this.refreshCompetition(false);
    },
  },
};
</script>
