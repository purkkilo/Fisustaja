(function(e){function t(t){for(var i,r,s=t[0],u=t[1],c=t[2],l=0,m=[];l<s.length;l++)r=s[l],Object.prototype.hasOwnProperty.call(a,r)&&a[r]&&m.push(a[r][0]),a[r]=0;for(i in u)Object.prototype.hasOwnProperty.call(u,i)&&(e[i]=u[i]);p&&p(t);while(m.length)m.shift()();return o.push.apply(o,c||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],i=!0,r=1;r<n.length;r++){var s=n[r];0!==a[s]&&(i=!1)}i&&(o.splice(t--,1),e=u(u.s=n[0]))}return e}var i={},r={app:0},a={app:0},o=[];function s(e){return u.p+"js/"+({about:"about"}[e]||e)+"."+{about:"de0bdcb6"}[e]+".js"}function u(t){if(i[t])return i[t].exports;var n=i[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,u),n.l=!0,n.exports}u.e=function(e){var t=[],n={about:1};r[e]?t.push(r[e]):0!==r[e]&&n[e]&&t.push(r[e]=new Promise((function(t,n){for(var i="css/"+({about:"about"}[e]||e)+"."+{about:"8a5d376d"}[e]+".css",a=u.p+i,o=document.getElementsByTagName("link"),s=0;s<o.length;s++){var c=o[s],l=c.getAttribute("data-href")||c.getAttribute("href");if("stylesheet"===c.rel&&(l===i||l===a))return t()}var m=document.getElementsByTagName("style");for(s=0;s<m.length;s++){c=m[s],l=c.getAttribute("data-href");if(l===i||l===a)return t()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=t,p.onerror=function(t){var i=t&&t.target&&t.target.src||a,o=new Error("Loading CSS chunk "+e+" failed.\n("+i+")");o.code="CSS_CHUNK_LOAD_FAILED",o.request=i,delete r[e],p.parentNode.removeChild(p),n(o)},p.href=a;var f=document.getElementsByTagName("head")[0];f.appendChild(p)})).then((function(){r[e]=0})));var i=a[e];if(0!==i)if(i)t.push(i[2]);else{var o=new Promise((function(t,n){i=a[e]=[t,n]}));t.push(i[2]=o);var c,l=document.createElement("script");l.charset="utf-8",l.timeout=120,u.nc&&l.setAttribute("nonce",u.nc),l.src=s(e);var m=new Error;c=function(t){l.onerror=l.onload=null,clearTimeout(p);var n=a[e];if(0!==n){if(n){var i=t&&("load"===t.type?"missing":t.type),r=t&&t.target&&t.target.src;m.message="Loading chunk "+e+" failed.\n("+i+": "+r+")",m.name="ChunkLoadError",m.type=i,m.request=r,n[1](m)}a[e]=void 0}};var p=setTimeout((function(){c({type:"timeout",target:l})}),12e4);l.onerror=l.onload=c,document.head.appendChild(l)}return Promise.all(t)},u.m=e,u.c=i,u.d=function(e,t,n){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(u.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)u.d(n,i,function(t){return e[t]}.bind(null,i));return n},u.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="/",u.oe=function(e){throw console.error(e),e};var c=window["webpackJsonp"]=window["webpackJsonp"]||[],l=c.push.bind(c);c.push=t,c=c.slice();for(var m=0;m<c.length;m++)t(c[m]);var p=l;o.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";var i=n("85ec"),r=n.n(i);r.a},"3faa":function(e,t,n){"use strict";n("d81d"),n("b0c0"),n("96cf");var i=n("1da1"),r=n("d4ec"),a=n("bee2"),o=n("bc3a"),s=n.n(o),u="api/users/",c="api/users/register",l="api/users/register-admin",m="api/users/login",p="api/users/auth",f=function(){function e(){Object(r["a"])(this,e)}return Object(a["a"])(e,null,[{key:"getUsers",value:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,s.a.get(u);case 2:return t=e.sent,e.prev=3,n=t.data,e.abrupt("return",n.map((function(e){return{_id:e._id,name:e.name,email:e.email,is_admin:e.is_admin,createdAt:e.createdAt}})));case 8:return e.prev=8,e.t0=e["catch"](3),e.abrupt("return",e.t0);case 11:case"end":return e.stop()}}),e,null,[[3,8]])})));function t(){return e.apply(this,arguments)}return t}()},{key:"getEmail",value:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(t){var n,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,s.a.get("".concat(u).concat(t));case 2:return n=e.sent,e.prev=3,i=n.data,e.abrupt("return",i.map((function(e){return{email:e.email}})));case 8:return e.prev=8,e.t0=e["catch"](3),e.abrupt("return",e.t0);case 11:case"end":return e.stop()}}),e,null,[[3,8]])})));function t(t){return e.apply(this,arguments)}return t}()},{key:"insertUser",value:function(e){return s.a.post(c,{_id:e._id,name:e.name,email:e.email,password:e.password,is_admin:!1})}},{key:"insertAdmin",value:function(e){return s.a.post(l,{_id:e._id,name:e.name,email:e.email,password:e.password,is_admin:e.is_admin})}},{key:"loginUser",value:function(e){return s.a.post(m,{email:e.email,password:e.password})}},{key:"checkToken",value:function(e){return s.a.post(p,{token:e})}}]),e}();t["a"]=f},"424d":function(e,t,n){e.exports=n.p+"img/clienticon_new.8f8ed215.png"},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var i=n("2b0e"),r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",{staticStyle:{background:"rgba(0,0,0,0)"},attrs:{id:"app"}},[n("v-main",[n("router-view")],1),n("v-footer",{attrs:{app:""}},[n("Footer")],1)],1)},a=[],o=(n("96cf"),n("1da1")),s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-footer",{attrs:{app:"",color:"primary lighten-1",paddless:"",absolute:""}},[n("v-row",{attrs:{justify:"center"}},[e._l(e.links,(function(t){return n("v-btn",{key:t,staticClass:"my-2",attrs:{color:"white",text:"",rounded:""}},[e._v(" "+e._s(t)+" ")])})),n("v-col",{staticClass:"primary lighten-2 py-4 text-center white--text",attrs:{cols:"12"}},[e._v(" "+e._s((new Date).getFullYear())+" — "),n("strong",[e._v("Jori Kosonen")])])],2)],1)},u=[],c={name:"Footer",data:function(){return{links:["Work In Progress"]}},mounted:function(){},computed:{},methods:{}},l=c,m=n("2877"),p=n("6544"),f=n.n(p),g=n("8336"),d=n("62ad"),h=n("553a"),b=n("0fd9"),v=Object(m["a"])(l,s,u,!1,null,"3bd5ea1c",null),_=v.exports;f()(v,{VBtn:g["a"],VCol:d["a"],VFooter:h["a"],VRow:b["a"]});var w=n("3faa"),y={name:"App",components:{Footer:_},mounted:function(){try{window.addEventListener("beforeunload",Object(o["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(null===localStorage.getItem("jwt")){e.next=4;break}return t=localStorage.getItem("jwt"),e.next=4,w["a"].checkToken(t).then((function(e){console.log(e)})).catch((function(e){if("Request aborted"!==e.message){if(400===e.response.status)return localStorage.removeItem("jwt"),void localStorage.removeItem("user");if(401!==e.response.status)return console.log(e)}}));case 4:case"end":return e.stop()}}),e)}))))}catch(e){console.log(e.message)}}},C=y,S=(n("034f"),n("7496")),k=n("f6c4"),x=Object(m["a"])(C,r,a,!1,null,null,null),j=x.exports;f()(x,{VApp:S["a"],VFooter:h["a"],VMain:k["a"]});n("8266"),n("45fc"),n("d3b7");var I=n("8c4f"),O=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"container",staticStyle:{"margin-top":"100px"}},[n("MainHeader"),e._m(0),e._m(1)],1)},A=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"section"},[n("div",{staticClass:"col s12 center-align"},[n("h1",[e._v("Fisustaja")])])])},function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"section row inputarea"},[n("div",{staticClass:"col s12"},[n("h4",[e._v("Sovellus kalastuskilpailujen järjestämistä varten")])])])}],E=n("e683"),$={name:"Home",components:{MainHeader:E["a"]},data:function(){return{}},mounted:function(){this.checkLogin(),this.$store.commit("refreshCompetition",null),localStorage.removeItem("competition"),this.$store.commit("refreshCup",null),localStorage.removeItem("cup"),location.href="#",location.href="#app"},methods:{checkLogin:function(){if(null!=localStorage.getItem("jwt")){this.$store.state.logged_in=!0;var e=JSON.parse(localStorage.getItem("user"));1==e.is_admin?this.$store.state.is_admin=!0:this.$store.state.is_admin=!1}else this.$store.state.logged_in=!1,this.$store.state.is_admin=!1}}},q=$,F=Object(m["a"])(q,O,A,!1,null,null,null),T=F.exports;i["a"].use(I["a"]);var P=[{path:"/",name:"Home",component:T,meta:{guest:!0}},{path:"/login",name:"login",component:function(){return n.e("about").then(n.bind(null,"a55b"))},meta:{guest:!0}},{path:"/dashboard",name:"dashboard",component:function(){return n.e("about").then(n.bind(null,"7277"))},meta:{requiresAuth:!0}},{path:"/admin",name:"admin",component:function(){return n.e("about").then(n.bind(null,"3530"))},meta:{requiresAuth:!0,is_admin:!0}},{path:"/feedback",name:"Feedback",component:function(){return n.e("about").then(n.bind(null,"6e7a"))},meta:{requiresAuth:!0}},{path:"/continue",name:"ContinueComp",component:function(){return n.e("about").then(n.bind(null,"3bb8"))},meta:{requiresAuth:!0}},{path:"/cup-overview",name:"CupOverview",component:function(){return n.e("about").then(n.bind(null,"c8f6"))},meta:{requiresAuth:!0}},{path:"/register-comp",name:"RegisterComp",component:function(){return n.e("about").then(n.bind(null,"f52d"))},meta:{requiresAuth:!0}},{path:"/weighting",name:"Weighting",component:function(){return n.e("about").then(n.bind(null,"4b37"))},meta:{requiresAuth:!0}},{path:"/overview",name:"Overview",component:function(){return n.e("about").then(n.bind(null,"2226"))},meta:{requiresAuth:!0}},{path:"/comp-settings",name:"CompSettings",component:function(){return n.e("about").then(n.bind(null,"9984"))},meta:{requiresAuth:!0}},{path:"/results",name:"Results",component:function(){return n.e("about").then(n.bind(null,"b3c3"))},meta:{requiresAuth:!0}},{path:"/signing",name:"Signing",component:function(){return n.e("about").then(n.bind(null,"90ba"))},meta:{requiresAuth:!0}}],B=new I["a"]({mode:"history",routes:P});B.beforeEach((function(e,t,n){if(e.matched.some((function(e){return e.meta.requiresAuth})))if(null==localStorage.getItem("jwt"))n({path:"/login",params:{nextUrl:e.fullPath}});else{var i=JSON.parse(localStorage.getItem("user"));e.matched.some((function(e){return e.meta.is_admin}))?1==i.is_admin?n():n({name:"dashboard"}):n()}else e.matched.some((function(e){return e.meta.guest}))?null==localStorage.getItem("jwt")?n():n({name:"dashboard"}):n({name:"Home"})}));var L=B,R=(n("4de4"),n("7db0"),n("c740"),n("c975"),n("a434"),n("b0c0"),n("2909")),H=n("2f62");i["a"].use(H["a"]);var N=new H["a"].Store({state:{competition:null,competitions:null,results:null,logged_in:!1,is_admin:!1},getters:{getSigneesCount:function(e){return e.competition.signees.length},getSigneeById:function(e){return function(t){return e.competition.signees.find((function(e){return e.id===t}))}},getSigneeByBoatNumber:function(e){return function(t){return e.competition.signees.find((function(e){return e.boat_number===t}))}},getCompetition:function(e){return e.competition},getCompetitionId:function(e){return e.competition._id},getCompetitionSignees:function(e){return e.competition.signees},getCompetitionTotalWeights:function(e){return e.competition.total_weights},getStillOnWaterSignees:function(e){return e.competition.signees.filter((function(e){return 0==e.returned}))},getSignees:function(e){return e.competition.signees.sort((function(e,t){return parseInt(e.boat_number)-parseInt(t.boat_number)}))},getFinishedSignees:function(e){return e.competition.signees.filter((function(e){return 1==e.returned}))},getPointSignees:function(e){return e.competition.signees.filter((function(e){return e.total_points>0}))},getResultSignees:function(e){return e.competition.signees.sort((function(e,t){return parseInt(t.total_points)-parseInt(e.total_points)}))},getCompetitionFishes:function(e){return e.competition.fishes},getBiggestFishes:function(e){return e.competition.biggest_fishes},getBiggestAmounts:function(e){return e.competition.biggest_amounts},getTeams:function(e){return e.competition.teams},isTeamCompetition:function(e){return e.competition.team_competition},isLoggedIn:function(e){return e.logged_in},isAdmin:function(e){return e.is_admin}},mutations:{refreshSignees:function(e,t){i["a"].set(e.competition,"signees",Object(R["a"])(t))},sortSigneesByNumber:function(e,t){var n=t.sort((function(e,t){return parseInt(e.boat_number)-parseInt(t.boat_number)}));i["a"].set(e.competition,"signees",Object(R["a"])(n))},addSignee:function(e,t){e.competition.signees.push(t)},removeSignee:function(e,t){e.competition.signees.splice(e.competition.signees.indexOf(t),1)},addBiggestFish:function(e,t){if(e.competition.biggest_fishes)if(e.competition.biggest_fishes[t.name]){var n=e.competition.biggest_fishes[t.name].findIndex((function(e){return parseInt(t.boat_number)===parseInt(e.boat_number)}));n>-1&&e.competition.biggest_fishes[t.name].splice(n,1),e.competition.biggest_fishes[t.name].push({boat_number:t.boat_number,captain_name:t.captain_name,weight:t.weight})}else e.competition.biggest_fishes[t.name]=[{boat_number:t.boat_number,captain_name:t.captain_name,weight:t.weight}];else i["a"].set(e.competition,"biggest_fishes",{}),e.competition.biggest_fishes[t.name]=[{boat_number:t.boat_number,captain_name:t.captain_name,weight:t.weight}]},addBiggestAmount:function(e,t){if(e.competition.biggest_amounts)if(e.competition.biggest_amounts[t.name]){var n=e.competition.biggest_amounts[t.name].findIndex((function(e){return parseInt(t.boat_number)===parseInt(e.boat_number)}));n>-1&&e.competition.biggest_amounts[t.name].splice(n,1),e.competition.biggest_amounts[t.name].push({boat_number:t.boat_number,captain_name:t.captain_name,weight:t.weight})}else e.competition.biggest_amounts[t.name]=[{boat_number:t.boat_number,captain_name:t.captain_name,weight:t.weight}];else i["a"].set(e.competition,"biggest_amounts",{}),e.competition.biggest_amounts[t.name]=[{boat_number:t.boat_number,captain_name:t.captain_name,weight:t.weight}]},setTeams:function(e,t){i["a"].set(e.competition,"teams",Object(R["a"])(t))},replaceSignee:function(e,t){var n=e.competition.signees.findIndex((function(e){return parseInt(t.id)===parseInt(e.id)}));e.competition.signees.splice(n,1,t)},refreshCompetition:function(e,t){i["a"].set(e,"competition",t)},refreshCup:function(e,t){i["a"].set(e,"cup",t)}},actions:{},modules:{}}),M=n("683f"),V=n("f309");i["a"].use(V["a"]);var K=new V["a"]({}),J=n("39e2"),U=n.n(J);i["a"].component("vue-select",U.a),i["a"].use(M["a"]),i["a"].config.productionTip=!1,new i["a"]({router:L,store:N,vuetify:K,render:function(e){return e(j)}}).$mount("#app")},"85ec":function(e,t,n){},e683:function(e,t,n){"use strict";var i=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("header",{staticClass:"header"},[i("div",{staticClass:"navbar-fixed"},[i("nav",[i("div",{staticClass:"nav-wrapper blue lighten-2"},[i("router-link",{attrs:{to:"/"}},[i("img",{staticClass:"circle responsive-img left",staticStyle:{height:"55px",width:"55px",margin:"5px 10px"},attrs:{src:n("424d"),alt:""}})]),i("router-link",{attrs:{to:"/"}},[i("a",{staticClass:"brand-logo white-text",attrs:{href:"#!"}},[e._v("Fisustaja")])]),e._m(0),i("ul",{staticClass:"right hide-on-med-and-down"},[i("li",{class:e.isHome},[i("router-link",{attrs:{to:"/"}},[i("a",{staticClass:"white-text"},[i("i",{staticClass:"material-icons left"},[e._v("home")]),e._v("Kotisivu")])])],1),i("li",{class:e.isLogin},[i("router-link",{attrs:{to:"/login"}},[i("a",{staticClass:"white-text"},[i("i",{staticClass:"material-icons left"},[e._v("play_circle_filled")]),e._v("Kirjaudu")])])],1)])],1)])])]),i("ul",{staticClass:"sidenav background grey darken-4",attrs:{id:"slide-out"}},[i("li",{class:e.isHome},[i("router-link",{attrs:{to:"/"}},[i("a",{staticClass:"white-text"},[i("i",{staticClass:"material-icons left"},[e._v("home")]),e._v("Kotisivu")])])],1),i("li",{class:e.isLogin},[i("router-link",{attrs:{to:"/login"}},[i("a",{staticClass:"white-text"},[i("i",{staticClass:"material-icons left"},[e._v("play_circle_filled")]),e._v("Kirjaudu")])])],1)])])},r=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("a",{staticClass:"sidenav-trigger right",attrs:{href:"#","data-target":"slide-out"}},[n("i",{staticClass:"material-icons"},[e._v("menu")])])}],a=(n("b0c0"),n("4d5c")),o=n.n(a),s={name:"Header",data:function(){return{user:null}},mounted:function(){o.a.AutoInit()},computed:{isHome:function(){return{active:"Home"===this.$route.name}},isLogin:function(){return{active:"login"===this.$route.name}},isRegister:function(){return{active:"register"===this.$route.name}}},methods:{}},u=s,c=n("2877"),l=Object(c["a"])(u,i,r,!1,null,"4d669de0",null);t["a"]=l.exports}});
//# sourceMappingURL=app.f15c32ec.js.map