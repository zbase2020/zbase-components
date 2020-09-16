<template>
  <div class="zbase-multiw__wrap">
    <button @click="log" v-show="false">log</button>
    <div
      class="zbase-multiw__open"
      :style="pageStyle"
      v-if="isHasShow"
    >
      <ul class="zbase-multiw__openlis">
        <transition-group name="zbase-move">        
          <li
            class="zbase-multiw__openitem"
            v-for="(item, index) in pageLists"
            :key="item.url + '' + index"
            v-show="item.onShow"
          >
            <iframe
              v-if="item.onLoad && (item.onShow || item.cache)"
              :src="item.url"
              frameborder="0"
              style="width:100%;height:100%;"></iframe>
          </li>
        </transition-group>
      </ul>
    </div>
    <div
      class="zbase-multiw__page"
      v-if="isShowFooter"
    >
      <ul class="zbase-multiw__pagelis">
        <li
          class="zbase-multiw__pageitem"
          :class="{
            'zbase-multiw__pageitemactive': item.onShow
          }"
          v-for="(item, index) in pageLists"
          :key="item + '' + index"
          :title="item.title || item.url"
        >
          <p @click="open(item)" class="zbase-ellipsis">{{item.title || item.url}}</p>
          <i class="zbase-multiw__pageclose" @click="close(item)">x</i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { MultiWindow } from '../index'
import { deepHas } from 'zbase-utils'
export default {
  name: 'multi-window-box',
  props: {
    // 显示底部
    showFooter: {
      type: Boolean,
      default: false
    },
    // 隐藏底部
    // hideFooter: {
    //   type: Boolean,
    //   default: true
    // },
    normalStyle: {
      type: String,
      default: 'height:90vh;bottom:3vh;right:2vh;'
    },
    largeStyle: {
      type: String,
      default: 'height:100vh;bottom:0vh;right:0vh;'
    },
    // 正常窗口下左边距离
    left: {
      type: String,
      default: '210px'
    }
  },
  data () {
    return {
      multiWindow: null,
      pageLists: [],
      size: 'normal',
      // 是否显示底部
      isShowFooter: false,
      // 是否隐藏底部
      // isHideFooter: true
    }
  },
  computed: {
    pageStyle() {
      // let style = this.isHideFooter ? 'height:90vh;bottom:5vh;right:5vh;' : ''
      let style = ''
      if (this.size === 'large') {
        style += (this.largeStyle + 'left:0;')
      } else {
        style += (this.normalStyle + `left:${this.left};`)
      }
      if (this.isShowFooter) {
        style += 'bottom:5vh;'
      }
      return style
    },
    isHasShow () {
      return this.pageLists.some(ele => ele.onShow)
    },
    pageListsUrl () {
      return this.pageLists.map(ele => ele.url)
    }
  },
  watch: {
    // hideFooter (val) {
    //   this.multiWindow.changeFooter(val)
    // },
    showFooter (val) {
      this.multiWindow.changeFooter(val)
    }
  },
  methods: {
    log () {
    },
    // 打开窗口
    open (item) {
      this.multiWindow.open(item)
    },
    // 关闭窗口
    close (item) {
      this.multiWindow.close(item)
    },
    handleChange () {
      this.multiWindow.on('boxChange', (obj) => {
        this.pageLists = (obj && obj.pages) || []
        this.size = (obj && obj.size) || 'normal'
        // this.isHideFooter = (obj && obj.hideFooter)
        this.isShowFooter = (obj && obj.showFooter) || false
      })
    },
    handleReceiveMessage (info) {
      const { data } = info
      if (data && data.type && data.type.indexOf('multiWindow') > -1) {
        var eventName = data.type.split('.')[1]
        if (deepHas(this.multiWindow, eventName)) {
          this.multiWindow[eventName](data.data)
        }
      }
    }
  },
  mounted () {
    // this.isHideFooter = this.hideFooter
    this.isShowFooter = this.showFooter
    this.multiWindow = MultiWindow.getInstance()
    this.pageLists = this.multiWindow.pages
    this.size = this.multiWindow.size
    this.isShowFooter = this.multiWindow && this.multiWindow.showFooter
    window.addEventListener('message', this.handleReceiveMessage)
    this.handleChange()
  }
}
</script>

<style>
.zbase-multiw__wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
.zbase-multiw__open {
  position: absolute;
  left: 210px;
  bottom: 5vh;
  right: 0;
  height: 95vh;
  transition: 0.3s;
}
.zbase-multiw__openlis {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.zbase-multiw__openitem {
  width: 100%;
  height: 100%;
}
.zbase-multiw__page {
  flex-shrink: 0;
  width: 100%;
  height: 5vh;
  line-height: 5vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.zbase-multiw__pagelis {
  position: relative;
  height: 100%;
}
.zbase-multiw__pageitem {
  display: inline-block;
  position: relative;
  height: 100%;
  box-sizing: border-box;
  max-width: 200px;
  padding: 0 20px;
}
.zbase-multiw__pageclose {
  position: absolute;
  right: 10px;
  top: 0;
  cursor: pointer;
}
.zbase-multiw__pageitemactive {
  background: #fff;
}
.zbase-move-enter,.zbase-move-leave-to {
  opacity:  0;
  transform: translateY(100%);
}
.zbase-move-enter-active,.zbase-move-leave-active {
  transition: all 0.5s ease;
}
</style>
