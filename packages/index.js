import MultiWindow from './multi-window'
import './reset.css'

const components = [
]

const install = Vue => {
  if (install.installed) return;
  components.map(component => Vue.component(component.name, component))
  Vue.use(MultiWindow)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  install,
  MultiWindow
}

export default {
  install,
  MultiWindow
}
