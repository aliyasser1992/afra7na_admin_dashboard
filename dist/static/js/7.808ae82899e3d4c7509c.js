webpackJsonp([7],{"4i9t":function(t,e){},UvgU:function(t,e){},bZNM:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("//Fk"),i=a.n(s),n={props:{title:{default:"",type:String},icon:{default:"",type:String}},data:function(){return{forceDelete:!1,image:null,errors:[],newUser:{id:null,name:null,email:null,phone:null,password:null},user:null,edit:!1,addEditDialog:!1,askToDeleteDialog:!1,mdialog:!1,imagesdialog:!1,requests:[],totalRequests:0,pagination:{},search:"",loading:!1,disapprove:!1,approve:!1,headers:[{text:"الاسم",align:"right",sortable:!1},{text:"البريد الاليكترونى",align:"right",sortable:!1},{text:"رقم الهاتف",align:"right",sortable:!1},{text:"الصورة",align:"right",sortable:!1},{text:"عمليات",align:"right",value:"actions",sortable:!1}],alert:{message:"",type:"success"},page:1}},computed:{formTitle:function(){return this.edit?"تعديل مدير":"إضافة مدير"},pages:function(){return null==this.pagination.rowsPerPage||null==this.pagination.totalItems?0:Math.ceil(this.pagination.totalItems/this.pagination.rowsPerPage)}},watch:{dialog:function(t){t||this.close()},pagination:{handler:function(){var t=this;this.page=this.pagination.page,this.loading||this.getDataFromApi().then(function(e){t.requests=e.items,t.totalRequests=e.total})},deep:!0}},created:function(){var t=this;this.loading||this.getDataFromApi().then(function(e){t.requests=e.items,t.totalRequests=e.total})},methods:{getDataFromApi:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return this.loading=!0,new i.a(function(a,s){var i=t.pagination,n=(i.sortBy,i.descending,i.page);i.rowsPerPage;if(null!=e){var r=e.data.data,l=e.data.total;t.pagination.rowsPerPage=e.data.per_page,t.pagination.totalItems=e.data.total,setTimeout(function(){t.loading=!1},300),a({items:r,total:l})}else{var o=t.search.replace(/\s/g,"").length>0?"api/admin/users/search/"+t.search:"admin/admins?page="+n;t.$http.get(o).then(function(e){var s=e.data.admins.data,i=e.data.admins.total;t.pagination.rowsPerPage=e.data.admins.per_page,t.pagination.totalItems=e.data.admins.total,setTimeout(function(){t.loading=!1},300),a({items:s,total:i})})}})},selectImage:function(){document.getElementById("image_choose").click()},imageFallBack:function(t){this.$refs["user_"+t].src="../assets/avatar.png"},deleteItem:function(){var t=this,e=this.selectedItem;this.disapprove=!0;var a=1==this.forceDelete?"admin/destroy/"+e.id:"admin/trached/"+e.id;this.$http.delete(a).then(function(e){t.getDataFromApi(e).then(function(e){t.requests=e.items,t.totalRequests=e.total}),t.alert.message=1==t.forceDelete?"تم حذف المستخدم!":"تم إيقاف المستخدم!ّ",t.alert.type="info",t.dialog=!1,t.disapprove=!1})},restoreItem:function(t){var e=this;if(this.approve=!0,confirm("هل تود استرجاع المستخدم؟")){this.forceDelete;this.$http.post("api/admin/users/"+t.id+"/restore?page="+this.page).then(function(t){e.getDataFromApi(t).then(function(t){e.requests=t.items,e.totalRequests=t.total}),e.alert.message="تم استئناف المستخدم",e.alert.type="success",e.approve=!1})}else this.approve=!1},close:function(){this.addEditDialog=!1},editing:function(t){this.dialog=!this.dialog,this.edit=!0,this.newUser.id=t.id,this.newUser.name=t.name,this.newUser.email=t.email,this.newUser.phone=t.phone,this.newUser.password=t.password,this.index=this.requests.indexOf(t)},save:function(){var t=this,e=this.index,a=new FormData,s={};this.newUser.name&&a.append("name",this.newUser.name),s.name=this.newUser.name,this.newUser.email&&a.append("email",this.newUser.email),s.email=this.newUser.email,this.newUser.phone&&a.append("phone",this.newUser.phone),s.phone=this.newUser.phone,this.newUser.password&&a.append("password",this.newUser.password),s.password=this.newUser.password,this.edit?this.$http.put("admin/country/"+this.country.id,s).then(function(a){t.$set(t.requests,e,s),t.alert.type="warning",t.alert.message="تم تعديل الدولة!",t.close(),t.errors=[],t.country={id:null,title_ar:null,title_en:null,code:null}}).catch(function(e){var a=e.response;t.errors=a.data.errors}):this.$http.post("admin/adminRegister?page="+this.page,a).then(function(e){t.requests.push(t.newUser),t.alert.type="info",t.alert.message="تم اضافة مدير جديد!",t.close(),t.errors=[],t.newUser={id:null,name:null,email:null,phone:null,password:null}}).catch(function(e){var a=e.response;t.errors=a.data.errors})}}},r={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"elevation-2"},[s("vuetify-alert",{attrs:{message:t.alert.message,type:t.alert.type},on:{message:function(e){t.alert.message=""}}}),t._v(" "),s("v-toolbar",{attrs:{flat:"",color:"white"}},[s("v-toolbar-title",{},[s("v-icon",{attrs:{medium:""}},[t._v(t._s(t.icon))]),t._v(" "+t._s(t.title))],1),t._v(" "),s("v-spacer"),t._v(" "),s("v-text-field",{attrs:{"append-icon":"search",label:"بحث","single-line":"","hide-details":""},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}}),t._v(" "),s("v-dialog",{attrs:{"max-width":"500px"},model:{value:t.addEditDialog,callback:function(e){t.addEditDialog=e},expression:"addEditDialog"}},[s("v-tooltip",{attrs:{slot:"activator",top:""},slot:"activator"},[s("v-btn",{staticClass:"mb-2",attrs:{slot:"activator",color:"primary",dark:""},on:{click:function(e){t.edit=!1}},slot:"activator"},[s("v-icon",[t._v("add")])],1),t._v(" "),s("span",[t._v("إضافة مدير جديد")])],1),t._v(" "),s("v-card",[s("v-card-title",[s("span",{staticClass:"headline"},[t._v(t._s(t.formTitle))])]),t._v(" "),s("v-card-text",[s("ul",t._l(t.errors,function(e){return s("li",{key:e[0]+Math.random(),staticClass:"red--text"},[s("ul",t._l(e,function(e){return s("li",{key:e+Math.random()},[t._v("\n                    "+t._s(e)+"\n                    ")])}))])}))]),t._v(" "),s("v-card-text",[s("v-container",{attrs:{"grid-list-md":""}},[s("v-layout",{attrs:{wrap:""}},[s("v-flex",[s("v-text-field",{attrs:{label:" الإسم"},model:{value:t.newUser.name,callback:function(e){t.$set(t.newUser,"name",e)},expression:"newUser.name"}}),t._v(" "),s("v-text-field",{attrs:{label:"البريد الإليكتروني"},model:{value:t.newUser.email,callback:function(e){t.$set(t.newUser,"email",e)},expression:"newUser.email"}}),t._v(" "),s("v-text-field",{attrs:{label:"رقم الهاتف"},model:{value:t.newUser.phone,callback:function(e){t.$set(t.newUser,"phone",e)},expression:"newUser.phone"}}),t._v(" "),s("v-text-field",{attrs:{label:"كلمة السر"},model:{value:t.newUser.password,callback:function(e){t.$set(t.newUser,"password",e)},expression:"newUser.password"}})],1)],1)],1)],1),t._v(" "),s("v-card-actions",[s("v-spacer"),t._v(" "),s("v-btn",{attrs:{color:"blue darken-1",flat:""},nativeOn:{click:function(e){return t.close(e)}}},[t._v("الغاء")]),t._v(" "),s("v-btn",{attrs:{color:"blue darken-1",flat:""},nativeOn:{click:function(e){return t.save(e)}}},[t._v("حفظ")])],1)],1)],1)],1),t._v(" "),s("v-data-table",{attrs:{headers:t.headers,items:t.requests,"total-items":t.totalRequests,loading:t.loading,search:t.search,"hide-actions":"",pagination:t.pagination},on:{"update:pagination":function(e){t.pagination=e}},scopedSlots:t._u([{key:"items",fn:function(e){return[e.item.name?s("td",{staticClass:"text-xs-right"},[t._v(t._s(e.item.name))]):s("td",{staticClass:"text-xs-right"},[t._v("لا يوجد مسمى")]),t._v(" "),e.item.email?s("td",{staticClass:"text-xs-right"},[t._v(t._s(e.item.email))]):s("td",{staticClass:"text-xs-right"},[t._v("لا يوجد مسمى")]),t._v(" "),e.item.phone?s("td",{staticClass:"text-xs-right"},[t._v(t._s(e.item.phone))]):s("td",{staticClass:"text-xs-right"},[t._v("لا يوجد مسمى")]),t._v(" "),s("td",{staticClass:"text-xs-right"},[e.item.image?s("img",{ref:"user_"+e.item.id,staticStyle:{cursor:"pointer"},attrs:{src:t.$root.$data.baseURL+e.item.image,alt:"صورة المستخدم",title:"صورة المستخدم",width:"50px",height:"50px"},on:{error:function(a){t.imageFallBack(e.item.id)},click:function(){t.image=e.item.image,t.mdialog=!0}}}):s("img",{staticStyle:{cursor:"pointer"},attrs:{src:a("HfaK"),alt:"صورة المستخدم",title:"صورة المستخدم",width:"50px",height:"50px"}})]),t._v(" "),s("td",{staticClass:"justify-right layout px-0"},[s("v-btn",{attrs:{small:"",flat:"",color:"blue"},on:{click:function(a){t.editing(e.item)}}},[t._v("\n                تعديل\n                "),s("v-icon",{staticClass:"mr-2 blue--text"},[t._v("\n                    edit\n                ")])],1),t._v(" "),null==e.item.deleted_at?s("v-btn",{attrs:{loading:t.disapprove,small:"",flat:"",color:"red"},on:{click:function(a){t.selectedItem=e.item,t.askToDeleteDialog=!t.askToDeleteDialog}}},[t._v("\n                مسح\n                "),s("v-icon",{staticClass:"red--text"},[t._v("\n                    delete\n                ")])],1):s("v-btn",{attrs:{loading:t.approve,small:"",flat:"",color:"green"},on:{click:function(a){t.restoreItem(e.item)}}},[t._v("\n                تنشيط\n                "),s("v-icon",{staticClass:"green--text"},[t._v("\n                    restore\n                ")])],1)],1)]}},{key:"pageText",fn:function(e){return[t._v("\n          الصفحات "+t._s(e.pageStart)+" - "+t._s(e.pageStop)+" من "+t._s(e.itemsLength)+"\n        ")]}}])},[s("v-alert",{attrs:{slot:"no-results",value:!0,color:"error",icon:"warning"},slot:"no-results"},[t._v('\n            لا يوجد نتائج للبحث "'+t._s(t.search)+'"\n        ')]),t._v(" "),s("template",{slot:"no-data"},[s("v-alert",{attrs:{value:!0,color:"success",icon:"warning",outline:""}},[t._v("\n            لا يوجد مستخدمين\n          ")])],1)],2),t._v(" "),s("div",{staticClass:"text-xs-center pt-2"},[s("v-pagination",{attrs:{"total-visible":"6",color:"primary",length:t.pages},model:{value:t.pagination.page,callback:function(e){t.$set(t.pagination,"page",e)},expression:"pagination.page"}})],1),t._v(" "),t.image?s("v-dialog",{staticStyle:{"max-height":"400px",overflow:"hidden"},attrs:{width:"600"},model:{value:t.mdialog,callback:function(e){t.mdialog=e},expression:"mdialog"}},[t.image?s("v-card",{style:"background-image:url('http://souq24app.com/"+t.image+"');",attrs:{id:"card-image"}}):t._e()],1):t._e(),t._v(" "),s("v-dialog",{attrs:{"max-width":"290"},model:{value:t.askToDeleteDialog,callback:function(e){t.askToDeleteDialog=e},expression:"askToDeleteDialog"}},[s("v-card",[s("v-card-title",{staticClass:"title red--text"},[t._v("متأكد من إيقاف المستخدم؟")]),t._v(" "),s("v-card-text",[s("v-checkbox",{attrs:{color:"red",label:"حذف المستخدم نهائيا"},model:{value:t.forceDelete,callback:function(e){t.forceDelete=e},expression:"forceDelete"}})],1),t._v(" "),s("v-card-actions",[s("v-spacer"),t._v(" "),s("v-btn",{attrs:{color:"grey darken-1",flat:"flat"},on:{click:function(e){t.askToDeleteDialog=!1}}},[t._v("\n            لا\n          ")]),t._v(" "),s("v-btn",{attrs:{color:"red darken-1",flat:"flat"},on:{click:t.deleteItem}},[t._v("\n            نعم\n          ")])],1)],1)],1)],1)},staticRenderFns:[]};var l={components:{UsersTable:a("VU/8")(n,r,!1,function(t){a("UvgU")},"data-v-4787214f",null).exports}},o={render:function(){var t=this.$createElement,e=this._self._c||t;return e("v-container",[e("users-table",{attrs:{title:"المستخدمين",icon:"people"}})],1)},staticRenderFns:[]};var c=a("VU/8")(l,o,!1,function(t){a("4i9t")},null,null);e.default=c.exports}});