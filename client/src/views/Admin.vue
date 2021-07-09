<template>
  <!-- /admin -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container>
    <Header style="margin-bottom:100px" />
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
      <v-tab href="#overview">Yleisnäkymä</v-tab>
      <v-tab href="#users">Käyttäjät</v-tab>
      <v-tab href="#competitions">Kilpailut</v-tab>
      <v-tab href="#feedback">Saatu palaute</v-tab>
      <v-tab href="#generate">Kilpailun generointi</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" style="background: rgba(0,0,0,0.4);">
      <v-tab-item
        :value="'overview'"
        v-bind:class="{
          inputarea: !$store.getters.getTheme,
          'inputarea-dark': $store.getters.getTheme,
        }"
      >
        <v-row>
          <v-col>
            <v-row>
              <v-col v-if="prevRoute">
                <v-btn
                  v-if="prevRoute.name"
                  large
                  rounded
                  color="yellow"
                  @click="$router.push({ path: prevRoute.path })"
                  ><i class="material-icons left">history</i>Palaa
                  takaisin</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <h1>Yleistietoja</h1>
              </v-col>
            </v-row>
            <!-- if this.loading === false, meaning app isn't loading feedback from database, then show this div -->
            <v-row v-if="!loading">
              <v-col class="inputarea black--text" md="6" offset-md="3">
                <p v-if="feedback.length" class="flow-text">
                  <i class="material-icons">feedback</i> Palautetta annettu:
                  {{ feedback.length }} kpl
                </p>
                <p v-else class="flow-text">
                  <i class="material-icons">feedback</i> Ei palautetta!
                </p>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col md="6" offset-md="3">
                <h3
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Ladataan palautteita...
                </h3>
                <ProgressBarQuery />
              </v-col>
            </v-row>
            <!-- if this.loading_users === false, meaning app isn't loading users, then show this div -->
            <v-row v-if="!loading_users">
              <v-col class="inputarea black--text" md="6" offset-md="3">
                <p v-if="users.length" class="flow-text">
                  <i class="material-icons">account_circle</i> Käyttäjiä
                  yhteensä: {{ users.length }} kpl
                </p>
                <p v-else class="flow-text">
                  <i class="material-icons">account_circle</i> Ei käyttäjiä!
                </p>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col md="6" offset-md="3">
                <h3
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Ladataan käyttäjiä...
                </h3>
                <ProgressBarQuery />
              </v-col>
            </v-row>
            <!-- if this.loading_competitions === false, meaning app isn't loading competitions, then show this div -->
            <v-row v-if="!loading_competitions">
              <v-col class="inputarea black--text" md="6" offset-md="3">
                <p v-if="all_competitions.length" class="flow-text">
                  <i class="material-icons">directions_boat</i> Kilpailuja
                  yhteensä: {{ all_competitions.length }} kpl<br />---> Itse
                  luotuja {{ competitions.length }}/{{
                    all_competitions.length
                  }}
                  kpl
                </p>
                <p v-else class="flow-text">
                  <i class="material-icons">directions_boat</i> Ei kilpailuja!
                </p>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col md="6" offset-md="3">
                <h3
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Ladataan kilpailuja...
                </h3>
                <ProgressBarQuery />
              </v-col>
            </v-row>
            <v-row v-if="!loading_cups">
              <v-col class="inputarea black--text" md="6" offset-md="3">
                <p v-if="all_cups.length" class="flow-text">
                  <i class="material-icons">directions_boat</i> Cuppeja
                  yhteensä: {{ all_cups.length }} kpl<br />---> Itse luotuja
                  {{ cups.length }}/{{ all_cups.length }} kpl
                </p>
                <p v-else class="flow-text">
                  <i class="material-icons">directions_boat</i> Ei cuppeja!
                </p>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col md="6" offset-md="3">
                <h3
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Ladataan Cuppeja...
                </h3>
                <ProgressBarQuery />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item
        :value="'users'"
        v-bind:class="{
          inputarea: !$store.getters.getTheme,
          'inputarea-dark': $store.getters.getTheme,
        }"
      >
        <v-row>
          <v-col>
            <v-row>
              <v-col v-if="prevRoute">
                <v-btn
                  v-if="prevRoute.name"
                  large
                  rounded
                  color="yellow"
                  @click="$router.push({ path: prevRoute.path })"
                  ><i class="material-icons left">history</i>Palaa
                  takaisin</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <h1>Käyttäjät</h1>
                <br />
                <p
                  class="flow-text"
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  *Klikkaa nimeä saadaksesi lisätietoa
                </p>
              </v-col>
            </v-row>
            <v-row v-if="users.length">
              <v-col
                md="6"
                offset-md="3"
                v-bind:class="{
                  'grey darken-4': $store.getters.getTheme,
                }"
              >
                <v-data-iterator
                  :items="users"
                  :search="search"
                  hide-default-footer
                  class="scroll_table"
                >
                  <template v-slot:header>
                    <v-toolbar class="mb-1" :dark="$store.getters.getTheme">
                      <v-text-field
                        v-model="search"
                        clearable
                        flat
                        solo-inverted
                        hide-details
                        prepend-inner-icon="search"
                        label="Etsi"
                      ></v-text-field>
                    </v-toolbar>
                  </template>
                  <template v-slot:default="props">
                    <v-col
                      v-for="(user, index) in props.items"
                      :key="index"
                      style="margin-top:20px"
                    >
                      <!-- For every user in this.users array -->
                      <v-menu
                        v-model="user.menu"
                        bottom
                        right
                        transition="scale-transition"
                        origin="top left"
                        :close-on-click="false"
                      >
                        <template v-slot:activator="{ on }">
                          <v-chip
                            :dark="$store.getters.getTheme"
                            :outlined="$store.getters.getTheme"
                            large
                            v-on="on"
                            :color="user.is_admin ? 'yellow darken-2' : 'green'"
                          >
                            <v-avatar left>
                              <i v-if="user.is_admin" class="material-icons"
                                >admin_panel_settings</i
                              >
                              <i v-else class="material-icons"
                                >account_circle</i
                              >
                            </v-avatar>
                            {{ user.name }}
                          </v-chip>
                        </template>
                        <v-card width="300">
                          <v-list dark>
                            <v-list-item>
                              <v-list-item-avatar>
                                <i v-if="user.is_admin" class="material-icons"
                                  >admin_panel_settings</i
                                >
                                <i v-else class="material-icons"
                                  >account_circle</i
                                >
                              </v-list-item-avatar>
                              <v-list-item-content>
                                <v-list-item-title>{{
                                  user.name
                                }}</v-list-item-title>
                                <v-list-item-subtitle>{{
                                  user.email
                                }}</v-list-item-subtitle>
                              </v-list-item-content>
                              <v-list-item-action>
                                <v-btn icon @click="user.menu = false">
                                  <v-icon>mdi-close-circle</v-icon>
                                </v-btn>
                              </v-list-item-action>
                            </v-list-item>
                          </v-list>
                          <v-list>
                            <v-tooltip right>
                              <template v-slot:activator="{ on, attrs }">
                                <v-list-item
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="copyToClipboard(user._id, user)"
                                >
                                  <v-list-item-action>
                                    <v-icon
                                      >mdi-badge-account-horizontal</v-icon
                                    >
                                  </v-list-item-action>
                                  <v-list-item-content>
                                    <v-list-item-title>{{
                                      user._id
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle
                                      >Id</v-list-item-subtitle
                                    >
                                  </v-list-item-content>
                                </v-list-item>
                              </template>
                              <span>Kopioi</span>
                            </v-tooltip>
                            <v-tooltip right>
                              <template v-slot:activator="{ on, attrs }">
                                <v-list-item
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="copyToClipboard(user.createdAt, user)"
                                >
                                  <v-list-item-action>
                                    <v-icon>mdi-calendar-check</v-icon>
                                  </v-list-item-action>
                                  <v-list-item-content>
                                    <v-list-item-title>{{
                                      user.createdAt
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle
                                      >Tili luotu</v-list-item-subtitle
                                    >
                                  </v-list-item-content>
                                </v-list-item>
                              </template>
                              <span>Kopioi</span>
                            </v-tooltip>
                            <v-list-item v-if="user.is_admin" @click="() => {}">
                              <v-list-item-action>
                                <v-icon>mdi-briefcase</v-icon>
                              </v-list-item-action>
                              <v-list-item-content>
                                <v-list-item-title>Admin</v-list-item-title>
                                <v-list-item-subtitle
                                  >Rooli</v-list-item-subtitle
                                >
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item v-else @click="() => {}">
                              <v-list-item-action>
                                <v-icon>mdi-briefcase</v-icon>
                              </v-list-item-action>
                              <v-list-item-content>
                                <v-list-item-title>Käyttäjä</v-list-item-title>
                                <v-list-item-subtitle
                                  >Rooli</v-list-item-subtitle
                                >
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item @click="() => {}">
                              <v-list-item-content>
                                <v-btn
                                  color="blue"
                                  @click="
                                    copyToClipboard(JSON.stringify(user), user)
                                  "
                                >
                                  <v-icon>mdi-copy-content</v-icon>
                                  Kopio koko objekti
                                </v-btn>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-card>
                      </v-menu>
                      <v-divider style="margin-top:10px"></v-divider>
                    </v-col>
                  </template>
                </v-data-iterator>
              </v-col>
            </v-row>
            <!-- users.length === 0 === false-->
            <v-row v-else-if="loading_users">
              <v-col md="10" offset-md="1">
                <v-sheet
                  :color="
                    `grey ${$store.getters.getTheme ? 'darken-2' : 'lighten-4'}`
                  "
                  class="px-3 pt-3 pb-3"
                >
                  <v-skeleton-loader
                    class="mx-auto"
                    type="card"
                  ></v-skeleton-loader>
                </v-sheet>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col>
                <h2
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Ei käyttäjiä!
                </h2>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item
        :value="'competitions'"
        v-bind:class="{
          inputarea: !$store.getters.getTheme,
          'inputarea-dark': $store.getters.getTheme,
        }"
      >
        <v-row>
          <v-col>
            <v-row>
              <v-col v-if="prevRoute">
                <v-btn
                  v-if="prevRoute.name"
                  large
                  rounded
                  color="yellow"
                  @click="$router.push({ path: prevRoute.path })"
                  ><i class="material-icons left">history</i>Palaa
                  takaisin</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <h1>Kilpailut</h1>
              </v-col>
            </v-row>
            <!-- if there are competitions in database-->
            <v-row v-if="all_competitions.length">
              <v-col>
                <v-card :dark="$store.getters.getTheme">
                  <v-card-title>
                    <p class="flow-text">Kilpailut</p>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search_comp"
                      append-icon="mdi-magnify"
                      label="Hae kilpailua"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-card-title>
                  <v-data-table
                    id="normal-table"
                    :headers="headers"
                    :items="all_competitions"
                    :search="search_comp"
                    :loading="loading_competitions"
                  >
                    <template v-slot:[`item.start_date`]="{ item }">
                      <v-chip color="primary darken-2">{{
                        item.start_date.format("DD.MM.YYYY")
                      }}</v-chip>
                    </template>
                    <template v-slot:[`item.cup_points_multiplier`]="{ item }">
                      <v-chip
                        :color="getColor(item.cup_points_multiplier)"
                        :outlined="$store.getters.getTheme"
                        >{{ item.cup_points_multiplier }}x</v-chip
                      >
                    </template>
                    <template v-slot:[`item.choose`]="{ item }">
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            color="primary"
                            v-bind="attrs"
                            v-on="on"
                            @click="pickCompetition(item)"
                            ><v-icon color="black"
                              >mdi-arrow-right-bold-box-outline</v-icon
                            ></v-btn
                          >
                        </template>
                        <span>Siirry kilpailuun</span>
                      </v-tooltip>
                    </template>
                    <template v-slot:[`item.delete`]="{ item }">
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            v-bind="attrs"
                            v-on="on"
                            color="red"
                            @click="deleteCompetition(item._id, false)"
                            :loading="loading_competitions"
                            ><v-icon>mdi-delete-outline</v-icon></v-btn
                          >
                        </template>
                        <span>Poista kilpailu</span>
                      </v-tooltip>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
            <!-- this.competitions.length === 0 === false -->
            <v-row v-else>
              <v-col v-if="loading_competitions" md="10" offset-md="1">
                <v-sheet
                  :color="
                    `grey ${$store.getters.getTheme ? 'darken-2' : 'lighten-4'}`
                  "
                  class="px-3 pt-3 pb-3"
                >
                  <v-skeleton-loader
                    class="mx-auto"
                    type="card"
                  ></v-skeleton-loader>
                </v-sheet>
              </v-col>
              <v-col v-else>
                <h2
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Ei Kilpailuja!
                </h2>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item
        :value="'feedback'"
        v-bind:class="{
          inputarea: !$store.getters.getTheme,
          'inputarea-dark': $store.getters.getTheme,
        }"
      >
        <v-row>
          <v-col>
            <v-row>
              <v-col v-if="prevRoute">
                <v-btn
                  v-if="prevRoute.name"
                  large
                  rounded
                  color="yellow"
                  @click="$router.push({ path: prevRoute.path })"
                  ><i class="material-icons left">history</i>Palaa
                  takaisin</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <h1>Saatu Palaute</h1>
              </v-col>
            </v-row>

            <v-row v-if="feedback.length">
              <v-col>
                <ul id="fish_weights">
                  <!-- For every feedback in this.feedback array -->
                  <li v-for="(feedback, index) in feedback" :key="index">
                    <v-card
                      class="mx-auto"
                      :dark="$store.getters.getTheme"
                      min-width="200px"
                      max-width="850px"
                      style="margin-bottom:30px;margin-top:30px"
                    >
                      <v-card-title>
                        <v-col md="10" offset-md="1">
                          <span class="title font-weight-light"
                            >#{{ index + 1 }} {{ feedback.type }}</span
                          >
                        </v-col>
                      </v-card-title>
                      <v-card-text
                        class="headline font-weight-bold"
                        style="word-break: break-all;"
                      >
                        {{ feedback.message }}
                      </v-card-text>
                      <v-card-actions>
                        <v-col>
                          <v-btn
                            large
                            rounded
                            color="yellow"
                            :loading="loading"
                            @click="deleteFeedback(feedback._id)"
                            class="black--text"
                            ><i class="material-icons left">done_outline</i
                            >Ratkaise</v-btn
                          >
                        </v-col>
                      </v-card-actions>
                    </v-card>
                  </li>
                </ul>
              </v-col>
            </v-row>
            <!-- this.feedback.length === 0 === false -->
            <v-row v-else>
              <v-col v-if="loading" md="10" offset-md="1">
                <v-sheet
                  :color="
                    `grey ${$store.getters.getTheme ? 'darken-2' : 'lighten-4'}`
                  "
                  class="px-3 pt-3 pb-3"
                >
                  <v-skeleton-loader
                    class="mx-auto"
                    type="card"
                  ></v-skeleton-loader>
                </v-sheet>
              </v-col>
              <v-col v-else>
                <h2
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Palautetta ei vielä annettu!
                </h2>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item
        :value="'generate'"
        v-bind:class="{
          inputarea: !$store.getters.getTheme,
          'inputarea-dark': $store.getters.getTheme,
        }"
      >
        <v-row>
          <v-col>
            <v-row>
              <v-col v-if="prevRoute">
                <v-btn
                  v-if="prevRoute.name"
                  large
                  rounded
                  color="yellow"
                  @click="$router.push({ path: prevRoute.path })"
                  ><i class="material-icons left">history</i>Palaa
                  takaisin</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <h1>Kilpailun generointi</h1>
              </v-col>
            </v-row>
            <v-row v-if="cup.name">
              <v-col md="3">
                <p
                  class="center-align flow-text black--text"
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Valitse Cup
                </p>
              </v-col>
              <v-col class="d-flex" md="6">
                <v-select
                  :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
                  :dark="$store.getters.getTheme"
                  v-model="cup"
                  :items="cups"
                  item-text="select"
                  item-value="_id"
                  :hint="`${cup.name} (${cup.year})`"
                  :disabled="!cup.name"
                  outlined
                  return-object
                  single-line
                  :loading="loading_cups"
                ></v-select>
              </v-col>
              <v-col md="3">
                <router-link to="/continue">
                  <v-btn tile color="green lighten-1"
                    ><i class="material-icons left">add_circle_outline</i>Luo
                    uusi cup!</v-btn
                  >
                </router-link>
              </v-col>
            </v-row>
            <v-row v-if="cup.name">
              <v-col md="6" offset-md="3" class="input-fields">
                <v-text-field
                  :dark="$store.getters.getTheme"
                  label="Kilpailijoiden määrä"
                  v-model="signees_amount"
                  append-outer-icon="add"
                  maxlength="6"
                  @click:append-outer="
                    signees_amount >= 0
                      ? signees_amount++
                      : (signees_amount = 1)
                  "
                  prepend-icon="remove"
                  @click:prepend="
                    signees_amount >= 1
                      ? signees_amount--
                      : (signees_amount = 0)
                  "
                  @paste.prevent
                  :counter="6"
                  @keypress="isNumber($event, true)"
                  :rules="number_rules"
                  :disabled="!cup.name"
                />
              </v-col>
            </v-row>
            <v-row v-if="cup.name">
              <v-col md="6" offset-md="3" class="input-fields">
                <v-col>
                  <span
                    class="flow-text"
                    v-bind:class="{
                      'white--text': $store.getters.getTheme,
                    }"
                    >Onko Tiimikilpailua?</span
                  >
                </v-col>
                <v-col offset-md="4">
                  <v-radio-group
                    v-model="team_competition"
                    row
                    :disabled="!cup.name"
                  >
                    <v-radio label="Kyllä" value="Kyllä"></v-radio>
                    <v-radio label="Ei" value="Ei"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col md="6" offset-md="3">
                <h3
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Ladataan Cuppeja...
                </h3>
                <ProgressBarQuery />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  large
                  rounded
                  color="green"
                  :loading="loading_cups"
                  @click="generateCompetition"
                  ><i class="material-icons left">history</i>Generoi
                  kilpailu</v-btn
                >
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
import FeedbackService from "../FeedbackService";
import CompetitionService from "../CompetitionService";
import UserService from "../UserService";
import CupService from "../CupService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import Header from "../components/layout/Header";

