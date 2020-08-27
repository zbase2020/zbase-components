<template>
  <zbase-menu-item :index="info && info.path" :title="info && info.name" :info="info">
    <template v-slot:icon>
      <div class="demom-menu__img">
        <img src="https://cn.vuejs.org/images/logo.png" alt="">
      </div>
    </template>
    <template v-slot:title>
      <div>
        {{info && info.name}}
      </div>
    </template>
  </zbase-menu-item>
</template>

<script>
export default {
  name: 'demo-menu-item',
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
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
