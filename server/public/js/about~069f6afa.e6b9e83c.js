(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["about~069f6afa"],{"0157":function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("v-row",[a("v-col",{staticStyle:{"padding-top":"50px","padding-bottom":"20px"},attrs:{md:"10","offset-md":"1"}},[a("v-row",[a("v-col",{attrs:{md:"4","offset-md":"4"}},[a("v-select",{attrs:{dark:"","menu-props":t.$store.getters.getTheme?"dark":"light",label:"Valitse näytettävät tulokset",outlined:"",items:t.normal_options},on:{input:function(e){return t.$emit("switch")}},model:{value:t.selected_normal,callback:function(e){t.selected_normal=e},expression:"selected_normal"}})],1),t.normal_points.length||t.signees.length&&"Ilmoittautuneet"===t.selected_normal?a("v-col",{attrs:{md:"3","offset-md":"1"}},[a("v-btn",{attrs:{large:"",outlined:"",color:"red lighten-2",dark:t.$store.getters.getTheme,loading:t.loading},on:{click:function(e){return t.$emit("dialog",{pdf:"#normal-table",pdfDialog:!0})}}},[a("v-icon",{attrs:{color:"red"}},[t._v("mdi-file-pdf-box")]),t._v(" Lataa pdf ")],1)],1):t._e()],1),t.normal_points.length||t.signees.length&&"Ilmoittautuneet"===t.selected_normal?a("v-row",{staticClass:"row"},[a("v-col",{attrs:{md:"12"}},[a("v-card",{attrs:{dark:t.$store.getters.getTheme}},[a("v-card-title",[a("p",{staticClass:"flow-text"},[t._v(" Normaalikilpailu ("+t._s(t.selected_normal)+") ")]),a("v-spacer"),a("v-text-field",{attrs:{"append-icon":"mdi-magnify",label:"Hae kilpailijaa","single-line":"","hide-details":""},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}})],1),a("v-data-table",{attrs:{headers:t.headers,items:t.results,search:t.search},scopedSlots:t._u([{key:"item.placement",fn:function(e){var i=e.item;return[a("v-chip",{attrs:{outlined:t.$store.getters.getTheme,color:t.getColor(i.placement)}},[t._v(t._s(i.placement)+".")])]}},"Ilmoittautuneet"===t.selected_normal?{key:"item.boat_number",fn:function(e){var i=e.item;return[a("v-chip",[t._v(t._s(i.boat_number))])]}}:null,{key:"item.total_points",fn:function(e){var i=e.item;return[a("v-chip",[t._v(t._s(i.total_points.toLocaleString())+" p")])]}},{key:"item.cup_points_total",fn:function(e){var i=e.item;return[a("v-tooltip",{attrs:{bottom:"",color:"primary"},scopedSlots:t._u([{key:"activator",fn:function(e){var s=e.on,n=e.attrs;return[a("v-chip",t._g(t._b({attrs:{color:t.getColorPoints(i.cup_points_total)}},"v-chip",n,!1),s),[t._v(t._s(i.cup_points_total)+" p")])]}}],null,!0)},[a("span",[a("b",[t._v("Sijoittumispisteet + Osallistumispisteet = Cup pisteet")]),a("br"),t._v(" "+t._s(i.cup_placement_points)+" + "+t._s(i.cup_participation_points)+" = "+t._s(i.cup_points_total)+" ")])])]}}],null,!0)})],1)],1)],1):a("v-row",[t.loading?a("v-col",[a("h2",{staticClass:"white--text"},[t._v("Päivitetään tuloksia tietokannasta...")]),a("ProgressBarQuery")],1):a("v-col",[a("p",{staticClass:"flow-text",class:{"white--text":t.$store.getters.getTheme}},[t._v(" Ei tuloksia, vielä... ")])])],1)],1)],1)],1)},s=[],n=a("e0b1"),o={name:"NormalComp",components:{},props:["loading","headers","search","results","normal_options","selected_normal","normal_points"],data:function(){return{}},created:function(){this.getColorPoints=n["getColorPoints"],this.getColor=n["getColor"]},methods:{}},l=o,r=a("2877"),c=a("6544"),d=a.n(c),u=a("8336"),m=a("b0af"),p=a("99d9"),h=a("cc20"),v=a("62ad"),_=a("8fea"),g=a("132d"),f=a("0fd9"),b=a("b974"),k=a("2fa4"),x=a("8654"),C=a("3a2f"),w=Object(r["a"])(l,i,s,!1,null,"7fdb0566",null);e["a"]=w.exports;d()(w,{VBtn:u["a"],VCard:m["a"],VCardTitle:p["c"],VChip:h["a"],VCol:v["a"],VDataTable:_["a"],VIcon:g["a"],VRow:f["a"],VSelect:b["a"],VSpacer:k["a"],VTextField:x["a"],VTooltip:C["a"]})},1554:function(t,e,a){},1670:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[t.biggest_amounts_results.length?a("v-row",[a("v-col",{staticStyle:{"margin-bottom":"40px"},attrs:{md:"10","offset-md":"1"}},[a("v-card",{attrs:{dark:t.$store.getters.getTheme}},[a("v-card-title",[t.results_found_amounts?a("p",{staticClass:"flow-text"},[t._v(" Suurimmat kalasaaliit ("+t._s(t.selected_biggest_amount)+" "+t._s(t.results_found_amounts)+") ")]):a("p",{staticClass:"flow-text"},[t._v(" Suurimmat kalasaaliit ("+t._s(t.selected_biggest_amount)+") ")]),a("v-spacer"),a("v-text-field",{attrs:{"append-icon":"mdi-magnify",label:"Hae kilpailijaa","single-line":"","hide-details":""},model:{value:t.search_amounts,callback:function(e){t.search_amounts=e},expression:"search_amounts"}})],1),a("v-data-table",{attrs:{headers:t.headers,items:t.biggest_amounts_results,search:t.search_amounts,loading:t.loading},scopedSlots:t._u([{key:"item.placement",fn:function(e){var i=e.item;return[a("v-chip",{attrs:{outlined:t.$store.getters.getTheme,color:t.getColor(i.placement)}},[t._v(t._s(i.placement)+".")])]}},{key:"item.name",fn:function(e){var i=e.item;return[a("v-chip",[t._v(t._s(i.name))])]}},{key:"item.weight",fn:function(e){var i=e.item;return[a("v-chip",[t._v(t._s(i.weight.toLocaleString())+" g")])]}}],null,!0)})],1)],1)],1):a("v-row",[t.loading?a("v-col",{attrs:{md:"8","offset-md":"2"}},[a("h2",{staticClass:"white--text"},[t._v("Päivitetään tuloksia tietokannasta...")]),a("ProgressBarQuery")],1):a("v-col",{attrs:{md:"8","offset-md":"2"}},[a("p",{staticClass:"flow-text",class:{"white--text":t.$store.getters.getTheme}},[t._v(" Ei tuloksia, vielä... ")])])],1)],1)},s=[],n=a("e0b1"),o={name:"BiggestAmounts",components:{},props:["loading","fish_names","selected_biggest_amount","biggest_amounts_results","results_found_amounts","search_amounts","headers"],data:function(){return{}},created:function(){this.getColorPoints=n["getColorPoints"],this.getColor=n["getColor"]},methods:{}},l=o,r=a("2877"),c=a("6544"),d=a.n(c),u=a("b0af"),m=a("99d9"),p=a("cc20"),h=a("62ad"),v=a("8fea"),_=a("0fd9"),g=a("2fa4"),f=a("8654"),b=Object(r["a"])(l,i,s,!1,null,"1b5049c0",null);e["a"]=b.exports;d()(b,{VCard:u["a"],VCardTitle:m["c"],VChip:p["a"],VCol:h["a"],VDataTable:v["a"],VRow:_["a"],VSpacer:g["a"],VTextField:f["a"]})},"3fdc":function(t,e,a){"use strict";a("d3b7"),a("35b3"),a("a9e3"),a("99af");var i,s,n=a("1fca"),o=n["d"].reactiveProp,l={props:["title"],extends:n["a"],mixins:[o],data:function(){return{options:{maintainAspectRatio:!1,responsive:!0,scales:{y:{beginAtZero:!0}},tooltips:{callbacks:{title:function(t,e){return e.labels[t[0].index]},label:function(t,e){var a=e.datasets[t.datasetIndex].data.reduce((function(t,e){return t+e}),0),i=e.datasets[t.datasetIndex].data[t.index]/a*100;i=Math.round(100*(i+Number.EPSILON))/100;var s="";return s="Kilpailijamäärä"===e.datasets[t.datasetIndex].label?"".concat(e.datasets[t.datasetIndex].label,": ").concat(e.datasets[t.datasetIndex].data[t.index].toLocaleString()," kpl"):"".concat(e.datasets[t.datasetIndex].label,": ").concat((e.datasets[t.datasetIndex].data[t.index]/1e3).toLocaleString()," kg ( ").concat(i,"% Cupin kaloista )"),s}}},plugins:{labels:{render:function(t){return"Kilpailijamäärä"===t.dataset.label?t.value:"".concat((t.value/1e3).toLocaleString()," kg")},fontSize:8,fontStyle:"bold",fontFamily:'"Lucida Console", Monaco, monospace',precision:2}},legend:{display:!0}}}},mounted:function(){this.renderChart(this.chartData,this.options)},watch:{chartData:function(t){this.renderChart(t,this.options)}}},r=l,c=a("2877"),d=Object(c["a"])(r,i,s,!1,null,null,null);e["a"]=d.exports},"543c":function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[t.biggest_fishes_results.length?a("v-row",[a("v-col",{staticStyle:{"margin-bottom":"40px"},attrs:{md:"10","offset-md":"1"}},[a("v-card",{attrs:{dark:t.$store.getters.getTheme}},[a("v-card-title",[t.results_found_fishes?a("p",{staticClass:"flow-text"},[t._v(" Suurimmat kalat ("+t._s(t.selected_biggest_fish)+" "+t._s(t.results_found_fishes)+") ")]):a("p",{staticClass:"flow-text"},[t._v(" Suurimmat kalat ("+t._s(t.selected_biggest_fish)+") ")]),a("v-spacer"),a("v-text-field",{attrs:{"append-icon":"mdi-magnify",label:"Hae kilpailijaa","single-line":"","hide-details":""},model:{value:t.search_fishes,callback:function(e){t.search_fishes=e},expression:"search_fishes"}})],1),a("v-data-table",{attrs:{headers:t.headers,items:t.biggest_fishes_results,search:t.search_fishes},scopedSlots:t._u([{key:"item.placement",fn:function(e){var i=e.item;return[a("v-chip",{attrs:{outlined:t.$store.getters.getTheme,color:t.getColor(i.placement)}},[t._v(t._s(i.placement)+".")])]}},{key:"item.name",fn:function(e){var i=e.item;return[a("v-chip",[t._v(t._s(i.name))])]}},{key:"item.weight",fn:function(e){var i=e.item;return[a("v-chip",[t._v(t._s(i.weight.toLocaleString())+" g")])]}}],null,!0)})],1)],1)],1):a("v-row",[t.loading?a("v-col",[a("h2",{staticClass:"white--text"},[t._v("Päivitetään tuloksia tietokannasta...")]),a("ProgressBarQuery")],1):a("v-col",[a("p",{staticClass:"flow-text",class:{"white--text":t.$store.getters.getTheme}},[t._v(" Ei tuloksia, vielä... ")])])],1)],1)},s=[],n=a("e0b1"),o={name:"BiggestFishes",components:{},props:["loading","fish_names","selected_biggest_fish","biggest_fishes_results","results_found_fishes","search_fishes","headers"],data:function(){return{}},created:function(){this.getColorPoints=n["getColorPoints"],this.getColor=n["getColor"]},methods:{}},l=o,r=a("2877"),c=a("6544"),d=a.n(c),u=a("b0af"),m=a("99d9"),p=a("cc20"),h=a("62ad"),v=a("8fea"),_=a("0fd9"),g=a("2fa4"),f=a("8654"),b=Object(r["a"])(l,i,s,!1,null,"31abe544",null);e["a"]=b.exports;d()(b,{VCard:u["a"],VCardTitle:m["c"],VChip:p["a"],VCol:h["a"],VDataTable:v["a"],VRow:_["a"],VSpacer:g["a"],VTextField:f["a"]})},"5fb0":function(t,e,a){"use strict";var i=[{points:30,placement:1},{points:28,placement:2},{points:26,placement:3},{points:24,placement:4},{points:22,placement:5},{points:20,placement:6},{points:19,placement:7},{points:18,placement:8},{points:17,placement:9},{points:16,placement:10},{points:15,placement:11},{points:14,placement:12},{points:13,placement:13},{points:12,placement:14},{points:11,placement:15},{points:10,placement:16},{points:9,placement:17},{points:8,placement:18},{points:7,placement:19},{points:6,placement:20},{points:5,placement:21},{points:4,placement:22},{points:3,placement:23},{points:2,placement:24},{points:1,placement:25}];e["a"]={placement_points:i}},"7ba5":function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-navigation-drawer",{attrs:{permanent:"","expand-on-hover":""}},[a("v-card",{staticClass:"mx-auto",attrs:{"max-width":"400",tile:"",dark:t.$store.getters.getTheme}},[a("v-list",{attrs:{dense:""}},[a("p",[t._v("Navigointi")]),a("v-list-item-group",{attrs:{color:"primary"},model:{value:t.selectedItem,callback:function(e){t.selectedItem=e},expression:"selectedItem"}},[a("v-divider"),t._l(t.items,(function(e,i){return a("div",{key:i},[a("v-list-item",{attrs:{disabled:t.$router.currentRoute.path===e.path},on:{click:function(a){return t.changePage(e.path)}}},[a("v-list-item-icon",[a("v-icon",{domProps:{textContent:t._s(e.icon)}})],1),a("v-list-item-content",[a("v-list-item-title",{domProps:{textContent:t._s(e.text)}})],1)],1),a("v-divider")],1)}))],2)],1)],1),a("v-snackbar",{attrs:{timeout:t.timeout},scopedSlots:t._u([{key:"action",fn:function(e){var i=e.attrs;return[a("v-btn",t._b({attrs:{color:"blue",text:""},on:{click:function(e){t.snackbar=!1}}},"v-btn",i,!1),[t._v(" Close ")])]}}]),model:{value:t.snackbar,callback:function(e){t.snackbar=e},expression:"snackbar"}},[t._v(" "+t._s(t.text)+" ")])],1)},s=[],n=(a("c740"),{name:"CompetitionNavigation",data:function(){return{selectedItem:0,items:[{text:"Yleisnäkymä",icon:"mdi-magnify-expand",path:"/overview"},{text:"Määritykset",icon:"mdi-tune",path:"/comp-settings"},{text:"Ilmoittautuminen",icon:"mdi-draw",path:"/signing"},{text:"Punnitus",icon:"mdi-dumbbell",path:"/weighting"},{text:"Tulokset",icon:"mdi-seal",path:"/results"}],snackbar:!1,text:"",timeout:5e3}},mounted:function(){var t=this;this.selectedItem=this.items.findIndex((function(e){return e.path===t.$router.currentRoute.path}))},methods:{changePage:function(t){this.$router.currentRoute.path!==t?this.$router.push(t):(this.text="Olet jo tällä sivulla!",this.snackbar=!0)}}}),o=n,l=a("2877"),r=a("6544"),c=a.n(r),d=a("8336"),u=a("b0af"),m=a("ce7e"),p=a("132d"),h=a("8860"),v=a("da13"),_=a("5d23"),g=a("1baa"),f=a("34c3"),b=a("f774"),k=a("2db4"),x=Object(l["a"])(o,i,s,!1,null,"5c4769c2",null);e["a"]=x.exports;c()(x,{VBtn:d["a"],VCard:u["a"],VDivider:m["a"],VIcon:p["a"],VList:h["a"],VListItem:v["a"],VListItemContent:_["a"],VListItemGroup:g["a"],VListItemIcon:f["a"],VListItemTitle:_["c"],VNavigationDrawer:b["a"],VSnackbar:k["a"]})},"998c":function(t,e,a){"use strict";var i,s,n,o,l=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("v-row",{staticStyle:{"padding-top":"50px"}},[a("v-col",{attrs:{md:"3","offset-md":"8"}},[a("v-btn",{staticStyle:{"margin-bottom":"20px"},attrs:{large:"",outlined:"",color:"red lighten-2",dark:t.$store.getters.getTheme,loading:t.loading,disabled:!t.biggest_amounts.length},on:{click:function(e){return t.$emit("dialog",{pdf:"Tilastoja",pdfDialog:!0})}}},[a("v-icon",{attrs:{color:"red"}},[t._v("mdi-file-pdf-box")]),t._v(" Lataa pdf")],1)],1)],1),t.competition?a("v-row",[a("v-col",[t.competition.normal_points.length?a("v-row",{staticStyle:{"min-height":"400px"}},[a("v-col",{staticStyle:{"margin-bottom":"50px"},attrs:{sm:"12",md:"5","offset-md":"1"}},[t.fishes_chart_data?a("div",[a("v-hover",{scopedSlots:t._u([{key:"default",fn:function(e){var i=e.hover;return[a("v-card",{class:{"on-hover":i},staticStyle:{padding:"20px"},attrs:{dark:t.$store.getters.getTheme,elevation:i?20:5}},[a("v-card-title",[a("h4",{staticClass:"headline mb-1"},[t._v(" "+t._s(t.fishes_chart_title)+" ")])]),a("doughnut-chart",{attrs:{"chart-data":t.fishes_chart_data,"chart-id":"fishes_chart",title:t.fishes_chart_title}})],1)]}}],null,!1,1847150614)})],1):t._e()]),a("v-col",{attrs:{sm:"12",md:"5"}},[t.signee_chart_data?a("div",[a("v-hover",{scopedSlots:t._u([{key:"default",fn:function(e){var i=e.hover;return[a("v-card",{class:{"on-hover":i},staticStyle:{padding:"20px"},attrs:{dark:t.$store.getters.getTheme,elevation:i?20:5}},[a("v-card-title",[a("h4",{staticClass:"headline mb-1"},[t._v(" "+t._s(t.signee_chart_title)+" ")])]),a("pie-chart",{attrs:{"chart-data":t.signee_chart_data,"chart-id":"signee_chart",title:t.signee_chart_title}})],1)]}}],null,!1,4159745268)})],1):t._e()])],1):a("v-row",[a("v-col",{attrs:{md:"12"}},[a("p",{staticClass:"flow-text",class:{"white--text":t.$store.getters.getTheme}},[t._v(" Ei tuloksia, vielä... ")])])],1)],1)],1):t._e(),t.competition?a("v-row",[a("v-col",{attrs:{md:"8","offset-md":"2"}},[a("v-row",[a("v-col",[a("v-hover",{scopedSlots:t._u([{key:"default",fn:function(e){var i=e.hover;return[a("v-card",{class:{"on-hover":i},staticStyle:{padding:"20px"},attrs:{dark:t.$store.getters.getTheme,elevation:i?20:5}},[a("v-card-title",{staticClass:"text-center"},[a("p",{staticClass:"display-1"},[t._v("Kalalajien määritykset")])]),a("v-list",{attrs:{outlined:""}},[t._l(t.calculated_weights,(function(e,i){return a("div",{key:i},[a("v-list-item",[a("v-list-item-title",[t._v(t._s(e.name))]),a("v-divider",{attrs:{vertical:""}}),a("v-list-item-subtitle",{class:t.getMultiplierTextColor(e.multiplier)+"--text"},[a("b",[t._v(" x "+t._s(e.multiplier))])]),a("v-divider",{attrs:{vertical:""}}),a("v-list-item-subtitle",{staticClass:"blue--text"},[a("span",[a("b",[t._v(t._s(e.minsize)+" cm")])])]),a("v-divider",{attrs:{vertical:""}}),a("v-list-item-subtitle",{staticClass:"green--text"},[a("b",[t._v(" "+t._s(e.weights?Math.round(100*(e.weights/1e3+Number.EPSILON))/100:0)+" kg ")])])],1),a("v-divider")],1)})),a("v-list-item",[a("v-list-item-title",[t._v(" Saalista yhteensä ")]),a("v-list-item-subtitle",[a("h4",{staticClass:"green--text"},[a("b",[t._v(t._s(Math.round(100*(t.calculated_total/1e3+Number.EPSILON))/100)+" kg")])])])],1)],2)],1)]}}],null,!1,3903179280)})],1)],1),a("v-row",[a("v-col",[a("v-hover",{scopedSlots:t._u([{key:"default",fn:function(e){var i=e.hover;return[a("v-card",{class:{"on-hover":i},staticStyle:{padding:"20px"},attrs:{dark:t.$store.getters.getTheme,elevation:i?20:5}},[a("v-card-title",{staticClass:"text-center"},[a("p",{staticClass:"display-1"},[t._v("Yleisiä tilastoja")])]),a("v-list",{attrs:{outlined:""}},[a("v-list-item",[a("v-list-item-title",[a("b",[t._v("Cup pistekerroin")])]),a("v-divider",{attrs:{vertical:""}}),a("v-list-item-subtitle",{class:t.getMultiplierTextColor(t.competition.cup_points_multiplier)+"--text"},[a("b",[t._v("x "+t._s(t.competition.cup_points_multiplier))])])],1),a("v-divider"),a("v-list-item",[a("v-list-item-title",[a("b",[t._v("Ilmoittautuneita yhteensä")])]),a("v-divider",{attrs:{vertical:""}}),a("v-list-item-subtitle",{staticClass:"green--text"},[a("b",[t._v(t._s(t.signees.length)+" venettä")])])],1),a("v-divider"),a("v-list-item",[a("v-list-item-title",[a("b",[t._v("Saalista saaneita")])]),a("v-divider",{attrs:{vertical:""}}),t.$store.getters.getPointSignees.length?a("v-list-item-subtitle",{staticClass:"green--text"},[a("b",[t._v(t._s(Math.round(t.$store.getters.getPointSignees.length/t.competition.signees.length*100*100)/100)+"% ("+t._s(t.$store.getters.getPointSignees.length)+" / "+t._s(t.signees.length)+")")])]):a("v-list-item-subtitle",{staticClass:"red-text"},[a("b",[t._v("0% (0/0)")])])],1)],1)],1)]}}],null,!1,1501868151)})],1)],1)],1)],1):t._e()],1)},r=[],c=(a("d3b7"),a("35b3"),a("a9e3"),a("99af"),a("1fca")),d=(a("8521"),c["d"].reactiveProp),u={props:["title"],extends:c["c"],mixins:[d],data:function(){return{options:{maintainAspectRatio:!1,responsive:!0,tooltips:{callbacks:{title:function(t,e){return e.labels[t[0].index]},label:function(t,e){var a=e.datasets[t.datasetIndex].data.reduce((function(t,e){return t+e}),0),i=e.datasets[t.datasetIndex].data[t.index]/a*100;i=Math.round(100*(i+Number.EPSILON))/100;var s="".concat(e.datasets[t.datasetIndex].label,": ").concat(e.datasets[t.datasetIndex].data[t.index]," kpl ( ").concat(i,"% )");return s}}},plugins:{labels:{render:"percentage",fontSize:26,fontStyle:"bold",fontColor:"#000",fontFamily:'"Lucida Console", Monaco, monospace',precision:2}},legend:{display:!0}}}},mounted:function(){this.renderChart(this.chartData,this.options)},watch:{chartData:function(t){this.renderChart(t,this.options)}}},m=u,p=a("2877"),h=Object(p["a"])(m,i,s,!1,null,null,null),v=h.exports,_=c["d"].reactiveProp,g={props:["title"],extends:c["b"],mixins:[_],data:function(){return{options:{tooltips:{callbacks:{title:function(t,e){return e.labels[t[0].index]},label:function(t,e){var a=e.datasets[t.datasetIndex].data.reduce((function(t,e){return t+e}),0),i=e.datasets[t.datasetIndex].data[t.index],s=i/a*100;s=Math.round(100*(s+Number.EPSILON))/100;var n="".concat(e.datasets[t.datasetIndex].label,": ").concat(i.toLocaleString()," g ( ").concat(s,"% )");return n}}},maintainAspectRatio:!1,responsive:!0,plugins:{labels:{render:function(t){return t.value/(1e3+Number.EPSILON)*100/100+" kg"},fontSize:14,fontStyle:"bold",textShadow:!0,position:"border",textmargin:1,fontColor:"#000",fontFamily:'"Lucida Console", Monaco, monospace'}}}}},mounted:function(){this.renderChart(this.chartData,this.options)},watch:{chartData:function(t){this.renderChart(t,this.options)}}},f=g,b=Object(p["a"])(f,n,o,!1,null,null,null),k=b.exports,x=a("e0b1"),C={name:"Stats",components:{PieChart:v,DoughnutChart:k},props:["competition","signees","loading","biggest_amounts","fishes_chart_title","fishes_chart_data","signee_chart_title","signee_chart_data","calculated_weights","calculated_total"],data:function(){return{}},created:function(){this.getMultiplierTextColor=x["getMultiplierTextColor"]},methods:{}},w=C,y=a("6544"),V=a.n(y),I=a("8336"),S=a("b0af"),$=a("99d9"),T=a("62ad"),P=a("ce7e"),L=a("ce87"),j=a("132d"),D=a("8860"),E=a("da13"),O=a("5d23"),N=a("0fd9"),R=Object(p["a"])(w,l,r,!1,null,"497609e5",null);e["a"]=R.exports;V()(R,{VBtn:I["a"],VCard:S["a"],VCardTitle:$["c"],VCol:T["a"],VDivider:P["a"],VHover:L["a"],VIcon:j["a"],VList:D["a"],VListItem:E["a"],VListItemSubtitle:O["b"],VListItemTitle:O["c"],VRow:N["a"]})},a822:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-progress-linear",{attrs:{indeterminate:"",color:"indigo lighten-2"}})},s=[],n={name:"ProgressBarQuery"},o=n,l=a("2877"),r=a("6544"),c=a.n(r),d=a("8e36"),u=Object(l["a"])(o,i,s,!1,null,null,null);e["default"]=u.exports;c()(u,{VProgressLinear:d["a"]})},b3a7:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticStyle:{padding:"15px"}},[a("v-card",{staticStyle:{background:"transparent"},attrs:{elevation:"5",outlined:"",dark:t.$store.getters.getTheme}},[a("v-row",[a("v-col",[a("h2",{staticClass:"white--text",attrs:{id:"comp-state"}},[t._v("Pvm. "+t._s(t.date))])]),a("v-col",[a("h2",{staticClass:"white--text",attrs:{id:"clock"}},[t._v("Klo. "+t._s(t.clock))])])],1)],1),a("v-card",{staticStyle:{background:"transparent"},attrs:{elevation:"5",outlined:"",dark:t.$store.getters.getTheme}},[a("v-row",{attrs:{align:"center"}},[a("v-col",{attrs:{cols:"12",xs:"6",sm:"6",md:"3","offset-md":"2"}},[a("h3",{class:"Kilpailu päättynyt!"===t.competition_state?"red--text":"green--text",attrs:{id:"date"}},[t._v(" "+t._s(t.competition_state)+" ")])]),a("v-col",{attrs:{cols:"12",xs:"6",sm:"6",md:"6"}},[t.competitionChosen?a("h2",{class:"Kilpailu päättynyt!"===t.competition_state?"red--text":"green--text",attrs:{id:"comp-left"}},[t._v(" "+t._s(t.timer_string)+" ")]):t._e()])],1)],1)],1)},s=[],n=(a("99af"),{name:"Timedate",data:function(){return{competition:null,competition_started:!1,competition_ended:!1,calculated_time:null,date_interval:100,clock_interval:100,remaining_interval:100,clock:null,date:null,timer:null,timer_date:null,timer_clock:null,timer_string:"",competition_state:"",amount:40}},computed:{competitionChosen:function(){return null!=localStorage.getItem("competition")}},mounted:function(){if(this.setTime(),this.setDate(),this.timer_clock=setInterval(this.setTime,this.clock_interval),this.timer_date=setInterval(this.setDate,this.date_interval),null!=localStorage.getItem("competition")){var t=JSON.parse(localStorage.getItem("competition"));this.competition={id:t["id"],start_date:t["start_date"],end_date:t["end_date"]},this.remainingTime(),this.timer=setInterval(this.remainingTime,this.remaining_interval)}else this.timer_string="",clearInterval(this.timer)},beforeDestroy:function(){clearInterval(this.timer),clearInterval(this.timer_clock),clearInterval(this.timer_date)},methods:{setTime:function(){if(document.getElementById("clock")){var t=new Date,e=t.getHours(),a=t.getMinutes(),i=t.getSeconds();a=this.checkZeros(a),i=this.checkZeros(i),this.clock="".concat(e,":").concat(a,":").concat(i),this.clock_interval=300}else clearInterval(this.timer_clock)},setDate:function(){if(document.getElementById("date")){var t=new Date,e=t.getDate(),a=t.getMonth()+1,i=t.getFullYear();e=this.checkZeros(e),a=this.checkZeros(a),this.date="".concat(e,".").concat(a,".").concat(i),this.date_interval=6e4}else clearInterval(this.timer_date)},remainingTime:function(){if(document.getElementById("comp-left")){if(this.competition){var t=this.$moment(this.competition.start_date),e=this.$moment(this.competition.end_date),a=0,i="";if(this.competition_started=this.$moment(this.$moment()).isAfter(t),this.competition_ended=this.$moment(this.$moment()).isAfter(e),this.competition_started||this.competition_ended)if(this.competition_started&&!this.competition_ended){a=this.$moment.duration(e.diff(this.$moment()));var s=a.days()?"".concat(a.days(),"d "):" ";i=s+this.checkZeros(a.hours())+"h "+this.checkZeros(a.minutes())+"m "+this.checkZeros(a.seconds())+"s",this.remaining_interval=300,this.competition_state="Kilpailua jäljellä",this.timer_string="".concat(i)}else this.timer_string=null,this.competition_state="Kilpailu päättynyt!";else a=this.$moment.duration(t.diff(this.$moment())),i=this.checkZeros(a.hours())+"h "+this.checkZeros(a.minutes())+"m "+this.checkZeros(a.seconds())+"s",a<864e5?(this.competition_state="Kilpailun alkuun",this.timer_string=i):(this.calculated_time=this.$moment(this.$moment()).to(t),this.competition_state="Kilpailu alkaa",this.timer_string=this.calculated_time)}}else clearInterval(this.timer)},checkZeros:function(t){return t<10&&(t="0"+t),t}}}),o=n,l=(a("ef79"),a("2877")),r=a("6544"),c=a.n(r),d=a("b0af"),u=a("62ad"),m=a("0fd9"),p=Object(l["a"])(o,i,s,!1,null,"e58cd4ae",null);e["a"]=p.exports;c()(p,{VCard:d["a"],VCol:u["a"],VRow:m["a"]})},c54f:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[t.team_results.length?a("v-row",[a("v-col",{staticStyle:{"padding-top":"50px"},attrs:{md:"3","offset-md":"8"}},[a("v-btn",{attrs:{large:"",outlined:"",color:"red lighten-2",dark:t.$store.getters.getTheme,loading:t.loading},on:{click:function(e){return t.$emit("dialog",{pdf:"#team-table",pdfDialog:!0})}}},[a("v-icon",{attrs:{color:"red"}},[t._v("mdi-file-pdf-box")]),t._v(" Lataa pdf ")],1)],1)],1):t._e(),a("v-row",[t.team_results.length?a("v-col",{staticStyle:{"padding-bottom":"20px"},attrs:{md:"10","offset-md":"1"}},[a("v-card",{attrs:{dark:t.$store.getters.getTheme}},[a("v-card-title",[a("p",{staticClass:"flow-text",class:{"white--text":t.$store.getters.getTheme}},[t._v(" Tiimikilpailu ")]),a("v-spacer"),a("v-text-field",{attrs:{"append-icon":"mdi-magnify",label:"Hae kilpailijaa","single-line":"","hide-details":""},model:{value:t.search_team,callback:function(e){t.search_team=e},expression:"search_team"}})],1),a("v-data-table",{attrs:{headers:t.headers,items:t.team_results,search:t.search_team},scopedSlots:t._u([{key:"item.placement",fn:function(e){var i=e.item;return[a("v-chip",{attrs:{outlined:t.$store.getters.getTheme,color:t.getColor(i.placement)}},[t._v(t._s(i.placement)+".")])]}},{key:"item.points",fn:function(e){var i=e.item;return[a("v-chip",[t._v(t._s(i.points.toLocaleString())+" p")])]}}],null,!0)})],1)],1):a("v-col",[t.loading?t._e():a("v-col"),t.loading?a("v-col",[a("h2",{staticClass:"white--text"},[t._v("Päivitetään tuloksia tietokannasta...")]),a("ProgressBarQuery")],1):a("p",{staticClass:"flow-text",class:{"white--text":t.$store.getters.getTheme}},[t._v(" Ei tuloksia, vielä... ")])],1)],1)],1)},s=[],n=a("e0b1"),o={name:"TeamComp",components:{},props:["team_results","search_team","loading","headers"],data:function(){return{}},created:function(){this.getColorPoints=n["getColorPoints"],this.getColor=n["getColor"]},methods:{}},l=o,r=a("2877"),c=a("6544"),d=a.n(c),u=a("8336"),m=a("b0af"),p=a("99d9"),h=a("cc20"),v=a("62ad"),_=a("8fea"),g=a("132d"),f=a("0fd9"),b=a("2fa4"),k=a("8654"),x=Object(r["a"])(l,i,s,!1,null,"553a3d79",null);e["a"]=x.exports;d()(x,{VBtn:u["a"],VCard:m["a"],VCardTitle:p["c"],VChip:h["a"],VCol:v["a"],VDataTable:_["a"],VIcon:g["a"],VRow:f["a"],VSpacer:b["a"],VTextField:k["a"]})},de30:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-navigation-drawer",{attrs:{permanent:"","expand-on-hover":""}},[a("v-card",{staticClass:"mx-auto",attrs:{"max-width":"400",tile:"",dark:t.$store.getters.getTheme}},[a("v-list",{attrs:{dense:""}},[a("p",[t._v("Navigointi")]),a("v-list-item-group",{attrs:{color:"primary"},model:{value:t.selectedItem,callback:function(e){t.selectedItem=e},expression:"selectedItem"}},t._l(t.items,(function(e,i){return a("v-list-item",{key:i,on:{click:function(a){return t.changePage(e.path)}}},[a("v-list-item-icon",[a("v-icon",{domProps:{textContent:t._s(e.icon)}})],1),a("v-list-item-content",[a("v-list-item-title",{domProps:{textContent:t._s(e.text)}})],1)],1)})),1)],1)],1),a("v-snackbar",{attrs:{timeout:t.timeout},scopedSlots:t._u([{key:"action",fn:function(e){var i=e.attrs;return[a("v-btn",t._b({attrs:{color:"blue",text:""},on:{click:function(e){t.snackbar=!1}}},"v-btn",i,!1),[t._v(" Close ")])]}}]),model:{value:t.snackbar,callback:function(e){t.snackbar=e},expression:"snackbar"}},[t._v(" "+t._s(t.text)+" ")])],1)},s=[],n=(a("c740"),{name:"PublicNavigation",data:function(){return{selectedItem:0,items:[{text:"Kilpailujen tuloksia",icon:"mdi-seal",path:"/public-results"},{text:"Cuppien tuloksia",icon:"mdi-trophy",path:"/public-cups"}],snackbar:!1,text:"",timeout:5e3}},mounted:function(){var t=this;this.selectedItem=this.items.findIndex((function(e){return e.path===t.$router.currentRoute.path}))},methods:{changePage:function(t){this.$router.currentRoute.path!==t?this.$router.push(t):(this.text="Olet jo tällä sivulla!",this.snackbar=!0)}}}),o=n,l=a("2877"),r=a("6544"),c=a.n(r),d=a("8336"),u=a("b0af"),m=a("132d"),p=a("8860"),h=a("da13"),v=a("5d23"),_=a("1baa"),g=a("34c3"),f=a("f774"),b=a("2db4"),k=Object(l["a"])(o,i,s,!1,null,"64a44f0d",null);e["a"]=k.exports;c()(k,{VBtn:d["a"],VCard:u["a"],VIcon:m["a"],VList:p["a"],VListItem:h["a"],VListItemContent:v["a"],VListItemGroup:_["a"],VListItemIcon:g["a"],VListItemTitle:v["c"],VNavigationDrawer:f["a"],VSnackbar:b["a"]})},e650:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-row",[a("v-dialog",{attrs:{width:"500"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",{attrs:{dark:t.$store.getters.getTheme}},[a("v-card-title",[t._v(" Pdf Asetukset ")]),a("v-card-text",[a("v-checkbox",{attrs:{label:"Pfd Vaakatasossa",disabled:!t.competitions.length},model:{value:t.isLandscape,callback:function(e){t.isLandscape=e},expression:"isLandscape"}}),a("v-checkbox",{attrs:{label:"Näytä pdf:ssä kuinka monta parasta kilpailua otettu huomioon pisteissä",disabled:!t.competitions.length,color:"indigo darken-3"},model:{value:t.showInfoInPdf,callback:function(e){t.showInfoInPdf=e},expression:"showInfoInPdf"}})],1),a("v-divider"),a("v-card-actions",[a("v-btn",{attrs:{color:"yellow",text:""},on:{click:function(e){t.dialog=!1}}},[t._v(" Peruuta ")]),a("v-spacer"),a("v-btn",{attrs:{color:"primary",text:""},on:{click:function(e){t.dialog=!1,t.$emit("save",{selectedCompetitions:t.selectedCompetitions,isLandscape:t.isLandscape,showInfoInPdf:t.showInfoInPdf})}}},[t._v(" Lataa ")])],1)],1)],1),a("v-col",[t.results.length?a("v-row",{staticStyle:{"margin-top":"50px","padding-left":"50px"}},[a("v-col",{staticClass:"d-flex",attrs:{md:"4"}},[a("v-select",{attrs:{"menu-props":t.$store.getters.getTheme?"dark":"light",dark:"",items:t.headerOptions,label:"Kilpailun otsikko",outlined:""},on:{input:function(e){return t.$emit("change",t.headerSelection)}},model:{value:t.headerSelection,callback:function(e){t.headerSelection=e},expression:"headerSelection"}})],1),a("v-col",{staticClass:"d-flex",attrs:{md:"4"}},[a("v-select",{attrs:{"menu-props":t.$store.getters.getTheme?"dark":"light",dark:"",items:t.selectNumbers,label:"Cup sijoittumispisteisiin vaikuttavien kilpailujen määrä",outlined:""},on:{input:function(e){return t.$emit("calculate",t.selectedCompetitions)}},model:{value:t.selectedCompetitions,callback:function(e){t.selectedCompetitions=e},expression:"selectedCompetitions"}})],1),a("v-col",{attrs:{md:"4"}},[a("v-btn",{attrs:{large:"",outlined:"",color:"red lighten-2",dark:t.$store.getters.getTheme,loading:t.loading},on:{click:function(e){t.dialog=!0}}},[a("v-icon",{attrs:{color:"red"}},[t._v("mdi-file-pdf-box")]),t._v(" Lataa pdf ")],1)],1)],1):t._e(),t.results.length&&t.notFinishedCount>0?a("v-row",[a("v-col",[a("p",{staticClass:"flow-text",class:{"white--text":t.$store.getters.getTheme}},[t._v(" *Punaisella merkityt kilpailut ovat vielä kesken! ("+t._s(t.notFinishedCount)+" kpl) ")])])],1):t._e(),t.isResults?a("v-row",[a("v-col",[a("v-card",{attrs:{dark:t.$store.getters.getTheme}},[a("v-card-title",[a("p",{staticClass:"flow-text"},[t._v("Cupin kokonaispisteet")]),a("v-spacer"),a("v-text-field",{attrs:{"append-icon":"mdi-magnify",label:"Hae kilpailijaa","single-line":"","hide-details":""},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}})],1),a("v-data-table",{attrs:{id:"normal-table",headers:t.headers,items:t.results,search:t.search,loading:t.loading},scopedSlots:t._u([t._l(t.headers,(function(e,i){return{key:"header."+e.value,fn:function(s){var n=s.header;return[n.highlight?a("span",{key:i,staticClass:"strokeme",class:{"red-text":n.isFinished,"green-text":!n.isFinished}},[t._v(" "+t._s(n.text)+" ")]):a("span",{key:e.value},[t._v(t._s(n.text))])]}}})),{key:"item.final_placement",fn:function(e){var i=e.item;return[a("v-chip",{attrs:{outlined:t.$store.getters.getTheme,color:t.getColor(i.final_placement)}},[t._v(t._s(i.final_placement)+".")])]}},t._l(t.competitions.length,(function(e,i){return{key:"item.cup_results["+e+"].points",fn:function(s){var n=s.item;return[n.cup_results[e]?a("div",{key:e},[n.cup_results[e].points===t.competitions[i].cup_participation_points?a("span",{staticClass:"strokeme"},[t._v(t._s(n.cup_results[e].points)+"p ("+t._s(n.cup_results[e].placement)+".)")]):a("span",{staticClass:"strokeme",class:["font-weight-bold",t.getColor(n.cup_results[e].placement)+"--text","strokeme"]},[t._v(t._s(n.cup_results[e].points)+"p ("+t._s(n.cup_results[e].placement)+".)")])]):a("span",{key:i},[t._v(" - ")])]}}})),{key:"item.final_cup_points",fn:function(e){var i=e.item;return[a("span",{staticClass:"indigo--text font-weight-bold"},[t._v(t._s(i.final_cup_points)+"p")])]}}],null,!0)})],1)],1)],1):a("v-row",[a("v-col",[a("h2",{class:{"white--text":t.$store.getters.getTheme}},[t._v(" Kilpailuissa ei vielä tuloksia! ")])])],1),t.competitions.length&&t.cup?a("v-row",[t.loading?a("v-col",[a("p",{staticClass:"flow-text",class:{"white--text":t.$store.getters.getTheme}},[t._v(" Päivitetään tuloksia... ")])]):t._e()],1):t._e(),t.competitions.length&&t.cup?a("v-row",{staticStyle:{"margin-bottom":"20px"}},[a("v-col",[a("v-btn",{staticClass:"white--text",attrs:{id:"updatebtn",large:"",tile:"",loading:t.loading,disabled:!t.isResults,color:"blue darken-4"},on:{click:function(e){return t.$emit("refresh",t.cup)}}},[a("v-icon",[t._v("mdi-update")]),t._v("Päivitä cupin tulokset ")],1)],1)],1):a("v-row",[a("v-col",[a("h2",{class:{"white--text":t.$store.getters.getTheme}},[t._v(" Ei kilpailuja rekisteröitynä! ")])])],1)],1)],1)},s=[],n=a("e0b1"),o={name:"CupPoints",props:["competitions","results","cup","headers","isResults","notFinishedCount","loading","selectNumbers"],data:function(){return{headerOptions:["Paikkakunta","Kilpailun nimi"],headerSelection:"Paikkakunta",selectedCompetitions:this.competitions.length,search:"",showInfoInPdf:!0,isLandscape:!1,dialog:!1}},mounted:function(){this.cup.meaningful_competitions>0?this.selectedCompetitions=this.cup.meaningful_competitions:this.selectedCompetitions=this.competitions.length},methods:{getColor:function(t){return n["default"].getColor(t)}}},l=o,r=a("2877"),c=a("6544"),d=a.n(c),u=a("8336"),m=a("b0af"),p=a("99d9"),h=a("ac7c"),v=a("cc20"),_=a("62ad"),g=a("8fea"),f=a("169a"),b=a("ce7e"),k=a("132d"),x=a("0fd9"),C=a("b974"),w=a("2fa4"),y=a("8654"),V=Object(r["a"])(l,i,s,!1,null,"19d6f022",null);e["a"]=V.exports;d()(V,{VBtn:u["a"],VCard:m["a"],VCardActions:p["a"],VCardText:p["b"],VCardTitle:p["c"],VCheckbox:h["a"],VChip:v["a"],VCol:_["a"],VDataTable:g["a"],VDialog:f["a"],VDivider:b["a"],VIcon:k["a"],VRow:x["a"],VSelect:C["a"],VSpacer:w["a"],VTextField:y["a"]})},ef79:function(t,e,a){"use strict";a("1554")}}]);
//# sourceMappingURL=about~069f6afa.e6b9e83c.js.map