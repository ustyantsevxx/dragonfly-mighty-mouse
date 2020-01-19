import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
Vue.config.productionTip = false

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/custom.scss'

import firebase from 'firebase/app'
import 'firebase/auth'

import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

// main:

firebase.initializeApp({
  apiKey: process.env.VUE_APP__FIREBASE_API,
  authDomain: "project-scimitar.firebaseapp.com",
  databaseURL: "https://project-scimitar.firebaseio.com",
  projectId: "project-scimitar",
  storageBucket: "project-scimitar.appspot.com",
  messagingSenderId: process.env.VUE_APP__FIREBASE_MSI,
  appId: process.env.VUE_APP__FIREBASE_APPID,
  measurementId: process.env.VUE_APP__FIREBASE_MESID
})

let app

firebase.auth().onAuthStateChanged(async user => {
  let userData

  if (user) {
    userData = await firebase.firestore().collection('users').doc(user.uid).get()
    userData = userData.data()
  }

  store.commit('setAuthData', user)
  store.commit('setUserData', userData)

  if (!app)
    app = new Vue({
      router,
      store,
      render: x => x(App)
    }).$mount('#app')
})