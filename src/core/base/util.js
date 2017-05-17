import device from '@/core/base/device'
import escape from 'escape-html'

export default {
  device,
  /**
   * 获取url query参数
   * @param {*} n 参数名
   * @param {*} url 默认值为location
   */
  getQuery (n, url) {
    let m, result, search

    if (url) {
      m = url.match(/\?[^#]+/)
      search = !m ? '' : m[0]
    } else {
      search = window.location.search
    }

    m = search.match(new RegExp('(?:\\?|&)' + n + '=([^&]*)(&|$)'))
    result = !m ? '' : decodeURIComponent(m[1])
    return result
  },
  /**
   * 金额分转化为元
   * @param cents
   * @returns {number}
   */
  cent2yuan (cents) {
    return Number((Number(cents) / 100).toFixed(2))
  },
  /**
   * 金额元转化为分
   * @param yuan
   * @returns {number}
   */
  yuan2cent (yuan) {
    return this.accMul(Number(yuan), 100)
  },
  /**
   * 乘法函数，用来得到精确的乘法结果。javascript的乘法结果会有误差
   * @param arg1
   * @param arg2
   * @returns {number}
   */
  accMul (arg1, arg2) {
    let m = 0
    let s1 = arg1.toString()
    let s2 = arg2.toString()
    try {
      m += s1.split('.')[1].length
    } catch (e) {
    }
    try {
      m += s2.split('.')[1].length
    } catch (e) {
    }
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
  },
  /**
   * 金额千分位格式化输出
   * @return {[type]} [description]
   */
  dealYuanToThousand (money) {
    return Number(money).toFixed(2).toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
  },
  /**
   * 数字千分位格式化输出
   * @return {[type]} [description]
   */
  dealNumToThousand (num) {
    return Number(num).toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
  },
  /**
   * html字符串转义
   */
  escapeHtml (str) {
    return escape(str)
  },

  /**
   * 将两个有css长度单位的字符串相加
   * @param {*} p1
   * @param {*} p2
   */
  addUnit (p1, p2) {
    let cp1 = parseFloat(p1)
    let cp2 = parseFloat(p2)
    let unit = p1.replace(cp1 + '', '')
    return cp1 + cp2 + unit
  }
}
