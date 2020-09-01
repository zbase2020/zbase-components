export default {
  getLeft (el) {
    var actualLeft = el.offsetLeft;
    var current = el.offsetParent;
    while (current !== null){
     actualLeft += current.offsetLeft;
     current = current.offsetParent;
    }
    if (document.compatMode == "BackCompat"){
     var elementScrollLeft=document.body.scrollLeft;
    } else {
     var elementScrollLeft=document.documentElement.scrollLeft;
    }
    return actualLeft-elementScrollLeft;
   },
  getTop (el) {
    var actualTop = el.offsetTop;
    var current = el.offsetParent;
    while (current !== null) {
      actualTop += current.offsetTop;
      current = current.offsetParent;
    }
    if (document.compatMode == "BackCompat") {
      var elementScrollTop = document.body.scrollTop;
    } else {
      var elementScrollTop = document.documentElement.scrollTop;
    }
    return actualTop - elementScrollTop;
  },
  getBottom (el) {
    var actualBottom = document.body.offsetHeight - this.getTop(el) - this.getHeight(el)
    return actualBottom
  },
  getHeight (el) {
    var height = el.offsetHeight
    return height
  }
}
