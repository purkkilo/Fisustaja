(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["about~31ecd969"],{"02f0":function(t,e,n){},"0bc6":function(t,e,n){},"0c18":function(t,e,n){},"13b3":function(t,e,n){},1681:function(t,e,n){},"1bfb":function(t,e,n){},"1c58":function(t,e,n){},"1f09":function(t,e,n){},2102:function(t,e,n){},"2bfd":function(t,e,n){},"2c64":function(t,e,n){},"368e":function(t,e,n){},"3d86":function(t,e,n){},"495d":function(t,e,n){},"4e81":function(t,e,n){"use strict";function r(t){var e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return t<100&&t>=0?(e=new Date(Date.UTC(t,n,r)),isFinite(e.getUTCFullYear())&&e.setUTCFullYear(t)):e=new Date(Date.UTC(t,n,r)),e}function u(t,e,n){var u=7+e-n,c=(7+r(t,0,u).getUTCDay()-e)%7;return-c+u-1}function c(t,e,n,r){var u=[0,31,59,90,120,151,181,212,243,273,304,334][e];return e>1&&o(t)&&u++,u+n}function a(t,e,n){var r=u(t,e,n),c=u(t+1,e,n),a=o(t)?366:365;return(a-r+c)/7}function i(t,e,n,r,i){var o=u(t,r,i),f=Math.ceil((c(t,e,n,r)-o)/7);return f<1?f+a(t-1,r,i):f>a(t,r,i)?f-a(t,r,i):f}function o(t){return t%4===0&&t%100!==0||t%400===0}n.d(e,"b",(function(){return i})),n.d(e,"a",(function(){return o}))},"4ff9":function(t,e,n){},"51dd":function(t,e,n){"use strict";var r=n("53ca"),u=n("1da1"),c=n("d4ec"),a=n("bee2"),i=(n("b0c0"),n("d81d"),n("96cf"),n("bc3a")),o=n.n(i),f="api/cups/",s=function(){function t(){Object(c["a"])(this,t)}return Object(a["a"])(t,null,[{key:"getCups",value:function(){var t=Object(u["a"])(regeneratorRuntime.mark((function t(e){var n,u;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,o.a.get("".concat(f),{params:e});case 2:return n=t.sent,t.prev=3,u=n.data,"object"==Object(r["a"])(u)&&u.constructor===Array&&(u=p(u)),t.abrupt("return",u);case 9:return t.prev=9,t.t0=t["catch"](3),t.abrupt("return",t.t0);case 12:case"end":return t.stop()}}),t,null,[[3,9]])})));function e(e){return t.apply(this,arguments)}return e}()},{key:"insertCup",value:function(t){return o.a.post(f,{user_id:t.user_id,name:t.name,year:t.year,signees:[],isPublic:!1})}},{key:"updateCup",value:function(t,e){return o.a.put("".concat(f).concat(t),e)}},{key:"updateValues",value:function(t,e){return o.a.put("".concat(f).concat(t),e)}},{key:"deleteCup",value:function(t){return o.a.delete("".concat(f).concat(t))}}]),t}();function p(t){return t.map((function(t){return{id:t._id,user_id:t.user_id,name:t.name,year:t.year,signees:t.signees,isPublic:t.isPublic,createdAt:new Date(t.createdAt)}}))}e["a"]=s},"608c":function(t,e,n){},"68dd":function(t,e,n){},"6ca7":function(t,e,n){},7149:function(t,e,n){"use strict";var r=n("5530"),u=n("53ca"),c=n("1da1"),a=n("d4ec"),i=n("bee2"),o=(n("d81d"),n("96cf"),n("bc3a")),f=n.n(o),s="api/competitions/",p=function(){function t(){Object(a["a"])(this,t)}return Object(i["a"])(t,null,[{key:"getCompetitions",value:function(){var t=Object(c["a"])(regeneratorRuntime.mark((function t(e){var n,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,f.a.get("".concat(s),{params:e});case 2:return n=t.sent,t.prev=3,r=n.data,"object"==Object(u["a"])(r)&&r.constructor===Array&&(r=d(r)),t.abrupt("return",r);case 9:return t.prev=9,t.t0=t["catch"](3),t.abrupt("return",t.t0);case 12:case"end":return t.stop()}}),t,null,[[3,9]])})));function e(e){return t.apply(this,arguments)}return e}()},{key:"insertCompetition",value:function(t){return f.a.post(s,Object(r["a"])(Object(r["a"])({},t),{},{normal_points:[],normal_weights:[],team_results:[],isPublic:!1,isFinished:!1}))}},{key:"updateCompetition",value:function(t,e){return f.a.put("".concat(s).concat(t),e)}},{key:"updateValues",value:function(t,e){return f.a.put("".concat(s).concat(t),e)}},{key:"deleteCompetition",value:function(t){return f.a.delete("".concat(s).concat(t))}}]),t}();function d(t){return t.map((function(t){return Object(r["a"])(Object(r["a"])({},t),{},{createdAt:new Date(t.createdAt)})}))}e["a"]=p},"7cf7":function(t,e,n){"use strict";function r(t,e){var n=[];for(var r in t)t.hasOwnProperty(r)&&n.push(e("template",{slot:r},t[r]));return n}n.d(e,"a",(function(){return r}))},"8b37":function(t,e,n){},"8ef5":function(t,e,n){"use strict";var r=n("1da1"),u=n("d4ec"),c=n("bee2"),a=(n("96cf"),n("d81d"),n("bc3a")),i=n.n(a),o="api/feedback/",f=function(){function t(){Object(u["a"])(this,t)}return Object(c["a"])(t,null,[{key:"getFeedback",value:function(){var t=Object(r["a"])(regeneratorRuntime.mark((function t(){var e,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,i.a.get(o);case 2:return e=t.sent,t.prev=3,n=e.data,t.abrupt("return",n.map((function(t){return{_id:t._id,type:t.type,message:t.message,createdAt:new Date(t.createdAt)}})));case 8:return t.prev=8,t.t0=t["catch"](3),t.abrupt("return",t.t0);case 11:case"end":return t.stop()}}),t,null,[[3,8]])})));function e(){return t.apply(this,arguments)}return e}()},{key:"insertFeedback",value:function(t){return i.a.post(o,{type:t.type,message:t.message})}},{key:"deleteFeedback",value:function(t){return i.a.delete("".concat(o).concat(t))}}]),t}();e["a"]=f},"91f4":function(t,e,n){},9734:function(t,e,n){},ab6d:function(t,e,n){"use strict";n.d(e,"a",(function(){return r}));n("a434");function r(t){if(t.model&&t.on&&t.on.input)if(Array.isArray(t.on.input)){var e=t.on.input.indexOf(t.model.callback);e>-1&&t.on.input.splice(e,1)}else delete t.on.input}},c982:function(t,e,n){},cf36:function(t,e,n){},d951:function(t,e,n){},e53c:function(t,e,n){},e635:function(t,e,n){},e9b1:function(t,e,n){},ee6f:function(t,e,n){},f823:function(t,e,n){}}]);
//# sourceMappingURL=about~31ecd969.c0006cc3.js.map