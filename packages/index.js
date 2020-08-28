import MultiWindow from './multi-window'
import Menu from './menu'
import MenuItem from './menu/src/menu-item'
import Submenu from './menu/src/submenu'
import ZbaseTab from './tab'
import { Tab } from './tab'
import './reset.css'
import './base.css'
const components = [
  Menu,
  MenuItem,
  Submenu
]

const install = (Vue, opt) => {
  if (install.installed) return;
  components.map(component => Vue.component(component.name, component))
  Vue.use(MultiWindow, opt)
  Vue.use(ZbaseTab, opt)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  install,
  MultiWindow,
  Menu,
  MenuItem,
  Submenu,
  ZbaseTab,
  Tab
}

export default {
  install,
  MultiWindow,
  Menu,
  ZbaseTab,
  Tab
}
