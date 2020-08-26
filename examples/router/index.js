import Vue from "vue";
import VueRouter from "vue-router";
import multiWindow from "../views/multi-window/index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/multi-window"
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

export default router;
