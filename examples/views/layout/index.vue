<template>
  <div class="demolayout-wrap">
    <div class="demolayout-menu">
      <zbase-menu ref="menu" :default-active="active" @select="handleMenuSelect">
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
    </div>
    <ZbaseTabBox :dbName="$pageConfig && $pageConfig.dbName"></ZbaseTabBox>
    <router-view></router-view>
  </div>
</template>

<script>
import DemoSubmenu from '../menu/index-sub'
import DemoMenuItem from '../menu/index-item'
export default {
  components: {
    DemoSubmenu,
    DemoMenuItem
  },
  data () {
    return {
      active: '',
      lists: [
        {
          name: '多窗口',
          path: '/safs',
          children: [
            {
              name: '窗口1',
              path: '/multi-window'
            },
            {
              name: '窗口2',
              path: '/sdfsdf345422',
              children: [
                {
                  name: '窗口2.1',
                  path: 'tab'
                },
                {
                  name: '窗口2.2',
                  path: '/tab'
                }
              ]
            }
          ]
        },
        {
          name: '菜单',
          path: '/menu',
          children: []
        },
        {
          name: '测试',
          path: '/test',
          children: [
            {
              name: '测试-前',
              path: '/test-before'
            },
            {
              name: '测试-中',
              path: '/test-on',
              children: [
                {
                  name: '测试-后',
                  path: '/test-after'
                },
              ]
            },
          ]
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
  },
  methods: {
    handleMenuSelect (index, item) {
      console.log('index', index)
      this.$router.push(index)
    }
  }
}
</script>

<style lang="scss">
.demolayout-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  padding-left: 150px;
  box-sizing: border-box;
  .demolayout-menu {
    background: #222945;
    position: absolute;
    left: 0;
    top: 60px;
    bottom: 0;
    width: 150px;
  }
}
</style>
