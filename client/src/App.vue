<template>
  <!-- Main file for the application -->
  <!-- html and js autoinjects to here (on index.html in server) -->
  <v-app
    id="app"
    style="
        background: rgba(0,0,0,0.3);"
  >
    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- If using vue-router -->
      <router-view></router-view>
    </v-main>

    <Footer />
  </v-app>
</template>

<script>
"use strict";
import UserService from "./UserService";
import Footer from "./components/layout/Footer";

export default {
  name: "App",
  components: {
    Footer,
  },
  mounted() {
    try {
      window.addEventListener("beforeunload", async function() {
        //TODO implement this in express? with a '/logout' route and verifyToken middleware somehow?
        if (localStorage.getItem("jwt") !== null) {
          let token = localStorage.getItem("jwt");
          //FIXME gives 400 bad request error on console when token is expired, but still works
          await UserService.checkToken(token)
            .then((response) => {
              // Token valid, no action needed
              console.log(response);
            })
            .catch((err) => {
              if (err.message === "Request aborted") {
                return;
              }
              // Expired token
              if (err.response.status === 400) {
                localStorage.removeItem("jwt");
                localStorage.removeItem("user");
                return;
              }
              // No token
              if (err.response.status === 401) {
                return;
              }
              return console.log(err);
            });
        }
      });
    } catch (err) {
      console.log(err.message);
    }
  },
};
</script>

<style>
.header {
  position: fixed; /* fixing the position takes it out of html flow - knows
                   nothing about where to locate itself except by browser
                   coordinates */
  left: 0; /* top left corner should start at leftmost spot */
  top: 0; /* top left corner should start at topmost spot */
  width: 100vw; /* take up the full browser width */
  z-index: 200; /* high z index so other content scrolls underneath */
  height: 64px; /* define height for content */
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
  position: relative; /* height of your footer */
  width: 100%;
}
body {
  display: flex;
  flex-direction: column;
  background: url("https://i.imgur.com/uLrR7M1.png");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
#app .container-transparent {
  background: rgba(149, 233, 248, 0.4);
  border-radius: 2%;
  border: white 1px solid;
}

#app .container-transparent-dark {
  background: rgba(15, 29, 70, 0.712);
  border-radius: 2%;
  border: white 1px solid;
}

#app h1 {
  -webkit-text-stroke: 1px black;
  color: white;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
}
.time {
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.45);
  padding: 5px;
  color: black;
  border: 2px solid white;
}

.time-dark {
  border-radius: 25px;
  background: rgba(15, 29, 70, 0.712);
  padding: 5px;
  color: black;
  border: 2px solid rgb(1, 0, 51);
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
}

#app .inputarea-dark {
  background: rgba(46, 46, 46, 0.856);
}

#app .tablearea {
  background: rgb(156, 215, 255);
  border-radius: 2%;
}
table.highlight > tbody > tr:hover {
  background-color: rgb(0, 153, 255) !important;
  border: 1px solid black;
  cursor: pointer;
}
table.highlight > tr:hover {
  background-color: rgb(0, 153, 255) !important;
  border: 1px solid black;
  cursor: pointer;
}
#app .selected {
  background-color: rgb(0, 114, 19) !important;
  color: white;
  border: 2px solid black;
}
#app li#fish_spec {
  margin: 20px;
  padding: 20px;
  border-radius: 2%;
  border: 1px solid black;
}
#app li#fish_spec:nth-child(odd) {
  background: rgba(88, 103, 129, 0.43);
}
#app .input-fields {
  background: rgba(160, 228, 255, 0.253);
  border-radius: 2%;
  border: 1px solid black;
}
#app .title {
  background: rgba(104, 112, 230, 0.212);
  border-radius: 2%;
  border: 1px solid rgb(0, 0, 61);
}

#app .table_header thead {
  background: rgb(0, 1, 34);
  color: #fff;
}

.blue_th {
  background: rgb(0, 1, 34);
  color: #fff;
}

#app .scroll_table {
  max-height: 500px;
  overflow: auto;
}
.v-tab--disabled {
  background: grey;
}
.v-tab--active {
  background: rgb(65, 141, 255);
}

.theme--light.v-divider {
  border-color: rgba(0, 0, 0, 0.699) !important;
}

.theme--dark.v-divider {
  border-color: rgba(219, 219, 219, 0.705) !important;
}
</style>
