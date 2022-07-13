<template>
  <v-app id="inspire" style="overlay:hidden">
    <v-navigation-drawer color="primary" right v-model="drawer" app temporary fixed>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <img src="../assets/logo.png" style="width: 100px" />
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list>
        <template v-for="item in items">
          <v-layout v-if="item.heading" :key="item.heading" row align-center>
            <v-flex xs6>
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>

          <v-list-group
            v-else-if="item.children"
            v-model="item.model"
            :key="item.text"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="(child, i) in item.children" :key="i" :to="child.url">
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ child.text }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ child.subtext }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>

          <v-list-tile v-else :key="item.title" :to="item.url">
            <v-list-tile-action class="grey--text text--darken-2">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title
                class="subheading text-xs-right grey--text text--darken-2"
                v-html="item.text"
              ></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="primary" dark app fixed>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">لوحة التحكم</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <v-btn icon slot="activator" @click="changePasswordDialog = !changePasswordDialog">
          <v-icon>lock</v-icon>
        </v-btn>
        <span>تغيير كلمة السر</span>
      </v-tooltip>

      <v-tooltip bottom>
        <v-btn icon slot="activator" @click="logout">
          <v-icon>logout</v-icon>
        </v-btn>
        <span>تسجيل الخروج</span>
      </v-tooltip>
    </v-toolbar>

    <v-content>
      <slot></slot>
    </v-content>

    <v-dialog v-model="countryDialog" width="400px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">تغيير الدولة الافتراضية</v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-radio-group v-model="radioGroup">
              <v-radio
                v-for="country in countries"
                :key="country.country_id"
                :label="country.title_ar"
                :value="country.country_id"
              ></v-radio>
            </v-radio-group>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="countryDialog = false">اغلاق</v-btn>
          <v-btn flat @click="updateDefaultCountry" :loading="resetting">حفظ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="changePasswordDialog" width="400px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">تغيير كلمة المرور</v-card-title>
        <v-alert
          v-if="newPassSuccess"
          :value="true"
          outline
          color="success"
          icon="check_circle"
        >تم تغيير كلمة السر بنجاح</v-alert>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <!-- <v-flex xs12>
                        <v-text-field v-model="user.old_password" prepend-icon="account_box" placeholder="اسم المستخدم"></v-text-field>
            </v-flex>-->
            <v-flex xs12>
              <v-text-field
                v-model="user.old_password"
                :append-icon="showOldPassword ? 'visibility_off' : 'visibility'"
                :type="showOldPassword ? 'text' : 'password'"
                @click:append="showOldPassword = !showOldPassword"
                prepend-icon="lock"
                placeholder="كلمة المرور القديمة"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="user.new_password"
                :append-icon="showNewPassword ? 'visibility_off' : 'visibility'"
                :type="showNewPassword ? 'text' : 'password'"
                @click:append="showNewPassword = !showNewPassword"
                prepend-icon="lock"
                placeholder="كلمة المرور الجديدة"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color class="ma-2" small @click="changePasswordDialog = false">اغلاق</v-btn>
          <v-btn
            color="primary"
            class="ma-2"
            dark
            small
            @click="resetPassword"
            :loading="resetting"
          >حفظ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    changePasswordDialog: false,
    newPassSuccess: false,
    drawer: null,
    showOldPassword: false,
    showNewPassword: false,
    resetting: false,
    radioGroup: "",
    countryDialog: false,
    default_country: 0,
    countries: [],
    errors: [],
    user: {
      old_password: null,
      new_password: null
    },
    items: [
      {
        icon: "supervisor_account",
        "icon-alt": "supervisor_account",
        text: "المديرين",
        children: [
          {
            icon: "supervisor_account",
            text: "المديرين",
            url: "/admins",
            subtext: "إضافة | حذف | تعديل"
          }
        ]
      },
      {
        icon: "supervisor_account",
        "icon-alt": "layers",
        text: "الأحداث",
        children: [
          {
            icon: "list",
            text: "الأحداث",
            url: "/events",
            subtext: "تنشيط | تعطيل | حذف"
          },
          {
            icon: "stars",
            text: "طلبات التمييز",
            url: "/ask-special-event",
            subtext: "طلبات الموافقه على الأحداث المميزة"
          },
          {
            icon: "ballot",
            text: "التصنيفات",
            url: "/events-categories"
          }
        ]
      },
      {
        icon: "devices_other",
        "icon-alt": "layers",
        text:'الاشعارات',
         children: [
          {
            icon: "list",
            text: " ارسال الاشعارات",
            url: "/notifications",
          
          },
          ]
      },
      {
        icon: "devices_other",
        "icon-alt": "layers",
        text: "الإعلانات",
        children: [
          {
            icon: "devices_other",
            text: "الإعلانات",
            url: "/ads"
          },
          {
            icon: "ballot",
            text: "التصنيفات",
            url: "/ads-categories"
          }
        ]
      },
      {
        icon: "devices_other",
        text: " اعلانات الفلاش",
        url: "/flash-ads"
      },
      {
        icon: "language",
        "icon-alt": "my_location",
        text: "المناطق",
        children: [
          {
            icon: "language",
            text: "الدول",
            url: "/countries"
          },
          {
            icon: "my_location",
            text: "المناطق",
            url: "/regions"
          }
        ]
      },
      {
        icon: "settings_applications",
        "icon-alt": "settings_applications",
        text: "التحكم",
        children: [
          {
            icon: "phone",
            text: "خدمة العملاء",
            url: "/customer_service"
          },
          {
            icon: "phone_android",
            text: "الصفحات",
            url: "/pages"
          }
        ]
      }
    ]
  }),
  props: {
    source: String
  },

  created() {
    //   this.user.username = this.$ls.get('username');
    //   this.radioGroup = this.$ls.get('country_id')
    //   this.fetchCountries()
  },
  methods: {
    // fetchCountries() {
    //   this.$http.get('api/countries')
    //   .then( (res) => {

    //    this.countries=res.data
    //   })
    // },
    updateDefaultCountry() {
      if (this.resetting) return;
      this.resetting = true;
      this.default_country = this.radioGroup;
      this.$http
        .post("api/admin/updateDefaultCountry", {
          default_country: this.default_country
        })
        .then(res => {
          this.$ls.set("country_id", this.radioGroup, 24 * 60 * 60 * 1000);
          this.countryDialog = false;

          this.resetting = false;
        });
    },
    logout() {
      // this.$ls.set('token', null)
      // this.$ls.set('admin', null)
      // this.$http.get('api/admin/logout');
      // this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + null;
      // this.$router.push('/login')
      // //////
      this.$http
        .post("api/auth/logout")
        .then(res => {
          this.$ls.remove("token", null);
          this.$ls.remove("admin", null);
          this.$http.defaults.headers.common["Authorization"] =
            "Bearer " + null;
          window.location.href = "/";
        })
        .catch(({ res }) => {
          this.$ls.remove("token", null);
          this.$ls.remove("admin", null);
          this.$http.defaults.headers.common["Authorization"] =
            "Bearer " + null;
          window.location.href = "/";
        });
      // /////
    },
    resetPassword() {
      if (this.resetting) return;
      this.resetting = true;
      this.$http
        .post("admin/reset_password", this.user)
        .then(res => {
          // const token = res.data;
          // this.$ls.set('token', token, 24 * 60 * 60 * 1000);
          // this.$ls.set('username', this.user.username, 24 * 60 * 60 * 1000);
          // this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
          this.changePasswordDialog = false;
          this.newPassSuccess = true;
          setTimeout(() => {
            this.resetting = false;
          }, 300);
          this.newPassSuccess = false;
        })
        .catch(e => {
          console.log(e);

          if (e.response.data.error.username) {
            alert("اسم المستخدم مطلوب");
          } else if (e.response.data.error.password) {
            alert("الرقم السرى مطلوب");
          } else {
            alert("حدث خطأ");
          }
          this.resetting = false;
        });
    }
  }
};
</script>
<style scoped>
.v-list__tile__content {
  text-align: right !important;
}
.v-list__tile__title {
  text-align: right !important;
}
.active {
  color: blue;
}
</style>