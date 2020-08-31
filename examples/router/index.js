import Vue from "vue";
import VueRouter from "vue-router";
import config from '../config'
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
    redirect: '/test',
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
      },
      {
        path: '/test',
        name: 'test',
        meta: {
          title: '测试'
        },
        component: resolve => require(['../views/test/index.vue'], resolve)
      },
      {
        path: '/test-before',
        name: 'test-before',
        meta: {
          title: '测试前'
        },
        component: resolve => require(['../views/test/test-before'], resolve)
      },
      {
        path: '/test-on',
        name: 'test-on',
        meta: {
          title: '测试中'
        },
        component: resolve => require(['../views/test/test-on'], resolve)
      },
      {
        path: '/test-after',
        name: 'test-after',
        meta: {
          title: '测试后'
        },
        component: resolve => require(['../views/test/test-after'], resolve)
      },
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
const tab = Tab.getInstance(config.index)
router.afterEach(to => {
  tab.open(to)
})

export default router;
