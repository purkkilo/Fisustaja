<template>
    <!-- Starting page, / -->  
    <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
    <div class="container" style="margin-top:100px">
        <MainHeader />
        <div class="section">
            <div class="col s12 center-align"><h1>Fisustaja</h1></div>
        </div>

        <div class="section row inputarea">
            <!-- TODO Cool starting page... -->  
            <div class="col s12">
                <h4>Sovellus kalastuskilpailujen järjestämistä varten</h4>
            </div>
        </div>
    </div>

</template>

<script>
    "use strict";
    import MainHeader from '../components/layout/MainHeader';

    export default {
        name: 'Home',
        components: {
            MainHeader,
        },
        data() {
            return {
            }
        },
        mounted() {
            // Check if user is logged in has admin status, update header
            this.checkLogin();
            // Set competition in localstorage and vuex to null
            this.$store.commit('refreshCompetition', null);
            localStorage.removeItem("competition");
            this.$store.commit('refreshCup', null);
            localStorage.removeItem("cup");

            // Focus on top of the page when changing pages
            location.href = "#";
            location.href = "#app";
        },
        methods: {
            //Check if user is logged in has admin status, update values to vuex (Header.vue updates based on these values)
            checkLogin: function() {
                // If login token present --> user is logged in
                if(localStorage.getItem('jwt') != null){
                    this.$store.state.logged_in = true;
                    let user = JSON.parse(localStorage.getItem('user'));
                    // Check if user is admin
                    //TODO safer way to check this than use localstorage?
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

</style>
