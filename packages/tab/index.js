import ZbaseTabBox from './src/tab-box'
import { has, isFunction, isObject, isString, isEmpty, deepClone, SessionSto } from 'zbase-utils'
export class Tab {
  static getInstance (name) {
    if (!this.instance) {
      this.instance = new Tab(name)
    }
    return this.instance
  }

  constructor (name) {
    this.instance = null
    // 当前打开的多tab
    this.tabs = []
    // 当前页面
    this.current = ''
    // 首页路径
    this.indexPath = '/'
    // 数据存储
    this.name = name || 'ZBASE_TAB'
    this.db = {}
    // 事件回调
    this.events = {
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
    this.tabs = [
      {fullPath: '/aaa', meta: {title: 'aaaaaaaaa'}},
      {fullPath: '/bbb', meta: {title: 'bbbbbbbbb'}},
      {fullPath: '/ccc', meta: {title: 'ccccccccc'}},
      {fullPath: '/ddd', meta: {title: 'ddddddddd'}},
      {fullPath: '/eee', meta: {title: 'eeeeeeeee'}},
      {fullPath: '/fff', meta: {title: 'fffffffff'}},
      {fullPath: '/ggg', meta: {title: 'ggggggggg'}},
    ]
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
      path: '/'
    }
    if (i > -1) {
      // 已经打开过
      var nextIndex = this.findNextIndex(fullPath, isBack)
      next = this.tabs[nextIndex]
      this.tabs.splice(i, 1)
      this.updateDb('close')
      this.events.go && this.events.go(next)
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
    Vue.prototype.$tab = Tab.getInstance(opt && opt.tabName)
    Vue.component('ZbaseTabBox', ZbaseTabBox)
  }
}
