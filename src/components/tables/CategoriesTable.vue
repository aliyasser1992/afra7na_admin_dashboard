<template>
<div class="elevation-2">
  <vuetify-alert @message="alert.message = ''" :message="alert.message" />
    <v-toolbar flat color="white">
        <v-toolbar-title class=""><v-icon medium>{{icon}}</v-icon> {{title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
            v-model="search"
            append-icon="search"
            label="بحث"
            single-line
            hide-details
        ></v-text-field>
        <v-select style="max-width:150px;height:32px" v-model="filterCategory" flat dense :items="[{title_ar:'الاقسام', category_id:null},...categories]" item-text="title_ar" item-value="category_id" />
        <v-dialog v-model="dialog" max-width="500px">
            <v-btn slot="activator" color="primary" dark class="mb-2" @click="edit = false"> <v-icon>add</v-icon> تصنيف جديد</v-btn>
            <v-card>
                <v-card-title>
                    <span class="headline">تصنيف جديد</span>
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
                            <v-flex>
                              <v-text-field v-model="newCategory.title_ar" label=" اسم التصنيف بالعربية" />
                              <v-text-field v-model="newCategory.title_en"  label="اسم التصنيف بالانجليزية" />
                              <v-btn color="info" @click="$refs.image_input.click()">
                                <v-icon>image</v-icon>
                                صورة
                              </v-btn>
                              <input style="display:none" type="file" ref="image_input">
                              <search-select label="القسم الرئيسى" endpoint="api/admin/categories/main/get/all" :initVal="newCategory.category.id"  @returnValue="(val) => {newCategory.category.id = val}" itemValue="category_id" :main="true" />

                              <search-select v-if="newCategory.category.id" label="القسم الفرعى" :endpoint="'api/admin/categories/sub/'+newCategory.category.id +'/get/all'" :initVal="newCategory.rel_category.id" :depends="newCategory.category.id"  @returnValue="(val) => {newCategory.rel_category.id = val}" itemValue="rel_category_id"  />
                              
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
            <td class="text-xs-right"  v-if="props.item.title_ar">{{ props.item.title_ar }}</td>
            <td class="text-xs-right" v-else>لا يوجد مسمى</td>
            <td class="text-xs-right">
              <img style="cursor:pointer" :src="$root.$data.baseURL +props.item.image" alt="ايقونة " title="صورة " width="50px" height="50px">
            </td>
            <td class="text-xs-right" v-if="props.item.sub_category">{{ props.item.sub_category.category.title_ar }}</td>
            <td class="text-xs-right" v-else>لا يوجد مسمى</td>
            <td class="text-xs-right"  v-if="props.item.sub_category">{{ props.item.sub_category.title_ar }}</td>
            <td class="text-xs-right" v-else>لا يوجد مسمى</td>
            <td class="justify-right layout px-0">
                <v-btn small flat color="blue" @click="editing(props.item)"> 
                  تعديل
                  <v-icon  class="mr-2 blue--text" >
                      edit
                  </v-icon>
                </v-btn>
                <v-btn :loading="disapprove" small flat color="red" @click="deleteItem(props.item)">
                  مسح
                  <v-icon class="red--text"  >
                      clear
                  </v-icon>
                </v-btn>
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
            لا يوجد اعلانات بهذا القسم
          </v-alert>
        </template>
    </v-data-table>
    <div class="text-xs-center pt-2">
      <v-pagination total-visible="6" color="primary" v-model="pagination.page" :length="pages"></v-pagination>
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
      category:{
        id: null,
        title: null,
      },
      rel_category: {
        id: null,
        title: null,
      }
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
    disapprove: false,
    headers: [
      {
        text: 'التصنيف',
        align: 'right',
        value: 'userName',
        sortable: false
      },
      {
        text: 'صورة',
        align: 'right',
        sortable: false
      },
      {
        text: 'القسم الرئيسى',
        align: 'right',
        value: 'country',
        sortable: false
      },
      {
        text: 'القسم الفرعى',
        align: 'right',
        value: 'category',
        sortable: false
      },
      {
        text: 'عمليات',
        align: 'right',
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
    categories: []
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
    dialog (val) {
      if(!val){
        this.newCategory = {
      id:null,
      title_ar: null,
      title_en: null,
      category:{
        id: null,
        title: null,
      },
      rel_category: {
        id: null,
        title: null,
      }
    }
      }
      val || this.close()
    },
    pagination: {
      handler () {
        this.page = this.pagination.page
        this.getDataFromApi()
        .then(data => {
          this.requests = data.items
          this.totalRequests = data.total
        })
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
  },
  created () {
    this.fetchCategories();
    this.getDataFromApi()
    .then(data => {
      this.requests = data.items
      this.totalRequests = data.total
    })
  },
  methods: {
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
          const endpoint = (this.search.replace(/\s/g, '').length>0)?'api/admin/categories/search/' + this.search + '?category='+this.filterCategory :'api/admin/categories?page=' + page + '&category='+this.filterCategory
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
      this.disapprove = true
      const index = this.requests.indexOf(item)
      if(confirm('هل انت متأكد من مسح القسم')) {

        this.$http.delete('api/admin/categories/'+ item.id+'?page=' + this.page)
        .then( res => {
          this.getDataFromApi()
          .then(data => {
            this.requests = data.items
            this.totalRequests = data.total
          })
          this.alert.message = 'تم مسح القسم!'
          this.alert.type = 'info'
          this.disapprove = false
        })
      }else{
        this.disapprove = false
      }
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = -1
      }, 300)
    },
    editing(item) {
      this.dialog = !this.dialog;
      this.edit=true;

      this.newCategory.id = item.id

      this.newCategory.title_ar = item.title_ar;
      this.newCategory.title_en = item.title_en;

      this.newCategory.category.id = item.sub_category.category.category_id;
      this.newCategory.category.title = item.sub_category.category.title_ar;

      this.newCategory.rel_category.id = item.sub_category.category.category_id;
      this.newCategory.rel_category.title = item.sub_category.title_ar;
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
      if(this.newCategory.category.id)
      formdata.append('category_id', this.newCategory.category.id)
      if(this.newCategory.rel_category.id)
      formdata.append('rel_category_id', this.newCategory.rel_category.id)

      if(this.edit){
        this.$http.post('api/admin/categories/update/category/'+ this.newCategory.id+'?page=' + this.page, formdata)
          .then( res => {
             
            this.getDataFromApi(res)
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
              category:{
                id: null,
                title: null,
              },
              rel_category: {
                id: null,
                title: null,
              }
            }
            this.$refs.image_input.value="";
          })
          .catch( ({response}) => {
            this.errors = response.data.error
          })
      }
      else{
        this.$http.post('api/admin/categories/add/category'+'?page=' + this.page, formdata)
          .then( res => {
             
            this.getDataFromApi(res)
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
              category:{
                id: null,
                title: null,
              },
              rel_category: {
                id: null,
                title: null,
              }
            }
            this.$refs.image_input.value="";
          })
          .catch( ({response}) => {
            this.errors = response.data.errors
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
