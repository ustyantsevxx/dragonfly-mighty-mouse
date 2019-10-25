import Vue from 'vue'

// vue plugins
import App from './App.vue'
import router from './router'
import store from './store'

// bootstrap
import './plugins/bootstrap-vue'

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
  if (user)
    userData = await firebase.firestore().collection('users').doc(user.uid).get()

  store.commit('setAuthData', user)
  store.commit('setUserData', userData ? userData.data() : null)

  if (!app) {
    app = new Vue({
      router,
      store,
      render: vue => vue(App)
    }).$mount('#app')
  }

  // eslint-disable-next-line
  console.log(`%c//user status fetched:\n\n`, 'color: white; background: black', user, "\n", userData ? userData.data() : null)
})


