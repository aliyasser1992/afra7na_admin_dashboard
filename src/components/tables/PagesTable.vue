<template>
  <div >
    <vuetify-alert @message="alert.message = ''" :message="alert.message" :type="alert.type" />
      <v-toolbar flat color="white">
        <v-toolbar-title class="">
          <v-icon medium>{{icon}}</v-icon> {{title}}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="addEditDialog" max-width="700px">
          <v-card>
              <v-card-title>
                  <span class="headline">{{formTitle}}</span>
              </v-card-title>
              <v-card-text>
                <!--  -->
                <v-list>
                  <template v-for="error in errors" >
                    <v-list-tile :key="error[0] + Math.random()">
                      <v-list-tile-content>
                        <v-list-tile-title class="text-xs-center">
                          <span class="red--text" v-for="err in error" :key="err + Math.random()">
                            {{err}} <v-icon color="red">error</v-icon>
                          </span>
                        </v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </template>
                </v-list>
                <!--  -->
              </v-card-text>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                      <v-flex>
                        <v-text-field v-model="pageItem.title_ar" label=" عنوان الصفحة بالعربية" />
                        <v-text-field v-model="pageItem.title_en"  label="عنوان الصفحة بالانجليزية" />
                        <v-text-field v-model="pageItem.description_ar"  label="وصف الصفحة بالعربية" multi-line />
                        <v-text-field v-model="pageItem.description_en"  label="وصف الصفحة بالانجليزية" multi-line />
                      </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>

              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="" class="ma-2" small @click.native="closeAddEditDialog">الغاء</v-btn>
                  <v-btn color="primary" class="ma-2" dark small @click.native="save">حفظ</v-btn>
              </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>


      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="requests"
        :total-items="totalRequests"
        :loading="loading"
        item-key="product_id"
        :search="search"
        hide-actions
        :pagination.sync="pagination"

        class="elevation-1"
      >
        <template v-if="requests" slot="items" slot-scope="props">

          <td class="text-xs-right"  v-if="props.item.title_ar">{{ props.item.title_ar }}</td>
          <td class="text-xs-right" v-else>لا يوجد اسم</td>

          <td class="text-xs-right"  v-if="props.item.title_en">{{ props.item.title_en }}</td>
          <td class="text-xs-right" v-else>لا يوجد اسم</td>

          <td v-if="props.item.description_ar != null">
            <read-more more-str="read more"  :text="props.item.description_ar" link="#" less-str="read less" :max-chars="100"></read-more>
          </td>
          <td v-if="props.item.description_en != null">
            <read-more more-str="read more"  :text="props.item.description_en" link="#" less-str="read less" :max-chars="100"></read-more>
          </td>

          <td class="justify-right layout px-0">
            <v-tooltip top>
              <v-btn slot="activator" icon :loading="approve"  flat color="blue" @click="editing(props.item)">
                <v-icon  class="mr-2 blue--text" >
                    edit
                </v-icon>
              </v-btn>
              <span>تعديل الصفحة</span>
            </v-tooltip>

            <v-tooltip top>
              <v-btn slot="activator" icon flat color="red" @click="deleteItem(props.item)">
                <v-icon class="red--text"  >
                    delete
                </v-icon>
              </v-btn>
              <span>مسح الإعلان</span>
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
            لا يوجد تسجيلات
          </v-alert>
        </template>

      </v-data-table>
      <div class="text-xs-center pt-2">
        <v-pagination total-visible="6" color="primary" v-model="pagination.page" :length="pages"></v-pagination>
      </div>
      <v-dialog
        v-if="media.length"
          v-model="dialog"
          width="600"
          style="max-height:400px"
      >
        <v-card>
          <v-carousel
            :circle="false"
            interval="600000"
          >
            <v-carousel-item
              v-for="item in media"
              :key="item.id"
              color="primary"
            >
              <img v-if="item.image" :src="$root.$data.baseURL+item.image" alt="" srcset="" style="margin:0 auto; width:100%;height:100%">
              <img v-if="item.vedio" :src="$root.$data.baseURL+item.vedio" alt="" srcset="" style="margin:0 auto; width:100%;height:100%">
              <video width="600" height="80%" controls>
                <source :src="$root.$data.baseURL+item.vedio" type="video/mp4">
                <source :src="$root.$data.baseURL+item.vedio" type="video/ogg">
              Your browser does not support the video tag.
              </video>
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </v-dialog>

  </div>
</template>

