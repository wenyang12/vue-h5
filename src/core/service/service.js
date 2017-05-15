import baseApi from './base'
import apiList from '@/data/apilist'

// 这里面放每个业务接口的请求方法，每个方法接收两个参数：
// 第一个参数是base.ajax方法的第一个参数，跟ajax有关的配置
// 第二个参数是另外一些配置选项，具体如下：
// abortLast: 是否终止上次请求。默认false
// abortFn: abort时调用的方法
let result = {}
baseApi.registe(result, ...apiList) // 使用baseApi.registe方法定义接口

result.unbindExam = function (opt, curOpt) {
  return baseApi.ajax(Object.assign(opt, {
    urlPrefix: '/open/emailproxy/web/email/',
    url: 'unbindExam',
    resPreproccess: false
  }), {})
}

export default result
