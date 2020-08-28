import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import './reset.css';
import ZbaseComponents from '../packages'
Vue.use(ZbaseComponents, {
  tabName: 'ZBASE_TAB_A'
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
