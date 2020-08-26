import { has, isFunction, isObject, isString, isEmpty, deepClone, LocalSto } from 'zbase-utils'
import MultiWindowBox from './src/multi-window'
export class MultiWindow {
  static getInstance () {
    if (!this.instance) {
      this.instance = new MultiWindow()
    }
    return this.instance
  }
  constructor (props) {
    // 单例
    this.instance = null
    // 当前打开的多窗口
    this.pages = []
    this.pagesUrl = []
    // 当前显示的多窗口
    this.opens = []
    this.opensUrl = []
    // 数据监听
    this.watcher = {
      pagesUrl: [],
      opensUrl: []
    }
    // 数据存储
    this.local = {}
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
      closeAll: null
    }
    // history hash
    this.routeType = 'hash'
    this.init()
  }
  // 初始化
  init () {
    // 创建一个localStorage
    this.local = new LocalSto({
      name: 'ZBASE_MULTIWINDOW'
    })
    this.pages = deepClone(this.local.get('pages') || [])
    this.pagesUrl = this.pages.map(ele => ele.url)
    this.opens = deepClone(this.local.get('opens') || [])
    this.opensUrl = this.opens.map(ele => ele.url)
    var _this = this
    Object.defineProperties(this.watcher, {
      'pagesUrl': {
        configurable: true,
        enumerable: true,
        get: function (value) {
          return _this.pages.map(ele => ele.url)
        }
      },
      'opensUrl': {
        configurable: true,
        enumerable: true,
        get: function (value) {
          return _this.opens.map(ele => ele.url)
        }
      }
    })
  }
  // 监听
  on (type, fn) {
    if (has(this.events, type) && isFunction(fn)) {
      this.events[type] = fn
    }
  }
  formatUrl (url) {
    if (/^https:\/\/|http:\/\//.test(url)) {
      return url
    } else if (typeof window !== 'undefined' && window && window.location && this.routeType === 'history') {
      url = window.location.protocol + '//' + window.location.host + url
    } else if (typeof window !== 'undefined' && window && window.location && this.routeType === 'hash') {
      url = window.location.href.split('#')[0] + `#${url.indexOf('/') === 0 ? '' : '/'}${url}`
    }
    return url
  }
  update (eventName) {
    // 持久化
    this.local.set('pages', this.pages)
    this.local.set('opens', this.opens)
    // 回调
    this.events[eventName] && this.events[eventName]({
      pages: this.pages,
      opens: this.opens
    })
    this.events.change && this.events.change({
      pages: this.pages,
      opens: this.opens
    })
  }
  // 查找下一个显示的窗口
  findNext (url, isBack) {
    var i = this.watcher.pagesUrl.indexOf(url)
    var len = this.pages.length
    // var j = this.watcher.opensUrl.indexOf(url)
    var obj = null
    if (i > -1) {
      if (isBack && this.pages && this.pages[i] && this.pages[i].backUrl) {
        // 返回
        var j = this.watcher.pagesUrl.indexOf(this.pages[i].backUrl)
        obj = this.pages[j]
      } else {
        // 下一个
        obj = this.pages[len > (i + 1) ? (i + 1) : (i - 1)]
      }
    } else {
      // 最后一个
      obj = this.pages[len - 1]
    }
    return obj
  }
  // 打开窗口
  open (info) {
    // 更新主窗口
    if (self != top) {
      window.parent.postMessage({
        type: 'multiWindow.open',
        data: info
      })
      return
    }
    if (isEmpty(info)) {
      throw new Error('url为必传参数')
    }
    var obj = {
      url: ''
    }
    if (isString(info) && info) {
      // 只有一个url
      obj.url = info
    }
    if (isObject(info) && info.url) {
      obj = Object.assign({}, obj, info)
    }
    obj.url = this.formatUrl(obj.url)
    var i = this.watcher.pagesUrl.indexOf(obj.url)
    var j = this.watcher.opensUrl.indexOf(obj.url)
    if (i === -1 && j === -1) {
      // 没有打开，没有显示
      this.pages.push(obj)
      // this.opens.push(obj)
    } else if (i > -1 && j === -1) {
      // 有打开,没有显示
      // this.opens.push(obj)
    } else if (i === -1 && j > -1) {
      // 没有打开，有显示
      this.pages.push(obj)
    }
    this.opens = [obj]
    this.update('open')
  }
  // 返回
  back (url) {
  }
  // 关闭窗口
  close (info) {
    // 更新主窗口
    if (self != top) {
      window.parent.postMessage({
        type: 'multiWindow.close',
        data: info
      })
      return
    }
    var url = ''
    if (isEmpty(info)) {
      url = this.opens && this.opens[0] && this.opens[0].url
      // throw new Error('url为必传参数')
    } else if (isString(info) && info) {
      url = info
    } else if (isObject(info) && info && info.url) {
      url = info.url
    }
    url = this.formatUrl(url)
    var i = this.watcher.pagesUrl.indexOf(url)
    var j = this.watcher.opensUrl.indexOf(url)
    // 显示的
    if (j > -1 && this.opens.length > 1) {
      // 至少两个正在显示
      this.opens.splice(j, 1)
    } else if (j > -1 && this.opens.length < 2) {
      // 最多一个正在显示
      var next = this.findNext(url)
      if (next && next.url) {
        this.opens = [next]
      }
    }
    // 打开的
    if (i > -1) {
      // 已打开
      this.pages.splice(i, 1)
    }
    this.update('close')
  }
  // 关闭当前窗口并返回
  closeBack () {

  }
  // 关闭当前窗口并返回刷新
  closeBackRefresh () {

  }
  // 关闭左边窗口
  closeLeft () {

  }
  // 关闭右边窗口
  closeRight () {

  }
  // 关闭其他窗口
  closeOther () {

  }
  // 关闭全部窗口
  closeAll () {

  }
}

export default {
  install (Vue) {
    Vue.prototype.$multiWindow = MultiWindow.getInstance()
    Vue.component('MultiWindowBox', MultiWindowBox)
  }
}
