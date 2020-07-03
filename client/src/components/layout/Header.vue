<template>
  <div>
    <header class="header">
      <div class="navbar-fixed">
        <nav>
          <div class="nav-wrapper blue lighten-2">
            <router-link to="/"><img src="../../assets/clienticon_new.png" alt="" class="circle responsive-img left" style="height:55px;width:55px;margin:5px 10px;"></router-link>
            <router-link to="/"><a href="#!" class="brand-logo">Fisustaja</a></router-link>
            <a href="#" data-target="slide-out" class="sidenav-trigger right"><i class="material-icons">menu</i></a>
            <ul class="right hide-on-med-and-down" v-if="isUserLoggedIn">
                <li v-bind:class="isDashboardPage"><router-link to="/dashboard"><a><i class="material-icons left">home</i>Dashboardiin</a></router-link></li>
                <li v-if="isCompetitionSet" v-bind:class="isOverviewPage"><router-link to="/overview"><a><i class="material-icons left">directions_boat</i>Yleisnäkymä</a></router-link></li>
                <li v-if="isAdmin" v-bind:class="isAdminPage"><router-link to="/admin"><a><i class="material-icons left">admin_panel_settings</i>Admin</a></router-link></li>
                <li v-bind:class="isFeedbackPage"><router-link to="/feedback"><a><i class="material-icons left">feedback</i>Palaute</a></router-link></li>
                <li><a v-on:click="logout" class="waves-effect waves-light red darken-4 btn-large"><i class="material-icons left">power_settings_new</i>Kirjaudu ulos</a></li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
    <ul id="slide-out" class="sidenav background grey darken-4">
      <div v-if="isUserLoggedIn">
        <li v-if="isUser"><div class="user-view">
          <div class="background blue darken-4">
            <img src="">
          </div>
          <span class="white-text name"><i class="material-icons left">account_circle</i></span>
          <span class="white-text name">{{ isUser.name }}</span>
          <span class="white-text email">{{ isUser.email }}</span>
        </div></li>
        <li v-bind:class="isDashboardPage" style="margin-top:20px"><router-link to="/dashboard"><a><i class="material-icons left">home</i>Dashboardiin</a></router-link></li>
        <li style="margin-top:20px" v-if="isCompetitionSet" v-bind:class="isOverviewPage"><router-link to="/overview"><a><i class="material-icons left">directions_boat</i>Yleisnäkymä</a></router-link></li>
        <li style="margin-top:20px" v-if="isAdmin" v-bind:class="isAdminPage"><router-link to="/admin"><a><i class="material-icons left">admin_panel_settings</i>Admin</a></router-link></li>
        <li style="margin-top:20px" v-bind:class="isFeedbackPage"><router-link to="/feedback"><a><i class="material-icons left">feedback</i>Palaute</a></router-link></li>
        <li style="margin-top:20px"><a class="waves-effect waves-light red darken-4 btn-large" v-on:click="logout"><i class="material-icons left">power_settings_new</i>Kirjaudu ulos</a></li>        
      </div>
    </ul>
  </div>
</template>

<script>
import M from 'materialize-css';

export default {
  name: "Header",
    data(){
        return {
          user: null,
        }
    },
  mounted() {
    //Init materialize elements
    M.AutoInit();
  },
  computed: {
      isDashboardPage() {
          return{
              'active': this.$route.name === "dashboard",
          }
      },
      isFeedbackPage() {
          return{
              'active': this.$route.name === "Feedback",
          }
      },
      isAdminPage() {
          return{
              'active': this.$route.name === "admin",
          }
      },
      isOverviewPage() {
          return{
              'active': this.$route.name === "Overview",
          }
      },
      isUser() {
        if(localStorage.getItem('jwt') != null) {
          return JSON.parse(localStorage.getItem('user'));
        }
        else {
          return null;
        }
      },
      isUserLoggedIn() {
        return this.$store.getters.isLoggedIn;
      },
      isAdmin() {
        return this.$store.getters.isAdmin;
      },
      isCompetitionSet() {
        if(this.$store.getters.getCompetition) {
          return true;
        }
        else {
          return false;
        }
      }
  },
  methods: {
    logout: function() {
      localStorage.removeItem('user');
      localStorage.removeItem('jwt');
      this.$store.state.logged_in = false;
      this.$store.state.is_admin = false;
      this.$router.push("/");
      this.$store.commit('refreshCompetition', null);
      this.user = null;
      M.toast({html: "Kirjattu ulos onnistuneesti!"});
    },
  }
}
</script>

<style scoped>
</style>
