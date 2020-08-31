import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import './reset.css';
import ZbaseComponents from '../packages'
import config from './config'
Vue.use(ZbaseComponents, config.index)
Vue.prototype.$pageConfig = config.index
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
