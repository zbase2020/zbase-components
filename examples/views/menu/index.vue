<template>
  <div class="demom-wrap">
    <!-- logo
    <div class="demom-menu">
      <zbase-menu ref="menu" :default-active="active">
        <template
          v-for="(item, index) in lists"
        >
          <DemoSubmenu
            v-if="item.children && Array.isArray(item.children) && item.children.length"
            :key="index"
            :info="item"
          >
          </DemoSubmenu>
          <DemoMenuItem
            v-else
            :key="index"
            :info="item"
          ></DemoMenuItem>
        </template>
      </zbase-menu>
    </div> -->
    这里是菜单
  </div>
</template>

<script>
// import DemoSubmenu from './index-sub'
// import DemoMenuItem from './index-item'
export default {
  components: {
    // DemoSubmenu,
    // DemoMenuItem
  },
  data () {
    return {
      active: '',
      lists: [
        {
          name: '多窗口',
          path: '/multi-window',
          children: [
            {
              name: '窗口1',
              path: '/1'
            }
          ]
        },
        {
          name: '菜单',
          path: '/menu',
          children: []
        }
      ]
    }
  },
  watch: {
    // 监听路由 控制侧边栏激活状态
    '$route': {
      handler ({ fullPath }) {
        this.active = fullPath
        this.$nextTick(() => {
          if (this.$refs.menu) {
            this.$refs.menu.activeIndex = fullPath
          }
        })
      },
      immediate: true
    }
  }
}
</script>
