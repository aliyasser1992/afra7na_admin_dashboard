<template>
<div class="elevation-2">
  <vuetify-alert @message="alert.message = ''" :message="alert.message" :type="alert.type" />
    <v-toolbar flat color="white">
      <v-toolbar-title class=""><v-icon medium>{{icon}}</v-icon> {{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-spacer></v-spacer>
      <v-text-field
        style="max-width:200px;height:42px;font-size: 11px"
        @keyup.native="makeSearch($event)"
        append-icon="search"
        label="بحث"
        single-line
        hide-details
      >
      </v-text-field>
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
        <td class="text-xs-right"  v-if="props.item.name">{{ props.item.name }}</td>
        <td class="text-xs-right" v-else>لا يوجد مسمى</td>

        <td class="text-xs-right"  v-if="props.item.email">{{ props.item.email }}</td>
        <td class="text-xs-right" v-else>لا يوجد مسمى</td>

        <td v-if="props.item.message != null">
            <read-more more-str="read more"  :text="props.item.message" link="#" less-str="read less" :max-chars="100"></read-more>
        </td>
        <td class="text-xs-right" v-else>لم يحدد</td>

        <td class="justify-right layout px-0">
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
          لا يوجد الرسالة
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
    forceDelete:false,
    image: null,
    errors:[],
    newUser:{
      id:null,
      name: '',
      email: '',
      phone: null,
      password: null
    },
    user: null,
    edit:false,
    addEditDialog:false,
    askToDeleteDialog: false,
    mdialog:false,
    imagesdialog:false,
    requests:[],
    totalRequests:0,
    pagination: {},
    search: '',
    loading: false,
    disapprove: false,
    approve: false,
    headers: [
      {
        text: 'الاسم',
        align: 'right',
        sortable: false
      },
      {
        text: 'البريد الاليكترونى',
        align: 'right',
        sortable: false
      },
      {
        text: 'الرسالة',
        align: 'right',
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
    page:1
  }),

  computed: {
    isDisabled: function(){
      let disabled = true
      let errors = 0
      if (this.newUser.name.replace(/\s/g, '').length>3) {
        errors =+ 1
      }else {
        errors =- 1
      }
      if (this.newUser.email.replace(/\s/g, '').length>3) {
        errors =+ 1
      }else {
        errors =- 1
      }
    	return disabled = errors > 0 ? false : true;
    },
    formTitle(){
      return (this.edit) ? 'تعديل مدير' : 'إضافة مدير';
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
    }
  },
  created () {
    if(!this.loading)
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
          const endpoint = (this.search.replace(/\s/g, '').length>0)?`admin/support?filter=${this.search}` :`admin/support?page=${page}`
        this.$http.get(endpoint)
        .then( (res) => {
          console.log('admins', res);
          
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
    fetch(){
      this.getDataFromApi().then(data => {
        this.requests = data.items;
        this.totalRequests = data.total;
      });
      if(this.loading) return;

    },
    selectImage () {
      document.getElementById('image_choose').click()
    },
    imageFallBack(id){
      this.$refs[`user_${id}`].src = '../assets/avatar.png'
    },
    deleteItem (item) {
      this.deleting = true
      const index = this.requests.indexOf(item)
      if(confirm('هل تريد مسح الرسالة ؟')) {

        this.$http.delete(`admin/support/${item.id}`)
        .then( res => {
          this.requests.splice(index, 1)
          this.alert.message = 'تم مسح الرسالة!'
          this.alert.type = 'success'
          this.deleting = false
        })
      }else{
        this.deleting = false
      }
    },
    close () {
      this.addEditDialog = false
    },
  }
}
</script>

<style scoped>
  ul{
    list-style: none;
    background-size: contain;
  }
  #card-image{
    height:400px;
    width:600px;
    background-size: cover;
    background-repeat: no-repeat
  }
</style>
