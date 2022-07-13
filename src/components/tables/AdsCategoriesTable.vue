<template>
<div class="elevation-2">
  <vuetify-alert @message="alert.message = ''" :message="alert.message" />
    <v-toolbar flat color="white">
        <v-toolbar-title class=""><v-icon medium>{{icon}}</v-icon> {{title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        
        <!-- <v-text-field
          style="max-width:200px;height:42px;font-size: 11px"
          @keyup.native="makeSearch($event)"
          append-icon="search"
          label="بحث"
          single-line
          hide-details
        ></v-text-field> -->
        
        <!-- <v-select style="max-width:150px;height:32px" v-model="filterCategory" flat dense :items="[{title_ar:'الاقسام', category_id:null},...categories]" item-text="title_ar" item-value="category_id" /> -->
        
        <v-dialog v-model="dialog" max-width="500px">
            <v-tooltip slot="activator" top>
                <v-btn 
                    slot="activator" 
                    color="primary" 
                    fab small dark class="mb-2" 
                    @click="edit = false;errors = []"
                > 
                    <v-icon>add</v-icon> 
                </v-btn>
                <span>تصنيف جديد</span>
            </v-tooltip>
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
                              <v-text-field v-model="newCategory.title_ar" label=" اسم التصنيف بالعربية" />
                              <v-text-field v-model="newCategory.title_en"  label="اسم التصنيف بالانجليزية" />
                              <v-btn color="primary" @click="$refs.image_input.click()">
                                <v-icon>image</v-icon>
                                صورة
                              </v-btn>
                              <input style="display:none" type="file" ref="image_input">
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="" class="ma-2" small @click.native="close">الغاء</v-btn>
                    <v-btn color="primary" class="ma-2" dark small @click.native="save">حفظ</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="requests"
      :total-items="totalRequests"
      :loading="loading"
      :search="search"
      hide-actions
      :pagination.sync="pagination">
        <template slot="items" slot-scope="props">
            <td class="text-xs-center"  v-if="props.item.title_ar">{{ props.item.title_ar }}</td>
            <td class="text-xs-center" v-else>لا يوجد مسمى</td>

            <td class="text-xs-center"  v-if="props.item.title_en">{{ props.item.title_en }}</td>
            <td class="text-xs-center" v-else>لا يوجد مسمى</td>

            <td class="text-xs-center">
              <img style="cursor:pointer" :src="`http://afr7na.com/public${props.item.image}`" alt="ايقونة " title="صورة " width="50px" height="50px">
            </td>
              <v-tooltip top>
                  <v-btn slot="activator" icon :loading="approve"  flat color="blue" @click="editing(props.item)"> 
                  <v-icon  class="mr-2 blue--text" >
                      edit
                  </v-icon>
                  </v-btn>
                  <span>تعديل التصنيف</span>
              </v-tooltip>

              <v-tooltip top>
                  <v-btn 
                      slot="activator" 
                      :loading="deleteLoading"
                      icon flat color="red" 
                      @click="deleteItem(props.item)"
                  >
                      <v-icon class="red--text"  >
                          delete
                      </v-icon>
                  </v-btn>
                  <span>مسح التصنيف</span>
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
            لا يوجد نتائج
          </v-alert>
        </template>
    </v-data-table>
    <div class="text-xs-center pt-2">
      <v-pagination total-visible="6" color="primary" v-model="page" :length="pages"></v-pagination>
    </div>
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
    errors:[],
    newCategory:{
      id:null,
      title_ar: null,
      title_en: null,
    },
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
    deleteLoading: false,
    headers: [
      {
        text: 'الإسم العربي',
        align: 'center',
        value: 'userName',
        sortable: false
      },
      {
        text: 'الإسم الإنجليزي',
        align: 'center',
        sortable: false
      },
      {
        text: 'صورة',
        align: 'center',
        value: 'country',
        sortable: false
      },
      {
        text: 'عمليات',
        align: 'center',
        value: 'actions',
        sortable: false
      }
    ],
    editedItem: null,
    alert: {
      message: '',
      type: 'success'
    },
    page:1,
    filterCategory:null,
    categories: [],
    approve: false
  }),

  computed: {
    formTitle(){
      return (this.edit) ? 'تعديل قسم' : 'إضافة قسم';
    },
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    }
  },

  watch: {
    dialog (val) {
      if(!val){
        this.newCategory = {
            id:null,
            title_ar: null,
            title_en: null,
        }
      }
      val || this.close()
    },
    page(val) {
      this.pagination.page = val
      this.fetch();
    },

  },
  created () {
    // this.fetchCategories();
    this.getDataFromApi()
    .then(data => {
      this.requests = data.items
      this.totalRequests = data.total
    })
  },
  methods: {
    makeSearch(){
      this.search=event.target.value;
      this.fetch();
    },
    fetch(){
      this.getDataFromApi().then(data => {
        this.requests = data.items;
        this.totalRequests = data.total;
      });
      if(this.loading) return;

    },
    fetchCategories() {
      this.$http.get('api/admin/categories/main/get/all')
      .then( (res) => {
        this.categories = res.data.data
      })
    },
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
          const endpoint = (this.search.replace(/\s/g, '').length>0)?`admin/ads-category?page=${page}`:`admin/ads-category?page=${page}`
          this.$http.get(endpoint)
          .then( (res) => {
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
    selectImage () {
      document.getElementById('image_choose').click()
    },

    deleteItem (item) {
      this.deleteLoading = true
      const index = this.requests.indexOf(item)
      if(confirm('هل انت متأكد من مسح القسم')) {

        this.$http.delete(`admin/ads-category/${item.id}?page=${this.page}`)
        .then( res => {
          this.getDataFromApi();
          this.requests.splice(index, 1)
          this.alert.message = 'تم مسح القسم!'
          this.alert.type = 'info'
          this.deleteLoading = false
        })
      }else{
        this.deleteLoading = false
      }
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = -1
      }, 300)
    },
    editing(item) {
      this.errors = []
      this.dialog = !this.dialog;
      this.edit=true;

      this.newCategory.id = item.id
      this.newCategory.title_ar = item.title_ar;
      this.newCategory.title_en = item.title_en;
    },
    save () {
      let image =this.$refs.image_input.files[0]
      if(typeof image == 'undefined')
        image = null
      let formdata = new FormData();
      if(image)
      formdata.append('image', image)
      if(this.newCategory.title_ar)
      formdata.append('title_ar', this.newCategory.title_ar)
      if(this.newCategory.title_en)
      formdata.append('title_en', this.newCategory.title_en)

      if(this.edit){
        this.$http.post(`admin/ads-category/${this.newCategory.id}`, formdata)
          .then( res => {
            this.getDataFromApi()
            .then(data => {
              this.requests = data.items
              this.totalRequests = data.total
            });
            this.alert.type = 'warning'
            this.alert.message = 'تم تعديل القسم!'
            this.close()
            this.errors = []
            this.newCategory = {
              id:null,
              title_ar: null,
              title_en: null,
            }
            this.$refs.image_input.value="";
          })
          .catch( ({response}) => {
            this.errors = response.data.error
          })
      }
      else{
        this.$http.post(`admin/ads-category?page=${this.page}`, formdata)
          .then( res => {
             
            this.getDataFromApi()
            .then(data => {
              this.requests = data.items
              this.totalRequests = data.total
            });
            this.alert.type = 'info'
            this.alert.message = 'تم اضافة القسم!'
            this.close()
            this.errors = []
            this.newCategory = {
              id:null,
              title_ar: null,
              title_en: null,
            }
          })
          .catch( ({response}) => {
            this.errors = response.data.error
          })
      }
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
</style>
