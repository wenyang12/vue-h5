import APPID from '@/data/appid'
import device from '@/core/base/device'

export default function (config) {
  const env = /\w+\.(\w+)\.\w+/g.test(location.host)
  const appId = (env && APPID[RegExp.$1]) || APPID['ceshi113']
  return new Promise(function (resolve, reject) {
    FSOpen.init(Object.assign({appId}, config, {
      onSuccess (resp) {
        resolve(resp)
      },
      onFail (error) {
        if (!device.pc) { // 为方便调试，pc端不提示jsapi错误消息
          if (error.errorCode === 30000) {
            alert('请更新纷享客户端到最新版本。')
          } else {
            alert('初始化失败：' + JSON.stringify(error.errorMessage))
          }
        }
        reject(error)
      }
    }))
  })
}
