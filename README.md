# zbase-components

vue常用组件库


## Installation
```
npm i zbase-components
```

## Usage
```js
// 在vue项目入口文件main.js中引入
import ZbaseComponents from 'zbase-components'
import "zbase-components/lib/style/index.css";
import Vue from 'vue'

Vue.use(ZbaseComponents)

```

### multi-window

vue多窗口

> 在显示多窗口的页面

```vue
<template>
  <div>
    <button @click="open">打开新窗口</button>
    <button @click="close">关闭窗口</button>
    <ZbaseMultiWindowBox />
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
```



