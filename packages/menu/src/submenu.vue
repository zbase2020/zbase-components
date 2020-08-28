<template>
  <ul
    :class="{
      'zbase-submenu': true
    }"
    @click="handleClick"
  >
    <div
      :class="{
        'zbase-menu-item': true,
        'zbase-menu__active': active
      }"
    >
      <slot name="icon"></slot>
      <slot name="title">{{title}}</slot>
    </div>
    <div class="zbase-submenu__child">
      <slot></slot>
    </div>
  </ul>
</template>

<script>
import { keys, isEmpty } from 'zbase-utils'
import menuMixins from './menu-mixins'
import emitter from '../../../src/utils/emitter'
export default {
  componentName: 'ZbaseSubmenu',
  name: 'ZbaseSubmenu',
  mixins: [menuMixins, emitter],
  props: {
    index: {
      default: null,
      validator: val => typeof val === 'string' || val === null
    },
    title: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      // 全部的子级index
      // allIndex: [],
      items: {},
      submenus: {}
    }
  },
  computed: {
    allIndex () {
      let arr = keys(this.items) || []
      let obj = this.submenus
      while (!isEmpty(obj.items) && !isEmpty(obj.submenus)) {
        arr.concat(keys(obj.items) || [])
        obj = obj.submenus || {}
      }
      return arr
    },
    active () {
      return this.allIndex.indexOf(this.rootMenu.activeIndex) > -1
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
    handleClick() {
      const { rootMenu, disabled } = this;
      if (
        (rootMenu.menuTrigger === 'hover' && rootMenu.mode === 'horizontal') ||
        (rootMenu.collapse && rootMenu.mode === 'vertical') ||
        disabled
      ) {
        return;
      }
      this.dispatch('ZbaseMenu', 'submenu-click', this);
    }
  },
  mounted () {
    this.rootMenu.addSubmenu(this)
    this.parentMenu.addSubmenu(this)
  },
  beforeDestroy () {
    this.rootMenu.removeSubmenu(this)
    this.parentMenu.removeSubmenu(this)
  }
}
</script>