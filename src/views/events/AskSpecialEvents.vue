<template>
  <div class="elevation-2">
      <vuetify-alert @message="alert.message = ''" :message="alert.message" />
      <v-toolbar flat color="white">
          <v-toolbar-title class=""><v-icon medium>stars</v-icon> طلبات التمييز</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- <v-checkbox
            class="mt-4"
            label="متميز"
            v-model="specialEvent"
          ></v-checkbox> -->
          <!-- <v-text-field
            v-model="search"
            append-icon="search"
            label="بحث"
            single-line
            hide-details
          ></v-text-field> -->
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="requests"
        :total-items="totalRequests"
        :loading="loading"
        :search="search"
        hide-actions
        :pagination.sync="pagination"
      >
        <template slot="items" slot-scope="props">

          <td class="text-xs-center"  v-if="props.item.event.title">{{ props.item.event.title }}</td>
          <td class="text-xs-center" v-else>لا يوجد مسمى</td>

          <td class="text-xs-center">
            <img style="cursor:pointer" :src="`http://afr7na.com/${props.item.event.special_image}`" alt="ايقونة " title="صورة " width="50px" height="50px">
          </td>

          <td class="text-xs-center" v-if="props.item.event.user">{{ props.item.event.user.name }}</td>
          <td class="text-xs-center" v-else>لا يوجد مسمى</td>

          <td class="text-xs-center" v-if="props.item.event.category.title_ar">{{ props.item.event.category.title_ar }}</td>
          <td class="text-xs-center" v-else>لا يوجد مسمى</td>

          <td class="text-xs-center" v-if="props.item.event.category.title_ar">{{ props.item.event.category.title_ar }}</td>
          <td class="text-xs-center" v-else>لا يوجد مسمى</td>

          <td class="text-xs-center"  v-if="props.item.event.country.title_ar">{{ props.item.event.country.title_ar }}</td>

          <td class="text-xs-center"  v-if="props.item.event.category.title_ar">{{ props.item.event.category.title_ar }}</td>
          <td class="text-xs-center" v-else>لا يوجد مسمى</td>

          <td class="text-xs-center"  v-if="props.item.start_time">
            {{ moment(props.item.start_time).calendar() }}
          </td>
          <td class="text-xs-center" v-else>لا يوجد وقت محدد</td>

          <td class="justify-center layout px-0">

            <v-tooltip top>
              <v-btn slot="activator" icon small flat color="blue" @click="showSpecialEventTimes(props.item)"> 
                <v-icon  class="mr-2 blue--text" >
                  access_time
                </v-icon>
              </v-btn>
              <span>عرض الأوقات</span>
            </v-tooltip>

            <!--  -->
            <v-tooltip v-if="props.item.deleted_at == null" top>
              <v-btn 
                slot="activator"
                :loading="disapprove" 
                icon small flat color="red" 
                @click="selectedItem = props.item;askToDeleteDialog = !askToDeleteDialog"
              >
                <v-icon class="red--text"  >
                    delete
                </v-icon>
              </v-btn> 
              <span>تعطيل</span>
            </v-tooltip> 
            <v-tooltip v-else top>
              <v-btn 
                slot="activator" 
                :loading="approve" 
                icon small flat color="green" 
                @click="restoreItem(props.item)"
              >
                <v-icon class="green--text"  >
                    restore
                </v-icon>
              </v-btn>
              <span>تنشيط</span>
            </v-tooltip>
          </td>


        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
            لا يوجد نتائج للبحث "{{search}}"
        </v-alert>
        <template slot="pageText" slot-scope="props">
        الصفحات {{ props.pageStart }} - {{ props.pageStop }} من {{ props.itemsLength }}
        </template>
        <template slot="no-data">
          <v-alert :value="true" color="success" icon="warning" outline>
              لا يوجد أحداث بهذا القسم
          </v-alert>
        </template>
      </v-data-table>
      <div class="text-xs-center pt-2">
        <v-pagination total-visible="6" color="primary" v-model="pagination.page" :length="pages"></v-pagination>
      </div>
      <!--  -->
      <v-dialog
        v-model="askToDeleteDialog"
        max-width="290"
      >
        <v-card>
          <v-card-title  class="title red--text">متأكد من إيقاف الفرح</v-card-title>
          <v-card-text>
            <v-checkbox color="red" label="حذف الفرح نهائيا" v-model="forceDelete"></v-checkbox>        
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="grey darken-1"
              flat="flat"
              @click="askToDeleteDialog = false"
            >
              لا
            </v-btn>
            <!-- <v-btn
              color="red darken-1"
              flat="flat"
              @click="deleteItem"
            >
              نعم
            </v-btn> -->
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--  -->


      <!--  -->
      <!-- show times dialog -->

      <v-dialog v-model="specialEventTimesDialog" max-width="500px">
        <v-card>
          <v-card-title>
              <span class="headline">اضافة الأوقات</span>
          </v-card-title>
          <v-card-text>
            <ul>
              <li class="red--text" v-for="error in errors" :key="error[0] + Math.random()">
                <ul>
                  <li v-for="err in error" :key="err + Math.random()">
                    {{err}}
                  </li>
                </ul>
              </li>
            </ul>
          </v-card-text>
          <v-card-text>
              <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 d-flex>
                      <v-datetime-picker
                        label="توقيت البداية"
                        v-model="eventTime.start_date">
                      </v-datetime-picker>
                    </v-flex>
                    <v-flex xs12 sm6 d-flex>
                      <v-datetime-picker
                        label="توقيت النهاية"
                        v-model="eventTime.end_date">
                      </v-datetime-picker>
                    </v-flex>
                  </v-layout>
              </v-container>
          </v-card-text>

          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="close">الغاء</v-btn>
              <v-btn color="blue darken-1" flat @click.native="save">حفظ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--  -->
  </div>
