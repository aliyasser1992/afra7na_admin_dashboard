<template>
  <div class="elevation-2">
    <vuetify-alert @message="alert.message = ''" :message="alert.message" />
      <v-toolbar flat color="white">
        <v-toolbar-title class=""><v-icon medium>{{icon}}</v-icon> {{title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- <v-text-field
          style="max-width:200px;height:42px;font-size: 11px"
          v-model="search"
          append-icon="search"
          label="بحث"
          single-line
          hide-details
        ></v-text-field> -->
        <v-select
          style="max-width:200px;height:42px;font-size: 11px"
          v-model="filterCountry" flat dense :items="[{title_ar:'الدول', id:null},...searchCountries]"
          item-text="title_ar" item-value="id" label="الدول"
        />

          <v-dialog v-model="dialog" max-width="500px">

            <v-tooltip top slot="activator">
              <v-btn
                slot="activator"
                color="primary"
                fab dark small
                class="mb-2"
                @click="edit = false;errors=[];region={}"
              >
                <v-icon>add</v-icon>
              </v-btn>
              <span>إضافة منطقة جديد</span>
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
                        <v-text-field v-model="region.title_ar" label=" اسم المنطقة بالعربية" />
                        <v-text-field v-model="region.title_en"  label="اسم المنطقة بالانجليزية" />
                        <v-select style=""
                          v-model="region.country_id"
                          flat dense
                          :items="[{title_ar:'الدول', id:null},...addEditCountries]"
                          item-text="title_ar" item-value="id" label="الدولة"
                        />
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

              <td class="text-xs-right" v-if="props.item.country">{{ props.item.country.title_ar }}</td>
              <td class="text-xs-right" v-else>لم يحدد</td>

              <td class="justify-right layout px-0">
                <v-tooltip top>
                  <v-btn slot="activator" icon small flat color="blue" @click="editing(props.item)">
                    <v-icon  class="mr-2 blue--text" >
                        edit
                    </v-icon>
                  </v-btn>
                  <span>تعديل المنطقة</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn slot="activator" :loading="disapprove" icon small flat color="red" @click="deleteItem(props.item)">
                    <v-icon class="red--text"  >
                        delete
                    </v-icon>
                  </v-btn>
                  <span>مسح المنطقة</span>
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
              لا يوجد نتائج للبحث
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
          <v-card-title  class="title red--text">هل تريد تعطيل المنطقة؟</v-card-title>

          <v-card-text>
            <v-checkbox color="red" label="حذف المنطقة نهائيا" v-model="forceDelete"></v-checkbox>
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
    region: {
      id: null,
      title_ar: null,
      title_en: null,
      country_id: '',
    },
    edit: false,
    dialog: false,
    deleteDialog: false,
    forceDelete: false,
    selectedItem: null,
    requests: [],
    totalRequests: 0,
    pagination: {},
    page: 1,
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
        text: "المنطقة",
        align: "right",
        value: "country",
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
    index: null,
    filterCountry:null,
    searchCountries: [],
    addEditCountries: []
  }),

  computed: {
    formTitle(){
      return (this.edit) ? 'تعديل منطقة' : 'إضافة منطقة';
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
    // pagination: {
    //   handler() {
    //     this.page = this.pagination.page;
    //     if(!this.loading)
    //     {
    //       this.getDataFromApi()
    //       .then(data => {
    //         this.requests = data.items
    //         this.totalRequests = data.total
    //       })
    //     }
    //   },
    //   deep: true
    // },
    page(val) {
      this.pagination.page = val
      this.fetch();
    },
    filterCountry(val){
      this.getDataFromApi()
      .then(data => {
        this.requests = data.items
        this.totalRequests = data.total
      });
    },
  },
  created() {
    if (this.loading) return;
    this.fetchCountries()
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

          setTimeout(() => {
            this.loading = false
          }, 300)

          resolve({
            items,
            total
          });
        } else {
          let filterByCountry = (this.filterCountry == null)
          ? ''
          : `&country_id=${this.filterCountry}`
          const endpoint = (this.search.replace(/\s/g, '').length>0)
          ? `admin/region?title=${this.search}${filterByCountry}`
          : `admin/region?page=${page}${filterByCountry}`
          this.$http.get(endpoint).then(res => {
            let items = res.data.data;
            const total = res.data.total;
            this.pagination.rowsPerPage = res.data.per_page;
            this.pagination.totalItems = res.data.total;
            setTimeout(() => {
              this.loading = false
            }, 300)
            resolve({
              items,
              total
            });

          });
        }
      });
    },
    fetchCountries() {
      this.$http.get('admin/country')
      .then( (res) => {
        this.searchCountries = res.data.data
        this.addEditCountries = res.data.data
      })
    },
    deleteItem (item) {
      this.deleting = true
      const index = this.requests.indexOf(item)
      if(confirm('هل تريد مسح المنطقة')) {

        this.$http.delete(`admin/region/${item.id}`)
        .then( res => {
          this.getDataFromApi()
          .then(data => {
            this.requests = data.items
            this.totalRequests = data.total
          })
          this.alert.message = 'تم مسح المنطقة!'
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
      this.region.id = item.id;
      this.region.title_ar = item.title_ar;
      this.region.title_en = item.title_en;
      this.region.country_id = item.country_id;

      this.index = this.requests.indexOf(item)
    },
    save() {
      const index = this.index

      let newformdata = new FormData();
      const editformdata = {};
      if (this.region.title_ar)
        newformdata.append("title_ar", this.region.title_ar);
        editformdata.title_ar = this.region.title_ar
      if (this.region.title_en)
        newformdata.append("title_en", this.region.title_en);
        editformdata.title_en = this.region.title_en
      if (this.region.country_id)
        newformdata.append("country_id", this.region.country_id);
        editformdata.country_id = this.region.country_id



      if (this.edit) {
        this.$http.put(`admin/region/${this.region.id}`, editformdata)
          .then(res => {


            this.$set(this.requests, index, editformdata)
            this.alert.type = "warning";
            this.alert.message = "تم تعديل المنطقة!";
            this.close();
            this.errors = [];
            this.region = {
              id: null,
              title_ar: null,
              title_en: null,
              country_id: null
            };
          })
          .catch(({ response }) => {
            this.errors = response.data.error;
          });
      } else {
        this.$http
          .post("admin/region" + "?page=" + this.page, newformdata)
          .then(res => {
            this.requests.push(res.data)
            this.alert.type = "info";
            this.alert.message = "تم اضافة المنطقة!";
            this.close();
            this.errors = [];
            this.region = {
              id: null,
              title_ar: null,
              title_en: null,
              country_id: null
            };
            this.getDataFromApi()
          })
          .catch(({ response }) => {
            this.errors = response.data.error;
          });
      }
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
