<template>
<div class="elevation-2">
  <vuetify-alert @message="alert.message = ''" :message="alert.message" :type="alert.type" />
    
    <v-toolbar flat color="white">
      <v-toolbar-title class=""><v-icon medium>{{icon}}</v-icon> {{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="addEditDialog" max-width="500px">
        
        <v-tooltip top slot="activator">
          <v-btn 
            slot="activator" 
            color="primary" 
            fab dark small
            class="mb-2" 
            @click="edit = false;errors=[];newUser={}"
          > 
            <v-icon>add</v-icon>
          </v-btn>
          <span>إضافة مدير جديد</span>
        </v-tooltip>
        <!-- <v-btn slot="activator" color="primary" dark class="mb-2" @click="edit = false"> <v-icon>add</v-icon> تصنيف جديد</v-btn> -->
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
                    <v-text-field v-model="newUser.name" label=" الإسم" />
                    <v-text-field v-model="newUser.email"  label="البريد الإليكتروني" />
                    <v-text-field v-model="newUser.phone"  label="رقم الهاتف" />
                    <v-text-field v-model="newUser.password"  label="كلمة السر" />
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="" class="ma-2"  small @click.native="close">الغاء</v-btn>
                <v-btn color="primary" class="ma-2" depressed small @click.native="save">حفظ</v-btn>
            </v-card-actions>
        </v-card> 
      </v-dialog>
      <v-spacer></v-spacer>
      <v-text-field
        style="max-width:250px;height:42px;font-size: 11px"
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

        <td class="text-xs-right"  v-if="props.item.phone">{{ props.item.phone }}</td>
        <td class="text-xs-right" v-else>لا يوجد مسمى</td>

        <!-- <td class="text-xs-right">
          <img v-if="props.item.image"  :src="https://afr7na.com/public+props.item.image" :ref="'user_'+props.item.id" @error="imageFallBack(props.item.id)" alt="صورة المستخدم" title="صورة المستخدم" width="50px" height="50px" style="cursor:pointer" @click="() => {image = props.item.image;mdialog = true;}">
          
          <img v-else  src="@/assets/avatar.png" alt="صورة المستخدم" title="صورة المستخدم" width="50px" height="50px" style="cursor:pointer" >
        </td> -->

        <td class="justify-right layout px-0">
          <!-- <v-btn small flat color="blue" @click="editing(props.item)"> 
            تعديل
            <v-icon  class="mr-2 blue--text" >
                edit
            </v-icon>
          </v-btn> -->
          <v-tooltip v-if="props.item.deleted_at == null" top>
            <v-btn
              slot="activator" 
              :loading="disapprove" 
              small flat icon color="red" 
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
              small flat icon color="green" 
              @click="restoreItem(props.item)"
            >
              <v-icon class="green--text"  >
                  restore
              </v-icon>
            </v-btn>
            <span>تنشيط</span>
          </v-tooltip>
        </td>

        <!-- <td class="justify-right layout px-0">
            <v-btn v-if="props.item.status" :loading="disapprove" small flat color="red" @click="dialog = true;user = props.item" >
              ايقاف
              <v-icon class="red--text"  >
                  not_interested
              </v-icon>
            </v-btn>
            <v-btn v-else :loading="approve" small flat color="green" @click="restoreItem(props.item)" >
              استرجاع
              <v-icon class="green--text"  >
                  restore
              </v-icon>
            </v-btn>
        </td> -->
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
          لا يوجد نتائج للبحث "{{search}}"
      </v-alert>
      <template slot="pageText" slot-scope="props">
        الصفحات {{ props.pageStart }} - {{ props.pageStop }} من {{ props.itemsLength }}
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="success" icon="warning" outline>
          لا يوجد مستخدمين
        </v-alert>
      </template>
    </v-data-table>
    
    <div class="text-xs-center pt-2">
      <v-pagination total-visible="6" color="primary" v-model="page" :length="pages"></v-pagination>
    </div>
    
    <v-dialog
      v-if="image"
      v-model="mdialog"
      width="600"
      style="max-height:400px;overflow:hidden"
    >
      <v-card v-if="image" :style="'background-image:url(\'http://souq24app.com/'+image+'\');'" id="card-image">
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="askToDeleteDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title  class="title red--text">متأكد من إيقاف المستخدم؟</v-card-title>
        <v-card-text>
          <v-checkbox color="red" label="حذف المستخدم نهائيا" v-model="forceDelete"></v-checkbox>        
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
          <v-btn
            color="red darken-1"
            flat="flat"
            @click="deleteItem"
          >
            نعم
          </v-btn>
        </v-card-actions>
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
    page:1,
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
        text: 'رقم الهاتف',
        align: 'right',
        sortable: false
      },
      // {
      //   text: 'الصورة',
      //   align: 'right',
      //   sortable: false
      // },
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
    
  }),

  computed: {
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
    page(val) {
      this.pagination.page = val
      this.fetch();
    },
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
    fetch(){
      this.getDataFromApi().then(data => {
        this.requests = data.items;
        this.totalRequests = data.total;
      });
      if(this.loading) return;

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

          let filterBySearch = (this.search == "") 
          ? '' 
          : `&filter=${this.search}`

          const endpoint = `admin/admins?page=${page}${filterBySearch}`

          this.$http.get(endpoint)
          .then( (res) => {
            console.log('admins', res);
            
            let items = res.data.admins.data
            const total = res.data.admins.total
            this.pagination.rowsPerPage = res.data.admins.per_page
            this.pagination.totalItems = res.data.admins.total
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
    imageFallBack(id){
      this.$refs[`user_${id}`].src = '../assets/avatar.png'
    },
    deleteItem() {
      const item = this.selectedItem
      this.disapprove = true
      const endPoint = this.forceDelete == true ? `admin/destroy/${item.id}`:`admin/trached/${item.id}`
        this.$http.delete(endPoint)
        .then( res => {
          this.getDataFromApi()
          .then(data => {
            this.requests = data.items
            this.totalRequests = data.total
          })
          this.alert.message = this.forceDelete == true ? 'تم حذف المستخدم!' : 'تم إيقاف المستخدم!ّ'
          
          this.alert.type = 'info'
          this.askToDeleteDialog = false 
          this.forceDelete = false
          this.disapprove = false
        })
    },

    restoreItem (item) {
      this.approve = true
      // const index = this.requests.indexOf(item)
      if(confirm('هل تود استرجاع المستخدم؟')) {
      const forceDelete = this.forceDelete == true ? 1:0
        this.$http.delete(`admin/cancel_trached/${item.id}`)
        .then( res => {
           
          this.getDataFromApi()
          .then(data => {
            this.requests = data.items
            this.totalRequests = data.total
          })
          // this.requests.splice(index, 1)
          this.alert.message = 'تم استئناف المستخدم'
          this.alert.type = 'success'
          this.approve = false
        })
      }else{
        this.approve = false
      }
    },

    close () {
      this.addEditDialog = false
    },
    editing(item) {
      this.dialog = !this.dialog;
      this.edit = true;
      this.newUser.id = item.id;
      this.newUser.name = item.name;
      this.newUser.email = item.email;
      this.newUser.phone = item.phone;
      this.newUser.password = item.password;

      this.index = this.requests.indexOf(item)
    },
    save() {
      const index = this.index
      let newformdata = new FormData();
      const editformdata = {};
      if (this.newUser.name)
        newformdata.append("name", this.newUser.name);
        editformdata.name = this.newUser.name
      if (this.newUser.email)
        newformdata.append("email", this.newUser.email);
        editformdata.email = this.newUser.email
      if (this.newUser.phone)
        newformdata.append("phone", this.newUser.phone);
        editformdata.phone = this.newUser.phone
      if (this.newUser.password)
        newformdata.append("password", this.newUser.password);
        editformdata.password = this.newUser.password

      console.log('editformdata', editformdata);
      
      if (this.edit) {
        this.$http.put(`admin/country/${this.country.id}`, editformdata)
          .then(res => {
            console.log(res.data);
            
            this.$set(this.requests, index, editformdata)
            this.alert.type = "warning";
            this.alert.message = "تم تعديل الدولة!";
            this.close();
            this.errors = [];
            this.country = {
              id: null,
              title_ar: null,
              title_en: null,
              code: null
            };
          })
          .catch(({ response }) => {
            this.errors = response.data.errors;
          });
      } else {
        this.$http
          .post("admin/adminRegister" + "?page=" + this.page, newformdata)
          .then(res => {
            this.requests.push(this.newUser)
            this.alert.type = "info";
            this.alert.message = "تم اضافة مدير جديد!";
            this.close();
            this.errors = [];
            this.newUser = {
              id: null,
              name: null,
              email: null,
              phone: null,
              password: null
            };
          })
          .catch(({ response }) => {
            this.errors = response.data.error;
          });
      }
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