</template>

<script>
 import moment from 'moment'
export default {
  props:{
    title:{
      default: '',
      type: String
    },
    icon:{
      default: '',
      type: String
    }
  },
  data: () => ({
    errors:[],
    askToDeleteDialog: false,
    specialEventTimesDialog: false,
    forceDelete: false,
    edit:false,
    dialog:false,
    optionsDialog:false,
    imagesdialog:false,
    menu1:false,
    dateFormatted:null,
    date: null,
    requests:[],
    media:[],
    totalRequests:0,
    pagination: {},
    search: '',
    loading: false,
    disapprove: false,
    approve: false,
    headers: [
      {
        text: 'العنوان',
        align: 'center',
        value: 'title',
        sortable: false
      },
      {
        text: 'صورة',
        align: 'center',
        sortable: false
      },
      {
        text: 'المستخدم',
        align: 'center',
        value: 'user',
        sortable: false
      },
      {
        text: 'الهاتف',
        align: 'center',
        value: 'phone',
        sortable: false
      },
      {
        text: 'القسم',
        align: 'center',
        value: 'category',
        sortable: false
      },
      {
        text: 'الدولة',
        align: 'center',
        value: 'country',
        sortable: false
      },
      {
        text: 'المنطقة',
        align: 'center',
        value: 'region',
        sortable: false
      },
      {
        text: 'وقت بداية الدعوة',
        align: 'center',
        value: 'invitationStartTime',
        sortable: false
      },
      {
        text: 'عمليات',
        align: 'center',
        value: 'actions',
        sortable: false
      },
    ],
    editedItem: null,
    alert: {
      message: '',
      type: 'success'
    },
    page:1,
    specialEvent:false,
    specialEventTimes: [],
    loadingDeleteTime: false,
    eventTime: {
          event_id:null,
          start_date: null,
          end_date: null,
        }
  }),

  computed: {
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    }
  },

  watch: {
    specialEventTimesDialog (val) {
      if(!val){
        this.eventTime = {
          event_id:null,
          start_date: null,
          end_date: null,
        }
      }
      val || this.close()
    },
    pagination: {
      handler () {
        this.page = this.pagination.page
        if(!this.loading) {

          this.getDataFromApi()
        .then(data => {
          this.requests = data.items
          this.totalRequests = data.total
        })
        }
      },
      deep: true
    },
  },
  created () {
    this.getDataFromApi()
    .then(data => {
      this.requests = data.items
      this.totalRequests = data.total
    })
  },
  methods: {
    getDataFromApi (res = null) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const { sortBy, descending, page, rowsPerPage } = this.pagination
        if(res != null){
          let items = res.data.data
          const total = res.data.total
          this.pagination.rowsPerPage = res.data.per_page
          this.pagination.totalItems = res.data.total
          this.loading = false
          resolve({
            items,
            total
          })
        }
        else {
        //   let bySpecialEvent = this.specialEvent == false ? '' : `&special_for_admin`
        //   let filterByCountry = this.filterCountry == null ? '' : `&country_id=${this.filterCountry}`
        //   const endpoint = (this.search.replace(/\s/g, '').length>0)?`admin/event?title=${this.search}${filterByCountry}&category=1&page=${page}${bySpecialEvent}`
        //   : `admin/event?category=1${filterByCountry}&page=${page}${bySpecialEvent}`
        let endpoint = `admin/ask-special-event`
          this.$http.get(endpoint)
            .then( (res) => {
              console.log(res);
              
              let items = res.data.data
              const total = res.data.total
              this.pagination.rowsPerPage = res.data.per_page
              this.pagination.totalItems = res.data.total
              this.loading = false
              resolve({
                items,
                total
              })
        })
      }
      })
    },
    close () {
      this.specialEventTimesDialog = false
      setTimeout(() => {
        this.editedItem = -1
      }, 300)
    },
    showSpecialEventTimes(item) {
      this.specialEventTimesDialog = !this.specialEventTimesDialog;

      this.eventTime.event_id = item.event_id

      this.eventTime.start_date = item.start_time;
      // this.eventTime.end_date = item.title_en;
      console.log(this.eventTime);
      
    },
    save () {
      let formdata = new FormData();
      if(this.eventTime.event_id)
      formdata.append('event_id', this.eventTime.event_id)
      if(this.eventTime.start_date)
      this.eventTime.start_date= moment(this.eventTime.start_date).format("YYYY-MM-DD HH:mm:ss");
      formdata.append('start_date', this.eventTime.start_date)
      if(this.eventTime.end_date)
      this.eventTime.end_date= moment(this.eventTime.end_date).format("YYYY-MM-DD HH:mm:ss");
      formdata.append('end_date', this.eventTime.end_date)
      console.log(this.eventTime);
      console.log(formdata);
      
      this.$http.post(`admin/special-events?page=${this.page}`, formdata)
        .then( res => {
            
          this.getDataFromApi(res)
          .then(data => {
            this.requests = data.items
            this.totalRequests = data.total
          });
          this.alert.type = 'info'
          this.alert.message = 'تم العملية بنجاح!'
          this.close()
          this.errors = []
          this.eventTime = {
            event_id:null,
            start_date: null,
            end_date: null,
          }
        })
        .catch( ({response}) => {
          this.errors = response.data.errors
        })
      
    },
    deleteEventTime(time){
      // alert(time.id)
      this.loadingDeleteTime = true
        this.$http.delete(`admin/special-events/${time.id}`)
        .then( res => {
            this.specialEventTimes.splice(time, 1);
            this.loadingDeleteTime = false
          },
          err => {
            alert('حدث خطأ غير متوقع . يرجى المحاولة مرة اخري') 
            this.loadingDeleteTime = false
          },
        )
    },
    parseDate (date) {
        if (!date) return null
        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
  }
}
</script>

<style scoped>
  ul{
    list-style: none;
  }
  .v-timeline-item__body{
    text-align: unset !important;
        margin-left: 25px !important;
  }
</style>
