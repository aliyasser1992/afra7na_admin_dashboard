webpackJsonp([17],{nvRD:function(t,e){},sZtV:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n("cWme"),r={data:function(){return{event:null}},mounted:function(){this.fetchEvent()},methods:{fetchEvent:function(){var t=this;this.$http.get("admin/event/"+this.$route.params.id).then(function(e){t.event=e.data}).catch(function(t){console.log(t)})},generateUrl:function(t){return a.a.replace("api","public")+t}}},i={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("v-container",[t.event?n("v-card",{staticClass:"elevation-5"},[n("div",[n("v-card-title",[n("p",{staticClass:"display-1 primary--text"},[t._v("\n            عرض "+t._s(t.event.title)+"\n          ")])]),t._v(" "),n("v-card-text",[t._v(t._s(t.event.description))]),t._v(" "),n("v-card-actions",[n("v-btn",{attrs:{color:"primary"},on:{click:function(e){t.$router.back()}}},[t._v("العودة")])],1)],1),t._v(" "),n("v-layout",{attrs:{row:"",wrap:""}},[n("v-flex",{attrs:{xs12:""}},[n("v-img",{attrs:{src:t.generateUrl(t.event.special_image)}})],1),t._v(" "),t._l(t.event.media,function(e){return n("v-flex",{key:e.id,attrs:{md4:"",xs12:""}},[n("v-card",{staticClass:"mx-2 my-3 elevation-5",attrs:{flat:"",tile:""}},[n("v-img",{attrs:{src:t.generateUrl(e.image)}})],1)],1)})],2)],1):n("v-progress-linear",{attrs:{indeterminate:!0}})],1)],1)},staticRenderFns:[]};var s=n("VU/8")(r,i,!1,function(t){n("nvRD")},null,null);e.default=s.exports}});