import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/pages/Login'
// import Requests from '@/components/pages/Requests'
// import Ads from '@/components/pages/Ads'
// import CategoriesLink from '@/components/pages/CategoriesLink'
// import Countries from '@/components/pages/Countries'
// import Others from '@/components/pages/Others'
// import RenamingCategories from '@/components/pages/RenamingCategories'
// import CommericalRequests from '@/components/pages/CommericalRequests'
// import CommericalCategories from '@/components/pages/CommericalCategories'
// import CommericalSettings from '@/components/pages/CommericalSettings'
// import SpecialProductsOrders from '@/components/pages/SpecialProductsOrders'
// import Packages from '@/components/pages/Packages'
// import Users from '@/components/pages/Users'
import baseURL from '@/components/config/baseurl'

function loadView(view) {
  console.log('view',view)
  return () => import(`@/views/${view}.vue`)
}

import axios from 'axios';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: loadView('admins/Login'),
      meta: {
        guest: true,
      }
    },
    {
      path: '/admins',
      name: 'Admins',
      component: loadView('admins/Admins'),
      secure: true,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/events',
      name: 'Events',
      component: loadView('events/Events'),
      secure: true,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/ask-special-event',
      name: 'AskSpecialEvents',
      component: loadView('events/AskSpecialEvents'),
      secure: true,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/events-categories',
      name: 'EventsCategories',
      component: loadView('events/EventsCategories'),
      secure: true,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/notifications',
      name: 'Notifications',
      component: loadView('notifications/Notifications'),
      secure: true,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/ads',
      name: 'Ads',
      component: loadView('ads/Ads'),
      secure: true,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/ads-categories',
      name: 'AdsCategories',
      component: loadView('ads/AdsCategories'),
      secure: true,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/flash-ads',
      name: 'FlashAds',
      component: loadView('ads/FlashAds'),
      secure: true,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/main-categories',
      name: 'MainCategories',
      component: loadView('MainCategories'),
      secure: true,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/countries',
      name: 'Countries',
      component: loadView('areas/Countries'),
      secure: true,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/regions',
      name: 'Regions',
      component: loadView('areas/Regions'),
      secure: true,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/customer_service',
      name: 'CustomerService',
      component: loadView('settings/CustomerService'),
      secure: true,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/pages',
      name: 'Pages',
      component: loadView('settings/Pages'),
      secure: true,
      meta: {
        requiresAuth: true,
      }
    },
  ]
})



router.beforeEach((to, from, next) => {
  console.log(localStorage.getItem('admin'));

  if(to.matched.some(record => record.meta.requiresAuth)) {
      if (localStorage.getItem('admin') == null) {
          window.location.href = '/login'
      } else {
          next()
      }
  } else if(to.matched.some(record => record.meta.guest)) {
      if(localStorage.getItem('admin') == null){
          next()
      }
      else{
          next({ name: 'Events'})
      }
  }else {
      next()
  }
})


// router.beforeEach((to, from, next) => {

//   if(to.matched.some(record => record.meta.secure)) {
//     if (localStorage.getItem('admin') == null || !localStorage.getItem('admin')) {
//         window.location.href = '/login'
//     } else {
//         next()
//     }
//   } else if(to.matched.some(record => record.meta.guest)) {
//     if(localStorage.getItem('admin') == null){
//         next()
//     }
//     else{
//         next({ name: 'Events'})
//     }
//   }else {
//       next()
//   }
// })


// router.beforeEach((to, from, next) => {
//   router.options.routes.forEach((route) => {
//     // If this is the current route and it's secure
//     if (to.matched[0].path === route.path && route.secure) {
//       axios.get(baseURL + 'api/admin/check')
//       .catch((e) => {
//         if(e.response.data == 'unauthenticated'){
//           Vue.ls.set('token', null)
//           return next('/login');
//         }
//       })
//     }
//   });
//   next()
// })

export default router;
