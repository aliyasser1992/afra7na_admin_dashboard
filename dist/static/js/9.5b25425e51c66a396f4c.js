webpackJsonp([9],{LOFH:function(t,e){},UKmI:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("//Fk"),s=a.n(i),n={props:{title:{default:"",type:String},icon:{default:"",type:String}},data:function(){return{forceDelete:!1,image:null,errors:[],newUser:{id:null,name:"",email:"",phone:null,password:null},user:null,edit:!1,addEditDialog:!1,askToDeleteDialog:!1,mdialog:!1,imagesdialog:!1,requests:[],totalRequests:0,pagination:{},search:"",loading:!1,disapprove:!1,approve:!1,headers:[{text:"الاسم",align:"right",sortable:!1},{text:"البريد الاليكترونى",align:"right",sortable:!1},{text:"الرسالة",align:"right",sortable:!1},{text:"عمليات",align:"right",value:"actions",sortable:!1}],alert:{message:"",type:"success"},page:1}},computed:{isDisabled:function(){return this.newUser.name.replace(/\s/g,"").length>3?1:-1,!((this.newUser.email.replace(/\s/g,"").length>3?1:-1)>0)},formTitle:function(){return this.edit?"تعديل مدير":"إضافة مدير"},pages:function(){return null==this.pagination.rowsPerPage||null==this.pagination.totalItems?0:Math.ceil(this.pagination.totalItems/this.pagination.rowsPerPage)}},watch:{dialog:function(t){t||this.close()},pagination:{handler:function(){var t=this;this.page=this.pagination.page,this.loading||this.getDataFromApi().then(function(e){t.requests=e.items,t.totalRequests=e.total})},deep:!0}},created:function(){var t=this;this.loading||this.getDataFromApi().then(function(e){t.requests=e.items,t.totalRequests=e.total})},methods:{makeSearch:function(){this.search=event.target.value,this.fetch()},getDataFromApi:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return this.loading=!0,new s.a(function(a,i){var s=t.pagination,n=(s.sortBy,s.descending,s.page);s.rowsPerPage;if(null!=e){var o=e.data.data,r=e.data.total;t.pagination.rowsPerPage=e.data.per_page,t.pagination.totalItems=e.data.total,setTimeout(function(){t.loading=!1},300),a({items:o,total:r})}else{var l=t.search.replace(/\s/g,"").length>0?"admin/support?filter="+t.search:"admin/support?page="+n;t.$http.get(l).then(function(e){var i=e.data.data,s=e.data.total;t.pagination.rowsPerPage=e.data.per_page,t.pagination.totalItems=e.data.total,setTimeout(function(){t.loading=!1},300),a({items:i,total:s})})}})},fetch:function(){var t=this;this.getDataFromApi().then(function(e){t.requests=e.items,t.totalRequests=e.total}),this.loading},selectImage:function(){document.getElementById("image_choose").click()},imageFallBack:function(t){this.$refs["user_"+t].src="../assets/avatar.png"},deleteItem:function(t){var e=this;this.deleting=!0;var a=this.requests.indexOf(t);confirm("هل تريد مسح الرسالة ؟")?this.$http.delete("admin/support/"+t.id).then(function(t){e.requests.splice(a,1),e.alert.message="تم مسح الرسالة!",e.alert.type="success",e.deleting=!1}):this.deleting=!1},close:function(){this.addEditDialog=!1}}},o={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"elevation-2"},[a("vuetify-alert",{attrs:{message:t.alert.message,type:t.alert.type},on:{message:function(e){t.alert.message=""}}}),t._v(" "),a("v-toolbar",{attrs:{flat:"",color:"white"}},[a("v-toolbar-title",{},[a("v-icon",{attrs:{medium:""}},[t._v(t._s(t.icon))]),t._v(" "+t._s(t.title))],1),t._v(" "),a("v-spacer"),t._v(" "),a("v-spacer"),t._v(" "),a("v-text-field",{staticStyle:{"max-width":"200px",height:"42px","font-size":"11px"},attrs:{"append-icon":"search",label:"بحث","single-line":"","hide-details":""},nativeOn:{keyup:function(e){t.makeSearch(e)}}})],1),t._v(" "),a("v-data-table",{attrs:{headers:t.headers,items:t.requests,"total-items":t.totalRequests,loading:t.loading,search:t.search,"hide-actions":"",pagination:t.pagination},on:{"update:pagination":function(e){t.pagination=e}},scopedSlots:t._u([{key:"items",fn:function(e){return[e.item.name?a("td",{staticClass:"text-xs-right"},[t._v(t._s(e.item.name))]):a("td",{staticClass:"text-xs-right"},[t._v("لا يوجد مسمى")]),t._v(" "),e.item.email?a("td",{staticClass:"text-xs-right"},[t._v(t._s(e.item.email))]):a("td",{staticClass:"text-xs-right"},[t._v("لا يوجد مسمى")]),t._v(" "),null!=e.item.message?a("td",[a("read-more",{attrs:{"more-str":"read more",text:e.item.message,link:"#","less-str":"read less","max-chars":100}})],1):a("td",{staticClass:"text-xs-right"},[t._v("لم يحدد")]),t._v(" "),a("td",{staticClass:"justify-right layout px-0"},[a("v-tooltip",{attrs:{top:""}},[a("v-btn",{attrs:{slot:"activator",icon:"",flat:"",color:"red"},on:{click:function(a){t.deleteItem(e.item)}},slot:"activator"},[a("v-icon",{staticClass:"red--text"},[t._v("\n                  delete\n              ")])],1),t._v(" "),a("span",[t._v("مسح الإعلان")])],1)],1)]}},{key:"pageText",fn:function(e){return[t._v("\n        الصفحات "+t._s(e.pageStart)+" - "+t._s(e.pageStop)+" من "+t._s(e.itemsLength)+"\n      ")]}}])},[a("v-alert",{attrs:{slot:"no-results",value:!0,color:"error",icon:"warning"},slot:"no-results"},[t._v('\n          لا يوجد نتائج للبحث "'+t._s(t.search)+'"\n      ')]),t._v(" "),a("template",{slot:"no-data"},[a("v-alert",{attrs:{value:!0,color:"success",icon:"warning",outline:""}},[t._v("\n          لا يوجد الرسالة\n        ")])],1)],2),t._v(" "),a("div",{staticClass:"text-xs-center pt-2"},[a("v-pagination",{attrs:{"total-visible":"6",color:"primary",length:t.pages},model:{value:t.pagination.page,callback:function(e){t.$set(t.pagination,"page",e)},expression:"pagination.page"}})],1)],1)},staticRenderFns:[]};var r={components:{CustomerServicesTable:a("VU/8")(n,o,!1,function(t){a("LOFH")},"data-v-3049d940",null).exports}},l={render:function(){var t=this.$createElement,e=this._self._c||t;return e("v-container",[e("customer-services-table",{attrs:{title:"خدمة العملاء",icon:"people"}})],1)},staticRenderFns:[]};var c=a("VU/8")(r,l,!1,function(t){a("oVVK")},null,null);e.default=c.exports},oVVK:function(t,e){}});