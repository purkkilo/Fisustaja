<template>
  <!-- /weighting -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div>
    <v-row>
      <v-col>
        <CompetitionNavigation></CompetitionNavigation>
      </v-col>
      <v-col>
        <Timedate />
      </v-col>
    </v-row>

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
          <v-col cols="12" xs="12" sm="12" md="12">
            <v-row justfify="center">
              <v-col>
                <h1 style="margin: 30px">Punnitus</h1>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>

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
        <v-tab href="#weighting">Punnitus</v-tab>
        <v-tab href="#situation">Tilannekatsaus</v-tab>
        <v-tab href="#onwater">Vielä vesillä</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" style="background: rgba(0, 0, 0, 0.4)">
        <!-- "Punnitus" tab -->
        <v-tab-item
          v-bind:class="{
            inputarea: !$store.getters.getTheme,
            'inputarea-dark': $store.getters.getTheme,
          }"
          :value="'weighting'"
        >
          <v-row v-if="!loading_site">
            <v-col>
              <v-row v-if="signees.length">
                <v-col>
                  <v-row v-if="notification" style="margin-top: 20px">
                    <v-col>
                      <v-alert type="success">
                        {{ notification }}
                      </v-alert>
                    </v-col>
                  </v-row>
                  <v-row v-if="!loading" style="margin-top: 20px">
                    <v-col
                      v-bind:class="{
                        'grey darken-4': $store.getters.getTheme,
                        'input-fields': !$store.getters.getTheme,
                      }"
                      md="6"
                      offset-md="3"
                      style="padding: 20px"
                    >
                      <v-col>
                        <p
                          class="flow-text"
                          v-bind:class="{
                            'white--text': $store.getters.getTheme,
                          }"
                        >
                          Venekunta
                        </p>
                      </v-col>
                      <v-col class="d-flex">
                        <v-autocomplete
                          :menu-props="
                            $store.getters.getTheme ? 'dark' : 'light'
                          "
                          :dark="$store.getters.getTheme"
                          v-model="boat_number_input"
                          :items="sortedArray"
                          item-text="select"
                          label="Valitse tai hae venekunta"
                          :hint="
                            boat_number_input['boat_number'] !== undefined
                              ? `(${boat_number_input.boat_number})
                          ${boat_number_input.captain_name},
                          ${boat_number_input.temp_captain_name}`
                              : `Valitse tai hae venekunta`
                          "
                          :disabled="loading_site"
                          outlined
                          return-object
                          single-line
                          @input="
                            fetchFromDatabase(
                              boat_number_input
                                ? boat_number_input.boat_number
                                : -1
                            )
                          "
                        >
                          <template v-slot:item="data">
                            <template v-if="typeof data.item !== 'object'">
                              <v-list-item-icon>
                                <v-icon v-if="data.item.returned" color="green"
                                  >mdi-checkbox-marked-circle</v-icon
                                >
                                <v-icon v-else color="yellow"
                                  >mdi-progress-question</v-icon
                                >
                              </v-list-item-icon>
                              <v-list-item-content
                                v-text="data.item"
                              ></v-list-item-content>
                            </template>
                            <template v-else>
                              <v-list-item-icon>
                                <v-icon v-if="data.item.returned" color="green"
                                  >mdi-checkbox-marked-circle</v-icon
                                >
                                <v-icon v-else color="yellow darken-2"
                                  >mdi-account-question</v-icon
                                >
                              </v-list-item-icon>
                              <v-list-item-content>
                                <v-list-item-title
                                  v-html="data.item.boat_number"
                                ></v-list-item-title>
                                <v-list-item-subtitle
                                  v-html="data.item.captain_name"
                                ></v-list-item-subtitle>
                              </v-list-item-content>
                            </template>
                          </template>
                        </v-autocomplete>
                      </v-col>
                    </v-col>
                  </v-row>
                  <v-row v-if="!competition_boat">
                    <v-col>
                      <v-alert v-if="loading" type="info"> </v-alert>
                      <v-alert v-if="!searched" type="warning">
                        Venekuntaa ei valittuna
                      </v-alert>
                      <v-alert v-else type="error">
                        Numerolla ei löytynyt venekuntaa tietokannasta!
                      </v-alert>
                    </v-col>
                  </v-row>
                  <v-row v-if="competition_boat">
                    <v-col>
                      <v-row v-if="!loading" style="margin-top: 30px">
                        <v-col offset="4" cols="4">
                          <v-btn large block color="yellow" @click="clearInputs"
                            ><v-icon>mdi-backspace-reverse-outline</v-icon
                            >Peruuta valinta</v-btn
                          >
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-divider class="black"></v-divider>
                        </v-col>
                      </v-row>

                      <v-col md="10" offset-md="1">
                        <ul
                          id="fish_weights"
                          v-if="$store.getters.getCompetitionFishes.length"
                          style="list-style-type: none"
                        >
                          <li style="padding: 10px; margin-bottom: 10px">
                            <v-btn
                              @click="
                                isBiggestFishVisible = !isBiggestFishVisible
                              "
                              color="primary"
                              ><v-icon>{{
                                isBiggestFishVisible ? "mdi-eye-off" : "mdi-eye"
                              }}</v-icon
                              >{{
                                isBiggestFishVisible
                                  ? "Piilota"
                                  : "Punnitse yksittäinen kala"
                              }}</v-btn
                            >
                            <v-row v-if="loading_fish" style="margin-top: 20px">
                              <v-col>
                                <p
                                  class="flow-text"
                                  v-bind:class="{
                                    'white--text': $store.getters.getTheme,
                                  }"
                                >
                                  Lisätään kala tietokantaan...
                                </p>
                                <ProgressBarQuery />
                              </v-col>
                            </v-row>
                            <v-row
                              v-if="!loading_fish && isBiggestFishVisible"
                              style="margin-top: 20px"
                            >
                              <v-col md="3">
                                <p
                                  class="flow-text"
                                  v-bind:class="{
                                    'white--text': $store.getters.getTheme,
                                  }"
                                >
                                  Suurin kala?
                                </p>
                              </v-col>
                              <v-col md="4">
                                <v-select
                                  outlined
                                  class="flow-text"
                                  label="Valitse kalalaji painamalla"
                                  v-model="selected_fish"
                                  item-text="name"
                                  :items="competition_fishes"
                                  :dark="$store.getters.getTheme"
                                >
                                  <template v-slot:selection="data">
                                    <v-chip
                                      color="primary"
                                      close
                                      @click:close="selected_fish = null"
                                    >
                                      {{ data.item.name }}
                                    </v-chip>
                                  </template>
                                </v-select>
                              </v-col>
                              <v-col class="input-fields" md="3">
                                <v-text-field
                                  :dark="$store.getters.getTheme"
                                  label="Paino grammoina"
                                  v-model="biggest_fish"
                                  type="number"
                                  @paste.prevent
                                  @keypress="isNumber($event)"
                                  value="0"
                                  step="50"
                                  min="0"
                                  :rules="number_rules"
                                  :loading="loading_fish"
                                />
                              </v-col>
                              <v-col md="2">
                                <v-btn
                                  v-if="selected_fish && biggest_fish"
                                  large
                                  tile
                                  color="green"
                                  @click="saveBiggestFish"
                                  ><v-icon>mdi-content-save</v-icon
                                  >Tallenna</v-btn
                                >
                              </v-col>
                            </v-row>
                          </li>
                          <li
                            v-for="(input, index) in inputs"
                            :key="index"
                            style="padding-top: 10px; padding-bottom: 20px"
                          >
                            <v-row>
                              <v-col md="12">
                                <v-divider class="black"></v-divider>
                              </v-col>
                            </v-row>
                            <v-row align="center" justify="center">
                              <v-col md="6">
                                <span
                                  class="flow-text"
                                  v-bind:class="{
                                    'white--text': $store.getters.getTheme,
                                  }"
                                >
                                  {{ index + 1 }}.
                                </span>
                                <span
                                  class="flow-text"
                                  v-bind:class="{
                                    'white--text': $store.getters.getTheme,
                                  }"
                                >
                                  {{ input.name }}
                                </span>
                              </v-col>
                              <v-col md="4" class="input-fields">
                                <v-text-field
                                  :dark="$store.getters.getTheme"
                                  label="Paino grammoina"
                                  v-model="input.value"
                                  type="number"
                                  @paste.prevent
                                  @keypress="isNumber($event)"
                                  value="0"
                                  step="50"
                                  min="0"
                                  :rules="number_rules"
                                  :loading="loading_fish"
                                />
                              </v-col>
                              <v-col md="2">
                                <v-dialog
                                  v-model="input.dialog"
                                  persistent
                                  max-width="600px"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      color="primary"
                                      dark
                                      v-bind="attrs"
                                      v-on="on"
                                      ><v-icon>mdi-plus</v-icon>Plussaa</v-btn
                                    >
                                  </template>
                                  <v-card :dark="$store.getters.getTheme">
                                    <v-card-title>
                                      <span class="headline"
                                        >Yhteenlaske summat</span
                                      >
                                    </v-card-title>
                                    <v-card-text>
                                      <v-row>
                                        <v-col md="6" offset-md="3">
                                          <v-text-field
                                            class="title"
                                            label="Alkuperäinen arvo"
                                            :value="input.value"
                                            disabled
                                          ></v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col md="6 " offset-md="3">
                                          <v-text-field
                                            v-model="input.addition"
                                            label="Lisättävä arvo"
                                            type="number"
                                            @paste.prevent
                                            @keypress="isNumber($event)"
                                            step="50"
                                            min="0"
                                            single-line
                                            outlined
                                          ></v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col
                                          md="6"
                                          offset-md="3"
                                          class="title red--text"
                                        >
                                          <v-text-field
                                            :value="
                                              parseInt(input.value) +
                                              parseInt(
                                                input.addition
                                                  ? input.addition
                                                  : 0
                                              )
                                            "
                                            label="Summa"
                                            disabled
                                          ></v-text-field>
                                        </v-col>
                                      </v-row>
                                    </v-card-text>
                                    <v-card-actions>
                                      <v-spacer></v-spacer>
                                      <v-btn
                                        outlined
                                        color="red darken-1"
                                        @click="
                                          input.addition = null;
                                          input.dialog = false;
                                        "
                                        >Peruuta</v-btn
                                      >
                                      <v-btn
                                        outlined
                                        color="green darken-1"
                                        @click="
                                          input.value =
                                            parseInt(input.value) +
                                            parseInt(
                                              input.addition
                                                ? input.addition
                                                : 0
                                            );
                                          input.dialog = false;
                                          input.addition = 0;
                                        "
                                        >Tallenna</v-btn
                                      >
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                              </v-col>
                            </v-row>
                          </li>
                        </ul>
                        <v-row>
                          <v-col md="12">
                            <v-divider class="black"></v-divider>
                          </v-col>
                        </v-row>
                        <v-row v-if="!loading">
                          <v-col>
                            <v-card
                              :dark="$store.getters.getTheme"
                              outlined
                              tile
                            >
                              <v-card-title>Yhteenveto</v-card-title>
                              <v-list>
                                <v-list-item>
                                  <v-list-item-icon>
                                    <v-icon>mdi-weight-gram</v-icon>
                                  </v-list-item-icon>
                                  <v-list-item-content>
                                    <v-list-item-title>
                                      <h3>
                                        {{
                                          getBoatTotalWeights().toLocaleString()
                                        }}
                                        g
                                      </h3>
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                      Yhteispaino
                                    </v-list-item-subtitle>
                                  </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                  <v-list-item-icon>
                                    <v-icon>mdi-counter</v-icon>
                                  </v-list-item-icon>
                                  <v-list-item-content>
                                    <v-list-item-title>
                                      <h3>
                                        {{
                                          getBoatTotalPoints().toLocaleString()
                                        }}
                                        p
                                      </h3>
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                      Yhteispisteet
                                    </v-list-item-subtitle>
                                  </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                  <v-list-item-icon>
                                    <v-icon>mdi-pound-box</v-icon>
                                  </v-list-item-icon>
                                  <v-list-item-content>
                                    <v-list-item-title>
                                      <h3>#{{ getBoatPlacing() }}</h3>
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                      Sijoitus
                                    </v-list-item-subtitle>
                                  </v-list-item-content>
                                </v-list-item>
                              </v-list>
                            </v-card>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col md="12">
                            <v-divider class="black"></v-divider>
                          </v-col>
                        </v-row>
                        <v-row v-if="!loading">
                          <v-col>
                            <v-btn
                              large
                              tile
                              color="red"
                              @click="saveToDatabase(true)"
                              :loading="refreshing"
                              ><v-icon>mdi-delete</v-icon>Nollaa</v-btn
                            >
                          </v-col>
                          <v-col>
                            <p
                              class="flow-text"
                              v-if="refreshing"
                              v-bind:class="{
                                'white--text': $store.getters.getTheme,
                              }"
                            >
                              Synkronoidaan tietokannan kanssa...
                            </p>
                          </v-col>
                          <v-col>
                            <v-btn
                              large
                              tile
                              color="green"
                              @click="saveToDatabase(false)"
                              :loading="refreshing"
                              ><v-icon>mdi-check</v-icon>Tallenna</v-btn
                            >
                          </v-col>
                        </v-row>
                        <v-row v-if="!loading" style="margin-bottom: 20px">
                          <v-col>
                            <v-btn
                              id="updatebtn"
                              large
                              tile
                              color="blue darken-4"
                              @click="refreshCompetition(competition_id)"
                              class="white--text"
                            >
                              <v-icon>mdi-update</v-icon>Päivitä kilpailun
                              tiedot
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-row v-else>
                          <v-col>
                            <p
                              class="flow-text"
                              v-bind:class="{
                                'white--text': $store.getters.getTheme,
                              }"
                            >
                              Päivitetään tiedot tietokantaan...
                            </p>
                            <ProgressBarQuery />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col style="padding: 30px">
                  <p
                    class="flow-text"
                    v-bind:class="{ 'white--text': $store.getters.getTheme }"
                  >
                    Kilpailussa ei vielä ilmoittautuneita!
                  </p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col>
              <h2 v-bind:class="{ 'white--text': $store.getters.getTheme }">
                Haetaan veneitä...
              </h2>
              <ProgressBarQuery />
            </v-col>
          </v-row>
        </v-tab-item>

        <!-- "Tilannekatsaus" tab -->
        <v-tab-item
          v-bind:class="{
            inputarea: !$store.getters.getTheme,
            'inputarea-dark': $store.getters.getTheme,
          }"
          :value="'situation'"
        >
          <v-row>
            <v-col>
              <v-row v-if="result_signees.length">
                <v-col md="8" offset-md="2" style="margin-top: 20px">
                  <v-card :dark="$store.getters.getTheme">
                    <v-card-title>
                      <p class="flow-text">Tilannekatsaus</p>
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
                      @click:row="rowClick"
                      :headers="headers"
                      :items="sortedCompetition"
                      :search="search"
                    >
                      <template v-slot:[`item.placement`]="{ item }">
                        <v-chip
                          :outlined="$store.getters.getTheme"
                          :color="getColor(item.placement)"
                          >{{ item.placement }}.</v-chip
                        >
                      </template>
                      <template v-slot:[`item.total_points`]="{ item }">
                        <v-chip :color="getColorPoints(item.total_points)"
                          >{{ item.total_points.toLocaleString() }} p</v-chip
                        >
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
              <v-row v-if="selected_id && result_signees.length">
                <v-col
                  md="8"
                  offset-md="2"
                  style="margin-top: 30px; margin-bottom: 30px"
                >
                  <v-btn large tile color="blue" @click="searchSelected"
                    ><v-icon>mdi-arrow-right</v-icon>Siirry punnitukseen</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col
                  md="8"
                  offset-md="2"
                  style="margin-top: 30px; margin-bottom: 30px"
                >
                  <p
                    v-if="result_signees.length"
                    class="flow-text"
                    v-bind:class="{ 'white--text': $store.getters.getTheme }"
                  >
                    Voit siirtyä punnitukseen myös klikkaamalla haluamaasi riviä
                    taulukosta ja painamalla ilmestyvää nappulaa
                  </p>
                  <p
                    v-else
                    class="flow-text"
                    v-bind:class="{ 'white--text': $store.getters.getTheme }"
                  >
                    Ei vielä tuloksia!
                  </p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-tab-item>

        <!-- "Vielä vesillä" tab -->
        <v-tab-item
          v-bind:class="{
            inputarea: !$store.getters.getTheme,
            'inputarea-dark': $store.getters.getTheme,
          }"
          :value="'onwater'"
        >
          <v-row>
            <v-col>
              <v-row v-if="!signees.length || !still_on_water.length">
                <v-col
                  md="8"
                  offset-md="2"
                  class="input-fields"
                  style="margin-top: 100px"
                >
                  <p v-if="!signees.length" class="flow-text red--text">
                    Kilpailussa ei vielä ilmoittautuneita!
                  </p>
                  <p
                    v-if="!still_on_water.length && signees.length"
                    class="flow-text green--text"
                  >
                    Kaikki venekunnat palanneet maaliin!
                  </p>
                </v-col>
              </v-row>
              <v-row v-if="still_on_water.length" style="margin-top: 20px">
                <v-col md="8" offset-md="2">
                  <v-card :dark="$store.getters.getTheme">
                    <v-card-title>
                      <p class="flow-text">
                        Venekunnat, jotka ovat vielä vesillä
                      </p>
                      <v-spacer></v-spacer>
                      <v-text-field
                        v-model="search_on_water"
                        append-icon="mdi-magnify"
                        label="Hae kilpailijaa"
                        single-line
                        hide-details
                      ></v-text-field>
                      ></v-card-title
                    >

                    <v-data-table
                      @click:row="rowClick"
                      :headers="headers_on_water"
                      :items="still_on_water"
                      :search="search_on_water"
                      :loading="loading"
                    >
                      <template v-slot:[`item.boat_number`]="{ item }">
                        <v-chip>{{ item.boat_number }}.</v-chip>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
              <v-row v-if="selected_id && still_on_water.length">
                <v-col
                  md="8"
                  offset-md="2"
                  style="margin-top: 30px; margin-bottom: 30px"
                >
                  <v-btn large tile color="blue" @click="searchSelected"
                    ><v-icon>mdi-arrow-right</v-icon>Siirry punnitukseen</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col
                  md="8"
                  offset-md="2"
                  style="margin-top: 30px; margin-bottom: 30px"
                >
                  <p
                    v-if="still_on_water.length"
                    class="flow-text"
                    v-bind:class="{ 'white--text': $store.getters.getTheme }"
                  >
                    Voit siirtyä punnitukseen myös klikkaamalla haluamaasi riviä
                    taulukosta ja painamalla ilmestyvää nappulaa
                  </p>
                  <v-btn
                    v-if="still_on_water.length"
                    large
                    tile
                    color="grey darken-4"
                    class="white--text"
                    @click="allFinished"
                    :loading="loading"
                    ><v-icon>mdi-check-outline</v-icon>Kaikki saapuneet
                    maaliin</v-btn
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
"use strict";
import CompetitionService from "../CompetitionService";
import Timedate from "../components/layout/Timedate";
import CompetitionNavigation from "../components/layout/CompetitionNavigation.vue";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";

