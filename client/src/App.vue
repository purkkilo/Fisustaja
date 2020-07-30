<template>
  <!-- Main file for the application -->  
  <!-- html and js autoinjects to here (on index.html in server) -->
  <div id ="app">
    <v-app
        style="
        background: rgba(0,0,0,0);"
    >
        <!-- Sizes your content based upon application components -->
        <v-main>
            <!-- If using vue-router -->
            <router-view></router-view>

        </v-main>

        <v-footer app>
            <Footer />
        </v-footer>
    </v-app>
  </div>

</template>

<script>
    "use strict"
    import Footer from './components/layout/Footer';

    export default {
    name: 'App',
    components: {
        Footer
    },
    }
</script>

<style>
.header {
  position:fixed; /* fixing the position takes it out of html flow - knows
                   nothing about where to locate itself except by browser
                   coordinates */
  left:0;           /* top left corner should start at leftmost spot */
  top:0;            /* top left corner should start at topmost spot */
  width:100vw;      /* take up the full browser width */
  z-index:200;  /* high z index so other content scrolls underneath */
  height:50px;     /* define height for content */
}

.layout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    min-height: 100vh; /* will cover the 100% of viewport */
    overflow: hidden;
    display: block;
    position: relative;
    padding-bottom: 180px; /* height of your footer */
    width: 100%;
}
body {
    display: flex;
    flex-direction: column;
    background-image: url('./assets/background_waterdrop.png');
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
}
#app .container-transparent {
    margin-top: 50px;
    background: rgba(149, 233, 248, 0.4);
    border-radius: 2%;
    border: white 1px solid;
}
#app h1 {
    -webkit-text-stroke: 1px black;
    color: white;
    text-shadow:
    -1px -1px 0 #000,  
     1px -1px 0 #000,
     -1px 1px 0 #000,
      1px 1px 0 #000;
 }
.time {
border-radius: 25px;
background: rgba(255, 255, 255, 0.45);
padding: 5px;

color:black;
}
#app li.collection-item:nth-child(odd) {
    background: rgb(255, 142, 142) !important;
    border: 1px solid red;
}
#app li.collection-item:nth-child(even) {
    background: rgb(255, 203, 203) !important;
    border: 1px solid red;
}

#app .inputarea {
    background: rgba(255, 255, 255, 0.7);
    border-radius: 2%;
}
#app .tablearea {
    background: rgb(156, 215, 255);
    border-radius: 2%;
}
table.highlight>tbody>tr:hover {
    background-color: rgb(0, 153, 255) !important;
    border: 1px solid black;
    cursor: pointer;
}
table.highlight>tr:hover {
    background-color: rgb(0, 153, 255) !important;
    border: 1px solid black;
    cursor: pointer;
}
#app .selected {
    background-color: rgb(0, 114, 19) !important;
    color:white;
    border: 2px solid black;
}
#app li#fish_spec{
    margin:20px;
    padding:20px;
    border-radius: 2%;
    border:1px solid black;
}
#app li#fish_spec:nth-child(odd){
    background: rgba(180, 206, 255, 0.43);
}
#app .input-fields{
    background: rgba(160, 228, 255, 0.253);
    border-radius: 2%;
    border: 1px solid black;
}
#app .title {
    background: rgba(104, 112, 230, 0.212);
    border-radius: 2%;
    border: 1px solid rgb(0, 0, 61);
}
#app .fixed_header{
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
}
#app .fixed_header tbody{
  display:block;
  width: 100%;
  overflow: auto;
  max-height: 400px;
}
#app .fixed_header thead tr {
   display: block;
}
#app .fixed_header thead {
  background: rgb(0, 1, 34);
  color:#fff;
}
#app .fixed_header th, .fixed_header td {
  padding: 5px;
  width: 400px;
  height: 50px;
}
</style>
