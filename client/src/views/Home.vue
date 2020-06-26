<template>

    <div class="container">
      <Timedate/>
      <div class="container-transparent" style="margin-top:5px">
          <div class="section">
              <div class="col s12 center-align"><h1>Fisustaja - Kotisivu</h1></div>
          </div>
        
            <div class="section row inputarea">
                <div class="col s12">
                    <h4>Sovellus kalastuskilpailujen järjestämistä varten</h4>
                    <p class="flow-text">Todo: Tähän jotain järkevää...</p>
                </div>
            </div>
            <div class="row">
                <router-link to="/register">
                    <a class="waves-effect waves-light blue darken-2 btn-large col s4 push-s1"><i class="material-icons left">add_circle_outline</i>Rekisteröidy</a>
                </router-link>
                <router-link to="/login">
                    <a class="waves-effect waves-light green darken-2 btn-large col s4 push-s2"><i class="material-icons left">play_circle_filled</i>Kirjaudu</a>
                </router-link>
            </div>
        </div>
    </div>

</template>

<script>
import Timedate from '../components/layout/Timedate';

export default {
    name: 'Home',
    components: {
        Timedate
    },
    data() {
        return {
        }
    },
    mounted() {
        this.checkLogin();
        localStorage.removeItem("competition");
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
    },
}
</script>

<style>

</style>
