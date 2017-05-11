// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Token from '@/data/token'

Vue.config.productionTip = false

if (process.env.NODE_ENV === 'development') {
  let date = new Date()
  date.setDate(date.getDate() + (30 * 3600))
  date.toGMTString()
  document.cookie = `fs_token=${Token.fsToken};path=/;expires=${date}`
  document.cookie = `FSAuthX=${Token.FSAuthX};path=/;expires=${date}`
}

/* eslint-disable no-extend-native */
Promise.prototype.finally = function (callback) {
  let P = this.constructor
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  )
}
Promise.prototype.done = function (onFulfilled, onRejected) {
  this.then(onFulfilled, onRejected)
    .catch(function (reason) {
      // 抛出一个全局错误
      setTimeout(() => { throw reason }, 0)
    })
}

const FastClick = require('fastclick')
FastClick.attach(document.body)

// 后台请求数据时，不是立即显示loading，而是过一段时间，防止loading闪现，单位毫秒
window.$showLoadingDelay = 200

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
