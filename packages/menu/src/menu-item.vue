<template>
  <li
    :class="{
      'zbase-menu-item': true,
      'zbase-menu__active': active
    }"
    @click="handleClick"
  >
    <slot name="icon"></slot>
    <slot name="title">{{title}}</slot>
    <slot></slot>
  </li>
</template>

<script>
import menuMixins from './menu-mixins'
import emitter from '../../utils/emitter'
export default {
  componentName: 'ZbaseMenuItem',
  name: 'ZbaseMenuItem',
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
    route: {
      type: [Object, String],
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

    }
  },
  computed: {
    active () {
      return this.index === this.rootMenu.activeIndex;
    }
  },
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.dispatch('ZbaseMenu', 'item-click', this);
        this.$emit('click', this);
      }
    }
  },
  mounted () {
    this.rootMenu.addItem(this)
    this.parentMenu.addItem(this)
  },
  beforeDestroy () {
    this.rootMenu.removeItem(this)
    this.parentMenu.removeItem(this)
  }
}
</script>