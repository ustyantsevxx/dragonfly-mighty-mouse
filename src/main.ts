import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store/index'
import { isMobile } from '@/utils'
import { mobileClass } from '@/directives'
import UserModule from '@/store/user.module'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'

import Vuelidate from 'vuelidate'

import 'file-icons-js/css/style.css'
import '@/assets/scss/global.scss'
import '@/registerServiceWorker'

Vue.config.productionTip = false
Vue.prototype.isMobile = isMobile
Vue.directive('mobile-class', mobileClass)
Vue.use(Vuelidate)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

firebase.initializeApp({
  apiKey: process.env.VUE_APP__FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP__FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP__FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP__FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP__FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP__FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP__FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP__FIREBASE_MEASUREMENT_ID
})

export const FIRESTORE = firebase.firestore()
export const STORAGE = firebase.storage()
export const AUTH = firebase.auth()

let app: any

AUTH.onAuthStateChanged(async user => {
  await UserModule.SetUser(user)
  if (!app)
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
})
