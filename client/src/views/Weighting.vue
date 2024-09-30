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
                <h2 style="margin: 10px; color: chartreuse">
                  {{ allReturned ? "Kaikki maalissa!" : "" }}
                </h2>
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
        <v-tab v-if="!allReturned" href="#onwater">Vielä vesillä</v-tab>
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
                          label="Valitse tai hae venekunta"
                          :hint="
                            boat_number_input['boat_number'] !== undefined
                              ? `Valittu venekunta`
                              : `Valitse tai hae venekunta`
                          "
                          :disabled="loading_site"
                          outlined
                          return-object
                          single-line
                          @input="searchSelected"
                        >
                          <template v-slot:selection="data">
                            <div>
                              <v-chip
                                v-bind="data.attrs"
                                :input-value="data.selected"
                                close
                                @click="data.select"
                                @click:close="clearInputs"
                              >
                                ({{ data.item.boat_number }})
                                {{ data.item.captain_name }},
                                {{ data.item.temp_captain_name }}
                              </v-chip>
                            </div>
                          </template>
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
                                ><span>{{
                                  data.item
                                }}</span></v-list-item-content
                              >
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
                                  ><span>{{
                                    data.item.boat_number
                                  }}</span></v-list-item-title
                                >
                                <v-list-item-subtitle
                                  ><span>{{
                                    data.item.captain_name
                                  }}</span></v-list-item-subtitle
                                >
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
                          v-if="competition.fishes.length"
                          style="list-style-type: none"
                        >
                          <li style="padding: 10px; margin-bottom: 10px">
                            <v-btn
                              @click="
                                isBiggestFishVisible = !isBiggestFishVisible
                              "
                              color="primary"
                              :disabled="loading || loading_fish"
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
                                  :items="competition.fishes"
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
                                  :disabled="loading || loading_fish"
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
                                      :disabled="loading || loading_fish"
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
                        <v-row v-if="!loading" align="center" justify="center">
                          <v-col cols="6">
                            <v-card
                              :dark="$store.getters.getTheme"
                              outlined
                              tile
                            >
                              <v-card-title>Yhteenveto</v-card-title>
                              <v-list dense>
                                <v-list-item>
                                  <v-list-item-icon>
                                    <v-icon>mdi-sail-boat</v-icon>
                                  </v-list-item-icon>
                                  <v-list-item-content>
                                    <v-list-item-title>
                                      <h3>
                                        ({{ boat_number_input.boat_number }})
                                        {{ boat_number_input.captain_name }},
                                        {{
                                          boat_number_input.temp_captain_name
                                        }}
                                      </h3>
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                      Venekunta
                                    </v-list-item-subtitle>
                                  </v-list-item-content>
                                </v-list-item>
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
              <v-row v-if="signees.filter((s) => s.returned).length">
                <v-col md="8" offset-md="2" style="margin-top: 20px">
                  <v-card :dark="$store.getters.getTheme">
                    <v-card-title>
                      <p class="flow-text">Tilannekatsaus</p>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            v-bind="attrs"
                            v-on="on"
                            style="margin: 0px 0px 20px 5px"
                            >mdi-chat-question-outline</v-icon
                          >
                        </template>
                        <span>
                          Voit siirtyä punnitukseen myös klikkaamalla haluamaasi
                          riviä taulukosta.</span
                        >
                      </v-tooltip>
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
                        <v-chip :color="getColorPoints(item.total_points)">{{
                          item.total_points.toLocaleString()
                        }}</v-chip>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col
                  md="8"
                  offset-md="2"
                  style="margin-top: 30px; margin-bottom: 30px"
                >
                  <p
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
              <v-row v-if="!signees.length">
                <v-col md="8" offset-md="2" style="margin-top: 100px">
                  <p v-if="!signees.length" class="flow-text red--text">
                    Kilpailussa ei vielä ilmoittautuneita
                  </p>
                  <p
                    v-if="!signees.filter((s) => !s.returned).length"
                    class="flow-text green--text"
                  >
                    Kaikki venekunnat palanneet maaliin!
                  </p>
                </v-col>
              </v-row>
              <v-row
                v-if="signees.filter((s) => !s.returned).length"
                style="margin: 0px 0px 0px 0px"
              >
                <v-col md="8" offset-md="2">
                  <v-card :dark="$store.getters.getTheme">
                    <v-card-title>
                      <p class="flow-text">Vielä vesillä</p>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            v-bind="attrs"
                            v-on="on"
                            style="margin: 0px 0px 20px 5px"
                            >mdi-chat-question-outline</v-icon
                          >
                        </template>
                        <span>
                          Voit siirtyä punnitukseen myös klikkaamalla haluamaasi
                          riviä taulukosta.</span
                        >
                      </v-tooltip>
                      <v-spacer></v-spacer>
                      <v-text-field
                        v-model="search_on_water"
                        append-icon="mdi-magnify"
                        label="Hae kilpailijaa"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-card-title>

                    <v-data-table
                      @click:row="rowClick"
                      :headers="headers_on_water"
                      :items="signees.filter((s) => !s.returned)"
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
              <v-row v-if="signees.filter((s) => !s.returned).length">
                <v-col
                  md="8"
                  offset-md="2"
                  style="margin-top: 30px; margin-bottom: 30px"
                >
                  <v-btn
                    large
                    tile
                    color="grey darken-4"
                    class="white--text"
                    @click="allFinished"
                    :loading="loading"
                    ><v-icon>mdi-check-outline</v-icon>Merkitse kaikki
                    saapuneeksi maaliin</v-btn
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
                    class="flow-text"
                    v-bind:class="{ 'white--text': $store.getters.getTheme }"
                  >
                    Kaikki maalissa!
                  </p>
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
import CompetitionService from "../services/CompetitionService";
import ResultService from "../services/ResultService";
import FishService from "../services/FishService";
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
      competition: {},
      boat_number_input: {},
      competition_boat: null,
      calculated_total_weights: null,
      calculated_fish_weights: null,
      searched: false,
      selected_boat_number: null,
      loading: false,
      refreshing: false,
      loading_fish: false,
      loading_site: true,
      notification: null,
      biggest_fish: null,
      selected_fish: null,
      isBiggestFishVisible: false,
      biggest_fishes: {},
      biggest_amounts: {},
      signees: [],
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
    allReturned() {
      return this.signees.filter((b) => !b.returned).length === 0
        ? true
        : false;
    },
    sortedCompetition() {
      let signees = [...this.signees].sort(
        (a, b) => b.total_points - a.total_points
      );
      let placement = 1;
      let last_points = -1;
      let last_placement = -1;
      signees.forEach((signee, index) => {
        // If competitor has same points as last competitor
        if (signee.total_points == last_points) {
          placement = last_placement;
        }
        // If no tie, add tied_competitors to placement, to give correct placement to next not tied competitor
        else {
          placement = index + 1;
          last_points = signee.total_points;
          last_placement = placement;
        }
        //For showing cup points, "Pisteet" on v-select
        signee.placement = placement;
      });
      return signees;
    },
  },
  created() {
    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
    // IF competition on localstorage
    if (localStorage.getItem("competition") != null) {
      // update from database
      const competition = JSON.parse(localStorage.getItem("competition"));
      this.refreshCompetition(competition._id);
    } else {
      console.log("No competition in localstorage!");
    }
  },
  mounted() {
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
        const fish = this.competition.fishes.find((f) => f.name === i.name);
        totalPoints += fish.multiplier * i.value;
      });
      return totalPoints;
    },
    getBoatTotalWeights() {
      let sum = 0;
      this.inputs.forEach((element) => {
        sum += element.value ? parseInt(element.value) : 0;
      });
      return sum;
    },
    getBoatPlacing() {
      if (this.sortedCompetition.length === 0) {
        return 1;
      }
      let points = this.getBoatTotalPoints();
      let index = this.bisect(points, this.sortedCompetition);
      let placement = index + 1;
      let samePoints = this.sortedCompetition.find(
        (b) => b.total_points === points
      );
      if (samePoints) placement = samePoints.placement;

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
          this.competition = competition;
          // Update to vuex, Assing variables and arrays from vuex (see client/store/index.js)
          this.calculateNormalResults(this.competition);
          this.inputs = [];
          this.competition.fishes.forEach((fish) => {
            this.inputs.push({
              id: fish.id,
              name: fish.name,
              value: null,
              dialog: false,
              addition: null,
              multiplier: fish.multiplier,
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
      let not_finished = this.signees.filter((s) => !s.returned);
      let ids = [];
      not_finished.forEach((element) => {
        element.returned = true;
        ids.push(element._id);
      });

      let valueToSet = {
        $set: { returned: true },
      };

      try {
        this.loading = true;
        await ResultService.updateManyResults(ids, valueToSet).catch((e) => {
          console.log(e);
        });
        this.loading = false;
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
    getColor(placement) {
      if (placement > 30) return "red";
      if (placement > 20) return "orange";
      else if (placement > 5) return "yellow";
      else return "green";
    },
    getColorPoints(points) {
      if (points > 0) return "indigo lighten-2";
      else return "grey";
    },
    rowClick(item) {
      this.boat_number_input = item;
      this.searchSelected();
    },
    // Set input weights for each fish for the signee
    setInputWeights: function () {
      // Loop trhough all the competition fishes
      this.inputs.forEach((input) => {
        if (this.competition_boat.fishes.length) {
          // find the fish weights based on the fish_name, from signees weights array
          let fish_weights = this.competition_boat.fishes.find(
            (fish) => fish.id === input.id
          ).weights;
          // Assign the value to input
          if (fish_weights) {
            input.value = fish_weights;
          } else {
            input.value = null;
          }
        }
      });
    },
    // Search signee from database when selected from table
    searchSelected() {
      // Change tab to "Punnitus" and fetch
      this.tab = "weighting";
      this.selected_boat_number = null;
      // If boat_number_input is empty, boat_number = -1
      // If boat_number selected on input
      if (this.boat_number_input.boat_number !== -1) {
        this.searched = true;
        this.notification = null;
        this.competition_boat = this.signees.find(
          (s) => s.boat_number === this.boat_number_input.boat_number
        );
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
        try {
          let comp_fish = this.competition.fishes.find(
            (cf) => cf.name === this.selected_fish
          );
          this.loading_fish = true;
          // TODO Check if there is already a biggest fish,
          // If yes then update
          let found_fish = null;
          let query = {
            boat_number: this.boat_number_input.boat_number,
            competition_id: this.boat_number_input.competition_id,
            fish_id: comp_fish.id,
          };
          await FishService.getFishes(query).then((r) => {
            if (r.length) found_fish = r[0];
          });
          if (found_fish) {
            found_fish.weight = this.biggest_fish;
            await FishService.updateFish(found_fish._id, found_fish);
          } else {
            let fish = {
              fish_id: comp_fish.id,
              boat_number: this.boat_number_input.boat_number,
              captain_name: this.boat_number_input.captain_name,
              name: this.selected_fish,
              weight: this.biggest_fish,
              competition_id: this.boat_number_input.competition_id,
              cup_id: this.boat_number_input.cup_id,
            };
            //Otherwise
            await FishService.insertFishes([fish]).catch((e) => console.log(e));
          }

          this.notification = `Tiedot päivitetty tietokantaan!`;
          this.loading_fish = false;
          this.selected_fish = null;
          this.biggest_fish = null;
        } catch (err) {
          console.log(err.message);
        }
        this.text = "Isoin kala tallennettu listaan!";
        this.snackbar = true;
      }
    },
    // Save all weights to database
    async saveToDatabase(reset) {
      let fish_weights = [];
      let fish_weight = 0;
      let total_points = 0;
      // if biggest fish not yet saved, save it
      if (this.isBiggestFishVisible) await this.saveBiggestFish();

      //if reset == true, reset current weights to 0, otherwise update weights from inputs
      if (reset) {
        this.competition_boat.returned = false;
        // reset weights
        this.competition_boat.fishes = [];
        // Check if biggest fish and delete
      }
      // Don't reset points, add new values
      else {
        this.competition_boat.returned = true;
        // For every fish, get values from inputs
        this.inputs.forEach((input) => {
          fish_weight = parseInt(input.value ? input.value : 0); // If input empty, replace with 0
          // Add fish object to array
          fish_weights.push({
            id: input.id,
            weights: fish_weight,
          });
          total_points += fish_weight * input.multiplier;
        });
      }

      this.competition_boat.total_points = total_points;
      this.competition_boat.fishes = fish_weights;
      const index = this.signees.findIndex(
        (item) => item._id === this.competition_boat._id
      );
      this.signees.splice(index, 1, this.competition_boat);

      try {
        this.loading = true;
        this.loading_fish = true;

        await ResultService.updateResult(
          this.competition_boat._id,
          this.competition_boat
        ).catch((e) => console.log(e));

        // Update competition state
        if (this.signees.filter((s) => !s.returned).length) {
          this.competition.state = "Punnitus";
        } else {
          this.competition.state = "Kaikki maalissa";
          // Refresh to vuex
          this.$store.commit("refreshCompetition", this.competition);
          let newvalues = {
            $set: {
              state: this.competition.state,
            },
          };
          //await CompetitionService.updateCompetition(comp._id, comp);
          await CompetitionService.updateValues(
            this.competition._id,
            newvalues
          );
        }

        this.clearInputs();
        this.notification = `Tiedot päivitetty tietokantaan!`;
        // Update values for next signee
        this.boat_number_input = {};
        this.competition_boat = null;
      } catch (err) {
        console.log(err.message);
      }
      this.loading = false;
      this.loading_fish = false;
      this.searched = false;
    },

    async calculateNormalResults(competition) {
      await ResultService.getResults({ competition_id: competition._id })
        .then((r) => {
          this.signees = r;
        })
        .catch((e) => {
          console.log(e);
        });

      this.signees.forEach((s) => {
        s.total_points = 0;
        if (s.fishes.length) {
          s.fishes.forEach((f) => {
            let competition_fish = competition.fishes.find(
              (cf) => cf.id === f.id
            );
            s.total_points += f.weights * competition_fish.multiplier;
          });
        }
      });

      //this.signees = this.signees.filter((signee) => signee.returned == true);
      this.signees = this.signees.sort(function compare(a, b) {
        return parseInt(b.total_points) - parseInt(a.total_points);
      });

      let last_points = -1;
      let last_placement = -1;
      let placement = 1;
      this.signees.forEach((signee, index) => {
        // If competitor has same points as last competitor
        if (signee.total_points == last_points) {
          placement = last_placement;
        }
        // If no tie, add tied_competitors to placement, to give correct placement to next not tied competitor
        else {
          placement = index + 1;
          last_points = signee.total_points;
          last_placement = placement;
        }
        //For showing cup points, "Pisteet" on v-select
        signee.placement = placement;
      });
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
