<template>
  <div class="zbase-multiw__wrap">
    <button @click="log">log</button>
    <div
      class="zbase-multiw__open"
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
      v-if="!hideFooter"
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
    hideFooter: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      openLists: [],
      pageLists: [],
      multiWindow: null
    }
  },
  computed: {
    isHasShow () {
      return this.pageLists.some(ele => ele.onShow)
    },
    openListsUrl () {
      return this.openLists.map(ele => ele.url)
    },
    pageListsUrl () {
      return this.pageLists.map(ele => ele.url)
    }
  },
  methods: {
    log () {
      this.multiWindow.close()
    },
    // 当前是否显示
    isOnShow (item) {
      return this.openListsUrl.indexOf(item.url) > -1
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
      this.multiWindow.on('change', (obj) => {
        this.openLists = (obj && obj.opens) || []
        this.pageLists = (obj && obj.pages) || []
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
    this.multiWindow = MultiWindow.getInstance()
    this.openLists = this.multiWindow.opens
    this.pageLists = this.multiWindow.pages
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
  background: rgba(255,255,255,0.3);
}
.zbase-multiw__open {
  position: absolute;
  left: 300px;
  bottom: 50px;
  right: 0;
  height: calc(100vh - 50px);
  background: green;
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
  height: 50px;
  line-height: 50px;
  background: rgba(0,0,0,0.3);
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