<script>
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
    selected:[],
    selectedItem: null,
    dialog:false,
    addEditDialog: false,
    edit: false,
    deleting:false,
    CountProductDialog:false,
    dateFormatted:null,
    date: null,
    picker:null,
    landscape:false,
    paginationDialog:false,
    end_date: null,
    optionsDialog:false,
    requests:[],
    productNumbers:10,
    media:[],
    totalRequests:0,
    pagination: {},
    errors:[],
    search: '',
    loading: false,
    specializing: false,
    approve: false,
    disapprove: false,
    pageItem: {
      id: null,
      title_ar: null,
      title_en: null,
      description_ar: null,
      description_ar: null
    },
    headers: [
      {
        text: 'العنوان بالعربية',
        align: 'right',
        value: 'country',
        sortable: false
      },
      {
        text: 'العنوان بالانجليزية',
        align: 'right',
        value: 'country',
        sortable: false
      },
      {
        text: 'الوصف بالعربية',
        align: 'right',
        value: 'link',
        sortable: false
      },
      {
        text: 'الوصف بالإنجليزية',
        align: 'right',
        value: 'image',
        sortable: false
      },
      {
        text: 'عمليات',
        align: 'right',
        value: 'actions',
        sortable: false
      }
    ],
    alert: {
      message: '',
      type: 'success'
    },

    page:1,
    filterCategory:null,
    categories:[],
    searchCategories:[],
    addEditCategories:[],
    index:null
  }),

  computed: {
    formTitle(){
      return (this.edit) ? 'تعديل الصفحة' : 'إضافة الصفحة';
    },
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    }
  },

  watch: {
    addEditDialog (val) {
      if (!val) {
        this.ad = {
          id: null,
          title_ar: null,
          title_en: null,
          description_ar: null,
          description_en: null,
        };
      }
      val || this.close();
    },
    dialog (val) {
      val || this.close()
    },
    pagination: {
      handler () {
        this.page = this.pagination.page
        if(!this.loading)
        {
          this.getDataFromApi()
        .then(data => {
          this.requests = data.items
          this.totalRequests = data.total
        })
        }
      },
      deep: true
    },
    filterCategory(val){
      this.getDataFromApi()
        .then(data => {
            this.requests = data.items
            this.totalRequests = data.total
        });
    },
    filterCountry(val){
      this.getDataFromApi()
        .then(data => {
            this.requests = data.items
            this.totalRequests = data.total
        });
    },
    optionsDialog (val) {
      if(val == false){
        this.selectedItem = null
        this.date = null
         this.end_date = null
        this.discrimint[0].value = false
      }
    }
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
          setTimeout(() => {
            this.loading = false
          }, 300);
          resolve({
            items,
            total
          })
        }
        else {
          const endpoint = (this.filterCategory != null)?
          `admin/ads?ads_category_id=${this.filterCategory}&page=${page}`:
          `admin/pages?page=${page}`
          this.$http.get(endpoint)
          .then( (res) => {

            let items = res.data.data
            const total = res.data.total
            this.pagination.rowsPerPage = res.data.per_page
            this.pagination.totalItems = res.data.total
            setTimeout(() => {
              this.loading = false
            }, 300);
            resolve({
              items,
              total
            })
          })
      }
      })
    },
    selectImage () {
      document.getElementById('image_choose').click()
    },
    imageChanged () {
      if ($('#image_choose')[0].files && $('#image_choose')[0].files[0]) {
        var FR = new FileReader()
        FR.addEventListener('load', (e) => {
          $('#avatar').attr('src', e.target.result)
          this.editedItem.image = e.target.result
        })
        FR.readAsDataURL($('#image_choose')[0].files[0])
      }
    },
    editItem (item) {
      this.editedIndex = this.requests.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true;
    },
    deleteItem (item) {
      this.deleting = true
      const index = this.requests.indexOf(item)
      if(confirm('هل تريد مسح الصفحة؟')) {

        this.$http.delete(`admin/flash-ads/${item.id}`)
        .then( res => {
          this.requests.splice(index, 1)
          this.alert.message = 'تم مسح الصفحة!'
          this.alert.type = 'success'
          this.deleting = false
        })
      }else{
        this.deleting = false
      }
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    closeAddEditDialog () {
      this.addEditDialog = false
      this.pageItem = {
          id: null,
          title_ar: null,
          title_en: null,
          description_ar: null,
          description_en: null
        };
    },
    editing(item) {
      this.errors = []
      this.addEditDialog = !this.addEditDialog;
      this.edit = true;
      this.pageItem.id = item.id;
      this.pageItem.title_ar = item.title_ar;
      this.pageItem.title_en = item.title_en;
      this.pageItem.description_ar = item.description_ar;
      this.pageItem.description_en = item.description_en;


      this.index = this.requests.indexOf(item)
    },
    save() {


      const index = this.index
      let newformdata = new FormData();
      const editformdata = {};
      if (this.pageItem.title_ar)
        newformdata.append("title_ar", this.pageItem.title_ar);
        editformdata.title_ar = this.pageItem.title_ar
      if (this.pageItem.title_en)
        newformdata.append("title_en", this.pageItem.title_en);
        editformdata.title_en = this.pageItem.title_en
      if (this.pageItem.description_ar)
        newformdata.append("description_ar", this.pageItem.description_ar);
        editformdata.description_ar = this.pageItem.description_ar
      if (this.pageItem.description_ar)
        newformdata.append("description_en", this.pageItem.description_en);
        editformdata.description_en = this.pageItem.description_en

      const endpoint = this.edit ? `admin/pages/${this.pageItem.id}` : `admin/pages`
      this.$http.put(endpoint, editformdata)
        .then(res => {
          this.$set(this.requests, index, editformdata)
          this.alert.type = "warning";
          this.alert.message = this.edit ? `تم تعديل الصفحة` : `تم حفظ الصفحة`
          this.close();
          this.errors = [];
          this.ad = {
            id: null,
            title_ar: null,
            title_en: null,
            description_ar: null,
            description_en: null,
          };
          setTimeout(() => {
            this.addEditDialog = false
          }, 300);
          this.edit = false
          this.getDataFromApi()
          .then(data => {
            this.requests = data.items
            this.totalRequests = data.total
          });
        })
        .catch(({ response }) => {
          this.errors = response.data.error;
          setTimeout(() => {
              this.ad = {
                    id: null,
                    title_ar: null,
                    title_en: null,
                    link: null
                };
          }, 5000);
        });
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
  .v-list__tile{
    height: 25px !important;
  }
</style>
