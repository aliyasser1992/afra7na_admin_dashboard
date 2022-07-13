<template>
  <div class="elevation-2">
    <vuetify-alert @message="alert.message = ''" :message="alert.message" />
    <v-toolbar flat color="white">
      <v-toolbar-title class>
        <v-icon medium>{{icon}}</v-icon>
        {{title}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-tooltip top slot="activator">
          <v-btn
            slot="activator"
            color="primary"
            fab
            dark
            small
            class="mb-2"
            @click="edit = false,errors = []"
          >
            <v-icon>add</v-icon>
          </v-btn>
          <span>إضافة اشعار جديد</span>
        </v-tooltip>

        <!-- <v-btn slot="activator" color="primary" dark class="mb-2" @click="edit = false"> <v-icon>add</v-icon>إضافة دولة</v-btn> -->
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
                  <v-text-field v-model="notificationsForm.text" label="الاشعار" />
                  <v-select
                    style="height:42px;font-size: 11px"
                    v-model="notificationsForm.country_id"
                    flat
                    dense
                    :items="[{title_ar:'الدول', id:null},...Countries]"
                    item-text="title_ar"
                    item-value="id"
                    label="الدول"
                    v-on:change="fetchRegionByCountryId(`${notificationsForm.country_id}`)"
                  />
                  <v-select
                    style="height:42px;font-size: 11px"
                    v-model="notificationsForm.region_id"
                    flat
                    dense
                    :items="[{title_ar:'المناطق', id:null},...Region]"
                    item-text="title_ar"
                    item-value="id"
                    label="المناطق"
                    :disabled="regin_disabled"
                  />
                  <v-checkbox
                    v-model="regin_disabled"
                    class="mx-2"
                    label="ارسال الى كل المناطق التابعة للدولة"
                  ></v-checkbox>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color class="ma-2" small @click.native="close">الغاء</v-btn>
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
      :pagination.sync="pagination"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-right">{{ props.item.text }}</td>
        <td class="text-xs-right">{{ props.item.title_ar }}</td>
        <td class="text-xs-right" v-if="props.item.region_title">{{ props.item.region_title }}</td>
        <td class="text-xs-right" v-else>جميع المناطق</td>
        <td class="justify-right layout px-0">
          <v-tooltip top>
            <v-btn
              slot="activator"
              icon
              :loading="disapprove"
              flat
              color="red"
              @click="deletenNotification(props.item)"
            >
              <v-icon class="mr-2 red--text">delete</v-icon>
            </v-btn>
            <span>مسح الاشعار</span>
          </v-tooltip>
        </td>
      </template>

      <!-- <v-alert slot="no-results" :value="true" color="error" icon="warning">
            لا يوجد نتائج للبحث "{{search}}"
        </v-alert>
        <template slot="pageText" slot-scope="props">
          الصفحات {{ props.pageStart }} - {{ props.pageStop }} من {{ props.itemsLength }}
        </template>
        <template slot="no-data">
          <v-alert :value="true" color="success" icon="warning" outline>
            لا يوجد دول
          </v-alert>
      </template>-->
    </v-data-table>

    <div class="text-xs-center pt-2">
      <v-pagination total-visible="100" color="primary" v-model="page" :length="pages"></v-pagination>
    </div>
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
    regin_disabled: false,
    errors: [],
    notificationsForm: {
      id: null,
      text: "",
      country_id: 0,
      region_id: 0
    },
    edit: false,
    dialog: false,
    deleteDialog: false,
    forceDelete: false,
    selectedItem: null,
    requests: [],
    Countries: [],
    Region: [],
    totalRequests: 0,
    pagination: {},
    search: "",
    loading: false,
    disapprove: false,
    approve: false,
    headers: [
      {
        text: "الاشعار",
        align: "right",
        value: "text",
        sortable: false
      },
      {
        text: "البلد",
        align: "right",
        value: "title_ar",
        sortable: false
      },
      {
        text: "المدينة",
        align: "right",
        value: "title_ar",
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
    index: null
    // filterCategory: null,
    // categories: []
  }),
  computed: {
    formTitle() {
      return "اضافة اشعار";
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

  mounted() {
    this.fetch();
    this.fetchCountries();
  },
  methods: {
    fetch() {
      this.$http.get("admin/get_notifications").then(res => {
        console.log(res.data.data);
        this.requests = res.data.data;
        this.totalRequests = this.requests.length;
      });
    },
    fetchCountries() {
      this.$http.get("admin/country").then(res => {
        this.Countries = res.data.data;
      });
    },
    fetchRegionByCountryId(id) {
      console.log("country_id", id);
      this.$http.get(`admin/fetch_region/${id}`).then(res => {
        console.log(res.data.data);
        this.Region = res.data.data;
      });
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = -1;
      }, 300);
      this.notificationsForm = {
        id: null,
        text: "",
        country_id: 0,
        region_id: 0
      };
    },
    save() {
      console.log(this.notificationsForm);
      this.$http
        .post("admin/ads_notifications", this.notificationsForm)
        .then(res => {
          console.log(res.data.data);
          this.requests.push(res.data.data);
          this.alert.message = "تم ارسال اشعار جديد بنجاح !";
          this.alert.type = "success";
          this.close();
        });
    },
    deletenNotification(item) {
      this.deleting = true;
      const index = this.requests.indexOf(item);
      if (confirm("هل تريد مسح الاشعار")) {
        this.$http.delete(`admin/delete_notifications/${item.id}`).then(res => {
          this.requests.splice(index, 1);
          this.alert.message = "تم مسح الاشعار!";
          this.alert.type = "success";
          this.deleting = false;
        });
      } else {
        this.deleting = false;
      }
    }
  }
};
</script>