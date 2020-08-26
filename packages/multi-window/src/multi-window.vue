<template>
  <div class="zbase-multiw__wrap">
    <button @click="log">log</button>
    <div class="zbase-multiw__open">
      <ul class="zbase-multiw__openlis">
        <li
          class="zbase-multiw__openitem"
          v-for="(item, index) in pageLists"
          :key="item.url + '' + index"
          v-show="isOnShow(item)"
        >
          <iframe :src="item.url" frameborder="0" style="width:100%;height:100%;"></iframe>
        </li>
      </ul>
    </div>
    <div class="zbase-multiw__page">
      <ul class="zbase-multiw__pagelis">
        <li
          class="zbase-multiw__pageitem"
          :class="{
            'zbase-multiw__pageitemactive': isOnShow(item)
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
  data () {
    return {
      openLists: [],
      pageLists: [],
      multiWindow: null
    }
  },
  computed: {
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
.zbase-fl {
  float: left;
}
.zbase-fr {
  float: right;
}
.zbase-clearfloat:before,
.zbase-clearfloat:after {
  display: table;
  line-height: 0;
  content: '';
}
.zbase-clearfloat:after {
  clear: both;
}
.zbase-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.zbase-multiw__wrap {
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.3);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.zbase-multiw__open {
  width: 100%;
  flex-grow: 1;
  flex: 1;
  flex-basis: 0;
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
</style>
