<template>

    <div class="container">
        <Timedate />
        <div class="row">
            <ul class="tabs">
            <li class="tab col s3">
                <a class="active" href="#overview">Yleisnäkymä</a>
            </li>
            <li class="tab col s3">
                <a class="active" href="#users">Käyttäjät</a>
            </li>
            <li class="tab col s3">
                <a class="active" href="#competitions">Kilpailut</a>
            </li>
            <li class="tab col s3">
                <a href="#feedback">Saatu palaute</a>
            </li>
            </ul>
        </div>
        <div class="section" id="overview">
            <h1>Yleistietoja</h1>
            <div v-if="!loading" class="row blue lighten-5">
                <p v-if="feedback.length" class="flow-text"><i class="material-icons">feedback</i> Palautetta annettu: {{feedback.length}} kpl</p>
                <p v-else class="flow-text"><i class="material-icons">feedback</i> Ei palautetta!</p>
            </div>
            <div v-else>
                <h3>Ladataan palautteita...</h3>
                <ProgressBarQuery />
            </div>
            <div v-if="!loading_users" class="row blue lighten-5">
                <p v-if="users.length" class="flow-text"><i class="material-icons">account_circle</i> Käyttäjiä yhteensä: {{users.length}} kpl</p>
                <p v-else class="flow-text">Ei käyttäjiä!</p>
            </div>
            <div v-else>
                <h3>Ladataan käyttäjiä...</h3>
                <ProgressBarQuery />
            </div>
            <div v-if="!loading_competitions" class="row blue lighten-5">
                <p v-if="competitions.length" class="flow-text"><i class="material-icons">directions_boat</i> Kilpailuja yhteensä: {{competitions.length}} kpl</p>
                <p v-else class="flow-text">Ei kilpailuja!</p>
            </div>
            <div v-else>
                <h3>Ladataan kilpailuja...</h3>
                <ProgressBarQuery />     
            </div>
        </div>
        <div class="section" id="users">
            <h1>Käyttäjät</h1>
            <div class="" v-if="users.length">
                <ul
                id="fish_weights"
                >
                <li
                    v-for="(user, index) in users"
                    :key="index"
                >
                
                    <div class="row">
                        <div class="card-panel blue lighten-5 z-depth-1">
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
                        </div>
                    </div>
                </li>
                </ul>
            </div>
        </div>
        <div class="section" id="competitions">
            <h1>Kilpailut</h1>
            <div v-if="competitions.length">
            <table border=1 id="competitions" class="centered responsive-table tablearea highlight">
                <thead class="title">
                <tr>
                    <th>Kilpailun Päivämäärä</th>
                    <th>Nimi</th>
                    <th>Käyttäjän id</th>
                    <th>Cup</th>
                    <th>Tila</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
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
                </tr>
                </tbody>
            </table>
            </div>
        </div>
        <div class="section" id="feedback">
            <h1>Saatu Palaute</h1>
            <div class="" v-if="feedback.length">
                <ul
                id="fish_weights"
                >
                <li
                    v-for="(feedback, index) in feedback"
                    :key="index"
                >
                
                <div class="col s12 m8 offset-m2 l6 offset-l3">
                    <div class="card-panel grey lighten-5 z-depth-1">
                        <p class="flow-text">#{{index+1}} {{feedback.type}} <i class="material-icons">report</i></p>
                        <div class="row valign-wrapper">
                        <div class="col s2">
                            <img src="../assets/logo.png" alt="" class="circle responsive-img"> <!-- notice the "circle" class -->
                        </div>
                        <div class="col s10">
                            <p class="black-text flow-text " style="word-break: break-all;">
                            {{ feedback.message }}
                            </p>
                        </div>
                        </div>
                        <div class="row section center-align">
                        <a v-on:click="deleteFeedback(feedback._id)" class="waves-effect waves-light yellow btn black-text col s4 push-s4">
                            <i class="material-icons left">done_outline</i>
                            Ratkaise
                        </a>
                        </div>
                    </div>
                    </div>
                </li>
                </ul>
            </div>
            <div v-else>
                <div class="title">
                <p class="flow-text">Palautetta ei ole annettu vielä!</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import M from "materialize-css";
    import { options_picker } from "../i18n";
    import "vue-select/dist/vue-select.css";
    import FeedbackService from '../FeedbackService';
    import Timedate from '../components/layout/Timedate';
    import UserService from '../UserService';
    import CompetitionService from '../CompetitionService';
    import moment from 'moment';
    import ProgressBarQuery from '../components/layout/ProgressBarQuery';

    export default {
        data () {
            return {
                feedback: [],
                users: [],
                competitions: [],
                loading: false,
                loading_users: false,
                loading_competitions: false,
            }
        },
        components: {
            Timedate,
            ProgressBarQuery
        },
        async mounted() {
            //Init materialize elements
            M.AutoInit();
            /* eslint-disable no-unused-vars */
            //TODO clocks doesn't appear on refreshing the tab
            var tabs = document.querySelectorAll(".tabs");
            var instance = M.Tabs.init(tabs, options_picker);
            /* eslint-enable no-unused-vars */
            var elem = document.querySelectorAll(".tabs")[0];
            this.tabs = M.Tabs.getInstance(elem);
            this.$store.commit('refreshCompetition', null);
            this.checkLogin();
            this.loading = this.loading_users = this.loading_competitions = true;
            try {
                this.feedback = await FeedbackService.getFeedback();
                this.loading = false;
                this.users = await UserService.getUsers();
                this.loading_users = false;
                this.competitions = await CompetitionService.getAllCompetitions();
                this.competitions.forEach(competition => {
                    competition.start_date = moment(competition.start_date);
                    competition.end_date = moment(competition.end_date);
                });
                this.loading_competitions = false;
            } catch(err) {
                this.error = err.message;
            }
        },
        methods: {
            checkLogin: function() {
                if(localStorage.getItem('jwt') != null){
                    this.$store.state.logged_in = true;
                    let user = JSON.parse(localStorage.getItem('user'));
                    user.is_admin == true ? this.$store.state.is_admin = true : this.$store.state.is_admin = false;
                }
                else {
                    this.$store.state.logged_in = false;
                    this.$store.state.is_admin = false;
                }
            },
            async deleteFeedback(id) {
                M.toast({html: "Palaute ratkaistu!"});
                this.loading = true;
                try{
                await FeedbackService.deleteFeedback(id);
                this.feedback = await FeedbackService.getFeedback();
                this.loading = false;
                } catch(err) {
                this.error = err.message;
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