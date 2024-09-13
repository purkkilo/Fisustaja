<template>
  <!-- /comp-settings -->
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
        <v-row align="center">
          <v-col>
            <h1 style="margin: 30px">Kilpailun määritykset</h1>
          </v-col>
          <v-col>
            <v-btn
              :disabled="!basic_info_validated"
              large
              tile
              color="grey"
              @click="basic_info_validated = false"
              ><v-icon>mdi-cog-transfer</v-icon>Muuta tietoja</v-btn
            >
          </v-col>
        </v-row>
      </v-card>

      <!-- if this.loading === false, meaning app isn't loading competition data from database -->

      <v-card
        style="background: transparent"
        elevation="10"
        outlined
        :dark="$store.getters.getTheme"
        v-if="basic_info_validated"
      >
        <v-row v-if="!loading && competition" id="settings-info">
          <v-col>
            <v-row style="margin-top: 20px">
              <v-col md="10" offset-md="1">
                <v-card :dark="$store.getters.getTheme" elevation="20" outlined>
                  <v-card-title class="text-center">
                    <p class="display-1">Perustiedot</p>
                  </v-card-title>
                  <v-list outlined elevation="10">
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-ferry</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Kilpailu</v-list-item-title>
                      <v-list-item-subtitle class="blue-text">
                        <b
                          >{{ competition.name }} ({{
                            competition.locality
                          }})</b
                        >
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="yellow darken-4">mdi-trophy</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Cup</v-list-item-title>
                      <v-list-item-subtitle class="blue-text">
                        <b>{{ competition.cup_name }}</b>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-calendar-arrow-right</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Aloituspäivä</v-list-item-title>
                      <v-list-item-subtitle class="blue-text">
                        <b>{{ formatted_start_date }}</b>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-calendar-multiple-check</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Lopetuspäivä</v-list-item-title>
                      <v-list-item-subtitle class="blue-text">
                        <b>{{ formatted_end_date }}</b>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-calendar-clock</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Kilpailuaika</v-list-item-title>
                      <v-list-item-subtitle class="blue-text">
                        <b>
                          {{ competition.start_time }} -
                          {{ competition.end_time }}</b
                        >
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="green">mdi-clipboard-check</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title
                          >Kilpailun sijoittumispisteet</v-list-item-title
                        >
                        <v-list
                          :dark="$store.getters.getTheme"
                          elevation="20"
                          outlined
                          style="max-height: 400px; overflow-y: auto"
                        >
                          <div
                            v-for="(p, index) in placement_points_array"
                            :key="index"
                            style="margin-top: 20px"
                          >
                            <v-list-item>
                              <v-row align="center">
                                <v-col>
                                  <h3>#{{ p.placement }}</h3>
                                </v-col>
                                <v-col>
                                  <p>{{ p.points }}p</p>
                                </v-col>
                              </v-row>
                            </v-list-item>
                            <v-divider></v-divider>
                          </div>
                        </v-list>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="green darken-2"
                          >mdi-clipboard-check</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-title
                        >Kilpailijoiden Cup
                        osallistumispisteet</v-list-item-title
                      >
                      <v-list-item-subtitle class="blue-text">
                        <b>{{ competition.cup_participation_points }}</b>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="green darken-1"
                          >mdi-calculator-variant-outline</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-title
                        >Kilpailun pistekerroin</v-list-item-title
                      >
                      <v-list-item-subtitle class="blue-text">
                        <b>x {{ competition.cup_points_multiplier }}</b>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-incognito</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title
                        >Onko kilpailu julkinen</v-list-item-title
                      >
                      <v-list-item-subtitle class="blue-text">
                        <v-icon
                          v-if="competition.isPublic"
                          color="green darken-2"
                          >mdi-check-bold</v-icon
                        >
                        <v-icon v-else color="red">mdi-close</v-icon>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="yellow darken-4"
                          >mdi-trophy-award</v-icon
                        >
                      </v-list-item-icon>
                      <v-list-item-title
                        >Onko kilpailu päättynyt</v-list-item-title
                      >
                      <v-list-item-subtitle class="blue-text">
                        <v-icon
                          v-if="competition.isFinished"
                          color="green darken-2"
                          >mdi-check-bold</v-icon
                        >
                        <v-icon v-else color="red">mdi-close</v-icon>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
            <v-row class="fishes_summary">
              <v-col md="10" offset-md="1" class="scroll_table">
                <v-card :dark="$store.getters.getTheme" outlined>
                  <v-card-title class="text-center"
                    ><p class="display-1">Kalojen määritykset</p></v-card-title
                  >
                  <v-list outlined elevation="10">
                    <div v-for="(fish, index) in fish_specs" :key="index">
                      <v-list-item>
                        <v-list-item-title>{{ fish.name }}</v-list-item-title>
                        <v-divider vertical></v-divider>
                        <v-list-item-subtitle class="green-text">
                          <b> x {{ fish.multiplier }}</b>
                        </v-list-item-subtitle>
                        <v-divider vertical></v-divider>
                        <v-list-item-subtitle class="blue-text">
                          <b>{{ fish.minsize }} cm</b>
                        </v-list-item-subtitle>
                      </v-list-item>
                      <v-divider></v-divider>
                    </div>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-if="!loading">
              <v-col style="margin-top: 20px">
                <v-btn
                  large
                  rounded
                  :color="
                    competition.isPublic ? 'grey darken-4' : 'green darken-4'
                  "
                  @click="publishCompetition(competition.isPublic)"
                  class="white--text"
                  :loading="updating"
                >
                  <div v-if="competition.isPublic">
                    <v-icon>mdi-incognito</v-icon> Aseta kilpailu salaiseksi
                  </div>
                  <div v-else>
                    <v-icon color="green">mdi-publish</v-icon> Aseta kilpailu
                    julkiseksi
                  </div>
                </v-btn>
              </v-col>
              <v-col style="margin-top: 20px">
                <v-btn
                  large
                  rounded
                  :color="competition.isFinished ? 'yellow' : 'green darken-3'"
                  @click="endCompetition(competition.isFinished)"
                  :loading="updating"
                >
                  <div v-if="competition.isFinished" class="black--text">
                    <v-icon color="red darken-2">mdi-cancel</v-icon> Aseta
                    kilpailu keskeneräiseksi
                  </div>
                  <div v-else>
                    <v-icon color="yellow">mdi-trophy</v-icon> Aseta kilpailu
                    päättyneeksi
                  </div>
                </v-btn>
              </v-col>
            </v-row>
            <v-row style="margin-bottom: 20px">
              <v-col md="3" offset-md="4" style="margin-top: 20px">
                <v-btn
                  block
                  color="red darken-4"
                  class="white--text"
                  :loading="updating"
                  @click="deleteCompetition(competition._id, false)"
                  ><v-icon color="white">mdi-delete-forever</v-icon> Poista
                  Kilpailu</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row v-if="loading" align="center" justify="center">
          <v-col>
            <h2 class="white--text">{{ loadingMessage }}</h2>
            <ProgressBarQuery />
          </v-col>
        </v-row>
      </v-card>
      <v-card
        style="background: transparent"
        elevation="10"
        outlined
        :dark="$store.getters.getTheme"
        v-if="!basic_info_validated"
      >
        <v-card
          :dark="$store.getters.getTheme"
          id="errordiv"
          v-if="errors.length"
        >
          <v-alert type="error"> Korjaa seuraavat virheet: </v-alert>
          <v-list>
            <v-list-item v-for="(error, index) in errors" v-bind:key="index">
              <v-list-item-icon>
                <v-icon color="red">mdi-alert-circle</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ error }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
        <v-row>
          <v-col>
            <h1>Muuta määrityksiä</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <p class="white--text">Kilpailun perustiedot</p>
            <p
              v-if="basic_info_validated"
              class="flow-text yellow lighten-1 center-align"
            >
              Tiedot lukittuna, paina "Muuta tietoja" jos haluat varmasti
              muokata tietoja
            </p>
          </v-col>
        </v-row>
        <v-row v-if="!loading">
          <v-col cols="12">
            <v-row v-if="competition" justify="center">
              <v-col cols="6" class="input-fields">
                <v-text-field
                  :dark="$store.getters.getTheme"
                  label="Kilpailun nimi"
                  v-model="name"
                  :maxlength="max_input"
                  :disabled="basic_info_validated"
                  :rules="rules"
                  :counter="max_input"
                />
              </v-col>
            </v-row>

            <v-row v-if="competition" justify="center">
              <v-col cols="6" class="input-fields">
                <v-text-field
                  :dark="$store.getters.getTheme"
                  label="Paikkakunta"
                  v-model="locality"
                  :maxlength="max_input"
                  :disabled="basic_info_validated"
                  :rules="rules"
                  :counter="max_input"
                />
              </v-col>
            </v-row>

            <v-row v-if="loading_cups">
              <v-col>
                <h2 class="white--text">Haetaan cuppeja...</h2>
                <ProgressBarQuery />
              </v-col>
            </v-row>
            <v-row v-if="!cups">
              <v-col>
                <h2
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Cuppeja ei löytynyt...
                </h2>
              </v-col>
            </v-row>
            <v-row v-if="!competition.cup_name">
              <v-col>
                <h2
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Kilpailusta ei löytynyt cuppia...
                </h2>
              </v-col>
            </v-row>
            <v-row v-else align="center" justify="center">
              <v-col cols="6" class="input-fields">
                <v-subheader class="white--text"> Valitse Cup </v-subheader>
                <v-select
                  label="Valitse Cup"
                  :dark="$store.getters.getTheme"
                  v-model="cup"
                  :items="cups"
                  item-text="select"
                  item-value="_id"
                  :hint="`${cup.name} (${cup.year})`"
                  :disabled="basic_info_validated"
                  outlined
                  return-object
                  single-line
                ></v-select>
              </v-col>
            </v-row>
            <v-row v-if="competition" justify="center">
              <v-col cols="6">
                <h2 class="white--text">Kilpailun sijoittumispisteet</h2>
                <v-list
                  :dark="$store.getters.getTheme"
                  elevation="20"
                  outlined
                  style="max-height: 400px; overflow-y: auto"
                >
                  <div
                    v-for="(p, index) in placement_points_array"
                    :key="index"
                    style="margin-top: 20px"
                  >
                    <v-list-item>
                      <v-row align="center">
                        <v-col>
                          <h3>#{{ p.placement }}</h3>
                        </v-col>
                        <v-col>
                          <v-text-field
                            :dark="$store.getters.getTheme"
                            label="Pisteet"
                            v-model="p.points"
                            :rules="number_rules"
                            :disabled="basic_info_validated || !editPoints"
                            @blur="sortPlacements"
                          />
                        </v-col>
                        <v-col v-if="editPoints"
                          ><v-btn @click="removePlacement(index)" color="red">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-list-item>
                    <v-divider></v-divider>
                  </div>
                </v-list>
                <v-row v-if="editPoints">
                  <v-col>
                    <v-btn color="green" @click="addPlacement"
                      ><v-icon>mdi-plus</v-icon>Lisää pistesija</v-btn
                    >
                  </v-col>
                </v-row>
                <v-row>
                  <v-col v-if="editPoints">
                    <v-btn
                      block
                      color="yellow"
                      class="black--text"
                      @click="cancelPoints"
                      ><v-icon>mdi-cancel</v-icon>Peruuta</v-btn
                    >
                  </v-col>
                  <v-col>
                    <v-btn
                      block
                      :color="editPoints ? 'green darken-2' : 'grey'"
                      @click="confirmPoints"
                      :disabled="basic_info_validated"
                      ><v-icon>mdi-check</v-icon
                      >{{ editPoints ? "Valmis" : "Muokkaa" }}</v-btn
                    >
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="2" v-if="editPoints">
                <div style="margin-top: 200px">
                  <p
                    class="center-align flow-text"
                    v-bind:class="{
                      'white--text': $store.getters.getTheme,
                    }"
                  >
                    Palauta alkuperäiset pisteet:<br />#1 = 30, #2 = 28, #3 =
                    26...
                  </p>
                  <v-btn color="red" @click="resetPoints">Palauta</v-btn>
                </div>
              </v-col>
            </v-row>

            <v-row v-if="competition" justify="center">
              <v-col cols="6" class="input-fields">
                <v-text-field
                  :dark="$store.getters.getTheme"
                  label="Kilpailun cup osallistumispisteet"
                  v-model="cup_participation_points"
                  append-outer-icon="add"
                  maxlength="6"
                  @click:append-outer="
                    cup_participation_points >= 0
                      ? cup_participation_points++
                      : (cup_participation_points = 1)
                  "
                  prepend-icon="remove"
                  @click:prepend="
                    cup_participation_points >= 1
                      ? cup_participation_points--
                      : (cup_participation_points = 0)
                  "
                  @paste.prevent
                  :counter="6"
                  @keypress="isNumber($event, true)"
                  :rules="number_rules"
                  :disabled="basic_info_validated"
                />
              </v-col>
            </v-row>

            <v-row v-if="competition" justify="center">
              <v-col cols="6" class="input-fields">
                <v-text-field
                  :dark="$store.getters.getTheme"
                  label="Cup pistekerroin"
                  v-model="cup_points_multiplier"
                  append-outer-icon="add"
                  maxlength="3"
                  @click:append-outer="
                    cup_points_multiplier >= 1
                      ? (cup_points_multiplier += 0.5)
                      : (cup_points_multiplier = 1)
                  "
                  prepend-icon="remove"
                  @click:prepend="
                    cup_points_multiplier >= 1.5
                      ? (cup_points_multiplier -= 0.5)
                      : (cup_points_multiplier = 1)
                  "
                  @paste.prevent
                  :counter="3"
                  @keypress="isNumber($event, true)"
                  :rules="number_rules"
                  :disabled="basic_info_validated"
                />
              </v-col>
            </v-row>

            <v-row v-if="competition" justify="center" align="center">
              <v-col cols="6" class="input-fields">
                <span class="white--text">Onko Tiimikilpailua?</span>
                <v-row justify="center" align="center">
                  <v-spacer></v-spacer>
                  <v-col>
                    <v-radio-group
                      :dark="$store.getters.getTheme"
                      v-model="team_competition"
                      row
                      :disabled="basic_info_validated"
                    >
                      <v-radio label="Kyllä" value="Kyllä"></v-radio>
                      <v-radio label="Ei" value="Ei"></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-spacer></v-spacer>
                </v-row>
              </v-col>
            </v-row>

            <v-row
              v-if="competition"
              style="padding: 20px; margin-bottom: 50px"
              justify="center"
              align="center"
            >
              <v-col cols="12" xl="6" l="6" md="6" s="10" xs="12">
                <span class="white--text">Kilpailun Aloituspäivä</span>

                <v-date-picker
                  :dark="$store.getters.getTheme"
                  style="height: 480px"
                  v-model="start_date"
                  full-width
                  elevation="15"
                  locale="fi"
                  class="mt-4"
                  first-day-of-week="1"
                  :disabled="basic_info_validated"
                ></v-date-picker>
              </v-col>
              <v-col cols="12" xl="6" l="6" md="6" s="10" xs="12">
                <span class="white--text">Kilpailun Lopetuspäivä</span>

                <v-date-picker
                  :dark="$store.getters.getTheme"
                  style="height: 480px"
                  v-model="end_date"
                  full-width
                  elevation="15"
                  locale="fi"
                  class="mt-4"
                  first-day-of-week="1"
                  :disabled="basic_info_validated"
                ></v-date-picker>
              </v-col>
            </v-row>

            <v-row
              v-if="competition"
              style="padding: 20px; margin-bottom: 50px"
              justify="center"
              align="center"
            >
              <v-col cols="12" xl="6" l="6" md="6" s="10" xs="12">
                <span class="white--text">Kilpailun alkamismisaika</span>

                <v-time-picker
                  :dark="$store.getters.getTheme"
                  v-model="start_time"
                  format="24hr"
                  full-width
                  scrollable
                  elevation="15"
                  :disabled="basic_info_validated"
                ></v-time-picker>
              </v-col>
              <v-col cols="12" xl="6" l="6" md="6" s="10" xs="12">
                <span class="white--text">Kilpailun loppumisaika</span>

                <v-time-picker
                  :dark="$store.getters.getTheme"
                  v-model="end_time"
                  format="24hr"
                  full-width
                  scrollable
                  elevation="15"
                  :disabled="basic_info_validated"
                ></v-time-picker>
              </v-col>
            </v-row>
            <v-row class="fishes_summary" justify="center" align="center">
              <v-col cols="12" xl="8" l="8" md="10" s="10" xs="12">
                <table class="highlight centered responsive-table table_header">
                  <thead>
                    <tr>
                      <th>Kalalaji</th>
                      <th>Pistekerroin</th>
                      <th>Alamitta</th>
                      <th v-if="!basic_info_validated">Poista?</th>
                    </tr>
                  </thead>

                  <!-- for every fish in this.fish_specs, show info for that fish -->
                  <draggable v-model="inputs" tag="tbody">
                    <tr v-for="(input, index) in inputs" :key="index">
                      <th style="border: 1px solid black" scope="row">
                        <v-text-field
                          :dark="$store.getters.getTheme"
                          label="Nimi"
                          v-model="input.name"
                          :disabled="basic_info_validated"
                          :rules="rules"
                          :counter="max_input"
                        />
                      </th>
                      <td style="border: 1px solid black">
                        <v-text-field
                          :dark="$store.getters.getTheme"
                          label="Kerroin"
                          v-model="input.multiplier"
                          maxlength="4"
                          append-outer-icon="add"
                          @click:append-outer="
                            parseInt(input.multiplier) >= 1
                              ? (input.multiplier += 0.5)
                              : (input.multiplier = 1)
                          "
                          prepend-icon="remove"
                          @click:prepend="
                            input.multiplier >= 1.5
                              ? (input.multiplier -= 0.5)
                              : (input.multiplier = 1)
                          "
                          @paste.prevent
                          :counter="3"
                          @keypress="isNumber($event, true)"
                          :rules="number_rules"
                          :disabled="basic_info_validated"
                        />
                      </td>
                      <td style="border: 1px solid black">
                        <v-text-field
                          :dark="$store.getters.getTheme"
                          label="Alamitta (cm)"
                          v-model="input.minsize"
                          :maxlength="40"
                          :disabled="basic_info_validated"
                          :rules="rules"
                          :counter="40"
                        />
                      </td>
                      <td
                        style="border: 1px solid black"
                        v-if="!basic_info_validated"
                      >
                        <v-btn
                          icon
                          color="red darken-4"
                          class="white--text"
                          :disabled="basic_info_validated"
                          @click="deleteFish(index, input.original_name, false)"
                          ><v-icon>mdi-delete</v-icon></v-btn
                        >
                      </td>
                    </tr>
                  </draggable>
                </table>
              </v-col>
            </v-row>
            <v-row v-if="!basic_info_validated">
              <v-col
                ><b>
                  <p>
                    Siirrä taulukon riviä hiirellä muuttaaksesi paikkaa
                    taulukossa
                  </p></b
                ></v-col
              >
            </v-row>
            <v-row v-if="!basic_info_validated">
              <v-col>
                <v-btn
                  large
                  color="green darken-4"
                  class="white--text"
                  @click="addInput"
                  ><v-icon color="green lighten-2">mdi-plus-circle</v-icon>
                  Lisää kala</v-btn
                >
              </v-col>
            </v-row>

            <v-row v-if="!basic_info_validated" style="margin-bottom: 20px">
              <v-col md="6" v-if="competition">
                <v-btn
                  large
                  color="yellow"
                  class="black--text"
                  @click="setOriginalValues"
                  ><v-icon color="red darken-2">mdi-cancel</v-icon> Peruuta
                  muutokset</v-btn
                >
              </v-col>
              <v-col md="6" v-if="competition">
                <v-btn large color="green" @click="checkBasicInformation"
                  ><v-icon color="green darken-4">mdi-check-outline</v-icon>
                  Tallenna muutokset</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>

      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}

        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </div>
