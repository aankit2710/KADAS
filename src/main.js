import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import ExportExcel from 'vue-excel-export'
import axios from 'axios'
import Vuex from 'vuex'
import VueCookies from 'vue-cookies'
import './plugins'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from "secure-ls"
const ls = new SecureLS({ isCompression: false })

Vue.config.productionTip = false

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    sessionData: [],
  },
  plugins: [createPersistedState(
    {
      storage: {
        getItem: key => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: key => ls.remove(key)
      }
    }
  )],
  mutations: {
    updateSessionData (state, data) {
      if (typeof data.token !== 'undefined') {
        state.sessionData.push({ token: data.token})
        state.sessionData.push({ user: data.user})  
      } else {
        state.sessionData = []
      }
    },
  }
})

new Vue({
  router,
  vuetify,
  ExportExcel,
  axios,
  store,
  VueCookies,
  render: h => h(App),
}).$mount('#app')