export default {
  name: "Weighting",
  components: {
    Timedate,
    ProgressBarQuery,
    CompetitionNavigation,
  },
  data() {
    return {
      dialog: false,
      tab: null,
      competition_id: null,
      boat_number_input: {},
      competition_boat: null,
      calculated_total_weights: null,
      calculated_fish_weights: null,
      searched: false,
      selected_id: null,
      selected_boat_number: null,
      loading: false,
      refreshing: false,
      loading_fish: false,
      loading_site: true,
      notification: null,
      biggest_fish: null,
      selected_fish: null,
      isBiggestFishVisible: false,
      competition_fishes: [],
      biggest_fishes: {},
      biggest_amounts: {},
      signees: [],
      result_signees: [],
      headers: [
        { text: "Sijoitus", value: "placement" },
        { text: "Kilp. Numero", value: "boat_number" },
        { text: "Kippari", value: "captain_name" },
        { text: "Pisteet", value: "total_points" },
      ],
      headers_on_water: [
        { text: "Kilp. Numero", value: "boat_number" },
        { text: "Kippari", value: "captain_name" },
        { text: "Varakippari", value: "temp_captain_name" },
        { text: "Lähtöpaikka", value: "starting_place" },
      ],
      search_on_water: "",
      search: "",
      still_on_water: [],
      number_rules: [
        (value) => !isNaN(value || "") || "Ei ole numero!",
        (value) => (value || "") >= 0 || "Numeron pitää olla positiivinen!",
      ],
      timer_refresh: null,
      interval: 60000,
      inputs: [],
      selectedItem: 3,
      items: [
        {
          text: "Yleisnäkymä",
          icon: "mdi-desktop-mac-dashboard",
          path: "/overview",
        },
        {
          text: "Määritykset",
          icon: "mdi-tune",
          path: "/comp-settings",
        },
        {
          text: "Ilmoittautuminen",
          icon: "mdi-draw",
          path: "/signing",
        },
        {
          text: "Punnitus",
          icon: "mdi-dumbbell",
          path: "/weighting",
        },
        {
          text: "Tulokset",
          icon: "mdi-seal",
          path: "/results",
        },
      ],
      snackbar: false,
      text: "",
      timeout: 5000,
    };
  },
  computed: {
    // Keep array sorted based on boat number in "Punnitus" tab
    sortedArray() {
      return [...this.signees].sort((a, b) => a.boat_number - b.boat_number);
    },
    sortedCompetition() {
      let signees = [...this.signees].sort(
        (a, b) => b.total_points - a.total_points
      );
      let placement = 1;
      let last_points = -1;
      let last_placement = -1;
      signees.forEach((signee) => {
        if (last_points === signee.total_points) {
          signee.placement = last_placement;
        } else {
          signee.placement = placement;
          last_points = signee.total_points;
          last_placement = signee.placement;
        }
        placement++;
      });
      return signees;
    },
  },
  created() {
    if (localStorage.getItem("competition") != null) {
      const competition = JSON.parse(localStorage.getItem("competition"));
      this.competition_id = competition["id"];
      this.loading_site = true;
      this.refreshCompetition(this.competition_id);
      /*
      this.timer_refresh = setInterval(
        () => this.refreshCompetition(competition_id),
        this.interval
      );
      */
    }
  },
  mounted() {
    /* eslint-enable no-unused-vars */
    if (!this.competition_id) {
      const competition = JSON.parse(localStorage.getItem("competition"));
      this.competition_id = competition["id"];
      this.loading_site = true;
      this.refreshCompetition(this.competition_id);
    }
    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
  },
  beforeDestroy() {
    // Clear timer
    //clearInterval(this.timer_refresh);
  },
  methods: {
    getBoatTotalPoints() {
      let totalPoints = 0;
      this.inputs.forEach((i) => {
        const fish = this.competition_fishes.find((f) => f.name === i.name);
        totalPoints += fish.multiplier * i.value;
      });
      return totalPoints;
    },
    getBoatTotalWeights() {
      return this.inputs.reduce((a, b) => {
        let aValue = a.value ? parseInt(a.value) : 0;
        let bValue = b.value ? parseInt(b.value) : 0;
        return aValue + bValue;
      });
    },
    getBoatPlacing() {
      if (this.sortedCompetition.length === 0) {
        return 1;
      }
      let points = this.getBoatTotalPoints();
      let index = this.bisect(points, this.sortedCompetition);
      let placement = index + 1;
      // Check if boat is already on the list with these points
      // = Placement doesn't change
      let samePoints = this.sortedCompetition.filter(
        (boat) => boat.total_points === points
      );
      if (index > 0) {
        samePoints.every((element) => {
          if (element.boat_number === this.boat_number_input.boat_number) {
            // Boat found with same points
            placement = element.placement;
            return false;
          }
          return true;
        });
      }
      return placement;
    },
    bisect(value, array) {
      let idx;
      if (array.length === 0) {
        return 0;
      }
      for (idx = 0; idx < array.length; idx++) {
        if (value > array[idx].total_points) {
          return idx;
        }
      }
      return idx;
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
    // Fetch competition from database, and update variables
    async refreshCompetition(competition_id) {
      this.refreshing = true;
      try {
        let competition = await CompetitionService.getCompetitions({
          _id: competition_id,
        });
        if (competition) {
          // Update to vuex, Assing variables and arrays from vuex (see client/store/index.js)
          let comp = competition;
          let normal_results = this.calculateNormalResults(comp);
          comp.normal_points = normal_results.normal_points;
          comp.normal_weights = normal_results.normal_weights;
          this.$store.commit("refreshCompetition", comp);
          this.competition_fishes = this.$store.getters.getCompetitionFishes;
          this.signees = this.$store.getters.getCompetitionSignees;
          let placement = 1;
          let last_points = -1;
          let last_placement = -1;
          this.signees.forEach((signee) => {
            signee.select = `${signee.boat_number}, ${signee.captain_name}`;
            if (last_points === signee.total_points) {
              signee.placement = last_placement;
            } else {
              signee.placement = placement;
              last_points = signee.total_points;
              last_placement = signee.placement;
            }
            placement++;
          });
          this.result_signees = this.$store.getters.getResultSignees;
          this.still_on_water = this.$store.getters.getStillOnWaterSignees;
          this.competition_fishes.forEach((fish) => {
            this.inputs.push({
              name: fish.name,
              value: null,
              dialog: false,
              addition: null,
            });
          });
        } else {
          console.log("No competition found on database...");
        }
      } catch (err) {
        console.log(err);
      }
      this.loading_site = false;
      this.refreshing = false;
    },
    // "Kaikki päässeet maaliin" button pressed
    async allFinished() {
      // Mark all signees as returned
      this.signees.forEach((signee) => {
        signee.returned = true;
      });
      // Update signees array to database/vuex
      let comp = this.$store.getters.getCompetition;
      let normal_results = this.calculateNormalResults(comp);
      comp.normal_points = normal_results.normal_points;
      comp.normal_weights = normal_results.normal_weights;
      comp.signees = this.signees;
      this.$store.commit("refreshCompetition", comp);
      try {
        this.loading = true;
        let newvalues = {
          $set: {
            normal_points: comp.normal_points,
            normal_weights: comp.normal_weights,
            signees: comp.signees,
          },
        };
        //await CompetitionService.updateCompetition(comp._id, comp);
        await CompetitionService.updateValues(comp._id, newvalues);
        this.loading = false;
        this.still_on_water = this.$store.getters.getStillOnWaterSignees;
        this.text = "Kaikki kilpailijat merkattu maaliin saapuneeksi!";
        this.snackbar = true;
      } catch (err) {
        console.log(err.message);
      }
    },
    // Check if input value is number, and only accept numbers to inputs
    isNumber: function (evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        if (charCode == 46) {
          evt.preventDefault();
        } else {
          return true;
        }
      }
    },
    // Fetch signee from vuex based on boat number
    // Check client\src\store\index.js for implementation
    searchBoatNumber: function (boat_number) {
      return this.$store.getters.getSigneeByBoatNumber(parseInt(boat_number));
    },
    getColor(placement) {
      if (placement > 30) return "red";
      if (placement > 20) return "orange";
      else if (placement > 5) return "yellow";
      else return "green";
    },
    getColorPoints(points) {
      if (points > 0) return "indigo";
      else return "grey";
    },
    // Select row from table, if selected --> unselect
    // selected_id bound to selected css class (on App.vue)
    rowClick: function (item, row) {
      if (item.id == this.selected_id) {
        this.selected_id = null;
        this.selected_boat_number = null;
        row.select(false);
      } else {
        if (this.selected_row) {
          this.selected_row.select(false);
        }
        this.selected_id = item.id;
        this.selected_boat_number = item.boat_number;
        row.select(true);
        this.selected_row = row;
      }
    },
    // Set input weights for each fish for the signee
    setInputWeights: function () {
      // Loop trhough all the competition fishes
      this.inputs.forEach((input) => {
        let fish_name = input.name;
        // find the fish weights based on the fish_name, from signees weights array
        let fish_weights = this.competition_boat.weights.find(
          (fish) => fish.name === fish_name
        ).weights;
        // Assign the value to input
        if (fish_weights > 0) {
          input.value = fish_weights;
        } else {
          input.value = null;
        }
      });
    },
    // Search signee from database when selected from table
    searchSelected: function () {
      // Change tab to "Punnitus" and fetch
      this.tab = "weighting";
      this.fetchFromDatabase(this.selected_boat_number);
    },

    fetchFromDatabase: function (boat_number) {
      this.selected_id = null;
      this.selected_boat_number = null;
      // If boat_number_input is empty, boat_number = -1
      // If boat_number selected on input
      if (boat_number !== -1) {
        this.searched = true;
        this.notification = null;
        this.competition_boat = this.searchBoatNumber(boat_number);
        if (this.competition_boat) {
          //Wait for render to set weights to inputs
          this.$nextTick(() => this.setInputWeights());
          this.boat_number_input = this.competition_boat;
        } else {
          console.log("No such boat in list!");
        }
      } else {
        // No boat selected, clear inputs
        this.clearInputs();
      }
    },

    // Save biggest fish to database
    async saveBiggestFish() {
      // If name for biggest fish, boat number and weight for biggest fish all have been selected
      if (this.selected_fish && this.boat_number_input && this.biggest_fish) {
        // Create fish object
        let fish = {
          name: this.selected_fish,
          boat_number: this.boat_number_input.boat_number,
          captain_name: this.boat_number_input.captain_name,
          weight: this.biggest_fish,
        };
        this.$store.commit("addBiggestFish", fish);
        this.biggest_fishes = this.$store.getters.getBiggestFishes;
        // Create competition object and update it to database
        let comp = this.$store.getters.getCompetition;
        comp.biggest_fishes = this.biggest_fishes;
        this.$store.commit("refreshCompetition", comp);
        try {
          this.loading_fish = true;
          let newvalues = {
            $set: {
              biggest_fishes: comp.biggest_fishes,
            },
          };
          //await CompetitionService.updateCompetition(comp._id, comp);
          await CompetitionService.updateValues(comp._id, newvalues);
          this.notification = `Tiedot päivitetty tietokantaan!`;
          this.loading_fish = false;
          (this.selected_fish = null), (this.biggest_fish = null);
        } catch (err) {
          console.log(err.message);
        }
        this.text = "Isoin kala tallennettu listaan!";
        this.snackbar = true;
      } else {
        console.log("Jokin input tyhjänä:");
      }
    },
    // Save all weights to database
    async saveToDatabase(reset) {
      let competition_fishes = this.$store.getters.getCompetitionFishes;
      let fish_weights = [];
      let total_weights = 0;
      let total_points = 0;
      let fish_weight = 0;
      let fish_points = 0;
      let fish_name;
      this.biggest_fishes = this.$store.getters.getBiggestFishes;

      // if biggest fish not yet saved, save it
      if (this.selected_fish && this.boat_number_input && this.biggest_fish) {
        let fish = {
          name: this.selected_fish,
          boat_number: this.boat_number_input.boat_number,
          captain_name: this.boat_number_input.captain_name,
          weight: this.biggest_fish,
        };
        this.$store.commit("addBiggestFish", fish);
        this.biggest_fishes = this.$store.getters.getBiggestFishes;
        (this.selected_fish = null), (this.biggest_fish = null);
      }
      //if reset == true, reset current weights to 0, otherwise update weights from inputs
      if (reset) {
        this.competition_boat.returned = false;
        // For every fish, reset weights/points and add them to array
        this.inputs.forEach((input) => {
          fish_name = input.name;
          fish_weights.push({
            name: fish_name,
            weights: fish_weight,
            points: fish_points,
          });
          // If there are biggest fishes in competition
          if (this.biggest_fishes) {
            // If there are biggest fishes from certain fish_name
            if (this.biggest_fishes[fish_name]) {
              // Check if signee has biggest fish there
              let index = this.biggest_fishes[fish_name].findIndex((item) => {
                return (
                  parseInt(this.boat_number_input.boat_number) ===
                  parseInt(item.boat_number)
                );
              });
              // If fish found, delete it
              if (index > -1) {
                this.biggest_fishes[fish_name].splice(index, 1);
              }
            }
          }
          // If there are fish amounts in competition
          if (this.biggest_amounts) {
            // If there are fish amounts from certain fish_name
            if (this.biggest_amounts[fish_name]) {
              // Check if signee has biggest fish there
              let index = this.biggest_amounts[fish_name].findIndex((item) => {
                return (
                  parseInt(this.boat_number_input.boat_number) ===
                  parseInt(item.boat_number)
                );
              });
              if (index > -1) {
                // If fish found, delete it
                this.biggest_amounts[fish_name].splice(index, 1);
              }
            }
          }
        });
      }
      // Don't reset points, add new values
      else {
        this.competition_boat.returned = true;
        // For every fish, get values from inputs
        this.inputs.forEach((input) => {
          fish_name = input.name;
          fish_weight = parseInt(input.value ? input.value : 0); // If input empty, replace with 0
          // Get points multiplier for this certain fish for points calculation
          let points_multiplier = competition_fishes.find(
            (fish) => fish.name === fish_name
          ).multiplier;
          fish_points = fish_weight * points_multiplier;
          // Add fish object to array
          fish_weights.push({
            name: fish_name,
            weights: fish_weight,
            points: fish_points,
          });
          // Create biggest fish amount object and store to vuex
          let fish = {
            name: fish_name,
            boat_number: this.competition_boat.boat_number,
            captain_name: this.competition_boat.captain_name,
            weight: fish_weight,
          };
          this.$store.commit("addBiggestAmount", fish);
          this.biggest_amounts = this.$store.getters.getBiggestAmounts;
          total_weights += fish_weight;
          total_points += fish_points;
        });
      }

      this.competition_boat.weights = fish_weights;
      this.competition_boat.total_weights = total_weights;
      this.competition_boat.total_points = total_points;
      // If there is signee with save number, replace in vuex
      // Check implementation from 'client\src\store\index.js'
      this.$store.commit("replaceSignee", this.competition_boat);
      let comp = this.$store.getters.getCompetition;
      let normal_results = this.calculateNormalResults(comp);
      let temp_total_weights = this.calculateTotalWeights();

      // Store to database and vuex
      comp.signees = this.$store.getters.getCompetitionSignees;
      comp.normal_points = normal_results.normal_points;
      comp.normal_weights = normal_results.normal_weights;
      if (comp.team_competition) {
        comp.team_results = this.calculateTeamResults();
      }
      comp.biggest_fishes = this.biggest_fishes;
      comp.biggest_amounts = this.biggest_amounts;
      comp.total_weights = temp_total_weights.total_weights;
      comp.fishes = temp_total_weights.competition_fishes;

      // Update competition state
      if (this.still_on_water.length) {
        comp.state = "Punnitus";
      } else {
        comp.state = "Kaikki maalissa";
      }
      // Refresh to vuex
      this.$store.commit("refreshCompetition", comp);
      try {
        this.loading = true;
        this.loading_fish = true;
        let newvalues = {
          $set: {
            signees: comp.signees,
            normal_points: comp.normal_points,
            normal_weights: comp.normal_weights,
            team_results: comp.team_results,
            biggest_fishes: comp.biggest_fishes,
            biggest_amounts: comp.biggest_amounts,
            fishes: comp.fishes,
            total_weights: comp.total_weights,
            state: comp.state,
          },
        };
        //await CompetitionService.updateCompetition(comp._id, comp);
        await CompetitionService.updateValues(comp._id, newvalues);
        this.notification = `Tiedot päivitetty tietokantaan!`;
        // Update values for next signee
        this.boat_number_input = {};
        this.competition_boat = null;
        this.signees = comp.signees;
        this.competition_fishes = this.$store.getters.getCompetitionFishes;
        this.calculated_total_weights =
          this.$store.getters.getCompetitionTotalWeights;
        this.result_signees = this.$store.getters.getResultSignees;
        this.still_on_water = this.$store.getters.getStillOnWaterSignees;
      } catch (err) {
        console.log(err.message);
      }
      this.loading = false;
      this.loading_fish = false;
      this.searched = false;
    },
    // "Normaalikilpailu" results
    calculateNormalResults(competition) {
      const placement_points = competition.cup_placement_points_array;
      let cup_placement_points = placement_points[0];
      const cup_participation_points = competition.cup_participation_points;
      let last_points = null;
      let tied_competitors = 0;
      let placement = 1;
      let cup_points_total;

      let normal_points = [];
      let normal_weights = [];
      this.signees = competition.signees.filter(
        (signee) => signee.returned == true
      );
      this.signees = this.signees.sort(function compare(a, b) {
        return parseInt(b.total_points) - parseInt(a.total_points);
      });
      // For every signee, calculate their cup points and placing
      //TODO rework the structure, seems more complex than it should be
      // Placements and points now saved in every competition to cup_placement_points_array, based on placement fetch from there?
      this.signees.forEach((signee) => {
        cup_points_total = 0;
        if (!last_points) {
          last_points = signee.total_points;
        } else {
          // If competitor has same points as last competitor
          if (signee.total_points == last_points) {
            placement -= 1; // Keep the same placing (adds 1 later)
            tied_competitors += 1; // remember amount of tied competitors for later to deduct more points from next not tied competitor
          }
          // If no tie, add tied_competitors to placement, to give correct placement to next not tied competitor
          else {
            placement += tied_competitors;
          }

          // If no points --> no placement points
          if (signee.total_points == 0) {
            // if there is a tie on points, increment tied competitors
            if (signee.total_points === last_points) {
              tied_competitors += 1;
            }
          }
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
          total_points: signee.total_points.toLocaleString(),
          cup_placement_points: cup_placement_points,
          cup_participation_points: cup_participation_points,
          cup_points_total: cup_points_total,
        });

        //For showing fish weights, "Kalat" on v-select
        let temp_dict = {};
        temp_dict.placement = placement;
        temp_dict.boat_number = signee.boat_number;
        temp_dict.captain_name = signee.captain_name;

        // For each fish, get the weight and fish name
        signee.weights.forEach((weights) => {
          let name = weights.name;
          let weight = weights.weights;
          temp_dict[name] = weight;
        });
        temp_dict.total_points = signee.total_points;
        normal_weights.push(temp_dict);
        last_points = signee.total_points;
        // Calculate next placement
        if (tied_competitors > 0) {
          placement += tied_competitors;
        } else {
          placement++;
        }
      });

      let output = {
        normal_points: normal_points,
        normal_weights: normal_weights,
      };

      return output;
    },
    calculateTeamResults: function () {
      var team_names = [];
      let team_results = [];
      // Get all the team names
      this.signees.forEach((signee) => {
        if (signee.team !== "-" && signee.team !== null) {
          team_names.push(signee.team);
        }
      });
      // Only unique ones needed
      team_names = [...new Set(team_names)];

      // Get all the members of each team and add up their points
      team_names.forEach((team_name) => {
        let team = this.signees.filter((signee) => signee.team == team_name);
        let team_points = 0;
        let members = [];

        team.forEach((member) => {
          members.push(member.captain_name);
          team_points += member.total_points;
        });

        // If there aren't 3 members in a team, add "-"'s as members for nicer looking table
        if (members.length === 1) {
          members.push("-");
          members.push("-");
        }
        if (members.length === 2) {
          members.push("-");
        }
        team_results.push({
          name: team_name,
          captain_name_1: members[0],
          captain_name_2: members[1],
          captain_name_3: members[2],
          points: team_points.toLocaleString(),
        });
      });

      return team_results;
    },
    // Calculate total weight of all the fishes in competition
    calculateTotalWeights: function () {
      let finished_boats = this.$store.getters.getFinishedSignees;
      let competition_fishes = this.$store.getters.getCompetitionFishes;
      let total_weights = 0;
      // For each boat, get every fish weight and add them to competition_fishes and total_weights in competition
      // For statistics
      // First reset
      for (let i = 0; i < competition_fishes.length; i++) {
        competition_fishes[i].weights = 0;
      }
      //Then add
      finished_boats.forEach((element) => {
        for (let i = 0; i < competition_fishes.length; i++) {
          let fish_weights = element.weights.find(
            (fish) => competition_fishes[i].name == fish.name
          ).weights;
          competition_fishes[i].weights += parseInt(fish_weights);
          //TODO update only this one variable to database, not the whole competition
          total_weights += parseInt(fish_weights);
        }
      });
      return {
        total_weights: total_weights,
        competition_fishes: competition_fishes,
      };
    },
    // Clear all inputs and selections
    clearInputs: function () {
      this.text = "Pyyhitään inputit ja valinnat...";
      this.snackbar = true;
      this.inputs.forEach((input) => {
        input.value = null;
      });
      this.competition_boat = null;
      this.boat_number_input = {};
      this.selected_fish = null;
      this.biggest_fish = null;
      this.searched = false;
    },
  },
};
</script>
