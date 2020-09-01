import ZbaseTabBox from './src/tab-box'
import { has, isFunction, isObject, isString, isEmpty, deepClone, SessionSto } from 'zbase-utils'
export class Tab {
  static getInstance (config) {
    if (!this.instance) {
      this.instance = new Tab(config)
    }
    return this.instance
  }

  constructor (config) {
    this.instance = null
    // 当前打开的多tab
    this.tabs = []
    // 当前页面
    this.current = ''
    // 首页路径
    this.indexPath = (config && config.indexPath) || '/'
    // 数据存储
    this.name = (config && config.dbName) || 'ZBASE_TAB'
    this.db = {}
    // 事件回调
    this.events = {
      boxChange: null,
      change: null,
      open: null,
      back: null,
      close: null,
      closeBack: null,
      closeBackRefresh: null,
      closeLeft: null,
      closeRight: null,
      closeOther: null,
      closeAll: null,
      go: null
    }
    // history hash
    this.routeType = 'hash'
    this.init()
  }
  // 初始化
  init () {
    this.db = new SessionSto({
      name: this.name
    })
    try {
      this.tabs = deepClone(this.db.get('tabs') || [])
    } catch (e) {
      this.tabs = []
    }
  }
  // 监听
  on (type, fn) {
    if (has(this.events, type) && isFunction(fn)) {
      this.events[type] = fn
    }
  }
  // 持久化
  updateDb (eventName) {
    this.db.set('tabs', this.tabs)
    // 回调
    this.events[eventName] && this.events[eventName]({
      tabs: this.tabs
    })
    this.events.change && this.events.change({
      tabs: this.tabs
    })
    this.events.boxChange && this.events.boxChange({
      tabs: this.tabs
    })
  }
  // 查找下一个显示的窗口
  findNextIndex (url, isBack) {
    var i = this.tabs.findIndex(ele => ele.fullPath === url)
    var len = this.tabs.length
    var index = len - 1
    if (i > -1) {
      if (isBack && this.tabs && this.tabs[i] && this.tabs[i].backUrl) {
        // 返回
        index = this.tabs.findIndex(ele => ele.fullPath === this.tabs[i].backUrl)
      } else {
        // 下一个
        index = len > (i + 1) ? (i + 1) : (i - 1)
      }
    }
    return index
  }
  // 打开窗口
  open (to) {
    if ((to && to.fullPath) === this.indexPath) {
      return
    }
    var obj = {
      fullPath: to.fullPath || '',
      hash: to.hash || '',
      meta: to.meta || {},
      params: to.params || {},
      path: to.path || '',
      query: to.query || {},
      backUrl: this.current || ''
    }
    var i = this.tabs.findIndex(ele => ele.fullPath === to.fullPath)
    if (i === -1) {
      // 没有打开过
      this.tabs.push(obj)
    }
    this.current = to.fullPath || ''
    this.updateDb('open')
  }
  // 关闭窗口
  close (info, isBack) {
    var fullPath = this.current
    if (isString(info) && info) {
      fullPath = info
    } else if (isObject(info) && info && info.fullPath) {
      fullPath = info.fullPath
    }
    var i = this.tabs.findIndex(ele => ele.fullPath === fullPath)
    var next = {
      path: this.indexPath || '/'
    }
    if (i > -1) {
      // 已经打开过
      var nextIndex = this.findNextIndex(fullPath, isBack)
      if (nextIndex > -1) {
        // 有下一个
        next = this.tabs[nextIndex]
      }
      this.tabs.splice(i, 1)
      this.updateDb('close')
      if (fullPath === this.current) {
        this.events.go && this.events.go(next)
      }
    }
  }
  // 关闭当前窗口并返回
  closeBack (info) {
    this.close(info, true)
  }
  // 关闭左侧窗口
  closeLeft (info) {
    var fullPath = this.current
    if (isString(info) && info) {
      fullPath = info
    } else if (isObject(info) && info && info.fullPath) {
      fullPath = info.fullPath
    }
    var i = this.tabs.findIndex(ele => ele.fullPath === fullPath)
    if (i > -1) {
      // 已经打开过
      this.tabs.splice(0, i)
      this.updateDb('closeLeft')
    }
  }
  // 关闭右侧窗口
  closeRight (info) {
    var fullPath = this.current
    if (isString(info) && info) {
      fullPath = info
    } else if (isObject(info) && info && info.fullPath) {
      fullPath = info.fullPath
    }
    var i = this.tabs.findIndex(ele => ele.fullPath === fullPath)
    var indexLen = this.tabs.length - 1
    if (i > -1 && indexLen > i) {
      // 已经打开过
      this.tabs.splice((i + 1), indexLen)
      this.updateDb('closeRight')
    }
  }
  // 关闭其他窗口
  closeOther (info) {
    var fullPath = this.current
    if (isString(info) && info) {
      fullPath = info
    } else if (isObject(info) && info && info.fullPath) {
      fullPath = info.fullPath
    }
    var i = this.tabs.findIndex(ele => ele.fullPath === fullPath)
    if (i > -1) {
      // 已经打开过
      var len = this.tabs.length
      var obj = this.tabs[i]
      this.tabs.splice(0, len, obj)
      this.updateDb('closeOther')
    }
  }
  // 关闭全部窗口
  closeAll (goIndex) {
    this.tabs.splice(0)
    this.updateDb('closeAll')
    if (goIndex) {
      this.events.go && this.events.go({
        path: this.indexPath
      })
    }
  }
}

export default {
  install (Vue, opt) {
    Vue.prototype.$tab = Tab.getInstance(opt)
    Vue.component('ZbaseTabBox', ZbaseTabBox)
  }
}
