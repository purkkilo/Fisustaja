<template>
  <header class="header">
    <h1>Development Navigation</h1>
    <div id="nav row">
      <router-link to="/"><a class="waves-effect waves-light blue lighten-1 btn-large"><i class="material-icons left">home</i>Alkuun</a></router-link>
      <router-link to="/about"><a class="waves-effect waves-light grey darken-2 lighten-1 btn-large"><i class="material-icons left">home</i>About</a></router-link>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header"
}
</script>

<style scoped>
  .header {
    background: rgba(255, 255, 255, 0.411);
    color: #fff;
    text-align: center;
    padding: 10px;
  }
  .header a {
    padding-right: 5px;
    text-decoration: none;
  }
</style>
