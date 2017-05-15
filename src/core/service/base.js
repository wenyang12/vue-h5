import request from 'superagent'
import Cookies from 'js-cookie'
import _ from 'lodash'

/**
 * 通用ajax方法
 * @param {*} opt 选项描述如下:
 *  urlPrefix: string url前缀，默认值/FHH/EM1APAY/PAYWallet/
 *  url: string 接口地址
 *  data: object 请求数据
 *  always: function 请求完成后执行, 无论成功还是失败
 *  resPreproccess: boolean 是否对response进行内置的预处理 默认值true
 *  errAlert: number 是否提示错误信息, 0: 表示不提示 1: 表示提示. 默认值1
 * @param {*} output 用作传递输出参数
 *  req: superagent对象
 */
export default {
  ajax (opt, output) {
    let option = _.defaults({}, opt, {
      urlPrefix: '/FHH/EM1APAY/PAYWallet/',
      errAlert: 1,
      data: {}
    })
    let req = output.req = request.post(option.urlPrefix + option.url)
    let result = req
      .query({ _fs_token: Cookies.get('fs_token') })
      .send(option.data)
      .then(res => {
        if (option.resPreproccess === false) {
          return res.body
        }
        if (res.body.Result.StatusCode === 0) {
          let value = res.body.Value
          if (value.errorCode === 0) {
            return value
          } else {
            let err = new Error(value.errorMessage)
            err.$errCode = value.errorCode
            throw err
          }
        } else {
          let err = new Error(res.body.Result.FailureMessage)
          err.$errCode = res.body.Result.StatusCode
          throw err
        }
      })
      .catch(err => {
        if (option.errAlert === 1) alert(err.message)
        throw err
      })
    return Promise.resolve(result)
      .finally(() => {
        _.isFunction(option.always) && option.always()
      })
  },
  /**
   * 注册一般业务接口方法：方法名称+ForWeb为接口地址
   * @param {*} serive 输出参数，所有的方法都放在service对象中
   * @param {*} names 方法名称
   */
  registe (serive, ...names) {
    names.forEach(name => {
      serive[name] = (opt, curOpt) => {
        if (curOpt.abortLast) {
          serive[name].req && serive[name].req.abort()
        }
        let output = {}
        let promise = this.ajax(Object.assign(opt, {url: name + 'ForWeb'}), output)
        serive[name].req = output.req
        if (curOpt.abortLast) {
          serive[name].req.once('abort', function () {
            curOpt.abortFn && curOpt.abortFn()
          })
        }
        return promise
      }
    })
    return serive
  }
}
