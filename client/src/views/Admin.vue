<template>
    <!-- /admin -->  
    <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
    <div class="container">
        <Header />
        <Timedate />

        <!-- Tabs -->
        <v-tabs
            v-model="tab"
            background-color="blue lighten-2"
            color="basil"
            grow
        >
            <v-tabs-slider color="blue darken-4"></v-tabs-slider>
            <v-tab href="#overview">Yleisnäkymä</v-tab>
            <v-tab href="#users">Käyttäjät</v-tab>
            <v-tab href="#competitions">Kilpailut</v-tab>
            <v-tab href="#feedback">Saatu palaute</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" style="background: rgba(0,0,0,0.4);">
            <v-tab-item :value="'overview'">
                <v-container>
                    <v-row>
                        <v-col>
                          <v-btn large rounded color="yellow" @click="$router.go(-1)"><i class="material-icons left">history</i>Palaa takaisin</v-btn>
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
                            <p v-if="feedback.length" class="flow-text"><i class="material-icons">feedback</i> Palautetta annettu: {{feedback.length}} kpl</p>
                            <p v-else class="flow-text"><i class="material-icons">feedback</i> Ei palautetta!</p>
                        </v-col>
                    </v-row>
                    <v-row v-else>
                        <v-col md="6" offset-md="3">
                            <h3>Ladataan palautteita...</h3>
                            <ProgressBarQuery />
                        </v-col>
                    </v-row>
                    <!-- if this.loading_users === false, meaning app isn't loading users, then show this div --> 
                    <v-row v-if="!loading_users">
                        <v-col class="inputarea black--text" md="6" offset-md="3">
                            <p v-if="users.length" class="flow-text"><i class="material-icons">account_circle</i> Käyttäjiä yhteensä: {{users.length}} kpl</p>
                            <p v-else class="flow-text"><i class="material-icons">account_circle</i> Ei käyttäjiä!</p>
                        </v-col>
                    </v-row>
                    <v-row v-else>
                        <v-col md="6" offset-md="3">
                            <h3>Ladataan käyttäjiä...</h3>
                            <ProgressBarQuery />
                        </v-col>
                    </v-row>
                    <!-- if this.loading_competitions === false, meaning app isn't loading competitions, then show this div --> 
                    <v-row v-if="!loading_competitions">
                        <v-col class="inputarea black--text" md="6" offset-md="3">
                            <p v-if="competitions.length" class="flow-text"><i class="material-icons">directions_boat</i> Kilpailuja yhteensä: {{competitions.length}} kpl</p>
                            <p v-else class="flow-text"><i class="material-icons">directions_boat</i> Ei kilpailuja!</p>
                        </v-col>
                    </v-row>
                    <v-row v-else>
                        <v-col md="6" offset-md="3">
                            <h3>Ladataan kilpailuja...</h3>
                            <ProgressBarQuery />  
                        </v-col>
                    </v-row>
                </v-container>
            </v-tab-item>
            <v-tab-item :value="'users'">
                <v-container>
                    <v-row>
                        <v-col>
                            <v-btn large rounded color="yellow" @click="$router.go(-1)"><i class="material-icons left">history</i>Palaa takaisin</v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <h1>Käyttäjät</h1>
                        </v-col>
                    </v-row>
                    <v-row v-if="users.length">
                        <v-col>
                            <ul
                            id="fish_weights"
                            >
                                <!-- Vue loop --> 
                                <!-- similar to js foreach loop --> 
                                <li
                                    v-for="(user, index) in users"
                                    :key="index"
                                >
                                    <!-- For every user in this.users array --> 
                                    <v-row>
                                        <v-col class="card-panel blue lighten-5 z-depth-1">
                                            <p v-if="user.is_admin" class="flow-text">#{{index+1}}. {{user.name}} (Admin)<i class="material-icons">admin_panel_settings</i></p>
                                            <p v-else class="flow-text">#{{index+1}}. {{user.name}} (Käyttäjä)<i class="material-icons">account_circle</i></p>
                                            
                                            <div class="row valign-wrapper">
                                                <div class="col s12">
                                                    <p class="black-text flow-text " style="word-break: break-all;">
                                                        Sähköposti: {{ user.email }}
                                                    </p>
                                                    <p class="black-text flow-text " style="word-break: break-all;">
                                                        Tili luotu: {{ user.createdAt }}
                                                    </p>
                                                </div>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </li>
                            </ul>
                        </v-col>
                    </v-row>
                    <!-- users.length === 0 === false-->
                    <v-row v-else-if="loading_users">
                        <v-col md="10" offset-md="1">
                            <v-sheet
                                :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
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
                            <h2>Ei käyttäjiä!</h2>
                        </v-col>
                    </v-row>
                </v-container>
            </v-tab-item>
            <v-tab-item :value="'competitions'">
                <v-container>
                    <v-row>
                        <v-col>
                            <v-btn large rounded color="yellow" @click="$router.go(-1)"><i class="material-icons left">history</i>Palaa takaisin</v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <h1>Kilpailut</h1>
                        </v-col>
                    </v-row>
                    <!-- if there are competitions in database--> 
                    <v-row v-if="competitions.length">
                        <v-col md="10" offset-md="1">
                            <table border=1 id="competitions" class="centered responsive-table tablearea highlight">
                                <thead class="title">
                                <tr>
                                    <th>Kilpailun Päivämäärä</th>
                                    <th>Nimi</th>
                                    <th>Käyttäjän id</th>
                                    <th>Cup</th>
                                    <th>Tila</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                <!-- For every competition in this.competitions array --> 
                                <tr v-for="(competition, index) in competitions"
                                    v-bind:item = "competition"
                                    v-bind:index = "index"
                                    v-bind:key="competition._id"
                                >
                                    <th style class="center-align" scope="row">{{ `${competition.start_date.date()}.${competition.start_date.month()+1}.${competition.start_date.year()} - ${competition.end_date.date()}.${competition.end_date.month()+1}.${competition.end_date.year()}` }}</th>  
                                    <td style>{{ competition.name }}</td>
                                    <td style>{{ competition.user_id }}</td> 
                                    <td style>{{ competition.cup_name }}</td> 
                                    <td style>{{ competition.state }}</td>
                                    <td><v-btn tile color="primary" @click="pickCompetition(competition)" :loading="loading_competitions"><i class="material-icons left">check</i>Valitse</v-btn></td>
                                    <td><v-btn tile color="red" @click="deleteCompetition(competition._id, false)" :loading="loading_competitions"><i class="material-icons left">delete_forever</i>Poista</v-btn></td>
                                </tr>
                                </tbody>
                            </table>
                        </v-col>
                    </v-row>
                    <!-- this.competitions.length === 0 === false --> 
                    <v-row v-else>
                        <v-col v-if="loading_competitions" md="10" offset-md="1">
                            <v-sheet
                                :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
                                class="px-3 pt-3 pb-3"
                            >
                                <v-skeleton-loader
                                class="mx-auto"
                                type="card"
                                ></v-skeleton-loader>
                            </v-sheet>
                        </v-col>
                        <v-col v-else>
                            <h2 >Ei Kilpailuja!</h2>
                        </v-col>
                    </v-row>
                </v-container>
            </v-tab-item>
            <v-tab-item :value="'feedback'">
                <v-container>
                    <v-row>
                        <v-col>
                            <v-btn large rounded color="yellow" @click="$router.go(-1)"><i class="material-icons left">history</i>Palaa takaisin</v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <h1>Saatu Palaute</h1>
                        </v-col>
                    </v-row>

                    <v-row v-if="feedback.length">
                        <v-col>
                          <ul
                            id="fish_weights"
                            >
                                <!-- For every feedback in this.feedback array --> 
                                <li
                                
                                    v-for="(feedback, index) in feedback"
                                    :key="index"
                                >
                                    <v-card
                                        class="mx-auto"
                                        dark
                                        min-width="200px"
                                        max-width="850px"
                                        style="margin-bottom:30px;margin-top:30px"
                                    >
                                        <v-card-title>
                                            <v-col md="10" offset-md="1">
                                                <span class="title font-weight-light">#{{index+1}} {{feedback.type}}</span>
                                            </v-col>
                                        </v-card-title>
                                        <v-card-text class="headline font-weight-bold white--text" style="word-break: break-all;">
                                            {{ feedback.message }}
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-col>
                                                <v-btn large rounded color="yellow" :loading="loading" @click="deleteFeedback(feedback._id)" class="black--text"><i class="material-icons left">done_outline</i>Ratkaise</v-btn>
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
                                :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
                                class="px-3 pt-3 pb-3"
                            >
                                <v-skeleton-loader
                                class="mx-auto"
                                type="card"
                                ></v-skeleton-loader>
                            </v-sheet>
                        </v-col>
                        <v-col v-else>
                            <h2 >Palautetta ei vielä annettu!</h2>
                        </v-col>
                    </v-row>
                </v-container>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
    "use strict";
    import M from "materialize-css";
    import "vue-select/dist/vue-select.css";
    import FeedbackService from '../FeedbackService';
    import Timedate from '../components/layout/Timedate';
    import Header from "../components/layout/Header";
    import UserService from '../UserService';
    import CompetitionService from '../CompetitionService';
    import moment from 'moment';
    import ProgressBarQuery from '../components/layout/ProgressBarQuery';

    export default {
        data () {
            return {
                tab: null,
                feedback: [],
                users: [],
                competitions: [],
                loading: false,
                loading_users: false,
                loading_competitions: false,
                theme: {isDark:true}
            }
        },
        components: {
            Timedate,
            ProgressBarQuery,
            Header
        },
        // Called everytime page is opened
        async mounted() {
            //Init materialize elements
            M.AutoInit();
            //TODO clocks doesn't appear on refreshing the tab
            //Check if user is logged in has admin status, update header
            this.checkLogin();
            // Show loading progressbars
            this.loading = this.loading_users = this.loading_competitions = true;
            try {
                // Load data from database
                this.feedback = await FeedbackService.getFeedback();
                this.loading = false;
                this.users = await UserService.getUsers();
                this.loading_users = false;
                this.competitions = await CompetitionService.getAllCompetitions();
                this.competitions.forEach(competition => {
                    competition.start_date = moment(competition.start_date);
                    competition.end_date = moment(competition.end_date);
                });
                // Sort them based on start_date so the oldest competitions are the last
                this.competitions.sort(function compare(a,b) {
                    return moment(b.start_date).isAfter(moment(a.start_date));
                })
                this.loading_competitions = false;
            } catch(err) {
                console.error(err.message);
            }
        },
        methods: {
            //Check if user is logged in has admin status, update values to vuex (Header.vue updates based on these values)
            checkLogin: function() {
                // If login token present --> user is logged in
                if(localStorage.getItem('jwt') != null){
                    this.$store.state.logged_in = true;
                    let user = JSON.parse(localStorage.getItem('user'));
                    // Check if user is admin
                    // NOTE safer way to check this than use localstorage?
                    user.is_admin == true ? this.$store.state.is_admin = true : this.$store.state.is_admin = false;
                }
                else {
                    //Not logger in, so not admin either
                    this.$store.state.logged_in = false;
                    this.$store.state.is_admin = false;
                }
            },
            // Delete received feedback
            async deleteFeedback(id) {
                this.loading = true;
                try{
                    //Delete feedback from database (check 'client\src\FeedbackService.js' and 'server\routes\api\feedback.js' to see how this works) 
                    await FeedbackService.deleteFeedback(id);
                    M.toast({html: "Palaute ratkaistu!"});
                    // Get updated list from database
                    this.feedback = await FeedbackService.getFeedback();
                    this.loading = false;
                } catch(err) {
                    console.error(err.message);
                } 
            },
            pickCompetition: function(competition) {
                // Pick competition for the app to use
                //NOTE Store competition to vuex, redundant?
                this.$store.state.competition = competition;
                // Set competition._id to localstorage for database queries
                localStorage.setItem("competition", competition._id);
                // redirect to /overview
                this.$router.push({path: '/overview'});
            },
            // Delete competition from database
            async deleteCompetition(id, confirmed) {
                // If user clicked "OK" on confirmation box
                if(confirmed) {
                    M.toast({html: "Poistetaan tietokannasta!"});
                    this.loading_competitions = true;
                    try{
                        //Delete competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works) 
                        await CompetitionService.deleteCompetition(id);
                        this.competitions = await CompetitionService.getAllCompetitions();
                        // Change dates to moment objects, so they are easy to format
                        this.competitions.forEach(competition => {
                            competition.start_date = moment(competition.start_date);
                            competition.end_date = moment(competition.end_date);
                        });
                        // Store to vuex
                        this.$store.state.competitions = this.competitions;
                        this.loading_competitions = false;
                    } catch(err) {
                        console.error(err.message);
                    }                
                }
                // Show confirmation box on first function call
                else {
                    this.$confirm("Oletko varma?", "Poista kilpailu", 'question')
                    .then((r) => {
                        // if user clicked "OK" on confirmation box
                        if(r) {
                            this.deleteCompetition(id, r);
                        }
                    })
                    .catch((error) => {
                        if(error){
                            console.error(error);
                        }
                    });
                }
            },
        },
    }
</script>
<style scoped>
    h1, h2 {
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