export default {
  data() {
    return {
      tab: null,
      feedback: [],
      users: [],
      all_competitions: [],
      competitions: [],
      user_id: null,
      loading: false,
      loading_users: false,
      loading_competitions: false,
      loading_cups: false,
      all_cups: [],
      cups: [],
      cup: {},
      signees_amount: 30,
      team_competition: "Ei",
      number_rules: [
        (value) => !!value || "Kenttä ei voi jäädä tyhjäksi!",
        (value) => !isNaN(value || "") || "Ei ole numero!",
        (value) => (value || "") >= 0 || "Numeron pitää olla positiivinen!",
      ],
      headers: [
        { text: "Kilpailun Päivämäärä", value: "start_date" },
        { text: "Nimi", value: "name" },
        { text: "Käyttäjä", value: "username" },
        { text: "Cup", value: "cup_name" },
        { text: "Pistekerroin", value: "cup_points_multiplier" },
        { text: "Valitse", value: "choose", sortable: false },
        { text: "Poista", value: "delete", sortable: false },
      ],
      search_comp: "",
      search: "",
      prevRoute: null,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  components: {
    ProgressBarQuery,
    Header,
  },
  // Called everytime page is opened
  async mounted() {
    //Init materialize elements
    M.AutoInit();
    //Check if user is logged in has admin status, update header
    this.checkLogin();
    // Focus on top of the page
    location.href = "#";
    location.href = "#app";
    // Show loading progressbars
    this.loading = this.loading_users = this.loading_competitions = this.loading_cups = true;
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.user_id = user["id"];
    }
    try {
      // Load data from database
      this.feedback = await FeedbackService.getFeedback();
      this.loading = false;
      this.users = await UserService.getUsers();
      this.users.forEach((user) => {
        user.menu = false;
      });
      this.loading_users = false;
      // No query, get all competitions
      this.all_competitions = await CompetitionService.getCompetitions();
      this.all_competitions.forEach((competition) => {
        competition.username = this.users.find(
          (user) => user._id === competition.user_id
        ).name;
        competition.start_date = this.$moment(competition.start_date);
        competition.end_date = this.$moment(competition.end_date);
        competition.cup_name = `${
          competition.cup_name
        } (${competition.start_date.format("YYYY")})`;
      });
      // Sort them based on start_date so the oldest competitions are the last
      this.all_competitions.sort(function compare(a, b) {
        return b.start_date.isAfter(a.start_date);
      });
      this.getCups();
      this.loading_competitions = false;
    } catch (err) {
      console.error(err.message);
    }
  },
  methods: {
    getColor(multiplier) {
      if (multiplier > 1) return "red";
      if (multiplier === 1) return "green";
      else return "grey";
    },
    generateCompetition: function() {
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user["id"];
      M.toast({ html: "TODO: Generoi kilpailu!" });
      console.log("TODO: Generoi kilpailu!");
      const competition = {
        user_id: user_id,
        cup_id: this.cup.id,
        team_competition: this.team_competition === "Ei" ? false : true,
        //Kaikki muu generointi, katso alta
      };
      console.log("Kilpailu olio:", competition);
    },
    /* 
            Kilpailun generointi:

            //Generate signee data on loop to signees array
            //Generate fish weights and points to every signee to every signee on signees array
            //When signees array complete, Add competition to database: await CompetitionService.insertCompetition(competition);
    */
    fallbackCopyToClipboard: function(text) {
      var textArea = document.createElement("textarea");
      textArea.value = text;
      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log("Fallback: text to copy: " + msg);
      } catch (err) {
        console.error("Fallback: unable to copy:", err);
      }

      document.body.removeChild(textArea);
    },
    copyToClipboard: function(text, user) {
      // If clipboard not there, create create input and copy it from there using doxument.execCommand("copy");
      if (!navigator.clipboard) {
        this.fallbackCopyToClipboard(text);
        return;
      }
      navigator.clipboard.writeText(text).then(
        function() {
          M.toast({ html: `"${text}" kopioitu leikepöydälle` });
        },
        function(err) {
          console.error("Async: Could not copy text: ", err);
          M.toast({ html: `Kopiointi ei onnistunut jostain syystä...` });
        }
      );
      user.menu = false;
    },
    async getCups() {
      if (this.user_id) {
        this.loading_cups = true;
        // Get Cups
        try {
          this.all_cups = await CupService.getCups();
          if (this.all_cups.length) {
            this.all_cups.sort(function compare(a, b) {
              return a.name - b.name;
            });
            this.all_cups.forEach((cup) => {
              cup.select = `${cup.name} (${cup.year})`;
            });
            this.cups = this.all_cups.filter(
              (cup) => cup.user_id === this.user_id
            );
            this.cup = this.cups[this.cups.length - 1];
          }
        } catch (err) {
          this.error = err.message;
        }
      } else {
        console.error("No user found in localstorage!");
      }
      this.loading_cups = false;
    },
    //Check if user is logged in has admin status, update values to vuex (Header.vue updates based on these values)
    checkLogin: function() {
      // If login token present --> user is logged in
      if (localStorage.getItem("jwt") != null) {
        this.$store.state.logged_in = true;
        let user = JSON.parse(localStorage.getItem("user"));
        // Set preferences to vuex
        this.$store.state.isDark = user.preferences.isDark;
        this.$store.state.lang = user.preferences.lang;
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
    // Delete received feedback
    async deleteFeedback(id) {
      this.loading = true;
      try {
        //Delete feedback from database (check 'client\src\FeedbackService.js' and 'server\routes\api\feedback.js' to see how this works)
        await FeedbackService.deleteFeedback(id);
        M.toast({ html: "Palaute ratkaistu!" });
        // Get updated list from database
        this.feedback = await FeedbackService.getFeedback();
        this.loading = false;
      } catch (err) {
        console.error(err.message);
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
    // Delete competition from database
    async deleteCompetition(id, confirmed) {
      // If user clicked "OK" on confirmation box
      if (confirmed) {
        M.toast({ html: "Poistetaan tietokannasta!" });
        this.loading_competitions = true;
        try {
          //Delete competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
          await CompetitionService.deleteCompetition(id);
          // No query, get all competitions
          let index = this.all_competitions.findIndex((c) => c._id === id);
          if (index > -1) {
            this.all_competitions.splice(index, 1);
          }
          this.loading_competitions = false;
        } catch (err) {
          console.error(err.message);
        }
      }
      // Show confirmation box on first function call
      else {
        this.$confirm("Oletko varma?", "Poista kilpailu", "question")
          .then((r) => {
            // if user clicked "OK" on confirmation box
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
  },
};
</script>
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
