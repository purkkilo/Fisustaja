(function(t){function e(e){for(var i,o,s=e[0],u=e[1],c=e[2],l=0,m=[];l<s.length;l++)o=s[l],Object.prototype.hasOwnProperty.call(a,o)&&a[o]&&m.push(a[o][0]),a[o]=0;for(i in u)Object.prototype.hasOwnProperty.call(u,i)&&(t[i]=u[i]);p&&p(e);while(m.length)m.shift()();return r.push.apply(r,c||[]),n()}function n(){for(var t,e=0;e<r.length;e++){for(var n=r[e],i=!0,o=1;o<n.length;o++){var s=n[o];0!==a[s]&&(i=!1)}i&&(r.splice(e--,1),t=u(u.s=n[0]))}return t}var i={},o={app:0},a={app:0},r=[];function s(t){return u.p+"js/"+({about:"about"}[t]||t)+"."+{about:"4e4ee2d0"}[t]+".js"}function u(e){if(i[e])return i[e].exports;var n=i[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,u),n.l=!0,n.exports}u.e=function(t){var e=[],n={about:1};o[t]?e.push(o[t]):0!==o[t]&&n[t]&&e.push(o[t]=new Promise((function(e,n){for(var i="css/"+({about:"about"}[t]||t)+"."+{about:"7614e570"}[t]+".css",a=u.p+i,r=document.getElementsByTagName("link"),s=0;s<r.length;s++){var c=r[s],l=c.getAttribute("data-href")||c.getAttribute("href");if("stylesheet"===c.rel&&(l===i||l===a))return e()}var m=document.getElementsByTagName("style");for(s=0;s<m.length;s++){c=m[s],l=c.getAttribute("data-href");if(l===i||l===a)return e()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=e,p.onerror=function(e){var i=e&&e.target&&e.target.src||a,r=new Error("Loading CSS chunk "+t+" failed.\n("+i+")");r.code="CSS_CHUNK_LOAD_FAILED",r.request=i,delete o[t],p.parentNode.removeChild(p),n(r)},p.href=a;var g=document.getElementsByTagName("head")[0];g.appendChild(p)})).then((function(){o[t]=0})));var i=a[t];if(0!==i)if(i)e.push(i[2]);else{var r=new Promise((function(e,n){i=a[t]=[e,n]}));e.push(i[2]=r);var c,l=document.createElement("script");l.charset="utf-8",l.timeout=120,u.nc&&l.setAttribute("nonce",u.nc),l.src=s(t);var m=new Error;c=function(e){l.onerror=l.onload=null,clearTimeout(p);var n=a[t];if(0!==n){if(n){var i=e&&("load"===e.type?"missing":e.type),o=e&&e.target&&e.target.src;m.message="Loading chunk "+t+" failed.\n("+i+": "+o+")",m.name="ChunkLoadError",m.type=i,m.request=o,n[1](m)}a[t]=void 0}};var p=setTimeout((function(){c({type:"timeout",target:l})}),12e4);l.onerror=l.onload=c,document.head.appendChild(l)}return Promise.all(e)},u.m=t,u.c=i,u.d=function(t,e,n){u.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},u.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},u.t=function(t,e){if(1&e&&(t=u(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(u.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)u.d(n,i,function(e){return t[e]}.bind(null,i));return n},u.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return u.d(e,"a",e),e},u.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},u.p="/",u.oe=function(t){throw console.error(t),t};var c=window["webpackJsonp"]=window["webpackJsonp"]||[],l=c.push.bind(c);c.push=e,c=c.slice();for(var m=0;m<c.length;m++)e(c[m]);var p=l;r.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"034f":function(t,e,n){"use strict";var i=n("85ec"),o=n.n(i);o.a},"424d":function(t,e,n){t.exports=n.p+"img/clienticon_new.8f8ed215.png"},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var i=n("2b0e"),o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app",{staticStyle:{background:"rgba(0,0,0,0)"},attrs:{id:"app"}},[n("v-main",[n("router-view")],1),n("v-footer",{attrs:{app:""}},[n("Footer")],1)],1)},a=[],r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-footer",{attrs:{app:"",color:"primary lighten-1",paddless:"",absolute:""}},[n("v-row",{attrs:{justify:"center"}},[t._l(t.links,(function(e){return n("v-btn",{key:e,staticClass:"my-2",attrs:{color:"white",text:"",rounded:""}},[t._v(" "+t._s(e)+" ")])})),n("v-col",{staticClass:"primary lighten-2 py-4 text-center white--text",attrs:{cols:"12"}},[t._v(" "+t._s((new Date).getFullYear())+" — "),n("strong",[t._v("Jori Kosonen")])])],2)],1)},s=[],u={name:"Footer",data:function(){return{links:["Work In Progress"]}},mounted:function(){},computed:{},methods:{}},c=u,l=n("2877"),m=n("6544"),p=n.n(m),g=n("8336"),f=n("62ad"),d=n("553a"),h=n("0fd9"),b=Object(l["a"])(c,r,s,!1,null,"3bd5ea1c",null),_=b.exports;p()(b,{VBtn:g["a"],VCol:f["a"],VFooter:d["a"],VRow:h["a"]});var v={name:"App",components:{Footer:_}},w=v,C=(n("034f"),n("7496")),y=n("f6c4"),S=Object(l["a"])(w,o,a,!1,null,null,null),x=S.exports;p()(S,{VApp:C["a"],VFooter:d["a"],VMain:y["a"]});n("8266"),n("45fc"),n("d3b7");var k=n("8c4f"),j=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container",staticStyle:{"margin-top":"100px"}},[n("MainHeader"),t._m(0),t._m(1)],1)},I=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"section"},[n("div",{staticClass:"col s12 center-align"},[n("h1",[t._v("Fisustaja")])])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"section row inputarea"},[n("div",{staticClass:"col s12"},[n("h4",[t._v("Sovellus kalastuskilpailujen järjestämistä varten")])])])}],O=n("e683"),A={name:"Home",components:{MainHeader:O["a"]},data:function(){return{}},mounted:function(){this.checkLogin(),this.$store.commit("refreshCompetition",null),localStorage.removeItem("competition"),this.$store.commit("refreshCup",null),localStorage.removeItem("cup"),location.href="#",location.href="#app"},methods:{checkLogin:function(){if(null!=localStorage.getItem("jwt")){this.$store.state.logged_in=!0;var t=JSON.parse(localStorage.getItem("user"));1==t.is_admin?this.$store.state.is_admin=!0:this.$store.state.is_admin=!1}else this.$store.state.logged_in=!1,this.$store.state.is_admin=!1}}},$=A,E=Object(l["a"])($,j,I,!1,null,null,null),q=E.exports;i["a"].use(k["a"]);var F=[{path:"/",name:"Home",component:q,meta:{guest:!0}},{path:"/login",name:"login",component:function(){return n.e("about").then(n.bind(null,"a55b"))},meta:{guest:!0}},{path:"/register",name:"register",component:function(){return n.e("about").then(n.bind(null,"73cf"))},meta:{guest:!0}},{path:"/dashboard",name:"dashboard",component:function(){return n.e("about").then(n.bind(null,"7277"))},meta:{requiresAuth:!0}},{path:"/admin",name:"admin",component:function(){return n.e("about").then(n.bind(null,"3530"))},meta:{requiresAuth:!0,is_admin:!0}},{path:"/feedback",name:"Feedback",component:function(){return n.e("about").then(n.bind(null,"6e7a"))},meta:{requiresAuth:!0}},{path:"/continue",name:"ContinueComp",component:function(){return n.e("about").then(n.bind(null,"3bb8"))},meta:{requiresAuth:!0}},{path:"/cup-overview",name:"CupOverview",component:function(){return n.e("about").then(n.bind(null,"c8f6"))},meta:{requiresAuth:!0}},{path:"/register-comp",name:"RegisterComp",component:function(){return n.e("about").then(n.bind(null,"f52d"))},meta:{requiresAuth:!0}},{path:"/weighting",name:"Weighting",component:function(){return n.e("about").then(n.bind(null,"4b37"))},meta:{requiresAuth:!0}},{path:"/overview",name:"Overview",component:function(){return n.e("about").then(n.bind(null,"2226"))},meta:{requiresAuth:!0}},{path:"/comp-settings",name:"CompSettings",component:function(){return n.e("about").then(n.bind(null,"9984"))},meta:{requiresAuth:!0}},{path:"/results",name:"Results",component:function(){return n.e("about").then(n.bind(null,"b3c3"))},meta:{requiresAuth:!0}},{path:"/signing",name:"Signing",component:function(){return n.e("about").then(n.bind(null,"90ba"))},meta:{requiresAuth:!0}}],P=new k["a"]({mode:"history",routes:F});P.beforeEach((function(t,e,n){if(t.matched.some((function(t){return t.meta.requiresAuth})))if(null==localStorage.getItem("jwt"))n({path:"/login",params:{nextUrl:t.fullPath}});else{var i=JSON.parse(localStorage.getItem("user"));t.matched.some((function(t){return t.meta.is_admin}))?1==i.is_admin?n():n({name:"dashboard"}):n()}else t.matched.some((function(t){return t.meta.guest}))?null==localStorage.getItem("jwt")?n():n({name:"dashboard"}):n()}));var B=P,T=(n("4de4"),n("7db0"),n("c740"),n("c975"),n("a434"),n("b0c0"),n("2909")),L=n("2f62");i["a"].use(L["a"]);var H=new L["a"].Store({state:{competition:null,competitions:null,results:null,logged_in:!1,is_admin:!1},getters:{getSigneesCount:function(t){return t.competition.signees.length},getSigneeById:function(t){return function(e){return t.competition.signees.find((function(t){return t.id===e}))}},getSigneeByBoatNumber:function(t){return function(e){return t.competition.signees.find((function(t){return t.boat_number===e}))}},getCompetition:function(t){return t.competition},getCompetitionId:function(t){return t.competition._id},getCompetitionSignees:function(t){return t.competition.signees},getCompetitionTotalWeights:function(t){return t.competition.total_weights},getStillOnWaterSignees:function(t){return t.competition.signees.filter((function(t){return 0==t.returned}))},getSignees:function(t){return t.competition.signees.sort((function(t,e){return parseInt(t.boat_number)-parseInt(e.boat_number)}))},getFinishedSignees:function(t){return t.competition.signees.filter((function(t){return 1==t.returned}))},getPointSignees:function(t){return t.competition.signees.filter((function(t){return t.total_points>0}))},getResultSignees:function(t){return t.competition.signees.sort((function(t,e){return parseInt(e.total_points)-parseInt(t.total_points)}))},getCompetitionFishes:function(t){return t.competition.fishes},getBiggestFishes:function(t){return t.competition.biggest_fishes},getBiggestAmounts:function(t){return t.competition.biggest_amounts},getTeams:function(t){return t.competition.teams},isTeamCompetition:function(t){return t.competition.team_competition},isLoggedIn:function(t){return t.logged_in},isAdmin:function(t){return t.is_admin}},mutations:{refreshSignees:function(t,e){i["a"].set(t.competition,"signees",Object(T["a"])(e))},sortSigneesByNumber:function(t,e){var n=e.sort((function(t,e){return parseInt(t.boat_number)-parseInt(e.boat_number)}));i["a"].set(t.competition,"signees",Object(T["a"])(n))},addSignee:function(t,e){t.competition.signees.push(e)},removeSignee:function(t,e){t.competition.signees.splice(t.competition.signees.indexOf(e),1)},addBiggestFish:function(t,e){if(t.competition.biggest_fishes)if(t.competition.biggest_fishes[e.name]){var n=t.competition.biggest_fishes[e.name].findIndex((function(t){return parseInt(e.boat_number)===parseInt(t.boat_number)}));n>-1&&t.competition.biggest_fishes[e.name].splice(n,1),t.competition.biggest_fishes[e.name].push({boat_number:e.boat_number,captain_name:e.captain_name,weight:e.weight})}else t.competition.biggest_fishes[e.name]=[{boat_number:e.boat_number,captain_name:e.captain_name,weight:e.weight}];else i["a"].set(t.competition,"biggest_fishes",{}),t.competition.biggest_fishes[e.name]=[{boat_number:e.boat_number,captain_name:e.captain_name,weight:e.weight}]},addBiggestAmount:function(t,e){if(t.competition.biggest_amounts)if(t.competition.biggest_amounts[e.name]){var n=t.competition.biggest_amounts[e.name].findIndex((function(t){return parseInt(e.boat_number)===parseInt(t.boat_number)}));n>-1&&t.competition.biggest_amounts[e.name].splice(n,1),t.competition.biggest_amounts[e.name].push({boat_number:e.boat_number,captain_name:e.captain_name,weight:e.weight})}else t.competition.biggest_amounts[e.name]=[{boat_number:e.boat_number,captain_name:e.captain_name,weight:e.weight}];else i["a"].set(t.competition,"biggest_amounts",{}),t.competition.biggest_amounts[e.name]=[{boat_number:e.boat_number,captain_name:e.captain_name,weight:e.weight}]},setTeams:function(t,e){i["a"].set(t.competition,"teams",Object(T["a"])(e))},replaceSignee:function(t,e){var n=t.competition.signees.findIndex((function(t){return parseInt(e.id)===parseInt(t.id)}));t.competition.signees.splice(n,1,e)},refreshCompetition:function(t,e){i["a"].set(t,"competition",e)},refreshCup:function(t,e){i["a"].set(t,"cup",e)}},actions:{},modules:{}}),N=n("683f"),R=n("f309");i["a"].use(R["a"]);var M=new R["a"]({}),V=n("39e2"),K=n.n(V);i["a"].component("vue-select",K.a),i["a"].use(N["a"]),i["a"].config.productionTip=!1,new i["a"]({router:B,store:H,vuetify:M,render:function(t){return t(x)}}).$mount("#app")},"85ec":function(t,e,n){},e683:function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("header",{staticClass:"header"},[i("div",{staticClass:"navbar-fixed"},[i("nav",[i("div",{staticClass:"nav-wrapper blue lighten-2"},[i("router-link",{attrs:{to:"/"}},[i("img",{staticClass:"circle responsive-img left",staticStyle:{height:"55px",width:"55px",margin:"5px 10px"},attrs:{src:n("424d"),alt:""}})]),i("router-link",{attrs:{to:"/"}},[i("a",{staticClass:"brand-logo white-text",attrs:{href:"#!"}},[t._v("Fisustaja")])]),t._m(0),i("ul",{staticClass:"right hide-on-med-and-down"},[i("li",{class:t.isHome},[i("router-link",{attrs:{to:"/"}},[i("a",{staticClass:"white-text"},[i("i",{staticClass:"material-icons left"},[t._v("home")]),t._v("Kotisivu")])])],1),i("li",{class:t.isRegister},[i("router-link",{attrs:{to:"/register"}},[i("a",{staticClass:"white-text"},[i("i",{staticClass:"material-icons left"},[t._v("add_circle_outline")]),t._v("Rekisteröidy")])])],1),i("li",{class:t.isLogin},[i("router-link",{attrs:{to:"/login"}},[i("a",{staticClass:"white-text"},[i("i",{staticClass:"material-icons left"},[t._v("play_circle_filled")]),t._v("Kirjaudu")])])],1)])],1)])])]),i("ul",{staticClass:"sidenav background grey darken-4",attrs:{id:"slide-out"}},[i("li",{class:t.isHome},[i("router-link",{attrs:{to:"/"}},[i("a",{staticClass:"white-text"},[i("i",{staticClass:"material-icons left"},[t._v("home")]),t._v("Kotisivu")])])],1),i("li",{class:t.isRegister},[i("router-link",{attrs:{to:"/register"}},[i("a",{staticClass:"white-text"},[i("i",{staticClass:"material-icons left"},[t._v("add_circle_outline")]),t._v("Rekisteröidy")])])],1),i("li",{class:t.isLogin},[i("router-link",{attrs:{to:"/login"}},[i("a",{staticClass:"white-text"},[i("i",{staticClass:"material-icons left"},[t._v("play_circle_filled")]),t._v("Kirjaudu")])])],1)])])},o=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("a",{staticClass:"sidenav-trigger right",attrs:{href:"#","data-target":"slide-out"}},[n("i",{staticClass:"material-icons"},[t._v("menu")])])}],a=(n("b0c0"),n("4d5c")),r=n.n(a),s={name:"Header",data:function(){return{user:null}},mounted:function(){r.a.AutoInit()},computed:{isHome:function(){return{active:"Home"===this.$route.name}},isLogin:function(){return{active:"login"===this.$route.name}},isRegister:function(){return{active:"register"===this.$route.name}}},methods:{}},u=s,c=n("2877"),l=Object(c["a"])(u,i,o,!1,null,"45a97160",null);e["a"]=l.exports}});
//# sourceMappingURL=app.6d028c40.js.map