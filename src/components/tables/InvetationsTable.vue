<template>
  <div class="elevation-2">
    <vuetify-alert @message="alert.message = ''" :message="alert.message" />
    <v-toolbar flat color="white">
      <v-toolbar-title class>
        <v-icon medium>{{icon}}</v-icon>
        {{title}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-checkbox class="mt-4" label="متميز" v-model="specialEvent"></v-checkbox>
      <v-text-field
        style="max-width:200px;height:42px;font-size: 11px"
        @keyup.native="makeSearch($event)"
        append-icon="search"
        label="بحث"
        single-line
        hide-details
      ></v-text-field>
      <v-select
        style="max-width:200px;height:42px;font-size: 11px"
        v-model="filterCountry"
        flat
        dense
        :items="[{title_ar:'الدول', id:null},...countries]"
        item-text="title_ar"
        item-value="id"
      />
      <v-dialog v-model="special_event_dialog" max-width="500px">
        <!-- <v-btn slot="activator" color="primary" dark class="mb-2" @click="edit = false">
          <v-icon>add</v-icon>تمييز /الغاء تمييز حدث
        </v-btn>-->
        <v-card>
          <v-card-title>
            <span class="headline">تمييز حدث</span>
          </v-card-title>
          <v-card-text>
            <ul>
              <li class="red--text" v-for="error in errors" :key="error[0] + Math.random()">
                <ul>
                  <li v-for="err in error" :key="err + Math.random()">{{err}}</li>
                </ul>
              </li>
            </ul>
          </v-card-text>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex>
                  <v-checkbox v-model="event.special" class="mx-2" label="تمييز الحدث"></v-checkbox>

                  <v-flex justify="center" v-show="event.special">
                    <label>من تاريخ</label>
                    <br />
                    <v-date-picker v-model="event.from"></v-date-picker>
                  </v-flex>
                  <br />
                  <v-flex justify="center" v-show="event.special">
                    <label>الى تاريخ</label>
                    <br />
                    <v-date-picker v-model="event.to"></v-date-picker>
                  </v-flex>

                  <br />
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">الغاء</v-btn>
            <v-btn color="blue darken-1" flat @click.native="addEditSpecail">حفظ</v-btn>
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
      :pagination.sync="pagination"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-right" v-if="props.item.title">{{ props.item.title }}</td>
        <td class="text-xs-right" v-else>لا يوجد مسمى</td>

        <td class="text-xs-right">
          <img
            style="cursor:pointer"
            :src="`https://afr7na.com/public${props.item.special_image}`"
            alt="ايقونة "
            title="صورة "
            width="50px"
            height="50px"
          />
        </td>

        <td class="text-xs-right" v-if="props.item.user_id">{{ props.item.user.name }}</td>
        <td class="text-xs-right" v-else>لا يوجد مسمى</td>

        <td class="text-xs-right" v-if="props.item.phone">{{ props.item.phone }}</td>
        <td class="text-xs-right" v-else>لا يوجد مسمى</td>

        <td
          class="text-xs-right"
          v-if="props.item.country.title_ar"
        >{{ props.item.country.title_ar }}</td>

        <td class="text-xs-right" v-if="props.item.region.title_ar">{{ props.item.region.title_ar }}</td>
        <td class="text-xs-right" v-else>لا يوجد مسمى</td>

        <td
          class="text-xs-right"
          v-if="props.item.invitation_start_time"
        >{{ props.item.invitation_start_time }}</td>
        <td class="text-xs-right" v-else>لا يوجد وقت محدد</td>

        <td class="text-xs-right" v-if="props.item.special">اعلان مميز</td>
        <td class="text-xs-right" v-else>اعلان غير مميز</td>

        <td class="text-xs-right" v-if="props.item.from">{{ props.item.from }}</td>
        <td class="text-xs-right" v-else>لا يوجد تاريخ</td>

        <td class="text-xs-right" v-if="props.item.to">{{ props.item.to }}</td>
        <td class="text-xs-right" v-else>لا يوجد تاريخ</td>
        <td class="text-xs-right">
          <v-tooltip top>
            <v-btn slot="activator" icon flat color="red" @click="event_special(props.item)">
              <v-icon v-if="props.item.special" class="mr-2 blue--text">check</v-icon>
              <v-icon v-else class="mr-2 blue--text">stop</v-icon>
            </v-btn>
            <span>التمييز /الغاء التمييز</span>
          </v-tooltip>
        </td>
        <td class="justify-right layout px-0">
          <!-- <v-tooltip v-if="specialEvent === true" top>
              <v-btn slot="activator" icon small flat color="blue" @click="sendNotifications(props.item)">
                <v-icon  class="mr-2 blue--text" >
                  add_alert
                </v-icon>
              </v-btn>
              <span>ارسال الإشعارات</span>
          </v-tooltip>-->

          <v-tooltip top>
            <v-btn
              slot="activator"
              icon
              small
              flat
              color="blue"
              @click="prepareSendingNoti(props.item)"
            >
              <v-icon class="mr-2 blue--text">add_alert</v-icon>
            </v-btn>
            <span>ارسال الإشعارات</span>
          </v-tooltip>

          <!--  -->
          <v-tooltip v-if="props.item.deleted_at == null" top>
            <v-btn
              slot="activator"
              :loading="disapprove"
              icon
              small
              flat
              color="red"
              @click="selectedItem = props.item;askToDeleteDialog = !askToDeleteDialog"
            >
              <v-icon class="red--text">delete</v-icon>
            </v-btn>
            <span>تعطيل</span>
          </v-tooltip>
          <v-tooltip v-else top>
            <v-btn
              slot="activator"
              :loading="approve"
              icon
              small
              flat
              color="green"
              @click="restoreItem(props.item)"
            >
              <v-icon class="green--text">restore</v-icon>
            </v-btn>
            <span>تنشيط</span>
          </v-tooltip>
        </td>
      </template>
      <v-alert
        slot="no-results"
        :value="true"
        color="error"
        icon="warning"
      >لا يوجد نتائج للبحث "{{search}}"</v-alert>
      <template
        slot="pageText"
        slot-scope="props"
      >الصفحات {{ props.pageStart }} - {{ props.pageStop }} من {{ props.itemsLength }}</template>
      <template slot="no-data">
        <v-alert :value="true" color="success" icon="warning" outline>لا يوجد دعوات</v-alert>
      </template>
    </v-data-table>
    <div class="text-xs-center pt-2">
      <v-pagination total-visible="6" color="primary" v-model="page" :length="pages"></v-pagination>
    </div>
    <!--  -->
    <v-dialog v-model="askToDeleteDialog" max-width="290">
      <v-card>
        <v-card-title class="title red--text">متأكد من إيقاف الدعوة</v-card-title>
        <v-card-text>
          <v-checkbox color="red" label="حذف الدعوة نهائيا" v-model="forceDelete"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" flat="flat" @click="askToDeleteDialog = false">لا</v-btn>
          <v-btn color="red darken-1" flat="flat" @click="deleteItem">نعم</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->

    <!--  -->
    <v-dialog v-model="notiControl.sendNotiDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">ارسال الإشعارات</span>
        </v-card-title>
        <v-card-text>
          <!--  -->
          <v-list>
            <template v-for="error in errors">
              <v-list-tile :key="error[0] + Math.random()">
                <v-list-tile-content>
                  <v-list-tile-title class="text-xs-center">
                    <span class="red--text" v-for="err in error" :key="err + Math.random()">
                      {{err}}
                      <v-icon color="red">error</v-icon>
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
              <v-flex xs8>
                <v-select
                  style
                  @change="selectedCountryChanged($event)"
                  v-model="notiControl.selectedCountry"
                  flat
                  dense
                  :items="[...notiControl.countries]"
                  item-text="title_ar"
                  item-value="id"
                  label="الدولة"
                />
              </v-flex>
              <v-flex xs4>
                <v-checkbox
                  @change="allcountryChanged($event)"
                  color="primary"
                  class="mt-4"
                  label="كل مناطق الدولة"
                  v-model="notiControl.allCountry"
                ></v-checkbox>
              </v-flex>
              <v-flex v-if="notiControl.showRegionSelectBox" xs12>
                <v-select
                  v-model="notiControl.selectedRegion"
                  :items="[{title_ar:'المناطق', id:null},...notiControl.regions]"
                  item-text="title_ar"
                  item-value="id"
                  label="المناطق"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color
            class="ma-2"
            small
            @click.native="notiControl.sendNotiDialog = false;close"
          >الغاء</v-btn>
          <v-btn
            color="primary"
            class="ma-2"
            :laoding="notiControl.loading"
            dark
            small
            @click.native="sendNotifications(notiControl)"
          >حفظ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->
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
    askToDeleteDialog: false,
    forceDelete: false,
    edit: false,
    dialog: false,
    sendNotiDialog: false,
    notiControl: {
      laoding: false,
      sendNotiDialog: false,
      countries: [],
      regions: [],
      eventId: null,
      selectedCountry: null,
      selectedRegion: null,
      showRegionSelectBox: true,
      allCountry: false
    },
    optionsDialog: false,
    imagesdialog: false,
    menu1: false,
    dateFormatted: null,
    date: null,
    requests: [],
    media: [],
    totalRequests: 0,
    pagination: {},
    search: "",
    loading: false,
    disapprove: false,
    approve: false,
    special_event_dialog: false,
    event: {
      id: 0,
      special: "",
      from: "",
      to: ""
    },
    headers: [
      {
        text: "العنوان",
        align: "right",
        value: "title",
        sortable: false
      },
      {
        text: "صورة",
        align: "right",
        sortable: false
      },
      {
        text: "المستخدم",
        align: "right",
        value: "user",
        sortable: false
      },
      {
        text: "الهاتف",
        align: "right",
        value: "phone",
        sortable: false
      },
      {
        text: "الدولة",
        align: "right",
        value: "country",
        sortable: false
      },
      {
        text: "المنطقة",
        align: "right",
        value: "region",
        sortable: false
      },
      {
        text: "وقت بداية الدعوة",
        align: "right",
        value: "invitationStartTime",
        sortable: false
      },
      {
        text: "التمييز",
        align: "center",
        value: "region",
        sortable: false
      },
      {
        text: "من",
        align: "center",
        value: "region",
        sortable: false
      },
      {
        text: "الى",
        align: "center",
        value: "region",
        sortable: false
      },
      {
        text: "تمميز",
        align: "center",
        value: "region",
        sortable: false
      },
      {
        text: "عمليات",
        align: "center",
        value: "actions",
        sortable: false
      }
      // {
      //   text: 'عمليات',
      //   align: 'center',
      //   value: 'oldActions',
      //   sortable: false
      // }
    ],
    editedItem: null,
    alert: {
      message: "",
      type: "success"
    },
    page: 1,
    filterCountry: null,
    specialEvent: false,
    countries: []
  }),

  computed: {
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
    page(val) {
      this.pagination.page = val;
      this.fetch();
    },
    filterCountry(val) {
      this.getDataFromApi().then(data => {
        this.requests = data.items;
        this.totalRequests = data.total;
      });
    },
    specialEvent(val) {
      this.getDataFromApi().then(data => {
        this.requests = data.items;
        this.totalRequests = data.total;
      });
    }
  },
  created() {
    this.fetchCountries();
    this.getDataFromApi().then(data => {
      this.requests = data.items;
      this.totalRequests = data.total;
    });
  },
  methods: {
    fetchCountries() {
      this.$http.get("admin/country").then(res => {
        this.notiControl.countries = res.data.data;
        this.countries = res.data.data;
      });
    },
    makeSearch() {
      this.search = event.target.value;
      this.fetch();
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
          let filterBySearch = this.search == "" ? "" : `&title=${this.search}`;

          let bySpecialEvent =
            this.specialEvent == false ? "" : `&special_for_admin`;

          let filterByCountry =
            this.filterCountry == null
              ? ""
              : `&country_id=${this.filterCountry}`;

          const endpoint = `admin/event?category=3${filterByCountry}${filterBySearch}&page=${page}${bySpecialEvent}`;
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
    fetch() {
      this.getDataFromApi().then(data => {
        this.requests = data.items;
        this.totalRequests = data.total;
      });
      if (this.loading) return;
    },
    selectImage() {
      document.getElementById("image_choose").click();
    },
    deleteItem() {
      const item = this.selectedItem;
      this.disapprove = true;
      const endPoint =
        this.forceDelete == true
          ? `admin/event-destroy/${item.id}`
          : `admin/event-trached/${item.id}`;
      this.$http.delete(endPoint).then(res => {
        this.getDataFromApi().then(data => {
          this.requests = data.items;
          this.totalRequests = data.total;
        });
        this.alert.message =
          this.forceDelete == true ? "تم حذف المناسبة!" : "تم إيقاف المناسبة!ّ";

        this.alert.type = "info";
        this.askToDeleteDialog = false;
        this.forceDelete = false;
        this.disapprove = false;
      });
    },
    restoreItem(item) {
      this.approve = true;
      if (confirm("هل تود استرجاع المناسبة")) {
        const forceDelete = this.forceDelete == true ? 1 : 0;
        this.$http.delete(`admin/event-restore/${item.id}`).then(res => {
          this.getDataFromApi().then(data => {
            this.requests = data.items;
            this.totalRequests = data.total;
          });
          // this.requests.splice(index, 1)
          this.alert.message = "تم استئناف المناسبة";
          this.alert.type = "success";
          this.approve = false;
        });
      } else {
        this.approve = false;
      }
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = -1;
      }, 300);
    },
    editing(item) {
      this.dialog = !this.dialog;
      this.edit = true;

      this.newCategory.id = item.id;

      this.newCategory.title_ar = item.title_ar;
      this.newCategory.title_en = item.title_en;

      this.newCategory.category.id = item.sub_category.category.category_id;
      this.newCategory.category.title = item.sub_category.category.title_ar;

      this.newCategory.rel_category.id = item.sub_category.category.category_id;
      this.newCategory.rel_category.title = item.sub_category.title_ar;
    },
    prepareSendingNoti(item) {
      this.notiControl.sendNotiDialog = !this.notiControl.sendNotiDialog;
      this.edit = true;

      this.notiControl.eventId = item.id;
    },
    sendNotifications(item) {

      let formdata = new FormData();

      if (this.notiControl.selectedCountry != null)
        formdata.append("country", this.notiControl.selectedCountry);
      if (this.notiControl.selectedRegion != null)
        formdata.append("region", this.notiControl.selectedRegion);

      this.notiControl.loading = true;

      this.$http
        .post(`admin/send-notification/${item.eventId}`, formdata)
        .then(res => {
          this.getDataFromApi().then(data => {
            this.requests = data.items;
            this.totalRequests = data.total;
          });
          this.alert.message = "تم ارسال الإشعارت";
          this.alert.type = "success";
          this.notiControl.loading = false;
        })
        .catch(({ response }) => {
          this.errors = response.data.error;
        });
    },
    selectedCountryChanged(newValue) {

      this.$http.get(`admin/region?country_id=${newValue}`).then(res => {


        this.notiControl.regions = res.data.data;
      });

      // this.notiControl.selectedRegion = null
      // if (newValue === true) {
      //   this.notiControl.showRegionSelectBox = false
      //   this.notiControl.selectedRegion = null
      // } else {
      //   this.notiControl.showRegionSelectBox = true
      //   this.notiControl.selectedRegion = null
      // }
    },
    allcountryChanged(newValue) {
      if (newValue === true) {
        this.notiControl.showRegionSelectBox = false;
        this.notiControl.selectedRegion = null;
      } else {
        this.notiControl.showRegionSelectBox = true;
        this.notiControl.selectedRegion = null;
      }
    },
    event_special(item) {
      this.special_event_dialog = true;
      this.event.id = item.id;
      this.event.special = item.special === 1 ? true : false;
      this.event.from =
        item.from === null
          ? new Date().toISOString().substr(0, 10)
          : new Date(item.from).toISOString().substr(0, 10);
      this.event.to =
        item.to === null
          ? new Date().toISOString().substr(0, 10)
          : new Date(item.to).toISOString().substr(0, 10);
    },
    addEditSpecail() {
      if (!this.event.special) {
        this.event.from = "";
        this.event.to = "";
      }

      this.$http
        .put("admin/special-event/" + this.event.id, this.event)
        .then(res => {
          this.special_event_dialog = false;

          if (res.data.data === 1) {
            this.alert.message = "تم تمييز الحدث";
          } else {
            this.alert.message = "تم الغاء تمييز الحدث";
          }
          this.getDataFromApi().then(data => {
            this.requests = data.items;
            this.totalRequests = data.total;
          });
        })
        .catch(({ response }) => {
          this.errors = response.data.errors;
        });
    },
    save() {
      let image = this.$refs.image_input.files[0];
      if (typeof image == "undefined") image = null;
      let formdata = new FormData();
      if (image) formdata.append("image", image);
      if (this.newCategory.title_ar)
        formdata.append("title_ar", this.newCategory.title_ar);
      if (this.newCategory.title_en)
        formdata.append("title_en", this.newCategory.title_en);
      if (this.newCategory.category.id)
        formdata.append("category_id", this.newCategory.category.id);
      if (this.newCategory.rel_category.id)
        formdata.append("rel_category_id", this.newCategory.rel_category.id);

      if (this.edit) {
        this.$http
          .post(
            `api/admin/categories/update/category/${this.newCategory.id}?page=${this.page}`,
            formdata
          )
          .then(res => {
            this.getDataFromApi(res).then(data => {
              this.requests = data.items;
              this.totalRequests = data.total;
            });
            this.alert.type = "warning";
            this.alert.message = "تم تعديل القسم!";
            this.close();
            this.errors = [];
            this.newCategory = {
              id: null,
              title_ar: null,
              title_en: null,
              category: {
                id: null,
                title: null
              },
              rel_category: {
                id: null,
                title: null
              }
            };
            this.$refs.image_input.value = "";
          })
          .catch(({ response }) => {
            this.errors = response.data.errors;
          });
      } else {
        this.$http
          .post(`api/admin/categories/add/category?page=${this.page}`, formdata)
          .then(res => {
            this.getDataFromApi(res).then(data => {
              this.requests = data.items;
              this.totalRequests = data.total;
            });
            this.alert.type = "info";
            this.alert.message = "تم اضافة القسم!";
            this.close();
            this.errors = [];
            this.newCategory = {
              id: null,
              title_ar: null,
              title_en: null,
              category: {
                id: null,
                title: null
              },
              rel_category: {
                id: null,
                title: null
              }
            };
            this.$refs.image_input.value = "";
          })
          .catch(({ response }) => {
            this.errors = response.data.errors;
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
