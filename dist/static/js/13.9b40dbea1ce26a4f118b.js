webpackJsonp([13],{Xtdy:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("d7EF"),i=a.n(n),s=a("//Fk"),l=a.n(s),o=a("PJh5"),r=a.n(o),c={props:{title:{default:"",type:String},icon:{default:"",type:String}},data:function(){return{errors:[],askToDeleteDialog:!1,specialEventTimesDialog:!1,forceDelete:!1,edit:!1,dialog:!1,optionsDialog:!1,imagesdialog:!1,menu1:!1,dateFormatted:null,date:null,requests:[],media:[],totalRequests:0,pagination:{},search:"",loading:!1,disapprove:!1,approve:!1,headers:[{text:"العنوان",align:"center",value:"title",sortable:!1},{text:"صورة",align:"center",sortable:!1},{text:"المستخدم",align:"center",value:"user",sortable:!1},{text:"الهاتف",align:"center",value:"phone",sortable:!1},{text:"القسم",align:"center",value:"category",sortable:!1},{text:"الدولة",align:"center",value:"country",sortable:!1},{text:"المنطقة",align:"center",value:"region",sortable:!1},{text:"وقت بداية الدعوة",align:"center",value:"invitationStartTime",sortable:!1},{text:"عمليات",align:"center",value:"actions",sortable:!1}],editedItem:null,alert:{message:"",type:"success"},page:1,specialEvent:!1,specialEventTimes:[],loadingDeleteTime:!1,eventTime:{event_id:null,start_date:null,end_date:null}}},computed:{pages:function(){return null==this.pagination.rowsPerPage||null==this.pagination.totalItems?0:Math.ceil(this.pagination.totalItems/this.pagination.rowsPerPage)}},watch:{specialEventTimesDialog:function(t){t||(this.eventTime={event_id:null,start_date:null,end_date:null}),t||this.close()},pagination:{handler:function(){var t=this;this.page=this.pagination.page,this.loading||this.getDataFromApi().then(function(e){t.requests=e.items,t.totalRequests=e.total})},deep:!0}},created:function(){var t=this;this.getDataFromApi().then(function(e){t.requests=e.items,t.totalRequests=e.total})},methods:{getDataFromApi:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return this.loading=!0,new l.a(function(a,n){var i=t.pagination;i.sortBy,i.descending,i.page,i.rowsPerPage;if(null!=e){var s=e.data.data,l=e.data.total;t.pagination.rowsPerPage=e.data.per_page,t.pagination.totalItems=e.data.total,t.loading=!1,a({items:s,total:l})}else{t.$http.get("admin/ask-special-event").then(function(e){var n=e.data.data,i=e.data.total;t.pagination.rowsPerPage=e.data.per_page,t.pagination.totalItems=e.data.total,t.loading=!1,a({items:n,total:i})})}})},close:function(){var t=this;this.specialEventTimesDialog=!1,setTimeout(function(){t.editedItem=-1},300)},showSpecialEventTimes:function(t){this.specialEventTimesDialog=!this.specialEventTimesDialog,this.eventTime.event_id=t.event_id,this.eventTime.start_date=t.start_time},save:function(){var t=this,e=new FormData;this.eventTime.event_id&&e.append("event_id",this.eventTime.event_id),this.eventTime.start_date&&(this.eventTime.start_date=r()(this.eventTime.start_date).format("YYYY-MM-DD HH:mm:ss")),e.append("start_date",this.eventTime.start_date),this.eventTime.end_date&&(this.eventTime.end_date=r()(this.eventTime.end_date).format("YYYY-MM-DD HH:mm:ss")),e.append("end_date",this.eventTime.end_date),this.$http.post("admin/special-events?page="+this.page,e).then(function(e){t.getDataFromApi(e).then(function(e){t.requests=e.items,t.totalRequests=e.total}),t.alert.type="info",t.alert.message="تم العملية بنجاح!",t.close(),t.errors=[],t.eventTime={event_id:null,start_date:null,end_date:null}}).catch(function(e){var a=e.response;t.errors=a.data.errors})},deleteEventTime:function(t){var e=this;this.loadingDeleteTime=!0,this.$http.delete("admin/special-events/"+t.id).then(function(a){e.specialEventTimes.splice(t,1),e.loadingDeleteTime=!1},function(t){alert("حدث خطأ غير متوقع . يرجى المحاولة مرة اخري"),e.loadingDeleteTime=!1})},parseDate:function(t){if(!t)return null;var e=t.split("/"),a=i()(e,3),n=a[0],s=a[1];return a[2]+"-"+n.padStart(2,"0")+"-"+s.padStart(2,"0")}}},v={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"elevation-2"},[a("vuetify-alert",{attrs:{message:t.alert.message},on:{message:function(e){t.alert.message=""}}}),t._v(" "),a("v-toolbar",{attrs:{flat:"",color:"white"}},[a("v-toolbar-title",{},[a("v-icon",{attrs:{medium:""}},[t._v("stars")]),t._v(" طلبات التمييز")],1),t._v(" "),a("v-spacer")],1),t._v(" "),a("v-data-table",{attrs:{headers:t.headers,items:t.requests,"total-items":t.totalRequests,loading:t.loading,search:t.search,"hide-actions":"",pagination:t.pagination},on:{"update:pagination":function(e){t.pagination=e}},scopedSlots:t._u([{key:"items",fn:function(e){return[e.item.event.title?a("td",{staticClass:"text-xs-center"},[t._v(t._s(e.item.event.title))]):a("td",{staticClass:"text-xs-center"},[t._v("لا يوجد مسمى")]),t._v(" "),a("td",{staticClass:"text-xs-center"},[a("img",{staticStyle:{cursor:"pointer"},attrs:{src:"http://afr7na.com/"+e.item.event.special_image,alt:"ايقونة ",title:"صورة ",width:"50px",height:"50px"}})]),t._v(" "),e.item.event.user?a("td",{staticClass:"text-xs-center"},[t._v(t._s(e.item.event.user.name))]):a("td",{staticClass:"text-xs-center"},[t._v("لا يوجد مسمى")]),t._v(" "),e.item.event.category.title_ar?a("td",{staticClass:"text-xs-center"},[t._v(t._s(e.item.event.category.title_ar))]):a("td",{staticClass:"text-xs-center"},[t._v("لا يوجد مسمى")]),t._v(" "),e.item.event.category.title_ar?a("td",{staticClass:"text-xs-center"},[t._v(t._s(e.item.event.category.title_ar))]):a("td",{staticClass:"text-xs-center"},[t._v("لا يوجد مسمى")]),t._v(" "),e.item.event.country.title_ar?a("td",{staticClass:"text-xs-center"},[t._v(t._s(e.item.event.country.title_ar))]):t._e(),t._v(" "),e.item.event.category.title_ar?a("td",{staticClass:"text-xs-center"},[t._v(t._s(e.item.event.category.title_ar))]):a("td",{staticClass:"text-xs-center"},[t._v("لا يوجد مسمى")]),t._v(" "),e.item.start_time?a("td",{staticClass:"text-xs-center"},[t._v("\n          "+t._s(t.moment(e.item.start_time).calendar())+"\n        ")]):a("td",{staticClass:"text-xs-center"},[t._v("لا يوجد وقت محدد")]),t._v(" "),a("td",{staticClass:"justify-center layout px-0"},[a("v-tooltip",{attrs:{top:""}},[a("v-btn",{attrs:{slot:"activator",icon:"",small:"",flat:"",color:"blue"},on:{click:function(a){t.showSpecialEventTimes(e.item)}},slot:"activator"},[a("v-icon",{staticClass:"mr-2 blue--text"},[t._v("\n                access_time\n              ")])],1),t._v(" "),a("span",[t._v("عرض الأوقات")])],1),t._v(" "),null==e.item.deleted_at?a("v-tooltip",{attrs:{top:""}},[a("v-btn",{attrs:{slot:"activator",loading:t.disapprove,icon:"",small:"",flat:"",color:"red"},on:{click:function(a){t.selectedItem=e.item,t.askToDeleteDialog=!t.askToDeleteDialog}},slot:"activator"},[a("v-icon",{staticClass:"red--text"},[t._v("\n                  delete\n              ")])],1),t._v(" "),a("span",[t._v("تعطيل")])],1):a("v-tooltip",{attrs:{top:""}},[a("v-btn",{attrs:{slot:"activator",loading:t.approve,icon:"",small:"",flat:"",color:"green"},on:{click:function(a){t.restoreItem(e.item)}},slot:"activator"},[a("v-icon",{staticClass:"green--text"},[t._v("\n                  restore\n              ")])],1),t._v(" "),a("span",[t._v("تنشيط")])],1)],1)]}},{key:"pageText",fn:function(e){return[t._v("\n      الصفحات "+t._s(e.pageStart)+" - "+t._s(e.pageStop)+" من "+t._s(e.itemsLength)+"\n      ")]}}])},[a("v-alert",{attrs:{slot:"no-results",value:!0,color:"error",icon:"warning"},slot:"no-results"},[t._v('\n          لا يوجد نتائج للبحث "'+t._s(t.search)+'"\n      ')]),t._v(" "),a("template",{slot:"no-data"},[a("v-alert",{attrs:{value:!0,color:"success",icon:"warning",outline:""}},[t._v("\n            لا يوجد أحداث بهذا القسم\n        ")])],1)],2),t._v(" "),a("div",{staticClass:"text-xs-center pt-2"},[a("v-pagination",{attrs:{"total-visible":"6",color:"primary",length:t.pages},model:{value:t.pagination.page,callback:function(e){t.$set(t.pagination,"page",e)},expression:"pagination.page"}})],1),t._v(" "),a("v-dialog",{attrs:{"max-width":"290"},model:{value:t.askToDeleteDialog,callback:function(e){t.askToDeleteDialog=e},expression:"askToDeleteDialog"}},[a("v-card",[a("v-card-title",{staticClass:"title red--text"},[t._v("متأكد من إيقاف الفرح")]),t._v(" "),a("v-card-text",[a("v-checkbox",{attrs:{color:"red",label:"حذف الفرح نهائيا"},model:{value:t.forceDelete,callback:function(e){t.forceDelete=e},expression:"forceDelete"}})],1),t._v(" "),a("v-card-actions",[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{color:"grey darken-1",flat:"flat"},on:{click:function(e){t.askToDeleteDialog=!1}}},[t._v("\n            لا\n          ")])],1)],1)],1),t._v(" "),a("v-dialog",{attrs:{"max-width":"500px"},model:{value:t.specialEventTimesDialog,callback:function(e){t.specialEventTimesDialog=e},expression:"specialEventTimesDialog"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"headline"},[t._v("اضافة الأوقات")])]),t._v(" "),a("v-card-text",[a("ul",t._l(t.errors,function(e){return a("li",{key:e[0]+Math.random(),staticClass:"red--text"},[a("ul",t._l(e,function(e){return a("li",{key:e+Math.random()},[t._v("\n                  "+t._s(e)+"\n                ")])}))])}))]),t._v(" "),a("v-card-text",[a("v-container",{attrs:{"grid-list-md":""}},[a("v-layout",{attrs:{wrap:""}},[a("v-flex",{attrs:{xs12:"",sm6:"","d-flex":""}},[a("v-datetime-picker",{attrs:{label:"توقيت البداية"},model:{value:t.eventTime.start_date,callback:function(e){t.$set(t.eventTime,"start_date",e)},expression:"eventTime.start_date"}})],1),t._v(" "),a("v-flex",{attrs:{xs12:"",sm6:"","d-flex":""}},[a("v-datetime-picker",{attrs:{label:"توقيت النهاية"},model:{value:t.eventTime.end_date,callback:function(e){t.$set(t.eventTime,"end_date",e)},expression:"eventTime.end_date"}})],1)],1)],1)],1),t._v(" "),a("v-card-actions",[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{color:"blue darken-1",flat:""},nativeOn:{click:function(e){return t.close(e)}}},[t._v("الغاء")]),t._v(" "),a("v-btn",{attrs:{color:"blue darken-1",flat:""},nativeOn:{click:function(e){return t.save(e)}}},[t._v("حفظ")])],1)],1)],1)],1)},staticRenderFns:[]};var d=a("VU/8")(c,v,!1,function(t){a("nhnY")},"data-v-9f09bd86",null);e.default=d.exports},nhnY:function(t,e){}});