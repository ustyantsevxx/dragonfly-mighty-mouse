import Vue from 'vue'
import App from './App.vue'

// vue
import router from './router'
import store from './store'

// bootstrap
import './plugins/bootstrap-vue'
import '@/assets/custom.scss'
// firebase
import firebase from 'firebase/app'
import 'firebase/auth'

// validation
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

Vue.config.productionTip = false

let app = null

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
      render: vue => vue(App)
    }).$mount('#app')
})