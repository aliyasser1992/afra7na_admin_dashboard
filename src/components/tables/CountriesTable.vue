<template>
<div class="elevation-2">
  <vuetify-alert @message="alert.message = ''" :message="alert.message" />
    <v-toolbar flat color="white">
        <v-toolbar-title class=""><v-icon medium>{{icon}}</v-icon> {{title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <v-tooltip top slot="activator">
            <v-btn
              slot="activator"
              color="primary"
              fab dark small
              class="mb-2"
              @click="edit = false,errors = []"
            >
              <v-icon>add</v-icon>
            </v-btn>
            <span>إضافة دولة جديد</span>
          </v-tooltip>

            <!-- <v-btn slot="activator" color="primary" dark class="mb-2" @click="edit = false"> <v-icon>add</v-icon>إضافة دولة</v-btn> -->
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
                              <v-text-field v-model="country.title_ar" label=" اسم الدولة بالعربية" />
                              <v-text-field v-model="country.title_en"  label="اسم الدولة بالانجليزية" />
                              <v-text-field v-model="country.currency_ar"  label=" عملة الدولة بالعربية" />
                              <v-text-field v-model="country.currency_en"  label="عملة الدولة بالانجليزية" />
                              <v-text-field v-model="country.code"  label="كود الدولة" />
                              <v-btn color="primary" @click="$refs.image_input.click()">
                                <v-icon>image</v-icon>
                                صورة
                              </v-btn>
                              <input style="display:none" type="file" ref="image_input" >
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
            <td class="text-xs-right" v-else>لم يحدد</td>

            <td class="text-xs-right" v-if="props.item.title_en">{{ props.item.title_en }}</td>
            <td class="text-xs-right" v-else>لم يحدد</td>

            <td class="text-xs-right">
              <img @click="openDialogue(props.item)" style="cursor:pointer" :src="`https://afr7na.com/public${props.item.image}`" alt="ايقونة الدولة" title="صورة الاعلان" width="50px" height="50px">
            </td>

            <td class="text-xs-right"  v-if="props.item.code">{{ props.item.code }}</td>
            <td class="text-xs-right" v-else>لم يحدد</td>


            <td class="text-xs-right" v-if="props.item.currency_ar">{{ props.item.currency_ar }}</td>
            <td class="text-xs-right" v-else>لم يحدد</td>

            <td class="text-xs-right" v-if="props.item.currency_en">{{ props.item.currency_en }}</td>
            <td class="text-xs-right" v-else>لم يحدد</td>

            <td class="justify-right layout px-0">

              <v-tooltip top>
                <v-btn slot="activator" icon :loading="approve"  flat color="blue" @click="editing(props.item)">
                  <v-icon  class="mr-2 blue--text" >
                      edit
                  </v-icon>
                </v-btn>
                <span>تعديل الدولة</span>
              </v-tooltip>

              <v-tooltip top>
                <v-btn slot="activator" icon :loading="disapprove" flat color="red" @click="deleteItem(props.item)">
                  <v-icon  class="mr-2 red--text" >
                      delete
                  </v-icon>
                </v-btn>
                <span>مسح الدولة</span>
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
            لا يوجد دول
          </v-alert>
        </template>
    </v-data-table>
    <div class="text-xs-center pt-2">
      <v-pagination total-visible="6" color="primary" v-model="page" :length="pages"></v-pagination>
    </div>
    <v-dialog
      v-model="deleteDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title  class="title red--text">هل تريد تعطيل الدولة؟</v-card-title>

        <v-card-text>
          <v-checkbox color="red" label="حذف الدولة نهائيا" v-model="forceDelete"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="grey darken-1"
            flat="flat"
            @click="dialog = false"
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
  props: {
    title: {
      default: "",
      type: String
    },
    icon: {
      default: "",
      type: String
    }
  },
  data: () => ({
    errors: [],
    country: {
      id: null,
      title_ar: null,
      title_en: null,
      currency:"",
      code: '',
    },
    edit: false,
    dialog: false,
    deleteDialog: false,
    forceDelete: false,
    selectedItem: null,
    requests: [],
    totalRequests: 0,
    pagination: {},
    search: "",
    loading: false,
    disapprove: false,
    approve: false,
    headers: [
      {
        text: "الاسم عربى",
        align: "right",
        value: "userName",
        sortable: false
      },
      {
        text: "الاسم انجليزى",
        align: "right",
        value: "userName",
        sortable: false
      },
      {
        text: "الصورة",
        align: "right",
        value: "category",
        sortable: false
      },
      {
        text: "كود الدولة",
        align: "right",
        value: "category",
        sortable: false
      },
       {
        text: "العملة بالعربية",
        align: "right",
        value: "category",
        sortable: false
      },
      {
        text: "العملة بالانجليزية",
        align: "right",
        value: "category",
        sortable: false
      },
      {
        text: "عمليات",
        align: "cneter",
        value: "actions",
        sortable: false
      }
    ],
    editedItem: null,
    alert: {
      message: "",
      type: "success"
    },
    page: 1,
    index: null,
    filterCategory: null,
    categories: []
  }),

  computed: {
    formTitle(){
      return (this.edit) ? 'تعديل الدولة' : 'إضافة دولة';
    },
    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      )
        return 0;
      return Math.ceil(
        this.pagination.totalItems / this.pagination.rowsPerPage
      );
    }
  },

  watch: {
    dialog(val) {
      if (!val) {
        this.country = {
          id: null,
          title_ar: null,
          title_en: null,
          code: null
        };
      }
      val || this.close();
    },
    page(val) {
      this.pagination.page = val
      this.fetch();
    },
  },
  created() {
    if (this.loading) return;
    this.getDataFromApi().then(data => {
      this.requests = data.items;
      this.totalRequests = data.total;
    });
  },
  methods: {
    fetch(){
      this.getDataFromApi().then(data => {
        this.requests = data.items;
        this.totalRequests = data.total;
      });
      if(this.loading) return;

    },
    getDataFromApi(res = null) {
      this.loading = true;
      return new Promise((resolve, reject) => {
        const { sortBy, descending, page, rowsPerPage } = this.pagination;
        if (res != null) {
          let items = res.data.data;
          const total = res.data.total;
          this.pagination.rowsPerPage = res.data.per_page;
          this.pagination.totalItems = res.data.total;
          this.loading = false;
          resolve({
            items,
            total
          });
        } else {
          const endpoint = `admin/country?page=${page}`;
          this.$http.get(endpoint).then(res => {
            let items = res.data.data;
            const total = res.data.total;
            this.pagination.rowsPerPage = res.data.per_page;
            this.pagination.totalItems = res.data.total;
            this.loading = false;
            resolve({
              items,
              total
            });
          });
        }
      });
    },
    deleteItem(item) {
      this.deleting = true
      const index = this.requests.indexOf(item)
      if(confirm('هل تريد مسح الدولة؟')) {

        this.$http.delete(`admin/country/${item.id}`)
        .then( res => {
          this.requests.splice(index, 1)
          this.alert.message = 'تم مسح الدولة!'
          this.alert.type = 'success'
          this.deleting = false
        })
      }else{
        this.deleting = false
      }
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = -1;
      }, 300);
    },
    editing(item) {
      this.errors = []
      this.dialog = !this.dialog;
      this.edit = true;
      this.country.id = item.id;
      this.country.title_ar = item.title_ar;
      this.country.title_en = item.title_en;
      this.country.code = item.code;
      this.country.currency_ar = item.currency_ar;
      this.country.currency_en = item.currency_en;

      this.index = this.requests.indexOf(item)
    },
    save() {
      const index = this.index
      let image = this.$refs.image_input.files[0];
      if (typeof image == "undefined") image = null;
      let newformdata = new FormData();
      const editformdata = {};
      if (image) newformdata.append("image", image);
      if (this.country.title_ar)
        newformdata.append("title_ar", this.country.title_ar);
        editformdata.title_ar = this.country.title_ar
      if (this.country.title_en)
        newformdata.append("title_en", this.country.title_en);
        editformdata.title_en = this.country.title_en
      if (this.country.code)
        newformdata.append("code", this.country.code);
        editformdata.code = this.country.code
      if (this.country.currency_ar)
        newformdata.append("currency_ar", this.country.currency_ar);
        editformdata.currency_ar = this.country.currency_ar
      if (this.country.currency_en)
        newformdata.append("currency_en", this.country.currency_en);

      const endpoint = this.edit ? `admin/country/${this.country.id}` : `admin/country?page="${this.page}`
      this.$http
          .post(endpoint, newformdata)
          .then(res => {
            // this.requests.push(res.data)
            this.alert.type = "info";
            // this.alert.message = "تم اضافة الدولة!";
            this.alert.message = this.edit ? `تم تعديل الدولة` : `تم حفظ الدولة`
            this.close();
            this.errors = [];
            this.country = {
              id: null,
              title_ar: null,
              title_en: null,
              code: null
            };
            this.$refs.image_input.value="";
            this.getDataFromApi()
            .then(data => {
              this.requests = data.items
              this.totalRequests = data.total
            });
          })
          .catch(({ response }) => {
            this.errors = response.data.error;
          });
    },
    parseDate(date) {
      if (!date) return null;
      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
};
</script>

<style scoped>
ul {
  list-style: none;
}
</style>
