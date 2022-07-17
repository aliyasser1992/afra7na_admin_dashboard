<template>
  <div>
    <vuetify-alert @message="alert.message = ''" :message="alert.message" :type="alert.type" />

    <v-toolbar flat color="white">
      <v-toolbar-title class>
        <v-icon medium>{{icon}}</v-icon>
        {{title}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="addEditDialog" max-width="500px">
        <v-tooltip top slot="activator">
          <v-btn
            slot="activator"
            color="primary"
            fab
            dark
            small
            class="mb-2"
            @click="edit = false;errors=[];errors=[];ad={}"
          >
            <v-icon>add</v-icon>
          </v-btn>
          <span>إضافة إعلان جديد</span>
        </v-tooltip>
        <v-card>
          <v-card-title>
            <span class="headline">{{formTitle}}</span>
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
                <v-flex>
                  <v-text-field v-model="ad.title" label="العنوان" />
                  <v-text-field v-model="ad.phone" label=" الهاتف" />
                  <v-text-field v-model="ad.brief" label="الوصف" />
                  <!-- <v-text-field v-model="ad.link" label="رابط" /> -->
                  <v-text-field v-model="ad.instagram_url" label="رابط الانستجرام" />
                  <v-text-field v-model="ad.twitter_url" label="رابط تويتر" />
                  <v-text-field v-model="ad.snap_chat_url" label="رابط سناب شات" />
                  <v-text-field v-model="ad.whatsapp_number" label="رقم الواتس اب" />
                  <v-text-field v-model="ad.website_url" label="رابط الموقع الالكترونى" />
                  <v-select
                    style
                    v-model="ad.ads_category_id"
                    flat
                    dense
                    :items="[{title_ar:'الاقسام', id:null},...addEditCategories]"
                    item-text="title_ar"
                    item-value="id"
                    label="الاقسام"
                  />
                  <v-select
                    style="height:42px;font-size: 11px"
                    v-model="ad.country_id"
                    flat
                    dense
                    :items="[{title_ar:'الدول', id:null},...Countries]"
                    item-text="title_ar"
                    item-value="id"
                    label="الدول"
                  />
                  <!-- {{ad.is_admin}} -->
                  <v-checkbox v-model="ad.is_admin" class="mx-2" label="اعلان سليدر"></v-checkbox>
                  <v-checkbox
                    v-model="ad.special"
                    v-on:change="changeSpicalState(ad.special)"
                    class="mx-2"
                    label="تمييز الاعلان"
                  ></v-checkbox>

                  <v-flex justify="center" v-show="ad.special">
                    <label>من تاريخ</label>
                    <br />
                    <v-date-picker v-model="ad.from"></v-date-picker>
                  </v-flex>
                  <br />
                  <v-flex justify="center" v-show="ad.special">
                    <label>الى تاريخ</label>
                    <br />
                    <v-date-picker v-model="ad.to"></v-date-picker>
                  </v-flex>

                  <br />
                  <v-btn color="primary" @click="$refs.image_input.click()">
                    <v-icon>image</v-icon>صورة
                  </v-btn>
                  <input
                    style="display:none"
                    name="images[]"
                    type="file"
                    ref="image_input"
                    multiple
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color class="ma-2" small @click.native="closeAddEditDialog">الغاء</v-btn>
            <v-btn color="primary" class="ma-2" dark small @click.native="save">حفظ</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-spacer></v-spacer>

      <v-dialog v-model="imageDialog" max-width="500px">
        <v-card-text>
          <v-card>
            <v-container grid-list-md>
              <v-layout wrap></v-layout>
              <v-data-table :items="ads_images" :headers="image_headers">
                <template slot="items" slot-scope="props">
                  <!-- <td>
                    {{props.item.id}}
                  </td>
                  -->
                  <td class="text-xs-right">
                    <img
                      @click="openDialogue(props.item)"
                      style="cursor:pointer"
                      :src="`https://afr7na.com/public${props.item.image}`"
                      alt="صوره الاعلان"
                      title="صورة الاعلان"
                      width="50px"
                      height="50px"
                    />
                  </td>
                  <td>
                    <v-tooltip top>
                      <v-btn
                        slot="activator"
                        icon
                        flat
                        color="red"
                        @click="deleteImags(props.item)"
                      >
                        <v-icon class="red--text">delete</v-icon>
                      </v-btn>
                      <span>مسح صورة الاعلان الإعلان</span>
                    </v-tooltip>
                  </td>
                </template>
              </v-data-table>
            </v-container>
          </v-card>
        </v-card-text>
      </v-dialog>
      <v-spacer></v-spacer>
      <v-select
        style="max-width:200px;height:42px;font-size: 11px"
        v-model="filterCategory"
        flat
        dense
        :items="[{title_ar:'الاقسام', id:null},...searchCategories]"
        item-text="title_ar"
        item-value="id"
      />
      <br />
      <v-select
        style="max-width:200px;height:42px;font-size: 11px"
        v-model="filterAdsType"
        flat
        dense
        :items="[{title_ar:'نوع الاعلانات', id:null},...[{'id':null ,'title_ar':'اعلان عادى','is_admin': null },{'id':1,'title_ar':'اعلان سليدر','is_admin':1}]]"
        item-text="title_ar"
        item-value="id"
      />
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
        <td class="text-xs-right" v-if="props.item.title">{{ props.item.title }}</td>
        <td class="text-xs-right" v-else>لا يوجد اسم</td>

        <td
          class="text-xs-right"
          v-if="props.item.country && props.item.country.title_ar"
        >{{ props.item.country.title_ar }}</td>
        <td class="text-xs-right" v-else>لا يوجد اسم</td>

        <td
          class="text-xs-right"
          v-if="props.item.ads_category.title_ar"
        >{{ props.item.ads_category.title_ar }}</td>
        <td class="text-xs-right" v-else>لا يوجد قسم</td>

        <td class="text-xs-right" v-if="props.item.phone">{{ props.item.phone }}</td>
        <td class="text-xs-right" v-else>لا يوجد هاتف</td>

        <td class="text-xs-right" v-if="props.item.instagram_url">
          {{ props.item.instagram_url
          }}
        </td>
        <td class="text-xs-right" v-else>لا يوجد رابط</td>

        <td class="text-xs-right" v-if="props.item.twitter_url">
          {{ props.item.twitter_url
          }}
        </td>
        <td class="text-xs-right" v-else>لا يوجد رابط</td>

        <td class="text-xs-right" v-if="props.item.snap_chat_url">
          {{ props.item.snap_chat_url
          }}
        </td>
        <td class="text-xs-right" v-else>لا يوجد رابط</td>

        <td class="text-xs-right" v-if="props.item.whatsapp_number">{{ props.item.whatsapp_number }}</td>
        <td class="text-xs-right" v-else>لا يوجد هاتف</td>

        <td class="text-xs-right" v-if="props.item.website_url">{{ props.item.website_url }}</td>
        <td class="text-xs-right" v-else>لا يوجد رابط موقع</td>
        <!-- <td class="text-xs-right" v-if="props.item.link">{{ props.item.link }}</td>
        <td class="text-xs-right" v-else>لا يوجد رابط</td>-->

        <td class="text-xs-right" v-if="props.item.views">{{ props.item.views}}</td>
        <td class="text-xs-right" v-else>لا يوجد مشاهدات</td>

        <td class="text-xs-right" v-if="props.item.special">اعلان مميز</td>
        <td class="text-xs-right" v-else>اعلان غير مميز</td>

        <td class="text-xs-right" v-if="props.item.from">{{ props.item.from }}</td>
        <td class="text-xs-right" v-else>لا يوجد تاريخ</td>

        <td class="text-xs-right" v-if="props.item.to">{{ props.item.to }}</td>
        <td class="text-xs-right" v-else>لا يوجد تاريخ</td>

        <td class="text-xs-right" v-if="props.item.brief">{{ props.item.brief }}</td>
        <td class="text-xs-right" v-else>لا يوجد وصف</td>

        <td class="text-xs-right" v-if="props.item.state === 0">الاعلان غير مفعل</td>
        <td class="text-xs-right" v-else>الاعلان مفعل</td>

        <td class="text-xs-right">
          <v-tooltip top>
            <v-btn
              slot="activator"
              icon
              :loading="approve"
              flat
              color="blue"
              @click="showImages(props.item.ads_images)"
            >
              <v-icon class="mr-2 blue--text">image</v-icon>
            </v-btn>
            <span>صور الاعلان</span>
          </v-tooltip>
        </td>

        <td class="justify-right layout px-0">
          <v-tooltip top>
            <v-btn
              slot="activator"
              icon
              :loading="approve"
              flat
              color="blue"
              @click="editing(props.item)"
            >
              <v-icon class="mr-2 blue--text">edit</v-icon>
            </v-btn>
            <span>تعديل الإعلان</span>
          </v-tooltip>

          <v-tooltip top>
            <v-btn slot="activator" icon flat color="red" @click="inc_views(props.item)">
              <v-icon class="mr-2 green--text">add</v-icon>
            </v-btn>
            <span>زيادة عدد المشاهدات</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn slot="activator" icon flat color="red" @click="ads_pin(props.item)">
              <v-icon
                v-if="props.item.pin === 0 || props.item.pin === null "
                class="mr-2 blue--text"
              >تثبيت</v-icon>
              <v-icon v-if="props.item.pin === 1" class="mr-2 red--text">الغاء</v-icon>
            </v-btn>
            <span>تثبيت /الغاء تثبيت الاعلان</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn slot="activator" icon flat color="red" @click="deleteItem(props.item)">
              <v-icon class="red--text">delete</v-icon>
            </v-btn>
            <span>مسح الإعلان</span>
          </v-tooltip>

          <v-tooltip top>
            <v-btn slot="activator" icon flat color="red" @click="ads_state(props.item)">
              <v-icon v-if="props.item.state === 0" class="mr-2 blue--text">check</v-icon>
              <v-icon v-if="props.item.state === 1" class="mr-2 red--text">stop</v-icon>
            </v-btn>
            <span>ايقاف / تشغيل الاعلان</span>
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
        <v-alert :value="true" color="success" icon="warning" outline>لا يوجد اعلانات</v-alert>
      </template>
    </v-data-table>
    <div class="text-xs-center pt-2">
      <v-pagination total-visible="6" color="primary" v-model="page" :length="pages"></v-pagination>
    </div>
    <!-- <v-dialog v-if="media.length" v-model="dialog" width="600" style="max-height:400px">
      <v-card>
        <v-carousel :circle="false" interval="600000">
          <v-carousel-item v-for="item in media" :key="item.id" color="primary">
            <img
              v-if="item.image"
              :src="https://afr7na.com/public+item.image"
              alt
              srcset
              style="margin:0 auto; width:100%;height:100%"
            />
            <img
              v-if="item.vedio"
              :src="$root.$data.baseURL+item.vedio"
              alt
              srcset
              style="margin:0 auto; width:100%;height:100%"
            />
            <video width="600" height="80%" controls>
              <source :src="$root.$data.baseURL+item.vedio" type="video/mp4" />
              <source :src="$root.$data.baseURL+item.vedio" type="video/ogg" />Your browser does not support the video tag.
            </video>
          </v-carousel-item>
        </v-carousel>
      </v-card>
    </v-dialog>-->
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
    selected: [],
    imageDialog: false,
    selectedItem: null,
    dialog: false,
    addEditDialog: false,
    edit: false,
    deleting: false,
    CountProductDialog: false,
    dateFormatted: null,
    date: null,
    picker: null,
    landscape: false,
    paginationDialog: false,
    end_date: null,
    optionsDialog: false,
    requests: [],
    Countries: [],
    ads_images: [],
    productNumbers: 10,
    media: [],
    totalRequests: 0,
    pagination: {},
    errors: [],
    search: "",
    loading: false,
    specializing: false,
    approve: false,
    disapprove: false,
    ad: {
      id: null,
      title: null,
      brief: null,
      phone: null,
      images: [],
      country_id: 0,
      ads_category_id: "",
      instagram_url: "",
      twitter_url: "",
      snap_chat_url: "",
      whatsapp_number: "",
      website_url: "",
      special: false,
      link: "",
      is_admin: 0,
      from: null,
      to: null
    },
    image_headers: [
      // {
      //   text: "الرقم",
      //   align: "right",
      //   value: "country",
      //   sortable: false
      // },
      {
        text: "الصورة",
        align: "right",
        value: "country",
        sortable: false
      },
      {
        text: "مسح",
        align: "right",
        value: "country",
        sortable: false
      }
    ],
    headers: [
      {
        text: "العنوان",
        align: "right",
        value: "country",
        sortable: false
      },
      {
        text: "البلد",
        align: "right",
        value: "country",
        sortable: false
      },
      {
        text: "القسم",
        align: "right",
        value: "category",
        sortable: false
      },
      {
        text: "الهاتف",
        align: "right",
        value: "category",
        sortable: false
      },

      {
        text: "رابط الانستجرام",
        align: "right",
        value: "instagram_url",
        sortable: false
      },
      {
        text: "رابط تويتر",
        align: "right",
        value: "twitter_url",
        sortable: false
      },
      {
        text: "رابط سناب شات",
        align: "right",
        value: "snap_chat_url",
        sortable: false
      },
      {
        text: "رقم الواتس ابب",
        align: "right",
        value: "whatsapp_number",
        sortable: false
      },
      {
        text: "رابط الموقع الالكترونى",
        align: "right",
        value: "website_url",
        sortable: false
      },
      // {
      //   text: "رابط الاعلان",
      //   align: "right",
      //   value: "link",
      //   sortable: false
      // },
      {
        text: "عدد المشاهدات",
        align: "right",
        value: "views",
        sortable: true
      },
      {
        text: "تميز الاعلان",
        align: "right",
        value: "category",
        sortable: false
      },
      {
        text: "من تاريخ",
        align: "right",
        value: "category",
        sortable: false
      },
      {
        text: "الى تاريخ",
        align: "right",
        value: "category",
        sortable: false
      },
      {
        text: "الوصف",
        align: "right",
        value: "category",
        sortable: false
      },

      {
        text: "حاله الاعلان",
        align: "right",
        value: "image",
        sortable: false
      },
      {
        text: "صور",
        align: "right",
        value: "image",
        sortable: false
      },
      {
        text: "عمليات",
        align: "right",
        value: "actions",
        sortable: false
      }
    ],
    alert: {
      message: "",
      type: "success"
    },
    page: 1,
    filterCategory: null,
    filterAdsType: null,
    categories: [],
    searchCategories: [],
    addEditCategories: [],
    index: null
  }),

  computed: {
    formTitle() {
      return this.edit ? "تعديل اعلان" : "إضافة اعلان";
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
    // addEditDialog(val) {
    //
    //   if (!val) {
    //     this.ad = {
    //       id: null,
    //       title: null,
    //       image: "",
    //       ads_category_id: "",
    //       special : ""
    //     };
    //   }
    //   val || this.close();
    // },
    dialog(val) {
      val || this.close();
    },
    page(val) {
      this.pagination.page = val;
      this.fetch();
    },
    filterCategory(val) {
      this.getDataFromApi().then(data => {
        this.requests = data.items;
        this.totalRequests = data.total;
      });
    },
    filterAdsType(val) {
      //
      this.getDataFromApi().then(data => {
        this.requests = data.items;
        this.totalRequests = data.total;
      });
    },
    filterCountry(val) {
      this.getDataFromApi().then(data => {
        this.requests = data.items;
        this.totalRequests = data.total;
      });
    },
    optionsDialog(val) {
      if (val == false) {
        this.selectedItem = null;
        this.date = null;
        this.end_date = null;
        this.discrimint[0].value = false;
      }
    }
  },
  created() {
    this.fetchCountries();
    this.fetchCategories();
    this.getDataFromApi().then(data => {
      this.requests = data.items;
      this.totalRequests = data.total;
    });
  },
  methods: {
    changeProductCount(item) {
      this.$http
        .post("/api/admin/editCountProducts", {
          productCount: this.productCount
        })
        .then(res => {
          this.alert.message = "تم تعديل عدد المنتجات بنجاح";
          this.alert.type = "info";
          this.CountProductDialog = false;
        })
        .catch(({ response }) => {});
    },
    reschedule() {
      let schedule = this.formatDateWithZone(
        this.schedule_start + " " + this.picker,
        "from"
      );

      this.$http
        .post("http://souq24app.com/api/admin/reschedule-product/", {
          schedule_start: schedule,
          product_id: this.selected
        })
        .then(res => {
          this.alert.message = "تم اعادة نشر الاعلان";
          this.alert.type = "info";
          this.schedule_start = null;
          this.selected = [];
          this.rescheduleDialog = false;
          this.getDataFromApi().then(data => {
            this.requests = data.items;
            this.totalRequests = data.total;
          });
        })
        .catch(({ response }) => {});
    },
    formatDateWithZone(given_date, formOrTo) {
      // first to get user diffrence from UTC + or - and minutes amount
      var offset = new Date().getTimezoneOffset().toString(); // exampel -120 for EG
      var opreator = offset.slice(0, 1);
      var minutes_amount = parseInt(offset.replace(opreator, ""));

      var dateString = given_date,
        dateTimeParts = dateString.split(" "),
        timeParts = dateTimeParts[1].split(":"),
        dateParts = dateTimeParts[0].split("-"),
        date,
        formatted_date;

      date = new Date(
        dateParts[0],
        parseInt(dateParts[1], 10) - 1,
        dateParts[2],
        timeParts[0],
        timeParts[1]
      );
      formatted_date =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes();
      //
      if (formOrTo == "from") {
        date.setMinutes(
          opreator == "-"
            ? date.getMinutes() - minutes_amount
            : date.getMinutes() + minutes_amount
        );
      } else if (formOrTo == "to") {
        date.setMinutes(
          opreator == "-"
            ? date.getMinutes() + minutes_amount
            : date.getMinutes() - minutes_amount
        );
      }

      formatted_date =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes();
      //
      return formatted_date;
    },
    changeProductNumbers() {
      this.getDataFromApi().then(data => {
        this.requests = data.items;
        this.totalRequests = data.total;
      });
      this.dialog == false;
    },
    fetchCountries() {
      this.$http.get("admin/country").then(res => {
        this.Countries = res.data.data;
      });
    },
    fetchCategories() {
      this.$http.get("admin/ads-category?paginate=1").then(res => {
        this.searchCategories = res.data;
        this.addEditCategories = res.data;
      });
    },
    specialize() {
      this.specializing = true;
      if (this.date)
        this.$http
          .post("/api/admin/specialize/" + this.selectedItem.product_id, {
            day: this.date,
            day_end: this.end_date
          })
          .then(res => {
            this.alert.message = "تم تمييز الاعلان";
            this.alert.type = "info";
            this.specializing = false;
            this.optionsDialog = false;
          })
          .catch(({ response }) => {
            this.specializing = false;
            this.optionsDialog = false;
          });
    },
    specialBtn(item) {
      this.optionsDialog = !this.optionsDialog;
      this.selectedItem = item;
      this.index = this.requests.indexOf(item);
      if (item.spec_products_day != null) {
        this.discrimint[0].value = true;
        this.date = item.spec_products_day.day;
        this.end_date = item.spec_products_day.end_date;
      }
    },
    watchers(item) {
      this.selectedItem = Object.assign({}, item);
      this.index = this.requests.indexOf(item);
      this.watchersDialog = true;
    },
    updateWatchers(item) {
      this.updatingWatchers = true;
      this.$http
        .put(
          "/api/admin/update-product-view/" +
            this.selectedItem.product_id +
            "?page=" +
            this.page,
          { views: this.selectedItem.views }
        )
        .then(res => {
          this.$set(this.requests, this.index, this.selectedItem);
          this.$set(this.requests, index, res.data.data[0]);
          this.alert.message = "تم بنجاح";
          this.alert.type = "info";
          this.updatingWatchers = false;
          this.watchersDialog = false;
        })
        .catch(({ response }) => {
          this.updatingWatchers = false;
          this.watchersDialog = false;
        });
    },
    fetch() {
      this.getDataFromApi().then(data => {
        this.requests = data.items;
        this.totalRequests = data.total;
      });
      if (this.loading) return;
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
            this.loading = false;
          }, 300);
          resolve({
            items,
            total
          });
        } else {


          let endpoint = "";
            if(this.filterCategory !== null && this.filterAdsType !== null ){
           endpoint = `admin/ads?is_admin=${this.filterAdsType}&ads_category_id=${this.filterCategory}&page=${page}`

          } else  if (this.filterCategory !== null) {
            endpoint = `admin/ads?ads_category_id=${this.filterCategory}&page=${page}`;

          } else   if (this.filterAdsType !== null) {
            endpoint = `admin/ads?is_admin=${this.filterAdsType}&page=${page}`;

          }else {
            endpoint = `admin/ads?page=${page}`;
          }

          this.$http.get(endpoint).then(res => {

            let items = res.data.data;
            const total = res.data.total;
            this.pagination.rowsPerPage = res.data.per_page;
            this.pagination.totalItems = res.data.total;
            // this.filterCategory = null;
            // this.filterAdsType = null;
            setTimeout(() => {
              this.loading = false;
            }, 300);
            resolve({
              items,
              total
            });
          });
        }
      });
    },
    selectImage() {
      document.getElementById("image_choose").click();
    },
    imageChanged() {
      if ($("#image_choose")[0].files && $("#image_choose")[0].files[0]) {
        var FR = new FileReader();
        FR.addEventListener("load", e => {
          $("#avatar").attr("src", e.target.result);
          this.editedItem.image = e.target.result;
        });
        FR.readAsDataURL($("#image_choose")[0].files[0]);
      }
    },
    editItem(item) {
      this.editedIndex = this.requests.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    stopItem(item) {
      this.disapprove = true;
      const index = this.requests.indexOf(item);
      if (confirm("هل انت متأكد من إيقاف الاعلان")) {
        this.$http
          .post(
            "api/admin/products/stop/" + item.product_id + "?page=" + this.page
          )
          .then(res => {
            this.getDataFromApi(res).then(data => {
              this.requests = data.items;
              this.totalRequests = data.total;
            });
            // this.requests.indexOf(index). =
            this.alert.message = "تم إيقاف الاعلان!";
            this.alert.type = "warning";
            this.disapprove = false;
          });
      } else {
        this.disapprove = false;
      }
    },
    reshareItem(item) {
      this.reshare = true;
      if (confirm("هل تريد اعادة مشاركة الاعلان ؟؟")) {
        this.$http
          .put(
            "api/admin/repost-product/" + item.product_id + "?page=" + this.page
          )
          .then(res => {
            this.getDataFromApi().then(data => {
              this.requests = data.items;
              this.totalRequests = data.total;
            });
            this.alert.message = "تم اعادة مشاركة الاعلان!";
            this.alert.type = "success";
            this.reshare = false;
          });
      } else {
        this.reshare = false;
      }
    },
    resumeItem(item) {
      this.disapprove = true;
      const index = this.requests.indexOf(item);
      if (confirm("هل تريد استئناف الاعلان؟")) {
        this.$http
          .post(
            "api/admin/products/resume/" +
              item.product_id +
              "?page=" +
              this.page
          )
          .then(res => {
            this.getDataFromApi(res).then(data => {
              this.requests = data.items;
              this.totalRequests = data.total;
            });
            this.alert.message = "تم استئناف الاعلان!";
            this.alert.type = "success";
            this.disapprove = false;
          });
      } else {
        this.disapprove = false;
      }
    },
    deleteItem(item) {
      this.deleting = true;
      const index = this.requests.indexOf(item);
      if (confirm("هل تريد مسح الاعلان؟")) {
        this.$http.delete(`admin/ads/${item.id}`).then(res => {
          this.getDataFromApi().then(data => {
            this.requests = data.items;
            this.totalRequests = data.total;
          });
          // this.requests.splice(index, 1)
          this.alert.message = "تم مسح الاعلان!";
          this.alert.type = "success";
          this.deleting = false;
        });
      } else {
        this.deleting = false;
      }
    },
    deleteImags(item) {
      this.deleting = true;
      const index = this.ads_images.indexOf(item);
      if (confirm("هل تريد مسح صورةالاعلان؟")) {
        this.$http.delete(`admin/ads/delete_images/${item.id}`).then(res => {
          this.ads_images.splice(index, 1);
          this.alert.message = "تم مسح صورة الاعلان!";
          this.alert.type = "success";
          this.deleting = false;
        });
      } else {
        this.deleting = false;
      }
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    closeAddEditDialog() {
      this.addEditDialog = false;
      this.ad = {
        id: null,
        title: null,
        phone: null,
        brief: null,
        ads_category_id: null,
        country_id: 0,
        special: 0,
        from: null,
        to: null
      };
    },
    changeSpicalState(special) {

      this.ad.special = special;

    },
    editing(item) {

      this.errors = [];
      this.addEditDialog = !this.addEditDialog;
      this.edit = true;
      this.ad.id = item.id;
      this.ad.title = item.title;
      this.ad.phone = item.phone;
      this.ad.brief = item.brief;
      this.ad.ads_category_id = item.ads_category_id;
      this.ad.country_id = item.country_id;
      this.ad.instagram_url = item.instagram_url;
      this.ad.twitter_url = item.twitter_url;
      this.ad.snap_chat_url = item.snap_chat_url;
      this.ad.whatsapp_number = item.whatsapp_number;
      this.ad.website_url = item.website_url;
      this.ad.is_admin = item.is_admin;
      // this.ad.link = item.link;
      this.ad.special = item.special === 1 ? true : false;
      this.ad.from =
        item.from === null
          ? new Date().toISOString().substr(0, 10)
          : new Date(item.from).toISOString().substr(0, 10);
      this.ad.to =
        item.to === null
          ? new Date().toISOString().substr(0, 10)
          : new Date(item.to).toISOString().substr(0, 10);
      this.index = this.requests.indexOf(item);
    },
    save() {
      const index = this.index;
      let image = this.$refs.image_input.files;
      if (typeof image == "undefined") image = null;
      let newformdata = new FormData();
      for (var i = 0; i < image.length; i++) {
        let file = image[i];
        newformdata.append("images[" + i + "]", file);
      }
      // if (image) newformdata.append("images", imageArr);
      if (this.ad.title) newformdata.append("title", this.ad.title);
      // if (this.ad.title_en)
      // newformdata.append("title_en", this.ad.title_en);

      if (this.ad.phone) newformdata.append("phone", this.ad.phone);
      if (this.ad.brief) newformdata.append("brief", this.ad.brief);
      if (this.ad.ads_category_id)
        newformdata.append("ads_category_id", this.ad.ads_category_id);
      if (this.ad.instagram_url)
        newformdata.append("instagram_url", this.ad.instagram_url);
      if (this.ad.twitter_url)
        newformdata.append("twitter_url", this.ad.twitter_url);
      if (this.ad.snap_chat_url)
        newformdata.append("snap_chat_url", this.ad.snap_chat_url);
      if (this.ad.whatsapp_number)
        newformdata.append("whatsapp_number", this.ad.whatsapp_number);
      if (this.ad.website_url)
        newformdata.append("website_url", this.ad.website_url);
      // if (this.ad.link)
      //   newformdata.append("link", this.ad.link);
      if (this.ad.country_id)
        newformdata.append("country_id", this.ad.country_id);
      if (this.ad.special) {
        newformdata.append("special", this.ad.special);
        if (this.ad.from) newformdata.append("from", this.ad.from);
        if (this.ad.to) newformdata.append("to", this.ad.to);
      } else {
        newformdata.append("special", 0);
        if (this.ad.from) newformdata.append("from", "");
        if (this.ad.to) newformdata.append("to", "");
      }
      this.ad.is_admin
        ? newformdata.append("is_admin", 1)
        : newformdata.append("is_admin", 0);

      const endpoint = this.edit ? `admin/ads/${this.ad.id}` : `admin/ads`;
      this.$http
        .post(endpoint, newformdata)
        .then(res => {



          // this.$set(this.requests, index, newformdata);
          this.alert.type = "warning";
          this.alert.message = this.edit
            ? `تم تعديل الإعلان`
            : `تم حفظ الإعلان`;
          this.close();
          this.errors = [];
          this.ad = {
            id: null,
            title: null,
            country_id: 0,
            ads_category_id: null,
            brief: null,
            special: 0,
            from: null,
            to: null
          };
          this.$refs.image_input.value = "";
          setTimeout(() => {
            this.addEditDialog = false;
          }, 300);
          this.edit = false;
          this.getDataFromApi().then(data => {
            this.requests = data.items;
            this.totalRequests = data.total;
          });
        })
        .catch(({ response }) => {
          this.errors = response.data.error;
        });
    },
    showImages(images) {
      this.imageDialog = true;
      this.ads_images = images;

    },
    ads_state(item) {
      this.$http
        .get(`admin/ads/changeState/${item.id}/${item.state}`)
        .then(res => {
          this.getDataFromApi().then(data => {
            this.requests = data.items;
            this.totalRequests = data.total;
          });
          // this.requests.splice(index, 1)

          if (res.data.data === 1) {
            this.alert.message = "تم تفعيل الاعلان";
          } else {
            this.alert.message = "تم وقف الاعلان";
          }
          this.alert.type = "success";
          this.deleting = false;
        });
    },
    ads_pin(item) {
      this.$http.put(`admin/ads/${item.id}/pin`).then(res => {
        this.getDataFromApi().then(data => {
          this.requests = data.items;
          this.totalRequests = data.total;
        });
        // this.requests.splice(index, 1)

        if (res.data.data === 1) {
          this.alert.message = "تم تثبيت الاعلان";
        } else {
          this.alert.message = "تم تثبيت الاعلان";
        }
        this.alert.type = "success";
        this.deleting = false;
      });
    },
    inc_views(item) {
      this.$http.put(`admin/ads/${item.id}/fake_views`).then(res => {
        this.getDataFromApi().then(data => {
          this.requests = data.items;
          this.totalRequests = data.total;
        });
        // this.requests.splice(index, 1)


        this.alert.message = "تم زيادة نسبه مشاهدةالاعلان";

        this.alert.type = "success";
        this.deleting = false;
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
.v-list__tile {
  height: 25px !important;
}
</style>
