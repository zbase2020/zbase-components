import Vue from "vue";
import VueRouter from "vue-router";
import { Tab } from '../../packages'
import Layout from '../views/layout/index.vue'
import multiWindow from "../views/multi-window/index.vue";
import menu from "../views/menu/index.vue";
import tabDemo from "../views/tab/index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: 'layout',
    component: Layout,
    children: [
      {
        path: '/menu',
        name: 'menu',
        component: menu
      },
      {
        path: '/tab',
        name: 'tab',
        component: tabDemo
      }
    ]
  },
  {
    path: '/multi-window',
    name: 'multi-window',
    component: multiWindow
  }
];

const router = new VueRouter({
  routes
});
const tab = Tab.getInstance()
router.afterEach(to => {
  tab.open(to)
})

export default router;
