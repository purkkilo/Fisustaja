<template>
    <!-- /dashboard-->  
    <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
    <div class="container">
        <Header />
        <Timedate/>
        <div class="container-transparent">
            <div class="section">
                <div class="col s12 center-align"><h1>Dashboard</h1></div>
            </div>
            <v-container>
                <v-row>
                    <v-col>
                        <!-- if user is found on localstorage (this.user is not null/false) -->
                        <div v-if="user">
                            <h3><b>{{ user.name }}</b></h3>
                            <h3><b>{{ user.email }}</b></h3>
                            <h3><b>Tili luotu: {{ created }}</b></h3>
                        </div>

                        <div class="divider black"></div>
                        <div class="section">
                            <v-row>
                                <v-col md="6">
                                    <router-link to="/register-comp">
                                        <v-btn large tile color="blue lighten-1"><i class="material-icons left">add_circle_outline</i>Uusi kilpailu</v-btn>
                                    </router-link>                             
                                </v-col>                            

                                <v-col md="6">
                                    <router-link to="/continue">
                                        <v-btn large tile color="green lighten-1"><i class="material-icons left">play_circle_filled</i>Jatka kilpailua</v-btn>
                                    </router-link>
                                </v-col>                        
                            </v-row>   
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </div>
    </div>
</template>

<script>
    "use strict";
    import Timedate from '../components/layout/Timedate';
    import Header from "../components/layout/Header";
    import moment from 'moment';

    export default {
        name: 'Home',
        components: {
            Timedate,
            Header
        },
        data() {
            return {
                user: null,
                created: null,
            }
        },
        mounted() {

            // Set competition in localstorage and vuex to null
            this.$store.commit('refreshCompetition', null);
            localStorage.removeItem("competition");
            this.$store.commit('refreshCup', null);
            localStorage.removeItem("cup");
            //Check if user is logged in has admin status, update header
            this.checkLogin();
            // Get user info form localstorage
            if(localStorage.getItem('user') != null){
                this.user = JSON.parse(localStorage.getItem('user'));
                let createdAt = moment(this.user.createdAt);
                this.created = `${createdAt.date()}.${createdAt.month()+1}.${createdAt.year()}`;
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
        },
    }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
    background-image: url('../assets/background_waterdrop.png');
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
}

</style>
