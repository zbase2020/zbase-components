<template>
  <div>
    <button @click="open">打开新窗口</button>
    <button @click="close">关闭窗口</button>
    <MultiWindowBox />
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    open () {
      // 打开新窗口
      this.$multiWindow.open('https://www.github.com/zbase2020')
    },
    close () {
      // 关闭窗口-默认关闭当前打开窗口
      this.$multiWindow.close()
      // 关闭指定窗口
      // this.$multiWindow.close('https://www.github.com/zbase2020')
    }
  }
}
</script>
