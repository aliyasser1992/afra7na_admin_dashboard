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
            @click="edit = false;errors=[];errors=[];ad={};isHttps = false;http = 'http://'"
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
                  <v-text-field v-model="ad.title_ar" label=" اسم الإعلان بالعربية" />
                  <v-text-field v-model="ad.title_en" label="اسم الإعلان بالانجليزية" />
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
                  <br />
                  <v-text-field
                    style="text-align: left !important;"
                    class="link"
                    :prefix="http"
                    v-model="ad.link"
                    label=" رابط الإعلان"
                  />
                  <v-switch v-model="isHttps" label="https" color="primary"></v-switch>
                  <!-- <v-select style="max-width:150px;height:32px" 
                        v-model="ad.ads_category_id" 
                        flat dense 
                        :items="[{title_ar:'الاقسام', id:null},...addEditCategories]" 
                        item-text="title_ar" item-value="id" 
                  />-->
                  <v-btn color="primary" @click="$refs.image_input.click()">
                    <v-icon>image</v-icon>صورة
                  </v-btn>
                  <input style="display:none" type="file" ref="image_input" />
                  <v-radio-group v-model="ad.flag">
                    <v-radio
                      v-for="(item,index) in flagTypes"
                      :key="index"
                      :label="`${item.name}`"
                      :value="item.id"
                    ></v-radio>
                  </v-radio-group>
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

      <!-- <v-text-field v-model="search" append-icon="search" label="بحث" single-line hide-details></v-text-field> -->
      <v-select
        style="height:42px;font-size: 11px"
        v-model="filter"
        flat
        dense
        :items="[{title_ar:'الدول', id:null},...Countries]"
        item-text="title_ar"
        item-value="id"
        label="الدول"
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
        <td class="text-xs-center" v-if="props.item.title_ar">{{ props.item.title_ar }}</td>
        <td class="text-xs-center" v-else>لا يوجد اسم</td>

        <td class="text-xs-center" v-if="props.item.title_en">{{ props.item.title_en }}</td>
        <td class="text-xs-center" v-else>لا يوجد اسم</td>

        <td
          class="text-xs-center"
          v-if="props.item.country.title_ar"
        >{{ props.item.country.title_ar }}</td>
        <td class="text-xs-center" v-else>لا يوجد اسم</td>

        <td class="text-xs-center" v-if="props.item.link">{{ props.item.link }}</td>
        <td class="text-xs-center" v-else>لا يوجد رابط</td>

        <td class="text-xs-center">
          <img
            style="cursor:pointer"
            @click="() => {media = [...props.item.media, {image:props.item.spec_image}];dialog = true;}"
            :src="`https://afr7na.com/public${props.item.image}`"
            alt="صورة الاعلان"
            title="صورة الاعلان"
            width="50px"
            height="50px"
          />
        </td>

        <td class="text-xs-center" v-if="props.item.flag===1">عند فتح التطبيق</td>
        <td class="text-xs-center" v-else-if="props.item.flag===2">عند فتح الاعلانات</td>
        <td class="text-xs-center" v-else-if="props.item.flag===3">عند فتح الاقسام</td>
        <td class="text-xs-center" v-else-if="props.item.flag===4">عند النقر ثلاث مرات داخل التطبيق</td>

        <td class="text-xs-center" v-if="props.item.view">{{ props.item.view }}</td>
        <td class="text-xs-center" v-else>0</td>

        <td class="justify-center layout px-0">
          <v-tooltip top>
            <v-btn slot="activator" icon flat color="red" @click="inc_views(props.item)">
              <v-icon class="mr-2 green--text">add</v-icon>
            </v-btn>
          </v-tooltip>
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
          </v-tooltip>

          <v-tooltip top>
            <v-btn slot="activator" icon flat color="red" @click="deleteItem(props.item)">
              <v-icon class="red--text">delete</v-icon>
            </v-btn>
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
    <v-dialog v-if="media.length" v-model="dialog" width="600" style="max-height:400px">
      <v-card>
        <v-carousel :circle="false" interval="600000">
          <v-carousel-item v-for="item in media" :key="item.id" color="primary">
            <img
              v-if="item.image"
              :src="`https://afr7na.com/publicitem.image`"
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
    flagTypes: [
      {
        id: 1,
        name: "عند فتح التطبيق"
      },
      {
        id: 2,
        name: "عند فتح الاعلانات"
      },
      {
        id: 3,
        name: "عند فتح الاقسام"
      },
      {
        id: 4,
        name: "بعد ثلاثة نقرات داخل التطبيق"
      }
    ],
    
    linkPrifix: "",
    http: "http://",

    isHttps: false,
    selected: [],
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
    Countries: [],
    ad: {
      id: null,
      title_ar: null,
      title_en: null,
      link: null,
      image: "",
      flag: 1,
      country_id: 0
    },
    headers: [
      {
        text: "الاسم بالعربية",
        align: "center",
        value: "country",
        sortable: false
      },
      {
        text: "الاسم بالانجليزية",
        align: "center",
        value: "country",
        sortable: false
      },
      {
        text: "اسم البلد",
        align: "center",
        value: "country",
        sortable: false
      },
      {
        text: "الرابط",
        align: "center",
        value: "link",
        sortable: false
      },
      {
        text: "صوره",
        align: "center",
        value: "image",
        sortable: false
      },
      {
        text: "علامة",
        align: "center",
        value: "flag",
        sortable: false
      },
      {
        text: "عدد المشاهدات",
        align: "center",
        value: "views",
        sortable: false
      },
      {
        text: "عمليات",
        align: "center",
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
    categories: [],
    searchCategories: [],
    addEditCategories: [],
    index: null,
    filter:null
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
       filterAdsType(val) {
      // console.log("filterAdsType", val);
      this.getDataFromApi().then(data => {
        this.requests = data.items;
        this.totalRequests = data.total;
      });
    },
    isHttps(val) {
      this.http = val == true ? "https://" : "http://";
    },
    addEditDialog(val) {
      if (!val) {
        this.ad = {
          id: null,
          title_ar: null,
          title_en: null,
          link: null,
          image: ""
        };
      }
      val || this.close();
    },
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
    filter(val) {
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
    this.getDataFromApi().then(data => {
      this.requests = data.items;
      this.totalRequests = data.total;
    });
  },
  mounted() {
    this.fetchCountries();
  },
  methods: {
    fetchCountries() {
      this.$http.get("admin/country").then(res => {
        this.Countries = res.data.data;
      });
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
      // console.log( 'date before', formatted_date);
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
      // console.log( 'date after', formatted_date );
      return formatted_date;
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
          const endpoint =
            this.filter != null
              ? `admin/flash-ads?country_id=${this.filter}&page=${page}`
              : `admin/flash-ads?page=${page}`;
          this.$http.get(endpoint).then(res => {
            console.log(this.selected);
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
    deleteItem(item) {
      this.deleting = true;
      const index = this.requests.indexOf(item);
      if (confirm("هل تريد مسح الاعلان؟")) {
        this.$http.delete(`admin/flash-ads/${item.id}`).then(res => {
          this.requests.splice(index, 1);
          this.alert.message = "تم مسح الاعلان!";
          this.alert.type = "success";
          this.deleting = false;
        });
      } else {
        this.deleting = false;
      }
    },
    close() {
      this.dialog = false;
      if (this.index != null) {
        this.requests[this.index].link = this.linkPrifix;
        // alert(this.requests[this.index].link)
      }
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    closeAddEditDialog() {
      this.addEditDialog = false;
      this.ad = {
        id: null,
        title_ar: null,
        title_en: null,
        ads_category_id: null
      };
      if (this.index != null) {
        this.requests[this.index].link = this.linkPrifix;
        // alert(this.requests[this.index].link)
      }
    },
    inc_views(item) {
      this.$http.put(`admin/flash-ads/${item.id}/add_views`).then(res => {
        this.getDataFromApi().then(data => {
          this.requests = data.items;
          this.totalRequests = data.total;
        });
        // this.requests.splice(index, 1)
        console.log(res.data);

        this.alert.message = "تم زيادة نسبه مشاهدةالاعلان";
        this.alert.type = "success";
        this.deleting = false;
      });
    },
    editing(item) {
      this.errors = [];
      // this.isHttps = 'http://';
      this.addEditDialog = !this.addEditDialog;
      this.edit = true;
      this.ad.id = item.id;
      this.ad.title_ar = item.title_ar;
      this.ad.title_en = item.title_en;
      this.ad.flag = item.flag;
      this.ad.country_id = item.country_id;
      //
      if (item.link.search("http://") > -1) {
        item.link = item.link.replace("http://", "");
        this.http = "http://";
        this.linkPrifix = `${this.http}${item.link}`;
        this.isHttps = false;
        this.ad.link = item.link;
      } else if (item.link.search("https://") > -1) {
        item.link = item.link.replace("https://", "");
        this.http = "https://";
        this.linkPrifix = `${this.http}${item.link}`;
        this.isHttps = true;
        this.ad.link = item.link;
      } else {
        this.http = "http://";
        this.linkPrifix = `${item.link}`;
        this.isHttps = false;
        this.ad.link = item.link;
      }

      this.index = this.requests.indexOf(item);
    },
    save() {
      const index = this.index;
      let image = this.$refs.image_input.files[0];
      if (typeof image == "undefined") image = null;
      let newformdata = new FormData();
      if (image) newformdata.append("image", image);
      if (this.ad.title_ar) newformdata.append("title_ar", this.ad.title_ar);
      if (this.ad.title_en) newformdata.append("title_en", this.ad.title_en);
      if (this.ad.link) this.ad.link = `${this.http}${this.ad.link}`;
      newformdata.append("link", this.ad.link);
      if (this.ad.flag) newformdata.append("flag", this.ad.flag);
      if (this.ad.country_id)
        newformdata.append("country_id", this.ad.country_id);
      const endpoint = this.edit
        ? `admin/flash-ads/${this.ad.id}`
        : `admin/flash-ads`;
      this.$http
        .post(endpoint, newformdata)
        .then(res => {
          // this.$set(this.requests, index, newformdata)
          this.alert.type = "warning";
          this.alert.message = this.edit
            ? `تم تعديل الإعلان`
            : `تم حفظ الإعلان`;
          this.close();
          this.errors = [];
          this.ad = {
            id: null,
            title_ar: null,
            title_en: null,
            link: null
          };
          this.http = "http://";
          this.isHttps = "false";
          this.$refs.image_input.value = "";
          setTimeout(() => {
            this.addEditDialog = false;
            this.getDataFromApi().then(data => {
              this.requests = data.items;
              this.totalRequests = data.total;
            });
          }, 300);
          this.edit = false;
        })
        .catch(({ response }) => {
          console.log(response);
          this.errors = response.data.error;
          setTimeout(() => {
            this.ad = {
              id: this.ad.id,
              title_ar: this.ad.title_ar,
              title_en: this.ad.title_en,
              link: this.ad.link.replace(this.http, "")
            };
          }, 200);
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
.link {
  text-align: left !important;
  direction: ltr !important;
}
/* .link > .v-input__control{
    text-align: left !important;
    direction: ltr !important;
  } */
</style>