</template>
<script>
"use strict";
import CompetitionService from "../CompetitionService";
import CupService from "../CupService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import Timedate from "@/components/layout/Timedate";
import CompetitionNavigation from "../components/layout/CompetitionNavigation.vue";
import constants from "@/constants";
import draggable from "vuedraggable";

export default {
  name: "CompSettings",
  components: {
    ProgressBarQuery,
    Timedate,
    CompetitionNavigation,
    draggable,
  },
  data() {
    return {
      dialog: false,
      errors: [],
      cups: [],
      cup: {},
      competition: null,
      name: null,
      locality: null,
      cup_participation_points: null,
      cup_points_multiplier: null,
      team_competition: null,
      fish_specs: null,
      start_date: null,
      end_date: null,
      formatted_start_date: null,
      formatted_end_date: null,
      start_time: null,
      end_time: null,
      loading: false,
      loadingMessage: "Haetaan määrityksiä...",
      loading_cups: false,
      updating: false,
      tab: null,
      basic_info_validated: true,
      inputs: [],
      rules: [
        (value) => !!value || "Kenttä ei voi jäädä tyhjäksi!",
        (value) =>
          (value || "").length <= this.max_input || "Enintään 40 merkkiä",
      ],
      number_rules: [
        (value) => !!value || "Kenttä ei voi jäädä tyhjäksi!",
        (value) => !isNaN(value || "") || "Ei ole numero!",
        (value) => (value || "") >= 0 || "Numeron pitää olla positiivinen!",
      ],
      max_input: 40,
      placement_points_array: [],
      temp_placement_points_array: [],
      selectedItem: 1,
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
      editPoints: false,
    };
  },
  created() {
    if (localStorage.getItem("competition") != null) {
      const competition = JSON.parse(localStorage.getItem("competition"));
      const competition_id = competition["id"];
      this.refreshCompetition(competition_id);
    } else {
      console.log("No competition in localstorage!");
    }
    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
    this.placement_points_array = JSON.parse(
      JSON.stringify(constants.placement_points)
    );
  },
  mounted() {},
  methods: {
    addPlacement() {
      const lastItem =
        this.placement_points_array[this.placement_points_array.length - 1];
      this.placement_points_array.push({
        points: lastItem.points > 1 ? lastItem.points - 1 : 1,
        placement: lastItem.placement + 1,
      });
    },
    removePlacement(index) {
      this.placement_points_array.splice(index, 1);
    },
    sortPlacements() {
      this.placement_points_array.sort((a, b) => b.points - a.points);
      this.savePlacements();
    },
    savePlacements() {
      this.placement_points_array.forEach((p, index) => {
        p.placement = index + 1;
      });
    },
    cancelPoints() {
      this.editPoints = !this.editPoints;
      this.placement_points_array = JSON.parse(
        JSON.stringify(this.temp_placement_points_array)
      );
    },
    confirmPoints() {
      this.savePlacements();
      this.editPoints = !this.editPoints;
      this.temp_placement_points_array = JSON.parse(
        JSON.stringify(this.placement_points_array)
      );
    },
    resetPoints() {
      this.placement_points_array = JSON.parse(
        JSON.stringify(constants.placement_points)
      );
      this.editPoints = !this.editPoints;
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
    async publishCompetition(isPublic) {
      this.competition.isPublic = !isPublic;
      const newvalues = {
        $set: { isPublic: this.competition.isPublic },
      };
      this.updateToDatabase(this.competition, newvalues);
    },
    async endCompetition(isFinished) {
      this.competition.isFinished = !isFinished;
      this.competition.isFinished
        ? (this.competition.state = "Päättynyt")
        : (this.competition.state = "Kesken");

      const newvalues = {
        $set: { isFinished: this.competition.isFinished },
      };
      this.updateToDatabase(this.competition, newvalues);
    },
    async updateToDatabase(competition, newvalues) {
      try {
        this.$store.commit("refreshCompetition", competition);
        this.updating = true;
        await CompetitionService.updateValues(this.competition._id, newvalues);
      } catch (err) {
        console.error(err.message);
      }
      this.updating = false;
    },
    async getCups() {
      this.loading_cups = true;
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user["_id"];
      // Get Cups
      try {
        this.cups = await CupService.getCups({
          user_id: user_id,
        });
        if (this.cups.length) {
          this.cups.sort(function compare(a, b) {
            return a.name - b.name;
          });
          this.cups.forEach((cup) => {
            cup.select = `${cup.name} (${cup.year})`;
          });
          let temp_cup = this.cups.find((cup) => {
            return this.competition.cup_id === cup._id;
          });
          if (temp_cup) {
            this.cup = temp_cup;
          } else {
            console.log("No cup found on competition!");
          }
        }
      } catch (err) {
        this.error = err.message;
      }
      this.loading_cups = false;
    },
    // Update competition data from database
    async refreshCompetition(competition_id) {
      this.loadingMessage = "Haetaan määrityksiä...";
      this.loading = true;
      this.inputs = [];
      try {
        //Get competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
        let competition = await CompetitionService.getCompetitions({
          _id: competition_id,
        });
        // IF competition found from database
        if (competition) {
          // Returns an array, get first result (there shouldn't be more than one in any case, since id's are unique)
          //TODO make a test for this?
          this.competition = competition;
          this.placement_points_array = [
            ...this.competition.cup_placement_points_array,
          ];
          // Update to vuex, Assing variables from vuex (see client/store/index.js)
          this.$store.commit("refreshCompetition", competition);
          this.fish_specs = this.$store.getters.getCompetitionFishes;
          let temp_start_date = this.$moment(this.competition.start_date);
          let temp_end_date = this.$moment(this.competition.end_date);
          this.formatted_start_date = `${temp_start_date.date()}.${
            temp_start_date.month() + 1
          }.${temp_start_date.year()}`;
          this.formatted_end_date = `${temp_end_date.date()}.${
            temp_end_date.month() + 1
          }.${temp_end_date.year()}`;
          this.setOriginalValues();
          if (!this.cups.length) {
            this.getCups();
          }
        } else {
          console.log("No competition found on database...");
        }
      } catch (err) {
        console.error(err.message);
      }
      this.loading = false;
    },
    //filter other characters out for number inputs
    isNumber: function (evt, isDate) {
      var charToCheckCode = 46; // --> .
      var charToCheck = ".";

      if (!isDate) {
        charToCheckCode = 58; // --> :
        charToCheck = ":";
      }

      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== charToCheckCode
      ) {
        evt.preventDefault();
      } else {
        if (charCode == charToCheckCode) {
          if (evt.target.value.indexOf(charToCheck) >= 0) {
            evt.preventDefault();
          } else {
            return true;
          }
        } else {
          return true;
        }
      }
    },
    addInput() {
      this.inputs.push({
        index: this.inputs.length,
        name: "",
        multiplier: 1,
        minsize: "0",
        weights: 0,
        color: this.generateRandomColor(),
      });
    },
    deleteFish: function (index, fish_name, confirmed) {
      if (confirmed) {
        try {
          this.inputs.splice(index, 1);
          this.competition.signees.forEach((signee) => {
            if (signee.weights.length) {
              let signee_index = signee.weights.findIndex((fish) => {
                return fish.name === fish_name;
              });
              if (signee_index > -1) {
                // Replace
                signee.weights.splice(signee_index, 1);
              }
            }
          });
        } catch (err) {
          console.error = err.message;
        }
      } else {
        // demos for this -->  https://constkhi.github.io/vue-simple-alert/
        this.$confirm("Oletko varma?", "Poista kala", "question")
          .then((r) => {
            if (r) {
              this.deleteFish(index, fish_name, r);
            }
          })
          .catch((error) => {
            if (error) {
              console.error(error);
            }
          });
      }
    },
    setOriginalValues() {
      this.inputs = [];
      this.fish_specs.forEach((fish, index) => {
        this.inputs.push({
          index: index,
          name: fish.name,
          multiplier: parseInt(fish.multiplier),
          minsize: fish.minsize,
          weights: parseInt(fish.weights),
          color: fish.color,
          original_name: fish.name,
          original_multiplier: parseInt(fish.multiplier),
          original_minsize: fish.minsize,
        });
      });
      this.name = this.competition.name;
      this.locality = this.competition.locality;
      this.cup_participation_points = this.competition.cup_participation_points;
      this.cup_points_multiplier = this.competition.cup_points_multiplier;
      this.team_competition = this.competition.team_competition
        ? "Kyllä"
        : "Ei";
      this.start_date = new Date(this.competition.start_date)
        .toISOString()
        .substr(0, 10);
      this.end_date = new Date(this.competition.end_date)
        .toISOString()
        .substr(0, 10);
      this.start_time = this.competition.start_time;
      this.end_time = this.competition.end_time;
      this.basic_info_validated = true;
    },
    // Generate random colors for the fish chart in Result.vue (since adding fishes is dynamic)
    //TODO look for 8-15 good colors to add/choose from, maybe with color picker next to fish name
    generateRandomColor: function () {
      var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
      return randomColor;
    },
    // Add error to error array and direct user to it
    showError: function (error) {
      this.errors.push(error);
      location.href = "#";
      location.href = "#app";
    },
    // Check competitions basic information (Perustiedot)
    checkBasicInformation() {
      this.loadingMessage = "Päivitetään tietoja...";
      this.errors = [];
      this.basic_info_validated = false;
      this.validated = false;
      // Check if the given dates and times are valid with moment
      var isDateValid = this.$moment(
        this.start_date,
        "YYYY-MM-DD",
        true
      ).isValid();

      var isEndDateValid = this.$moment(
        this.end_date,
        "YYYY-MM-DD",
        true
      ).isValid();

      var isStartTimeValid = this.$moment(
        this.start_time,
        "HH:mm",
        true
      ).isValid();

      var isEndTimeValid = this.$moment(this.end_time, "HH:mm", true).isValid();

      // Check other variables
      if (!this.name) {
        this.showError("Kilpailun nimi puuttuu!");
      }

      // Check other variables
      if (!this.locality) {
        this.showError("Kilpailun paikkakunta puuttuu!");
      }

      if (!this.cup._id) {
        this.showError("Cuppia ei valittuna!");
      }
      if (!this.placement_points_array.length) {
        this.showError("Lisää osallistumispisteet kiljailijoille");
      }
      if (!this.cup_participation_points) {
        this.showError("Määritä kilpailun Cup osallistumispisteet!");
      }
      if (!this.cup_points_multiplier) {
        this.showError("Kilpailun pistekerroin puuttuu!");
      }
      if (this.cup_points_multiplier < 0.1) {
        this.showError("Kilpailun pistekerroin pitää olla vähintään 0.1!");
      }
      if (!this.start_time || !isStartTimeValid) {
        !this.start_time == true
          ? this.showError("Kilpailun alkamisnaika puuttuu!")
          : this.showError(
              'Syötä aika muodossa "hh:mm" (esim: 13:00). Syötetty aika oli: ' +
                this.start_time
            );
      }
      if (!this.end_time || !isEndTimeValid) {
        !this.end_time == true
          ? this.showError("Kilpailun loppumisaika puuttuu!")
          : this.showError(
              'Syötä aika muodossa "hh:mm" (esim: 13:00). Syötetty aika oli: ' +
                this.end_time
            );
      }
      if (!this.start_date || !isDateValid) {
        !this.start_date == true
          ? this.showError("Päivämäärää ei ole valittu!")
          : this.showError(
              'Syötä päivämäärä muodossa "PP.KK.VVVV (esim: 06.02.2020)'
            );
      }
      if (!this.end_date || !isEndDateValid) {
        !this.end_date == true
          ? this.showError("Päivämäärää ei ole valittu!")
          : this.showError(
              'Syötä päivämäärä muodossa "PP.KK.VVVV (esim: 06.02.2020)'
            );
      } else {
        let temp_start = this.$moment(this.start_date).format("DD.MM.YYYY");
        let temp_end = this.$moment(this.end_date).format("DD.MM.YYYY");
        // If dates are valid, check that start_date is before end_date
        let start_date = this.$moment(
          `${temp_start} ${this.start_time}`,
          "DD.MM.YYYY HH:mm"
        );
        let end_date = this.$moment(
          `${temp_end} ${this.end_time}`,
          "DD.MM.YYYY HH:mm"
        );

        if (end_date.isBefore(start_date, "minutes")) {
          this.showError(
            "Kilpailun päättymispäivämäärä ja kellonaika ei voi olla ennen alkamispäivämäärää!"
          );
        }
      }

      // Check all the inputs
      this.inputs.forEach((input) => {
        if (!input.name) {
          this.showError("Kalan nimi on jäänyt tyhjäksi!");
        }
        if (!input.multiplier) {
          this.showError(
            `${
              input.name ? input.name : "Kalan"
            } kerroin on jäänyt tyhjäksi tai on alle yhden!`
          );
        }
        if (!input.minsize) {
          this.showError(
            `${input.name ? input.name : "Kalan"} alamitta on jäänyt tyhjäksi!`
          );
        }
      });

      // If all inputs validated
      if (!this.errors.length) {
        let temp_start = this.$moment(this.start_date).format("DD.MM.YYYY");
        let temp_end = this.$moment(this.end_date).format("DD.MM.YYYY");
        let start_date = this.$moment(
          `${temp_start} ${this.start_time}`,
          "DD.MM.YYYY HH:mm"
        );
        let end_date = this.$moment(
          `${temp_end} ${this.end_time}`,
          "DD.MM.YYYY HH:mm"
        );

        // Basic info, change all the competition variables with values from inputs
        this.competition.cup_id = this.cup._id;
        this.competition.cup_name = this.cup.name;
        this.competition.name = this.name;
        this.competition.locality = this.locality;
        this.competition.cup_participation_points = Number(
          this.cup_participation_points
        );

        let temp_placement_points = [];
        // IF the multiplier has been changed, and is different from 1, calculate new points, else just use template array
        if (
          this.competition.cup_points_multiplier !==
            this.cup_points_multiplier &&
          this.cup_points_multiplier !== 1.0
        ) {
          let temp_placement = 1;
          this.placement_points_array.forEach((placement_point) => {
            temp_placement_points.push({
              placement: temp_placement,
              points: placement_point.points * this.cup_points_multiplier,
            });
            temp_placement++;
          });
        } else {
          temp_placement_points = [...this.placement_points_array];
        }
        this.competition.cup_points_multiplier = this.cup_points_multiplier;
        this.competition.cup_placement_points_array = temp_placement_points;
        this.competition.team_competition =
          this.team_competition === "Ei" ? false : true;
        this.competition.start_date = start_date;
        this.competition.end_date = end_date;
        this.competition.start_time = this.start_time;
        this.competition.end_time = this.end_time;

        // Change values for each signee (so that only the changed variables change), if the name/multiplier/minsize has been changed
        this.competition.signees.forEach((signee) => {
          if (signee.weights.length) {
            this.inputs.forEach((input) => {
              // If one of these input values are changed, handle variable changes to database
              if (
                input.name !== input.original_name ||
                input.multiplier !== input.original_multiplier ||
                input.minsize !== input.original_minsize
              ) {
                let index = signee.weights.findIndex((fish) => {
                  return fish.name === input.original_name;
                });
                if (index > -1) {
                  // Replace name, and calculate points in case the multiplier has been changed
                  signee.weights[index].name = input.name;
                  // Remove old points from total points
                  signee.total_points -= signee.weights[index].points;
                  // Calculate new points
                  signee.weights[index].points =
                    signee.weights[index].weights * input.multiplier;
                  // Add new points
                  signee.total_points += signee.weights[index].points;

                  if (this.competition.normal_weights.length) {
                    // Update signee values on competition.normal_weights
                    let weight_index =
                      this.competition.normal_weights.findIndex((results) => {
                        return (
                          parseInt(results.boat_number) ===
                          parseInt(signee.boat_number)
                        );
                      });
                    if (weight_index > -1) {
                      let normal_weight =
                        this.competition.normal_weights[weight_index];
                      // Assing total_points here too
                      normal_weight.total_points = signee.total_points;
                      // If name has changed, replace old key with new one, so only name changes, not the values apart from total_points
                      if (input.name !== input.original_name) {
                        delete Object.assign(normal_weight, {
                          [input.name]: normal_weight[input.original_name],
                        })[input.original_name];
                      }
                    }

                    // Update signee values on competition.normal_points
                    let point_index = this.competition.normal_points.findIndex(
                      (results) => {
                        return (
                          parseInt(results.boat_number) ===
                          parseInt(signee.boat_number)
                        );
                      }
                    );
                    if (point_index > -1) {
                      let normal_point =
                        this.competition.normal_points[point_index];
                      // Assing total_points here too, so no need to calculate points again
                      normal_point.total_points = signee.total_points;
                    }
                  }
                }
                // New fish, add to signee.weights
                else {
                  signee.weights.push({
                    name: input.name,
                    weights: 0,
                    points: 0,
                  });
                }
              }
            });
          }
        });

        this.inputs.forEach((input) => {
          // Change only the key names for each fish for biggest_fishes and biggest_amounts, if the name has been changed
          if (input.name !== input.original_name) {
            if (this.competition.biggest_fishes[input.original_name]) {
              delete Object.assign(this.competition.biggest_fishes, {
                [input.name]:
                  this.competition.biggest_fishes[input.original_name],
              })[input.original_name];
            }

            if (this.competition.biggest_amounts[input.original_name]) {
              delete Object.assign(this.competition.biggest_amounts, {
                [input.name]:
                  this.competition.biggest_amounts[input.original_name],
              })[input.original_name];
            }

            // Change the original values to current ones, if the variables gets changed in the future
            input.original_name = input.name;
            input.original_multiplier = input.multiplier;
            input.original_minsize = input.minsize;
          }
        });
        //Update to database, calculate current standings and points in case multipliers have been changed
        this.competition.fishes = this.fish_specs = this.inputs;
        let normal_results = this.calculateNormalResults(this.competition);
        this.competition.normal_points = normal_results.normal_points;
        this.competition.normal_weights = normal_results.normal_weights;
        if (this.competition.team_competition) {
          this.competition.team_results = this.calculateTeamResults();
        }
        this.updateCompetition(this.competition);
        this.basic_info_validated = true;
      }
    },
    // Update competition to database
    async updateCompetition(competition) {
      try {
        this.$store.commit("refreshCompetition", competition);
        this.loading = true;
        await CompetitionService.updateCompetition(
          competition._id,
          competition
        );
        this.tab = "show-settings";
      } catch (err) {
        console.error(err.message);
      }
      this.loading = false;
      this.text =
        "Tiedot päivitetty tietokantaan, sekä tulokset laskettu uusilla arvoilla!";
      this.snackbar = true;
    },
    // Delete competition
    async deleteCompetition(id, confirmed) {
      // If user clicked "OK" on confirmation box
      if (confirmed) {
        this.text = "Poistetaan tietokannasta!";
        this.snackbar = true;
        try {
          //Delete competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
          await CompetitionService.deleteCompetition(id);
          // Competition deleted, remove it from localstorage and vuex
          this.$store.state.competition = null;
          localStorage.removeItem("competition");
          // Redirect to dashboard
          this.$router.push({ path: "/dashboard" });
        } catch (err) {
          this.error = err.message;
        }
      } else {
        // demos for this -->  https://constkhi.github.io/vue-simple-alert/
        this.$confirm("Oletko varma?", "Poista kilpailu", "question")
          .then((r) => {
            if (r) {
              this.deleteCompetition(id, r);
            }
          })
          .catch((error) => {
            if (error) {
              console.error(error);
            }
          });
      }
    },
    // "Normaalikilpailu" results
    calculateNormalResults(competition) {
      const placement_points = competition.cup_placement_points_array;
      let cup_placement_points = placement_points[0];
      const cup_participation_points = competition.cup_participation_points;
      let last_points = -1;
      let last_placement = -1;

      let placement = 1;
      let cup_points_total = 0;
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
      this.signees.forEach((signee, index) => {
        // If competitor has same points as last competitor
        if (signee.total_points == last_points) {
          placement = last_placement;
        }
        // If no tie, add tied_competitors to placement, to give correct placement to next not tied competitor
        else {
          placement = index + 1;
          last_points = signee.total_points;
          last_placement = signee.placement;
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
      });

      let output = {
        normal_points: normal_points,
        normal_weights: normal_weights,
      };

      return output;
    },
    calculateTeamResults: function () {
      let signees = this.competition.signees;
      var team_names = [];
      let team_results = [];
      // Get all the team names
      signees.forEach((signee) => {
        if (signee.team !== "-" && signee.team !== null) {
          team_names.push(signee.team);
        }
      });
      // Only unique ones needed
      team_names = [...new Set(team_names)];

      // Get all the members of each team and add up their points
      team_names.forEach((team_name) => {
        let team = signees.filter((signee) => signee.team == team_name);
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
  },
};
</script>
