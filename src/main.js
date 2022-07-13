// developed by tahamostafa588@gmail.com
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'

import VueLocalStorage from 'vue-ls';
import Datetime from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'

import axios from 'axios'
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions'

import Navbar from './components/Navbar'
import VuetifyAlert from './components/helpers/VuetifyAlert'
import SearchSelect from './components/helpers/SearchSelect'

import 'vuetify/dist/vuetify.min.css'
import './stylus/main.styl'
import DatetimePicker from 'vuetify-datetime-picker'
import 'vuetify-datetime-picker/src/stylus/main.styl'

import baseURL from './components/config/baseurl'
import imageBaseUrl from './components/config/imageBaseUrl'
// import Notifications from "./components/pages/Notifications";
import ReadMore from 'vue-read-more';
import moment from 'moment';

Vue.prototype.moment = moment
Vue.prototype.$imageBaseUrl = 'http://afr7na.com/public'
// moment.locale('ar');

Vue.use(VueLocalStorage);
Vue.use(Datetime)
Vue.use(ReadMore);

Vue.use(Vuetify, {
  rtl: true,
  theme: {
    primary: '#EF6C00',
    secondary: '#FFCDD2',
    accent: '#3F51B5',
  }
})

Vue.component('nav-bar', Navbar)
Vue.component('vuetify-alert', VuetifyAlert)
Vue.component('search-select', SearchSelect)
// Vue.component("notifications", Notifications);

Vue.config.productionTip = false

// enhance the original axios adapter with throttle and cache enhancer

const http = axios.create({
  baseURL,
  headers: {
    "Cache-Control": "no-cache",
    Accept: "application/json"
  },
  // cache will be enabled by default
  adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
    enabledByDefault: false,
    cacheFlag: "useCache"
  })
});

// Vue.ls.set('token', localStorage.token)

http.defaults.headers.common['Authorization'] = 'Bearer ' + Vue.ls.get('token', null);

Vue.prototype.$http = http

Vue.use(DatetimePicker)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>',
  data: {
    baseURL,
    imageBaseUrl
  }
})
