<template>
  <div>
    <header class="header">
      <div class="navbar-fixed">
        <nav>
          <div class="nav-wrapper blue lighten-2">
            <router-link to="/"><img src="../../assets/clienticon_new.png" alt="" class="circle responsive-img left" style="height:55px;width:55px;margin:5px 10px;"></router-link>
            <router-link to="/"><a href="#!" class="brand-logo">Fisustaja</a></router-link>
            <a href="#" data-target="slide-out" class="sidenav-trigger"><i class="material-icons">menu</i></a>
            <ul class="right hide-on-med-and-down" v-if="!isUserLoggedIn">
                <li><router-link to="/"><a class="waves-effect waves-light blue lighten-1 lighten-1 btn-large"><i class="material-icons left">home</i>Kotisivulle</a></router-link></li>
                <li>
                  <router-link to="/register">
                      <a class="waves-effect waves-light blue darken-2 btn-large"><i class="material-icons left">add_circle_outline</i>Rekisteröidy</a>
                  </router-link>
                </li>
                <li>
                  <router-link to="/login">
                  <a class="waves-effect waves-light green darken-2 btn-large"><i class="material-icons left">play_circle_filled</i>Kirjaudu</a>
                  </router-link>
                </li>
            </ul>
            <ul class="right hide-on-med-and-down" v-else>
                <li v-if="isUser"><span class="flow-text"><i class="material-icons left">account_box</i>{{ isUser.name }}</span></li>
                <li><router-link to="/dashboard"><a class="waves-effect waves-light blue darken-2 lighten-1 btn-large"><i class="material-icons left">home</i>Dashboardiin</a></router-link></li>
                <li v-if="isAdmin"><router-link to="/admin"><a class="waves-effect waves-light yellow darken-4 lighten-1 btn-large"><i class="material-icons left">admin_panel_settings</i>Admin</a></router-link></li>
                <li><router-link to="/feedback"><a class="waves-effect waves-light grey darken-2 lighten-1 btn-large"><i class="material-icons left">feedback</i>Palaute</a></router-link></li>
                <li><a class="waves-effect waves-light red darken-4 btn-large" v-on:click="logout"><i class="material-icons left">power_settings_new</i>Kirjaudu ulos</a></li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
    <ul id="slide-out" class="sidenav background grey darken-4">
      <div  v-if="!isUserLoggedIn">
        <li style="margin-top:20px"><router-link to="/"><a class="waves-effect waves-light blue lighten-1 lighten-1 btn-large"><i class="material-icons left">home</i>Kotisivulle</a></router-link></li>
        <li style="margin-top:20px">
          <router-link to="/register">
              <a class="waves-effect waves-light blue darken-2 btn-large"><i class="material-icons left">add_circle_outline</i>Rekisteröidy</a>
          </router-link>
        </li>
        <li style="margin-top:20px">
          <router-link to="/login">
          <a class="waves-effect waves-light green darken-2 btn-large"><i class="material-icons left">play_circle_filled</i>Kirjaudu</a>
          </router-link>
        </li>
      </div>
      <div v-else>
        <li v-if="isUser"><div class="user-view">
          <div class="background blue darken-4">
            <img src="">
          </div>
          <span class="white-text name"><i class="material-icons left">account_circle</i></span>
          <span class="white-text name">{{ isUser.name }}</span>
          <span class="white-text email">{{ isUser.email }}</span>
        </div></li>
        <li style="margin-top:20px"><router-link to="/dashboard"><a class="waves-effect waves-light blue darken-2 lighten-1 btn-large"><i class="material-icons left">home</i>Dashboardiin</a></router-link></li>
        <li style="margin-top:20px" v-if="isAdmin"><router-link to="/admin"><a class="waves-effect waves-light yellow darken-4 lighten-1 btn-large"><i class="material-icons left">admin_panel_settings</i>Admin</a></router-link></li>
        <li style="margin-top:20px"><router-link to="/feedback"><a class="waves-effect waves-light grey darken-2 lighten-1 btn-large"><i class="material-icons left">feedback</i>Palaute</a></router-link></li>
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
    M.AutoInit();

  },
  computed: {
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
