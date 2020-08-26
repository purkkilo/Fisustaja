<template>
  <div>
    <header class="header">
      <div class="navbar-fixed">
        <nav>
          <div class="nav-wrapper blue lighten-2">
            <router-link to="/"
              ><img
                src="https://i.imgur.com/2WcI49A.png"
                alt=""
                class="circle responsive-img left"
                style="height:55px;width:55px;margin:5px 10px;"
            /></router-link>
            <router-link to="/"
              ><a href="#!" class="brand-logo white-text"
                >Fisustaja</a
              ></router-link
            >
            <a href="#" data-target="slide-out" class="sidenav-trigger right"
              ><i class="material-icons">menu</i></a
            >
            <ul class="right hide-on-med-and-down">
              <li v-bind:class="isHome">
                <router-link to="/"
                  ><a class="white-text"
                    ><i class="material-icons left">home</i>Kotisivu</a
                  ></router-link
                >
              </li>
              <li v-bind:class="isRegister">
                <router-link to="/register"
                  ><a class="white-text"
                    ><i class="material-icons left">add_circle_outline</i
                    >Rekisteröidy</a
                  ></router-link
                >
              </li>
              <li v-bind:class="isLogin">
                <router-link to="/login"
                  ><a class="white-text"
                    ><i class="material-icons left">play_circle_filled</i
                    >Kirjaudu</a
                  ></router-link
                >
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
    <ul id="slide-out" class="sidenav background grey darken-4">
      <li v-bind:class="isHome">
        <router-link to="/"
          ><a class="white-text"
            ><i class="material-icons left">home</i>Kotisivu</a
          ></router-link
        >
      </li>
      <li v-bind:class="isRegister">
        <router-link to="/register"
          ><a class="white-text"
            ><i class="material-icons left">add_circle_outline</i
            >Rekisteröidy</a
          ></router-link
        >
      </li>
      <li v-bind:class="isLogin">
        <router-link to="/login"
          ><a class="white-text"
            ><i class="material-icons left">play_circle_filled</i>Kirjaudu</a
          ></router-link
        >
      </li>
    </ul>
  </div>
</template>

<script>
import M from "materialize-css";

export default {
  name: "Header",
  data() {
    return {
      user: null,
    };
  },
  mounted() {
    //Init materialize elements
    M.AutoInit();
  },
  computed: {
    isHome() {
      return {
        active: this.$route.name === "Home",
      };
    },
    isLogin() {
      return {
        active: this.$route.name === "login",
      };
    },
    isRegister() {
      return {
        active: this.$route.name === "register",
      };
    },
  },
  methods: {},
};
</script>

<style scoped></style>
