import { has, isFunction, isObject, isString, isEmpty, deepClone, SessionSto } from 'zbase-utils'
import ZbaseMultiWindowBox from './src/multi-window-box'
function isOnFrame () {
  return self != top
}
export class MultiWindow {
  static getInstance (config) {
    if (!this.instance) {
      this.instance = new MultiWindow(config)
    }
    return this.instance
  }
  constructor (config) {
    // 单例
    this.instance = null
    // 当前打开的多窗口
    this.pages = []
    // 窗口大小
    this.size = (config && config.size) || 'normal'
    // 显示底部
    this.showFooter = (config && config.showFooter) || false
    // 隐藏底部
    // this.hideFooter = (config && this.hideFooter) || false
    // 数据监听
    this.watcher = {
      pagesUrl: [],
      opensUrl: []
    }
    // 数据存储
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
      sizeChange: null,
      changeFooter: null
    }
    // history hash
    this.routeType = 'hash'
    this.init()
  }
  // 初始化
  init () {
    // 创建一个sessionStorage
    this.db = new SessionSto({
      name: 'ZBASE_MULTIWINDOW'
    })
    this.pages = deepClone(this.db.get('pages') || [])
    this.size = this.db.get('size') || this.size
    // this.hideFooter = this.db.get('hideFooter') || this.hideFooter
    this.showFooter = this.db.get('showFooter') || this.showFooter
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
          return _this.pages.filter(ele => ele.onShow).map(ele => ele.url) || []
        }
      }
    })
    this.events.change && this.events.change({
      pages: this.pages,
      size: this.size,
      showFooter: this.showFooter
    })
    this.events.boxChange && this.events.boxChange({
      pages: this.pages,
      size: this.size,
      showFooter: this.showFooter
    })
  }
  // 监听
  on (type, fn) {
    if (has(this.events, type) && isFunction(fn)) {
      this.events[type] = fn
    }
  }
  formatUrl (url) {
    if (!url) {
      return url
    }
    if (/^https:\/\/|http:\/\//.test(url)) {
      return url
    } else if (typeof window !== 'undefined' && window && window.location && this.routeType === 'history') {
      url = window.location.protocol + '//' + window.location.host + url
    } else if (typeof window !== 'undefined' && window && window.location && this.routeType === 'hash') {
      url = window.location.href.split('#')[0] + `#${url.indexOf('/') === 0 ? '' : '/'}${url}`
    }
    return url
  }
  // 持久化
  updateDb (eventName) {
    // 回调
    this.events[eventName] && this.events[eventName]({
      pages: this.pages,
      size: this.size,
      showFooter: this.showFooter
    })
    this.events.change && this.events.change({
      pages: this.pages,
      size: this.size,
      showFooter: this.showFooter
    })
    this.events.boxChange && this.events.boxChange({
      pages: this.pages,
      size: this.size,
      showFooter: this.showFooter
    })
    if (self == top) {
      this.db.set('pages', this.pages)
      this.db.set('size', this.size)
      this.db.set('showFooter', this.showFooter)
    }
  }
  // 查找下一个显示的窗口
  findNextIndex (url, isBack) {
    var i = this.watcher.pagesUrl.indexOf(url)
    var len = this.pages.length
    var index = len - 1
    if (i > -1) {
      if (isBack && this.pages && this.pages[i] && this.pages[i].backUrl) {
        // 返回
        index = this.watcher.pagesUrl.indexOf(this.pages[i].backUrl)
      } else {
        // 下一个
        index = len > (i + 1) ? (i + 1) : (i - 1)
      }
    }
    return index
  }
  findNow () {
    return this.pages.find(ele => ele.onShow)
  }
  // 打开窗口
  open (info) {
    // 更新主窗口
    if (self != top) {
      window.parent.postMessage({
        type: 'multiWindow.open',
        data: info
      })
      // return
    }
    if (isEmpty(info)) {
      throw new Error('url为必传参数')
    }
    var now = this.findNow()
    var obj = {
      // 原始url
      originUrl: '',
      url: '',
      // 加载
      onLoad: true,
      // 缓存
      cache: true,
      // 显示
      onShow: true,
      // 窗口大小
      size: '',
      // 返回的url
      backUrl: (now && now.url) || ''
    }
    if (isString(info) && info) {
      // 只有一个url
      obj.url = info
    }
    if (isObject(info) && info.url) {
      obj = Object.assign({}, obj, info)
    }
    obj.originUrl = obj.url
    obj.url = this.formatUrl(obj.url)
    obj.onShow = true
    obj.onLoad = true
    // 设置窗口大小
    if (obj.size) {
      this.changeSize(obj.size)
    }
    // var i = this.watcher.pagesUrl.indexOf(obj.url)
    var i = -1
    var len = this.pages.length
    for (var x = 0; x < len; x++) {
      if (this.pages[x].url === obj.url) {
        i = x
      } else {
        this.pages[x].onShow = false
      }
    }
    if (i === -1) {
      // 没有打开
      this.pages.push(obj)
    } else {
      // 已经打开
      this.pages.splice(i, 1, obj)
    }
    this.updateDb('open')
  }
  // 返回
  back () {
    // 更新主窗口
    if (self != top) {
      window.parent.postMessage({
        type: 'multiWindow.back',
        data: info
      })
      // return
    }
    var now = this.findNow()
    var index = -1
    if (now && now.url) {
      index = this.findNextIndex(now.url, true)
    }
    if (this.pages && this.pages.length) {
      index = index > -1 ? index : 0
      this.pages[index].onShow = true
      this.updateDb('back')
    }
  }
  // 关闭窗口
  close (info, isBack) {
    // 更新主窗口
    if (self != top) {
      window.parent.postMessage({
        type: 'multiWindow.close',
        data: info
      })
      // return
    }
    var url = ''
    var openArr = this.watcher.opensUrl || []
    if (isEmpty(info)) {
      url = (openArr && openArr[0]) || ''
      // throw new Error('url为必传参数')
    } else if (isString(info) && info) {
      url = info
    } else if (isObject(info) && info && info.url) {
      url = info.url
    }
    url = this.formatUrl(url)
    var i = this.watcher.pagesUrl.indexOf(url)
    // 显示的i
    if (i > -1) {
      var nextIndex = this.findNextIndex(url, isBack)
      if (openArr.length < 2 && nextIndex > -1) {
        // 下一个显示
        this.pages[nextIndex].onShow = true
      }
      this.pages.splice(i, 1)
    }
    this.updateDb('close')
  }
  // 关闭当前窗口并返回
  closeBack (info) {
    // 更新主窗口
    if (self != top) {
      window.parent.postMessage({
        type: 'multiWindow.closeBack',
        data: info
      })
      // return
    }
    this.close(info, true)
  }
  // 关闭当前窗口并返回刷新
  closeBackRefresh () {
    // 更新主窗口
    if (self != top) {
      window.parent.postMessage({
        type: 'multiWindow.closeBackRefresh',
        data: info
      })
      // return
    }
    this.close(info, true)

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
  closeAll (info) {
    // 更新主窗口
    if (self != top) {
      window.parent.postMessage({
        type: 'multiWindow.closeAll',
        data: info
      })
      // return
    }
    this.pages.splice(0)
    this.updateDb('closeAll')
  }
  // 隐藏窗口
  hide (info) {
    // 更新主窗口
    if (self != top) {
      window.parent.postMessage({
        type: 'multiWindow.hide',
        data: info
      })
      // return
    }
    var url = ''
    var openArr = this.watcher.opensUrl || []
    if (isEmpty(info)) {
      url = (openArr && openArr[0]) || ''
      // throw new Error('url为必传参数')
    } else if (isString(info) && info) {
      url = info
    } else if (isObject(info) && info && info.url) {
      url = info.url
    }
    url = this.formatUrl(url)
    var i = this.watcher.pagesUrl.indexOf(url)
    // 显示的i
    if (i > -1) {
      this.pages[i].onShow = false
      this.updateDb('hide')
    }
  }
  // 隐藏全部窗口
  hideAll (info) {
    // 更新主窗口
    if (self != top) {
      window.parent.postMessage({
        type: 'multiWindow.hideAll',
        data: info
      })
      // return
    }
    var len = this.pages.length
    for (var i = 0; i < len; i++) {
      this.pages[i].onShow = false
    }
    this.updateDb('hideAll')
  }
  // 切换窗口大小
  changeSize (size) {
    // 更新主窗口
    if (self != top) {
      window.parent.postMessage({
        type: 'multiWindow.changeSize',
        data: size
      })
      // return
    }
    this.size = size
    this.updateDb('sizeChange')
  }
  // 切换底部
  changeFooter (bol) {
    // 更新主窗口
    if (self != top) {
      window.parent.postMessage({
        type: 'multiWindow.changeFooter',
        data: bol
      })
      // return
    }
    if (bol !== undefined) {
      this.showFooter = bol || false
    } else {
      this.showFooter = !this.showFooter
    }
    this.updateDb('changeFooter')
  }
}

export default {
  install (Vue, opt) {
    Vue.prototype.$multiWindow = MultiWindow.getInstance(opt)
    Vue.component('ZbaseMultiWindowBox', ZbaseMultiWindowBox)
  }
}
