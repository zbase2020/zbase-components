<template>
  <ul
    :class="{
      'zbase-menu': true,
      'zbase-horizontal': mode === 'horizontal',
      'zbase-vertical': mode === 'vertical'
    }"
  >
    <slot></slot>
  </ul>
</template>

<script>
export default {
  componentName: 'ZbaseMenu',
  name: 'ZbaseMenu',
  props: {
    // horizontal / vertical
    mode: {
      type: String,
      default: 'vertical'
    },
    // 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
    collapse: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: '#222945'
    },
    textColor: {
      type: String,
      default: '#fff'
    },
    activeTextColor: {
      type: String,
      default: '#fff'
    },
    defaultActive: {
      type: String,
      default: ''
    },
    defaultOpeneds: {
      type: Array,
      default () {
        return []
      }
    },
    uniqueOpened: {
      type: Boolean,
      default: false
    },
    // 子菜单打开的触发方式(只在 mode 为 horizontal 时有效)
    // hover / click
    menuTrigger: {
      type: String,
      default: 'hover'
    },
    router: {
      type: Boolean,
      default: false
    },
    collapseTransition: {
      type: Boolean,
      default: true
    }
  },
  provide () {
    return {
      rootMenu: this
    }
  },
  data () {
    return {
      activeIndex: this.defaultActive,
      items: {},
      submenus: {}
    }
  },
  watch: {
    defaultActive (val) {
      this.activeIndex = val
    }
  },
  methods: {
    addItem(item) {
      this.$set(this.items, item.index, item);
    },
    removeItem(item) {
      delete this.items[item.index];
    },
    addSubmenu(item) {
      this.$set(this.submenus, item.index, item);
    },
    removeSubmenu(item) {
      delete this.submenus[item.index];
    },
    handleItemClick (e) {
      const {index, info} = e
      this.$emit('select', index, info)
    },
    handleSubmenuClick (e) {
      const {index, info} = e
    }
  },
  mounted () {
    this.$on('item-click', this.handleItemClick);
    this.$on('submenu-click', this.handleSubmenuClick);
  }
}
</script>

<style lang="scss">
@import '../../style/menu.scss';
</style>
