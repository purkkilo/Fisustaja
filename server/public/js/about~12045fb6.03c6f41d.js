(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["about~12045fb6"],{e0b1:function(t,e,i){"use strict";i.r(e);var a=i("2909"),n=i("b85c"),s=(i("96cf"),i("4fadc"),i("d3b7"),i("159b"),i("07ac"),i("35b3"),i("a9e3"),i("ac1f"),i("5319"),i("a15b"),i("d81d"),i("1276"),i("99af"),i("b0c0"),i("5b81"),i("caad"),i("2532"),i("3ca3"),i("ddb0"),i("4e827"),i("4de4"),i("2b3d"),i("9861"),i("8baf")),o=(i("0da4"),regeneratorRuntime.mark(_));function l(t,e){var i=Object.entries(t),a=[];return i.forEach((function(t){var i=Object.values(t[1]);if(1===e&&(i[0]=String(i[0])+".",i[1]="("+String(i[1])+")",i[5]=i[5].toLocaleString()+" p"),2===e){i[0]=String(i[0])+".",i[1]="("+String(i[1])+")";var s,o=Object(n["a"])(_(3,i.length-2));try{for(o.s();!(s=o.n()).done;){var l=s.value;parseInt(i[l])>0?i[l]=i[l].toLocaleString()+" g":i[l]="-"}}catch(B){o.e(B)}finally{o.f()}i[i.length-1]=i[i.length-1].toLocaleString()+" p"}if(3===e){var r=i[3],c=i[0],h=i[1],u=i[2].toLocaleString()+" g";i[0]=String(r)+".",i[1]="("+String(c)+")",i[2]=h,i[3]=u}if(4===e&&(i[1]="("+String(i[1])+")",i[3]=i[i.length-1].toLocaleString()+" g"),5===e){var g=i[5],d=i[0],p=i[1],m=i[2],f=i[3],b=i[4];i[0]=String(g)+".",i[1]=d,i[2]=p,i[3]=m,i[4]=f,i[5]=b.toLocaleString()+" p"}if(6===e){var S=i[1],w=i[3],y=i[4],k=i[2],v=i[5],x=i[6];i[0]="("+String(S)+")",i[1]=w,i[2]=y,i[3]=k,i[4]=v,i[5]=x}if(7===e){var P=i[0],T=i[1],j=i[2],z=i[3];i[0]=P,i[1]="x "+String(T),i[2]=j+" cm",i[3]=String(Math.round(100*(z/1e3+Number.EPSILON))/100)+" kg"}a.push(i)})),a}function r(t){return t.replace(/(?:^|\s|['`‘’.-])[^\x60^\x7B-\xDF](?!(\s|$))/g,(function(t){return t.toUpperCase()}))}function c(t,e){return Object(a["a"])(t).map((function(t){for(var i in e)t==i&&(t=e[i]);return t})).join("")}function h(t,e,i){return t.split(e).join(i)}function u(t){t=this.$moment(t);var e="".concat(t.date(),".").concat(t.month()+1,".").concat(t.year());return e}function g(t,e){this.onbeforeprint();var i,a,n,o=this.formatDate(this.competition.start_date),l=this.formatDate(this.competition.end_date),r=new s["default"],c="".concat(this.competition.name),h=o===l?String(o):"".concat(o," - ").concat(l),u="".concat(h,", Klo. ").concat(this.competition.start_time," - ").concat(this.competition.end_time);r.setFontSize(24),r.text(10,10,c,{align:"left"}),r.setFontSize(14),r.text(10,20,this.competition.cup_name,{align:"left"}),r.text(10,30,u,{align:"left"}),r.line(0,35,400,35),r.setFontSize(20),"#normal-table"===e&&(n="Normaalikilpailu".concat(this.selected_normal),"Pisteet"===this.selected_normal&&(a=["Sijoitus","Nro.","Kippari","Varakippari","Paikkakunta","Tulos","Sij. pisteet","Osal. pisteet","Yht."],i=this.dictToArray(this.normal_points,1)),"Kalat"===this.selected_normal&&(a=["Sijoitus","Nro.","Kippari"],this.table_fish_names.forEach((function(t){a.push(t)})),a.push("Tulos"),i=this.dictToArray(this.normal_weights,2)),"Ilmoittautuneet"===this.selected_normal&&(a=["Kilp. numero","Kippari","Varakippari","Paikkakunta","Lähtöpaikka"],this.isTeamCompetition&&a.push("Tiimi"),i=this.dictToArray(this.$store.getters.getSignees,6))),"#team-table"===e&&(n="Tiimikilpailu",a=["Sijoitus","Tiimi","Jäsen 1","Jäsen 2","Jäsen 3","Pisteet"],i=this.dictToArray(this.team_results,5)),"#biggest-fishes-table"===e&&(n="SuurimmatKalat".concat(this.selected_biggest_fish),"Voittajat"===this.selected_biggest_fish?(a=["Kalalaji","Veneen nro","Kippari","Paino"],i=this.dictToArray(this.biggest_fishes_results,4)):(a=["Sijoitus","Veneen nro","Kippari","Paino"],i=this.dictToArray(this.biggest_fishes_results,3))),"#biggest-amounts-table"===e&&(n="SuurimmatSaaliit".concat(this.selected_biggest_amount),"Voittajat"===this.selected_biggest_amount?(a=["Kalalaji","Veneen nro","Kippari","Paino"],i=this.dictToArray(this.biggest_amounts_results,4)):(a=["Sijoitus","Veneen nro","Kippari","Paino"],i=this.dictToArray(this.biggest_amounts_results,3))),r.text(100,50,t,{align:"center"}),r.autoTable({head:[a],body:i,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",startY:55,margin:{top:20}});var g="".concat(this.$moment(this.competition.start_date).year(),"_").concat(this.replaceAll(this.competition.name," ",""),"_").concat(n,".pdf");P(r,g),this.onafterprint()}function d(t){this.onbeforeprint();var e=this.formatDate(this.competition.start_date),i=this.formatDate(this.competition.end_date),a=new s["default"],n="".concat(this.competition.name),o=e===i?String(e):"".concat(e," - ").concat(i),l="".concat(o,", Klo. ").concat(this.competition.start_time," - ").concat(this.competition.end_time);a.setFontSize(24),a.text(10,10,n,{align:"left"}),a.setFontSize(14),a.text(10,20,this.competition.cup_name,{align:"left"}),a.text(10,30,l,{align:"left"}),a.line(0,35,400,35),a.setFontSize(18);var r=document.getElementById("fishes_chart").toDataURL("image/png",1),c=document.getElementById("signee_chart").toDataURL("image/png",1);a.addImage(r,"PNG",-30,40,180,90),a.addImage(c,"PNG",70,40,180,90),a.text(100,145,"Kalalajien määritykset",{align:"center"});var h=this.dictToArray(this.calculated_fish_weights,7),u=Math.round(100*(this.calculated_total_weights/1e3+Number.EPSILON))/100,g=u.toLocaleString()+" kg";h.push(["Yhteensä","","",g]);var d=["Kalalaji","Kerroin","Alamitta","Saalista saatu"];a.autoTable({head:[d],body:h,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{cellwidth:"auto"},theme:"striped",pageBreak:"auto",tableWidth:"auto",startY:150,margin:{top:20}}),a.text(100,a.autoTable.previous.finalY+20,"Yleisiä tilastoja",{align:"center"}),d=["",""],h=[["Cup pistekerroin","x ".concat(this.competition.cup_points_multiplier)],["Ilmoittautuneita yhteensä","".concat(this.signees.length," kpl")],["Saalista saaneita","".concat(Math.round(this.$store.getters.getPointSignees.length/this.competition.signees.length*100*100)/100," % (").concat(this.$store.getters.getPointSignees.length,"/").concat(this.signees.length,")")]],a.autoTable({head:[d],body:h,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",margin:{top:20},startY:a.autoTable.previous.finalY+25});var p="".concat(this.$moment(this.competition.start_date).year(),"_").concat(this.replaceAll(this.competition.name," ",""),"_").concat(this.replaceAll(this.capitalize_words(t)," ",""),".pdf");P(a,p),this.onafterprint()}function p(t){var e=this;this.onbeforeprint();var i,a,n,o=t,l=!0,r=this.selected_biggest_fish,c=this.selected_biggest_amount,h=this.selected_normal,u=this.formatDate(this.competition.start_date),g=this.formatDate(this.competition.end_date),d=this.$moment(this.competition.start_date).year(),p=new s["default"],m="".concat(this.competition.name),f=u===g?String(u):"".concat(u," - ").concat(g),_="".concat(f,", Klo. ").concat(this.competition.start_time," - ").concat(this.competition.end_time);if(p.setFontSize(24),p.text(10,10,m,{align:"left"}),p.setFontSize(14),p.text(10,20,this.competition.cup_name,{align:"left"}),p.text(10,30,_,{align:"left"}),p.line(0,35,400,35),p.setFontSize(18),this.selected_print.includes("normal")&&(n=["Sijoitus","Nro.","Kippari"],this.table_fish_names.forEach((function(t){n.push(t)})),n.push("Tulos"),a=this.dictToArray(this.normal_weights,2),p.text(100,50,"Normaalikilpailun tulokset (Kalat)",{align:"center"}),p.autoTable({head:[n],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",margin:{top:20},startY:60}),p.addPage(),n=["Sijoitus","Nro.","Kippari","Varakippari","Paikkakunta","Tulos","Sij. pisteet","Osal. pisteet","Yht."],a=this.dictToArray(this.normal_points,1),p.text(100,10,"Normaalikilpailun tulokset (Pisteet)",{align:"center"}),p.autoTable({head:[n],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",startY:20,margin:{top:20}})),this.isTeamCompetition&&this.selected_print.includes("team")&&(this.selected_print.includes("normal")&&p.addPage(),p.setFontSize(24),p.text(10,10,m,{align:"left"}),p.setFontSize(14),p.text(10,20,this.competition.cup_name,{align:"left"}),p.text(10,30,_,{align:"left"}),p.line(0,35,400,35),p.setFontSize(18),p.text(100,50,"Tiimikilpailun tulokset",{align:"center"}),this.team_results.length&&(n=["Sijoitus","Tiimi","Jäsen 1","Jäsen 2","Jäsen 3","Pisteet"],a=this.dictToArray(this.normal_points,1),p.autoTable({head:[n],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",margin:{top:20},startY:55}))),this.selected_print.includes("biggest_fishes")){(this.selected_print.includes("normal")||this.selected_print.includes("team"))&&p.addPage();var b=0;this.table_fish_names.forEach((function(t){e.selected_biggest_fish=t,e.calculateBiggestFishes(),i=10,e.biggest_fishes_results.length&&(b>0&&p.addPage(),p.setFontSize(24),p.text(10,10,m,{align:"left"}),p.setFontSize(14),p.text(10,20,e.competition.cup_name,{align:"left"}),p.text(10,30,_,{align:"left"}),p.line(0,35,400,35),p.setFontSize(18),i=50,n=["Sijoitus","Veneen nro","Kippari","Paino"],a=e.dictToArray(e.biggest_fishes_results,3),p.text(100,i,"Suurimmat kalat"+" (".concat(t,")"),{align:"center"}),p.autoTable({head:[n],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",margin:{top:20},startY:i+5}),b++)}))}if(this.selected_print.includes("biggest_amounts")){(this.selected_print.includes("normal")||this.selected_print.includes("team")||this.selected_print.includes("biggest_fishes"))&&p.addPage();var S=0;n=["Sijoitus","Veneen nro","Kippari","Paino"],this.table_fish_names.forEach((function(t){e.selected_biggest_amount=t,e.calculateBiggestAmounts(),i=10,e.biggest_amounts[t].length&&(S>0&&p.addPage(),p.setFontSize(24),p.text(10,10,m,{align:"left"}),p.setFontSize(14),p.text(10,20,e.competition.cup_name,{align:"left"}),p.text(10,30,_,{align:"left"}),p.line(0,35,400,35),p.setFontSize(18),i=50,n=["Sijoitus","Veneen nro","Kippari","Paino"],a=e.dictToArray(e.biggest_amounts[t],3),p.text(100,i,"Suurimmat kalasaaliit"+" (".concat(t,")"),{align:"center"}),p.autoTable({head:[n],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",startY:i+5}),S++)}))}if(this.selected_print.includes("biggest_winners")&&((this.selected_print.includes("normal")||this.selected_print.includes("team")||this.selected_print.includes("biggest_fishes")||this.selected_print.includes("biggest_amounts"))&&p.addPage(),this.selected_biggest_fish=this.selected_biggest_amount="Voittajat",n=["Kalalaji","Veneen nro","Kippari","Paino"],this.calculateBiggestFishes(),this.calculateBiggestAmounts(),(this.biggest_fishes_results.length||this.biggest_amounts_results.length)&&(p.setFontSize(24),p.text(10,10,m,{align:"left"}),p.setFontSize(14),p.text(10,20,this.competition.cup_name,{align:"left"}),p.text(10,30,_,{align:"left"}),p.line(0,35,400,35),p.setFontSize(18)),this.biggest_fishes_results.length?(a=this.dictToArray(this.biggest_fishes_results,4),p.text(100,50,"Suurimmat kalat"+" (".concat(this.selected_biggest_fish,")"),{align:"center"}),p.autoTable({head:[n],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{cellwidth:"auto"},theme:"striped",pageBreak:"auto",tableWidth:"auto",margin:{top:20},startY:55}),i=p.autoTable.previous.finalY+25):i=50,this.biggest_amounts_results.length&&(a=this.dictToArray(this.biggest_amounts_results,4),p.text(100,i,"Suurimmat kalasaaliit"+" (".concat(this.selected_biggest_fish,")"),{align:"center"}),p.autoTable({head:[n],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",margin:{top:20},startY:i+5}))),this.selected_print.includes("stats")){(this.selected_print.includes("normal")||this.selected_print.includes("team")||this.selected_print.includes("biggest_fishes")||this.selected_print.includes("biggest_amounts")||this.selected_print.includes("biggest_winners"))&&p.addPage(),p.setFontSize(24),p.text(10,10,m,{align:"left"}),p.setFontSize(14),p.text(10,20,this.competition.cup_name,{align:"left"}),p.text(10,30,_,{align:"left"}),p.line(0,35,400,35),p.setFontSize(18);var w=document.getElementById("fishes_chart").toDataURL("image/png",1),y=document.getElementById("signee_chart").toDataURL("image/png",1);try{p.addImage(w,"PNG",-30,40,180,90),p.addImage(y,"PNG",70,40,180,90)}catch(T){l=!1,this.tab="stats",setTimeout((function(){return e.saveAllAsPDF(o)}),1e3)}p.text(100,165,"Kalalajien määritykset",{align:"center"}),a=this.dictToArray(this.calculated_fish_weights,7);var k=Math.round(100*(this.calculated_total_weights/1e3+Number.EPSILON))/100,v=k.toLocaleString()+" kg";a.push(["Yhteensä","","",v]),n=["Kalalaji","Kerroin","Alamitta","Saalista saatu"],p.autoTable({head:[n],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",startY:170,margin:{top:20}}),p.text(100,p.autoTable.previous.finalY+20,"Yleisiä tilastoja",{align:"center"}),n=["",""],a=[["Cup pistekerroin","x ".concat(this.competition.cup_points_multiplier)],["Ilmoittautuneita yhteensä","".concat(this.signees.length," kpl")],["Saalista saaneita","".concat(Math.round(this.$store.getters.getPointSignees.length/this.competition.signees.length*100*100)/100," % (").concat(this.$store.getters.getPointSignees.length,"/").concat(this.signees.length,")")]],p.autoTable({head:[n],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",margin:{top:20},startY:p.autoTable.previous.finalY+25})}if(this.selected_biggest_fish=r,this.selected_biggest_amount=c,this.selected_normal=h,this.calculateBiggestFishes(),this.calculateBiggestAmounts(),l){this.tab=o;var x="".concat(d,"_").concat(this.replaceAll(this.competition.name," ",""),"Tulokset.pdf");P(p,x),this.onafterprint()}else this.text="Kaaviot ei ruudulla, yritetään uudelleen...",this.snackbar=!0}function m(){var t=i("30ef");for(var e in t.instances){var a=t.instances[e];a.canvas.parentNode.style.height="800px",a.canvas.parentNode.style.width="1600px",a.resize()}}function f(){var t=i("30ef");for(var e in t.instances){var a=t.instances[e];a.canvas.parentNode.style.height="",a.canvas.parentNode.style.width="",a.resize()}this.drawCharts()}function _(t,e){return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return i.next=2,t;case 2:if(t!==e){i.next=4;break}return i.abrupt("return");case 4:return i.delegateYield(_(t+1,e),"t0",5);case 5:case"end":return i.stop()}}),o)}function b(t){return t>30?"red":t>20?"orange":t>5?"yellow":"green"}function S(t){return t>1?"red":1===t?"green":"grey"}function w(t){return t>5?"primary darken-2":"red"}function y(){var t=[],e=[];this.calculated_fish_weights.forEach((function(i){t.push(i.weights),e.push(i.color)}));var i=[],a=this.$store.getters.getPointSignees.length,n=this.signees.length-a;i.push(a),i.push(n),this.fishes_chart_title="Kaloja saatu yhteensä",this.fishes_chart_data={labels:this.table_fish_names,datasets:[{label:"Paino",backgroundColor:e,data:t}]},this.signee_chart_title="Saalista saaneita",this.signee_chart_data={labels:["Kyllä","Ei saalista"],datasets:[{label:"Lukumäärä",backgroundColor:["#7fbf7f","#ff7f7f"],data:i}]}}function k(t){if(t){var e=[],i=[];return this.fish_names.forEach((function(a){"Voittajat"!==a&&t[a]&&(i=t[a].sort((function(t,e){return parseInt(e.weight)-parseInt(t.weight)})),t[a]=i.filter((function(t){return t.weight>0})),t[a].length&&e.push({name:a,boat_number:i[0].boat_number,captain_name:i[0].captain_name,weight:i[0].weight.toLocaleString()}))})),e}return[]}function v(t,e,i){var a,n,s,o,l,r,c,h;if(t=Math.max(0,Math.min(360,t)),e=Math.max(0,Math.min(100,e)),i=Math.max(0,Math.min(100,i)),e/=100,i/=100,0==e)return a=n=s=i,[Math.round(255*a),Math.round(255*n),Math.round(255*s)];switch(t/=60,o=Math.floor(t),l=t-o,r=i*(1-e),c=i*(1-e*l),h=i*(1-e*(1-l)),o){case 0:a=i,n=h,s=r;break;case 1:a=c,n=i,s=r;break;case 2:a=r,n=i,s=h;break;case 3:a=r,n=c,s=i;break;case 4:a=h,n=r,s=i;break;default:a=i,n=r,s=c}return{r:Math.round(255*a),g:Math.round(255*n),b:Math.round(255*s)}}function x(t){for(var e=360/(t-1),i=[],a=90,n=50,s=0;s<t;s++){var o=Math.floor(Math.random()*(a-n))+n,l=Math.floor(Math.random()*(a-n))+n,r=this.HSVtoRGB(e*s,o,l);i.push("rgb(".concat(r.r,",").concat(r.g,",").concat(r.b,")"))}return i}function P(t,e){window.navigator&&window.navigator.msSaveOrOpenBlob?window.navigator.msSaveOrOpenBlob(t.output("blob"),e):(window.open(URL.createObjectURL(t.output("blob")),"_blank","height=auto,width=auto,scrollbars=yes,location=yes"),setTimeout((function(){window.URL.revokeObjectURL(t.output("bloburl"))}),100))}function T(t,e){return function(i,a){return e?(a[t]<i[t])-(a[t]>i[t]):(a[t]>i[t])-(a[t]<i[t])}}e["default"]={onafterprint:f,onbeforeprint:m,saveAllAsPDF:p,saveStatsAsPDF:d,saveAsPDF:g,dictToArray:l,capitalize_words:r,replaceAll:h,formatDate:u,range:_,getColorPoints:w,getMultiplierColor:S,getColor:b,drawCharts:y,sortDict:k,HSVtoRGB:v,getRandomColors:x,openPdfOnNewTab:P,sortBy:T,replaceAllChars:c}}}]);
//# sourceMappingURL=about~12045fb6.03c6f41d.js.map