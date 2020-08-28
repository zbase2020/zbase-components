<template>
  <div class="zbase-tab" flex>
    <div class="zbase-tab__main" flex-box="1">
      <el-tabs
        class="zbase-tab__lists"
        :value="tab && tab.current"
        type="card"
        :closable="true"
        @tab-click="handleClick"
        @edit="handleTabsEdit"
        @contextmenu.native="handleContextmenu"
      >
        <el-tab-pane
          v-for="page in lists"
          :key="page.fullPath"
          :label="page.meta.title || '未命名'"
          :name="page.fullPath"
        />
      </el-tabs>
    </div>
    <div
      class="zbase-tab__tool"
      flex-box="0"
    >
      <p
        class="zbase-tab__toolbtn"
        title="关闭全部"
        @click="closeAll(true)"
      >
        <i class="el-icon-circle-close"></i>
      </p>
      <el-dropdown
        size="default"
        @command="handleControlItemClick"
      >
        <p class="zbase-tab__toolbtn">
          <i class="el-icon-s-unfold"></i>
        </p>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="refresh">
            <i class="el-icon-refresh"></i>
            刷新页面
          </el-dropdown-item>
          <el-dropdown-item command="left">
            <i class="el-icon-back"></i>
            关闭左侧
          </el-dropdown-item>
          <el-dropdown-item command="right">
            <i class="el-icon-right"></i>
            关闭右侧
          </el-dropdown-item>
          <el-dropdown-item command="other">
            <i class="el-icon-close"></i>
            关闭其它
          </el-dropdown-item>
          <!-- <el-dropdown-item command="all">
            全部关闭
          </el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { Tab } from '../index'
import Vue from 'vue';
import 'element-ui/lib/theme-chalk/tabs.css';
import 'element-ui/lib/theme-chalk/dropdown.css';
import 'element-ui/lib/theme-chalk/dropdown-menu.css';
import 'element-ui/lib/theme-chalk/dropdown-item.css';
import 'element-ui/lib/theme-chalk/icon.css';
import { Dropdown, DropdownMenu, DropdownItem, Tabs, TabPane, Icon } from 'element-ui';
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Icon)
export default {
  name: 'ZbaseTabBox',
  props: {
    tabName: {
      default: 'ZBASE_TAB',
      validator: val => typeof val === 'string'
    }
  },
  data () {
    return {
      tab: null,
      lists: [],
      contextmenuFlag: false,
      contentmenuX: 0,
      contentmenuY: 0,
      contextmenuListIndex: [
        { icon: 'times-circle', title: '关闭全部', value: 'all' }
      ],
      contextmenuList: [
        { icon: 'arrow-left', title: '关闭左侧', value: 'left' },
        { icon: 'arrow-right', title: '关闭右侧', value: 'right' },
        { icon: 'times', title: '关闭其它', value: 'other' },
        { icon: 'times-circle', title: '关闭全部', value: 'all' }
      ],
      tagName: '/index',
      opened: [],
      current: ''
    }
  },
  computed: {
  },
  methods: {
    close (params) {
      this.tab.close(params)
    },
    closeLeft (params) {
      this.tab.closeLeft(params)
    },
    closeRight (params) {
      this.tab.closeRight(params)
    },
    closeOther (params) {
      this.tab.closeOther(params)
    },
    closeAll (goIndex) {
      this.tab.closeAll(goIndex)
    },
    handleContextmenu (event) {
      let target = event.target
      let flag = false
      if (target.className.indexOf('el-tabs__item') > -1) flag = true
      else if (target.parentNode.className.indexOf('el-tabs__item') > -1) {
        target = target.parentNode
        flag = true
      }
      if (flag) {
        event.preventDefault()
        event.stopPropagation()
        this.contentmenuX = event.clientX
        this.contentmenuY = event.clientY
        this.tagName = target.getAttribute('aria-controls').slice(5)
        this.contextmenuFlag = true
      }
    },
    /**
     * @description 右键菜单的row-click事件
     */
    contextmenuClick (command) {
      this.handleControlItemClick(command, this.tagName)
    },
    /**
     * @description 接收点击关闭控制上选项的事件
     */
    handleControlItemClick (command, tagName = null) {
      if (this.tagName) {
        this.contextmenuFlag = false
      }
      // const params = {
      //   pageSelect: this.tagName
      // }

      switch (command) {
        case 'refresh':
          this.pageRefresh()
          break
        case 'left':
          this.closeLeft()
          break
        case 'right':
          this.closeRight()
          break
        case 'other':
          this.closeOther()
          break
        case 'all':
          this.closeAll(true)
          break
        default:
          this.$message.error('无效的操作')
          break
      }
    },
    /**
     * @description 接收点击 tab 标签的事件
     */
    handleClick (tab, event) {
      this.$router.push(tab && tab.name)
    },
    /**
     * @description 点击 tab 上的删除按钮触发这里 首页的删除按钮已经隐藏 因此这里不用判断是 index
     */
    handleTabsEdit (tagName, action) {
      if (action === 'remove') {
        this.close({
          tagName
        })
      }
    },
    // 刷新当前页面
    pageRefresh () {
      setTimeout(() => {
        this.$emit('reload')
      }, 100)
    },
    goOther (item) {
      this.$router.push(item.fullPath)
    },
    handleOn () {
      this.tab.on('change', (e) => {
        this.lists = (e && e.tabs) || []
      })
      this.tab.on('go', (e) => {
        this.$router.push(e)
      })
    }
  },
  mounted () {
    this.tab = Tab.getInstance(this.tabName)
    this.lists = this.tab.tabs || []
    this.handleOn()
  }
}
</script>

<style lang="scss">
@import '../../../src/style/tab.scss';
</style>
