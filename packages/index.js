import MultiWindow from './multi-window'
import Menu from './menu'
import MenuItem from './menu/src/menu-item'
import Submenu from './menu/src/submenu'
import './reset.css'
import './base.css'

const components = [
  Menu,
  MenuItem,
  Submenu
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
  MultiWindow,
  Menu,
  MenuItem,
  Submenu
}

export default {
  install,
  MultiWindow,
  Menu
}
