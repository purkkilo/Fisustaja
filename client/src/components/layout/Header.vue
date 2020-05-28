<template>
  <header class="header">
    <div class="navbar-fixed">
      <nav>
        <div class="nav-wrapper blue lighten-2">
          <img src="../../assets/clienticon_new.png" alt="" class="circle responsive-img left" style="height:55px;width:55px;margin:5px 10px;">
          <router-link to="/"><a href="#!" class="brand-logo">Fisustaja</a></router-link>
          <a href="#" data-target="mobile" class="sidenav-trigger"><i class="material-icons">menu</i></a>
          <ul class="right hide-on-med-and-down">
              <li><router-link to="/"><a class="waves-effect waves-light blue darken-2 btn-large"><i class="material-icons left">home</i>Alkuun</a></router-link></li>
              <li><router-link to="/about"><a class="waves-effect waves-light grey darken-2 lighten-1 btn-large"><i class="material-icons left">info</i>About</a></router-link></li>
          </ul>
        </div>
      </nav>
    </div>
  </header>

</template>

<script>
import M from 'materialize-css';
import { options_picker } from '../../i18n';

export default {
  name: "Header",
  mounted() {
    M.AutoInit();
    /* eslint-disable no-unused-vars */
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, options_picker);
    /* eslint-enable no-unused-vars */
  },
}
</script>

<style scoped>
</style>
