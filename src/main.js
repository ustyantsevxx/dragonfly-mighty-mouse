import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { isMobile } from '@/assets/js/functions'
import { mobileClass } from '@/directives'

Vue.config.productionTip = false
Vue.prototype.isMobile = isMobile
Vue.directive('mobile-class', mobileClass)

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'

import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

import 'file-icons-js/css/style.css'
import '@/assets/scss/global.scss'
import '@/registerServiceWorker'

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

export const storage = firebase.storage()
export const auth = firebase.auth()

let app

auth.onAuthStateChanged(async user => {
  let userData

  if (user) {
    userData = await db.collection('users').doc(user.uid).get()
    userData = userData.data()
  }
  store.commit('setAuthData', user)
  store.commit('setUserData', userData)

  if (!app)
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
})
