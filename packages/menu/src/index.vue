<template>
  <ul
    class="zbase-menu"
  >
    <slot></slot>
  </ul>
</template>

<script>
export default {
  name: 'menu',
  props: {
    // horizontal / vertical
    mode: {
      type: String,
      default: 'vertical'
    },
    collapse: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: Boolean,
      default: '#fff'
    },

  },
  data () {
    return {}
  },
  methods: {
  }
}
</script>

<style lang="scss">
.zbase-menu {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
