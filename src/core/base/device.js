// 检测设备平台和版本号：iOS/Android/PC
module.exports = (function detect (ua) {
  let device = {
    ios: false,
    android: false,
    pc: false,
    version: 0
  }

  let android
  let ios
  /* eslint-disable no-cond-assign, no-useless-escape */
  if ((android = ua.match(/(Android);?[\s\/]+([\d.]+)?/))) {
    device.android = true
    device.version = android[2]
    return device
  }

  if ((ios = ua.match(/(iPhone|iPod|iPad).*OS\s([\d_]+)/))) {
    device.ios = true
    device.version = ios[2].replace(/_/g, '.')
    return device
  }

  device.pc = true
  return device
}(window.navigator.userAgent))
