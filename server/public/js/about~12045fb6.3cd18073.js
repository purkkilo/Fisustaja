(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["about~12045fb6"],{e0b1:function(t,e,i){"use strict";i.r(e);var a=i("2909"),s=i("b85c"),n=(i("96cf"),i("4fadc"),i("d3b7"),i("159b"),i("07ac"),i("35b3"),i("a9e3"),i("ac1f"),i("5319"),i("a15b"),i("d81d"),i("1276"),i("99af"),i("b0c0"),i("5b81"),i("caad"),i("2532"),i("3ca3"),i("ddb0"),i("4e827"),i("4de4"),i("2b3d"),i("9861"),i("8baf")),o=(i("0da4"),regeneratorRuntime.mark(_));function l(t,e){var i=Object.entries(t),a=[];return i.forEach((function(t){var i=Object.values(t[1]);if(1===e&&(i[0]=String(i[0])+".",i[1]="("+String(i[1])+")",i[5]=i[5].toLocaleString()+" p",i[6]=i[i.length-1]+" p"),2===e){i[0]=String(i[0])+".",i[1]="("+String(i[1])+")";var n,o=Object(s["a"])(_(3,i.length-2));try{for(o.s();!(n=o.n()).done;){var l=n.value;parseInt(i[l])>0?i[l]=i[l].toLocaleString()+" g":i[l]="-"}}catch(C){o.e(C)}finally{o.f()}i[i.length-1]=i[i.length-1].toLocaleString()+" p"}if(3===e){var r=isNaN(i[i.length-1])?i[i.length-2]:i[i.length-1],h=i[0],c=i[1],g=i[2].toLocaleString()+" g";i[0]=String(r)+".",i[1]="("+String(h)+")",i[2]=c,i[3]=g}if(4===e&&(i[1]="("+String(i[1])+")",i[3]=i[i.length-1].toLocaleString()+" g"),5===e){var u=i[5],d=i[0],p=i[1],m=i[2],f=i[3],b=i[4];i[0]=String(u)+".",i[1]=d,i[2]=p,i[3]=m,i[4]=f,i[5]=b.toLocaleString()+" p"}if(6===e){var S=i[1],y=i[3],w=i[4],k=i[2],v=i[5],x=i[6];i[0]="("+String(S)+")",i[1]=y,i[2]=w,i[3]=k,i[4]=v,i[5]=x}if(7===e){var P=i[0],T=i[1],j=i[2],B=i[3];i[0]=P,i[1]="x "+String(T),i[2]=j+" cm",i[3]=String(Math.round(100*(B/1e3+Number.EPSILON))/100)+" kg"}if(8===e){var z=isNaN(i[i.length-1])?i[i.length-2]:i[i.length-1],W=i[0],K=i[1],A=isNaN(i[i.length-1])?i[i.length-1]:i[i.length-2],F=i[2].toLocaleString()+" g";i[0]=String(z)+".",i[1]="("+String(W)+")",i[2]=K,i[3]=A,i[4]=F}a.push(i)})),a}function r(t){return t.replace(/(?:^|\s|['`‘’.-])[^\x60^\x7B-\xDF](?!(\s|$))/g,(function(t){return t.toUpperCase()}))}function h(t,e){return Object(a["a"])(t).map((function(t){for(var i in e)t==i&&(t=e[i]);return t})).join("")}function c(t,e,i){return t.split(e).join(i)}function g(t){t=this.$moment(t);var e="".concat(t.date(),".").concat(t.month()+1,".").concat(t.year());return e}function u(t,e){this.onbeforeprint();var i,a,s,o=this.formatDate(this.competition.start_date),l=this.formatDate(this.competition.end_date),r=new n["default"],h="".concat(this.competition.name),c=o===l?String(o):"".concat(o," - ").concat(l),g="".concat(c,", Klo. ").concat(this.competition.start_time," - ").concat(this.competition.end_time);r.setFontSize(24),r.text(10,10,h,{align:"left"}),r.setFontSize(14),r.text(10,20,this.competition.cup_name,{align:"left"}),r.text(10,30,g,{align:"left"}),r.line(0,35,400,35),r.setFontSize(20),"#normal-table"===e&&(s="Normaalikilpailu".concat(this.selected_normal),"Pisteet"===this.selected_normal&&(a=["Sijoitus","Nro.","Kippari","Varakippari","Paikkakunta","Tulos","Cup pisteet"],i=this.dictToArray(this.normal_points,1)),"Kalat"===this.selected_normal&&(a=["Sijoitus","Nro.","Kippari"],this.table_fish_names.forEach((function(t){a.push(t)})),a.push("Tulos"),i=this.dictToArray(this.normal_weights,2)),"Ilmoittautuneet"===this.selected_normal&&(a=["Kilp. numero","Kippari","Varakippari","Paikkakunta","Lähtöpaikka"],this.isTeamCompetition&&a.push("Tiimi"),i=this.dictToArray(this.$store.getters.getSignees,6))),"#team-table"===e&&(s="Tiimikilpailu",a=["Sijoitus","Tiimi","Jäsen 1","Jäsen 2","Jäsen 3","Pisteet"],i=this.dictToArray(this.team_results,5)),"#biggest-fishes-table"===e&&(s="SuurimmatKalat".concat(this.selected_biggest_fish),"Voittajat"===this.selected_biggest_fish?(a=["Kalalaji","Veneen nro","Kippari","Paino"],i=this.dictToArray(this.biggest_fishes_results,4)):"Kaikki"===this.selected_biggest_fish?(a=["Sijoitus","Veneen nro","Kippari","Kala","Paino"],i=this.dictToArray(this.biggest_fishes_results,8)):(a=["Sijoitus","Veneen nro","Kippari","Paino"],i=this.dictToArray(this.biggest_fishes_results,3))),"#biggest-amounts-table"===e&&(s="SuurimmatSaaliit".concat(this.selected_biggest_amount),"Voittajat"===this.selected_biggest_amount?(a=["Kalalaji","Veneen nro","Kippari","Paino"],i=this.dictToArray(this.biggest_amounts_results,4)):"Kaikki"===this.selected_biggest_amount?(a=["Sijoitus","Veneen nro","Kippari","Kala","Paino"],i=this.dictToArray(this.biggest_amounts_results,8)):(a=["Sijoitus","Veneen nro","Kippari","Paino"],i=this.dictToArray(this.biggest_amounts_results,3))),r.text(100,50,t,{align:"center"}),r.autoTable({head:[a],body:i,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",startY:55,margin:{top:20}});var u="".concat(this.$moment(this.competition.start_date).year(),"_").concat(this.replaceAll(this.competition.name," ",""),"_").concat(s,".pdf");P(r,u),this.onafterprint()}function d(t){this.onbeforeprint();var e=this.formatDate(this.competition.start_date),i=this.formatDate(this.competition.end_date),a=new n["default"],s="".concat(this.competition.name),o=e===i?String(e):"".concat(e," - ").concat(i),l="".concat(o,", Klo. ").concat(this.competition.start_time," - ").concat(this.competition.end_time);a.setFontSize(24),a.text(10,10,s,{align:"left"}),a.setFontSize(14),a.text(10,20,this.competition.cup_name,{align:"left"}),a.text(10,30,l,{align:"left"}),a.line(0,35,400,35),a.setFontSize(18);var r=document.getElementById("fishes_chart").toDataURL("image/png",1),h=document.getElementById("signee_chart").toDataURL("image/png",1);a.addImage(r,"PNG",-30,40,180,90),a.addImage(h,"PNG",70,40,180,90),a.text(100,145,"Kalalajien määritykset",{align:"center"});var c=this.dictToArray(this.calculated_fish_weights,7),g=Math.round(100*(this.calculated_total_weights/1e3+Number.EPSILON))/100,u=g.toLocaleString()+" kg";c.push(["Yhteensä","","",u]);var d=["Kalalaji","Kerroin","Alamitta","Saalista saatu"];a.autoTable({head:[d],body:c,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{cellwidth:"auto"},theme:"striped",pageBreak:"auto",tableWidth:"auto",startY:150,margin:{top:20}}),a.text(100,a.autoTable.previous.finalY+20,"Yleisiä tilastoja",{align:"center"}),d=["",""],c=[["Cup pistekerroin","x ".concat(this.competition.cup_points_multiplier)],["Ilmoittautuneita yhteensä","".concat(this.signees.length," kpl")],["Saalista saaneita","".concat(Math.round(this.$store.getters.getPointSignees.length/this.competition.signees.length*100*100)/100," % (").concat(this.$store.getters.getPointSignees.length,"/").concat(this.signees.length,")")]],a.autoTable({head:[d],body:c,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",margin:{top:20},startY:a.autoTable.previous.finalY+25});var p="".concat(this.$moment(this.competition.start_date).year(),"_").concat(this.replaceAll(this.competition.name," ",""),"_").concat(this.replaceAll(this.capitalize_words(t)," ",""),".pdf");P(a,p),this.onafterprint()}function p(t){var e=this;this.onbeforeprint();var i,a,s,o=t,l=!0,r=this.selected_biggest_fish,h=this.selected_biggest_amount,c=this.selected_normal,g=this.formatDate(this.competition.start_date),u=this.formatDate(this.competition.end_date),d=this.$moment(this.competition.start_date).year(),p=new n["default"],m="".concat(this.competition.name),f=g===u?String(g):"".concat(g," - ").concat(u),_="".concat(f,", Klo. ").concat(this.competition.start_time," - ").concat(this.competition.end_time);if(p.setFontSize(24),p.text(10,10,m,{align:"left"}),p.setFontSize(14),p.text(10,20,this.competition.cup_name,{align:"left"}),p.text(10,30,_,{align:"left"}),p.line(0,35,400,35),p.setFontSize(18),this.selected_print.includes("normal")&&(s=["Sijoitus","Nro.","Kippari"],this.table_fish_names.forEach((function(t){s.push(t)})),s.push("Tulos"),a=this.dictToArray(this.normal_weights,2),p.text(100,50,"Normaalikilpailun tulokset (Kalat)",{align:"center"}),p.autoTable({head:[s],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",margin:{top:20},startY:60}),p.addPage(),s=["Sijoitus","Nro.","Kippari","Varakippari","Paikkakunta","Tulos","Cup pisteet"],a=this.dictToArray(this.normal_points,1),p.text(100,10,"Normaalikilpailun tulokset (Pisteet)",{align:"center"}),p.autoTable({head:[s],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",startY:20,margin:{top:20}})),this.isTeamCompetition&&this.selected_print.includes("team")&&(this.selected_print.includes("normal")&&p.addPage(),p.setFontSize(24),p.text(10,10,m,{align:"left"}),p.setFontSize(14),p.text(10,20,this.competition.cup_name,{align:"left"}),p.text(10,30,_,{align:"left"}),p.line(0,35,400,35),p.setFontSize(18),p.text(100,50,"Tiimikilpailun tulokset",{align:"center"}),this.team_results.length&&(s=["Sijoitus","Tiimi","Jäsen 1","Jäsen 2","Jäsen 3","Pisteet"],a=this.dictToArray(this.normal_points,1),p.autoTable({head:[s],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",margin:{top:20},startY:55}))),this.selected_print.includes("all_biggest")&&((this.selected_print.includes("normal")||this.selected_print.includes("team"))&&p.addPage(),this.selected_biggest_fish=this.selected_biggest_amount="Kaikki",s=["Sijoitus","Veneen nro","Kippari","Kala","Paino"],this.calculateBiggestFishes(),this.calculateBiggestAmounts(),(this.biggest_fishes_results.length||this.biggest_amounts_results.length)&&(p.setFontSize(24),p.text(10,10,m,{align:"left"}),p.setFontSize(14),p.text(10,20,this.competition.cup_name,{align:"left"}),p.text(10,30,_,{align:"left"}),p.line(0,35,400,35),p.setFontSize(18)),this.biggest_fishes_results.length?(a=this.dictToArray(this.biggest_fishes_results,8),p.text(100,50,"Suurimmat kalat"+" (".concat(this.selected_biggest_fish,")"),{align:"center"}),p.autoTable({head:[s],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{cellwidth:"auto"},theme:"striped",pageBreak:"auto",tableWidth:"auto",margin:{top:20},startY:55}),i=p.autoTable.previous.finalY+25):i=50,this.biggest_amounts_results.length&&(a=this.dictToArray(this.biggest_amounts_results,8),p.text(100,i,"Suurimmat kalasaaliit"+" (".concat(this.selected_biggest_fish,")"),{align:"center"}),p.autoTable({head:[s],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",margin:{top:20},startY:i+5}))),this.selected_print.includes("biggest_fishes")){(this.selected_print.includes("normal")||this.selected_print.includes("team")||this.selected_print.includes("all_biggest"))&&p.addPage();var b=0;this.table_fish_names.forEach((function(t){e.selected_biggest_fish=t,e.calculateBiggestFishes(),i=10,e.biggest_fishes_results.length&&(b>0&&p.addPage(),p.setFontSize(24),p.text(10,10,m,{align:"left"}),p.setFontSize(14),p.text(10,20,e.competition.cup_name,{align:"left"}),p.text(10,30,_,{align:"left"}),p.line(0,35,400,35),p.setFontSize(18),i=50,s=["Sijoitus","Veneen nro","Kippari","Paino"],a=e.dictToArray(e.biggest_fishes_results,3),p.text(100,i,"Suurimmat kalat"+" (".concat(t,")"),{align:"center"}),p.autoTable({head:[s],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",margin:{top:20},startY:i+5}),b++)}))}if(this.selected_print.includes("biggest_amounts")){(this.selected_print.includes("normal")||this.selected_print.includes("team")||this.selected_print.includes("biggest_fishes")||this.selected_print.includes("all_biggest"))&&p.addPage();var S=0;s=["Sijoitus","Veneen nro","Kippari","Paino"],this.table_fish_names.forEach((function(t){e.selected_biggest_amount=t,e.calculateBiggestAmounts(),i=10,e.biggest_amounts[t].length&&(S>0&&p.addPage(),p.setFontSize(24),p.text(10,10,m,{align:"left"}),p.setFontSize(14),p.text(10,20,e.competition.cup_name,{align:"left"}),p.text(10,30,_,{align:"left"}),p.line(0,35,400,35),p.setFontSize(18),i=50,s=["Sijoitus","Veneen nro","Kippari","Paino"],a=e.dictToArray(e.biggest_amounts[t],3),p.text(100,i,"Suurimmat kalasaaliit"+" (".concat(t,")"),{align:"center"}),p.autoTable({head:[s],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",startY:i+5}),S++)}))}if(this.selected_print.includes("biggest_winners")&&((this.selected_print.includes("normal")||this.selected_print.includes("team")||this.selected_print.includes("biggest_fishes")||this.selected_print.includes("biggest_amounts")||this.selected_print.includes("all_biggest"))&&p.addPage(),this.selected_biggest_fish=this.selected_biggest_amount="Voittajat",s=["Kalalaji","Veneen nro","Kippari","Paino"],this.calculateBiggestFishes(),this.calculateBiggestAmounts(),(this.biggest_fishes_results.length||this.biggest_amounts_results.length)&&(p.setFontSize(24),p.text(10,10,m,{align:"left"}),p.setFontSize(14),p.text(10,20,this.competition.cup_name,{align:"left"}),p.text(10,30,_,{align:"left"}),p.line(0,35,400,35),p.setFontSize(18)),this.biggest_fishes_results.length?(a=this.dictToArray(this.biggest_fishes_results,4),p.text(100,50,"Suurimmat kalat"+" (".concat(this.selected_biggest_fish,")"),{align:"center"}),p.autoTable({head:[s],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{cellwidth:"auto"},theme:"striped",pageBreak:"auto",tableWidth:"auto",margin:{top:20},startY:55}),i=p.autoTable.previous.finalY+25):i=50,this.biggest_amounts_results.length&&(a=this.dictToArray(this.biggest_amounts_results,4),p.text(100,i,"Suurimmat kalasaaliit"+" (".concat(this.selected_biggest_fish,")"),{align:"center"}),p.autoTable({head:[s],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",margin:{top:20},startY:i+5}))),this.selected_print.includes("stats")){(this.selected_print.includes("normal")||this.selected_print.includes("team")||this.selected_print.includes("biggest_fishes")||this.selected_print.includes("biggest_amounts")||this.selected_print.includes("biggest_winners"))&&p.addPage(),p.setFontSize(24),p.text(10,10,m,{align:"left"}),p.setFontSize(14),p.text(10,20,this.competition.cup_name,{align:"left"}),p.text(10,30,_,{align:"left"}),p.line(0,35,400,35),p.setFontSize(18);var y=document.getElementById("fishes_chart").toDataURL("image/png",1),w=document.getElementById("signee_chart").toDataURL("image/png",1);try{p.addImage(y,"PNG",-30,40,180,90),p.addImage(w,"PNG",70,40,180,90)}catch(T){l=!1,this.tab="stats",setTimeout((function(){return e.saveAllAsPDF(o)}),1e3)}p.text(100,165,"Kalalajien määritykset",{align:"center"}),a=this.dictToArray(this.calculated_fish_weights,7);var k=Math.round(100*(this.calculated_total_weights/1e3+Number.EPSILON))/100,v=k.toLocaleString()+" kg";a.push(["Yhteensä","","",v]),s=["Kalalaji","Kerroin","Alamitta","Saalista saatu"],p.autoTable({head:[s],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",startY:170,margin:{top:20}}),p.text(100,p.autoTable.previous.finalY+20,"Yleisiä tilastoja",{align:"center"}),s=["",""],a=[["Cup pistekerroin","x ".concat(this.competition.cup_points_multiplier)],["Ilmoittautuneita yhteensä","".concat(this.signees.length," kpl")],["Saalista saaneita","".concat(Math.round(this.$store.getters.getPointSignees.length/this.competition.signees.length*100*100)/100," % (").concat(this.$store.getters.getPointSignees.length,"/").concat(this.signees.length,")")]],p.autoTable({head:[s],body:a,styles:{overflow:"linebreak",cellWidth:"wrap",rowPageBreak:"avoid",halign:"justify",fontSize:"8",lineColor:100,lineWidth:.25},columnStyles:{text:{cellwidth:"auto"}},theme:"striped",pageBreak:"auto",tableWidth:"auto",margin:{top:20},startY:p.autoTable.previous.finalY+25})}if(this.selected_biggest_fish=r,this.selected_biggest_amount=h,this.selected_normal=c,this.calculateBiggestFishes(),this.calculateBiggestAmounts(),l){this.tab=o;var x="".concat(d,"_").concat(this.replaceAll(this.competition.name," ",""),"Tulokset.pdf");P(p,x),this.onafterprint()}else this.text="Kaaviot ei ruudulla, yritetään uudelleen...",this.snackbar=!0}function m(){var t=i("30ef");for(var e in t.instances){var a=t.instances[e];a.canvas.parentNode.style.height="800px",a.canvas.parentNode.style.width="1600px",a.resize()}}function f(){var t=i("30ef");for(var e in t.instances){var a=t.instances[e];a.canvas.parentNode.style.height="",a.canvas.parentNode.style.width="",a.resize()}this.drawCharts()}function _(t,e){return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return i.next=2,t;case 2:if(t!==e){i.next=4;break}return i.abrupt("return");case 4:return i.delegateYield(_(t+1,e),"t0",5);case 5:case"end":return i.stop()}}),o)}function b(t){return 1===t?"yellow":t>1&&t<10?"green":"orange"}function S(t){return t>1?"red":1===t?"green":"grey"}function y(t){return t>5?"primary darken-2":"red"}function w(){var t=[],e=[];this.calculated_fish_weights.forEach((function(i){t.push(i.weights),e.push(i.color)}));var i=[],a=this.$store.getters.getPointSignees.length,s=this.signees.length-a;i.push(a),i.push(s),this.fishes_chart_title="Kaloja saatu yhteensä",this.fishes_chart_data={labels:this.table_fish_names,datasets:[{label:"Paino",backgroundColor:e,data:t}]},this.signee_chart_title="Saalista saaneita",this.signee_chart_data={labels:["Kyllä","Ei saalista"],datasets:[{label:"Lukumäärä",backgroundColor:["#7fbf7f","#ff7f7f"],data:i}]}}function k(t){if(t){var e=[],i=[];return this.fish_names.forEach((function(a){"Voittajat"!==a&&t[a]&&(i=t[a].sort((function(t,e){return parseInt(e.weight)-parseInt(t.weight)})),t[a]=i.filter((function(t){return t.weight>0})),t[a].length&&e.push({name:a,boat_number:i[0].boat_number,captain_name:i[0].captain_name,weight:i[0].weight.toLocaleString()}))})),e}return[]}function v(t,e,i){var a,s,n,o,l,r,h,c;if(t=Math.max(0,Math.min(360,t)),e=Math.max(0,Math.min(100,e)),i=Math.max(0,Math.min(100,i)),e/=100,i/=100,0==e)return a=s=n=i,[Math.round(255*a),Math.round(255*s),Math.round(255*n)];switch(t/=60,o=Math.floor(t),l=t-o,r=i*(1-e),h=i*(1-e*l),c=i*(1-e*(1-l)),o){case 0:a=i,s=c,n=r;break;case 1:a=h,s=i,n=r;break;case 2:a=r,s=i,n=c;break;case 3:a=r,s=h,n=i;break;case 4:a=c,s=r,n=i;break;default:a=i,s=r,n=h}return{r:Math.round(255*a),g:Math.round(255*s),b:Math.round(255*n)}}function x(t){for(var e=360/(t-1),i=[],a=90,s=50,n=0;n<t;n++){var o=Math.floor(Math.random()*(a-s))+s,l=Math.floor(Math.random()*(a-s))+s,r=this.HSVtoRGB(e*n,o,l);i.push("rgb(".concat(r.r,",").concat(r.g,",").concat(r.b,")"))}return i}function P(t,e){window.navigator&&window.navigator.msSaveOrOpenBlob?window.navigator.msSaveOrOpenBlob(t.output("blob"),e):(window.open(URL.createObjectURL(t.output("blob")),"_blank","height=auto,width=auto,scrollbars=yes,location=yes"),setTimeout((function(){window.URL.revokeObjectURL(t.output("bloburl"))}),100))}function T(t,e){return function(i,a){return e?(a[t]<i[t])-(a[t]>i[t]):(a[t]>i[t])-(a[t]<i[t])}}e["default"]={onafterprint:f,onbeforeprint:m,saveAllAsPDF:p,saveStatsAsPDF:d,saveAsPDF:u,dictToArray:l,capitalize_words:r,replaceAll:c,formatDate:g,range:_,getColorPoints:y,getMultiplierColor:S,getColor:b,drawCharts:w,sortDict:k,HSVtoRGB:v,getRandomColors:x,openPdfOnNewTab:P,sortBy:T,replaceAllChars:h}}}]);
//# sourceMappingURL=about~12045fb6.3cd18073.js.map