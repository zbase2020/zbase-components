<template>
  <zbase-submenu :title="info && info.name" :info="info" :index="uniqueId">
    <!-- slot -->
    <template v-slot:icon>
      <div class="demom-menu__img">
        <img src="https://cn.vuejs.org/images/logo.png" alt="">
      </div>
    </template>
    <template v-slot:title>
      <div>{{info && info.name}}</div>
    </template>
    <!-- child -->
    <template v-for="(child, childIndex) in info.children">
      <demo-submenu
        :key="childIndex"
        v-if="child && Array.isArray(child.children) && child.children.length"
        :info="child"
      ></demo-submenu>
      <DemoMenuItem
        :key="childIndex"
        v-else
        :info="child"
      ></DemoMenuItem>
    </template>
  </zbase-submenu>
</template>

<script>
import { createGuid } from 'zbase-utils'
import DemoMenuItem from './index-item.vue'
export default {
  name: 'demo-submenu',
  components: {
    DemoMenuItem
  },
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      uniqueId: createGuid()
    }
  }
}
</script>

<style lang="scss">
.demom-menu__img {
  display: inline-block;
  width: 50px;
  height: 50px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
