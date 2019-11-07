import Vue from 'vue'
import App from './App.vue'

// vue plugins
import router from './router'
import store from './store'

// bootstrap
import './plugins/bootstrap-vue'
import './plugins/bv-custom.scss'

// firebase
import firebase from 'firebase/app'
import 'firebase/auth'

// form validation
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

Vue.config.productionTip = false

let app = null

firebase.initializeApp({
  apiKey: "AIzaSyD-XGzua3MLXvUjECoaGuUz9FE-wYgMnak",
  authDomain: "project-scimitar.firebaseapp.com",
  databaseURL: "https://project-scimitar.firebaseio.com",
  projectId: "project-scimitar",
  storageBucket: "project-scimitar.appspot.com",
  messagingSenderId: "752029733760",
  appId: "1:752029733760:web:23fcad9a7d731d7eeae765",
  measurementId: "G-SVQWSKW7KC"
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


