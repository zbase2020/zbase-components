<template>
  <div class="demomw-wrap">
    <div style="position:fixed;z-index:9999;">      
      <input type="text" v-model="url">
      <button @click="open">打开新窗口</button>
      <button @click="close">关闭窗口</button>
      <div>
        <button @click="handleChnageSize('')">正常</button>
        <button @click="handleChnageSize('large')">最大化</button>
        <button @click="hideAll">隐藏</button>
      </div>
      <div>
        <button @click="handleChangeFooter()">隐藏底部</button>
        <button @click="handleChangeFooter(false)">显示底部</button>
      </div>
    </div>
    <div class="demomw-box">
      <ZbaseMultiWindowBox :hideFooter="true" :left="'360px'" />
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
    handleChnageSize (size) {
      this.$multiWindow.changeSize(size)
    },
    handleChangeFooter (val) {
      this.$multiWindow.changeFooter(val)
    },
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
