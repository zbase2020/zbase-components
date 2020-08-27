import Vue from "vue";
import VueRouter from "vue-router";
import Layout from '../views/layout/index.vue'
import multiWindow from "../views/multi-window/index.vue";
import menu from "../views/menu/index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: 'layout',
    component: Layout,
    children: [
      {
        path: '/multi-window',
        name: 'multi-window',
        component: multiWindow
      },
      {
        path: '/menu',
        name: 'menu',
        component: menu
      }
    ]
  },
];

const router = new VueRouter({
  routes
});

export default router;
