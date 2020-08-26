<template>
  <div class="demomw-wrap">
    <div>

    </div>
    <input type="text" v-model="url">
    <button @click="open">打开新窗口</button>
    <button @click="close">关闭窗口</button>
    <div>
      <button @click="hideAll">隐藏</button>
    </div>
    <div class="demomw-box">
      <MultiWindowBox />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: ''
    }
  },
  methods: {
    open () {
      // 打开新窗口
      this.$multiWindow.open(this.url)
    },
    close () {
      // 关闭窗口-默认关闭当前打开窗口
      this.$multiWindow.close()
      // 关闭指定窗口
      // this.$multiWindow.close('https://www.github.com/zbase2020')
    },
    hideAll () {
      this.$multiWindow.hideAll()
    }
  }
}
</script>

<style lang="scss">
.demomw-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  background: skyblue;
}
</style>
