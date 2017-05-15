<template>
  <div>
    <div class="header">
      <span class="close" @click.stop.prevent="closeWindow"></span>
      <p class="title">选择解绑邮箱的原因</p>
      <p class="sub-title">我们将继续改进</p>
    </div>
    <div class="container">
      <div class="select-area">
        <span class="select-option" v-for="(option, index) in selectOptions" :class="{ active: option.isActive, inactive: !option.isActive }" @click.stop.prevent="toggleSelect(index)">{{option.value}}</span>
      </div>
      <div class="input-textarea-wrapper">
        <textarea class="input-textarea" placeholder="填写其他原因..." :value="otherReason" @input="validate" data-maxlength="200"></textarea>
      </div>
    </div>
    <div class="footer" :class="{disabled: !hasSelect}" ref="footer" @click.stop.prevent="submit">确&nbsp;认</div>
  </div>
</template>

<script>
import Loading from '@/components/base/loading'
import Success from '@/components/base/Success'
import util from '@/core/base/util'
import Api from '@/core/service/service'

export default {
  name: 'app',
  data () {
    return {
      loadingTimer: null,
      selectOptions: [{
        value: '担心信息安全',
        isActive: false
      }, {
        value: '体验不好',
        isActive: false
      }, {
        value: '我不在这里处理邮件',
        isActive: false
      }],
      otherReason: ''
    }
  },
  computed: {
    hasSelect () {
      return this.selectOptions.some(element => element.isActive) || this.otherReason.trim()
    }
  },
  methods: {
    showLoading (useJsapi = true, showText = '加载中...') {
      if (this.loadingTimer) return
      this.loadingTimer = setTimeout(() => {
        if (this.isJsapiReady && useJsapi) {
          FSOpen.widget.showPreloader({
            text: showText
          })
        } else {
          Loading.open(showText)
        }
      }, window.$showLoadingDelay)
    },
    closeLoading (useJsapi = true) {
      if (!this.loadingTimer) return
      clearTimeout(this.loadingTimer)
      this.loadingTimer = null
      if (this.isJsapiReady && useJsapi) {
        FSOpen.widget.hidePreloader()
      } else {
        Loading.close()
      }
    },
    toggleSelect (index) {
      let isActive = this.selectOptions[index].isActive
      this.selectOptions[index].isActive = !isActive
    },
    validate ($event) {
      let value = $event.target.value
      let maxLength = Number($event.target.getAttribute('data-maxlength'))
      this.otherReason = $event.target.value = value.substr(0, maxLength)
    },
    ajustHeight () {
      if (!util.device.pc) {
        let height = this.$refs.footer.getBoundingClientRect().bottom
        console.log('ajustHeight:' + height)
        FSMailBridge && FSMailBridge.handle('setWebContentHeight', Math.ceil(height) + '')
      }
    },
    closeWindow () {
      if (util.device.pc) {
        try {
          if (parent) {
            parent.FS.emailOption.hide()
          }
        } catch (err) {
          console.log('closeWindow: ' + err)
        }
      } else {
        FSMailBridge && FSMailBridge.handle('closeDialog', null)
      }
    },
    submit ($event) {
      if ($event.target.classList.contains('disabled')) return
      let selectOptions = []
      this.selectOptions.forEach((item) => {
        if (item.isActive) selectOptions.push(item.value)
      })
      let submitData = {
        reason: selectOptions.join('#'),
        other: util.escapeHtml(this.otherReason.trim())
      }
      this.showLoading(false, '提交中...')
      Api.unbindExam({
        data: submitData,
        always: () => { this.closeLoading(false) }
      }).then(res => {
        if (res.errorCode === 0) {
          Success.open('提交成功')
          setTimeout(() => {
            Success.close()
            this.closeWindow()
          }, 1000)
        } else {
          alert(res.errorMessage)
        }
      })
    }
  },
  mounted () {
    this.ajustHeight()
  }
}
</script>

<style lang="less">
@import '~@/assets/style/all';

@header-height: 3.2rem;
@footer-height: 2rem;

.header{
  position: relative;
  top: 0;
  height: @header-height;
  background: #f8f8f8 url(@img-logo) no-repeat center;
  background-size: auto 100%;
  text-align: center;
  &:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px dashed #DFDFDF;
    color: #DFDFDF;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
  }
}
.close{
  position: absolute;
  top: 0.208rem;
  right: 0.266rem;
  .square(0.906rem);
  background: url(@img-close) no-repeat center;
  background-size: 60%;
  cursor: pointer;
}
.title{
  padding-top: 0.65rem;
  font-size: 0.8rem;
  color: #333333;
}
.sub-title{
  font-size: 0.52rem;
  color: #BFBFBF;
}
.footer{
  position: relative;
  height: @footer-height;
  line-height: @footer-height;
  font-size: 0.68rem;
  color: #333333;
  text-align: center;
  cursor: pointer;
  &:active{
    background: #F8F8F8;
  }
  &.disabled{
    color: #cccccc;
  }
  &:after{
    .setTopLine(#E4E6EB);
  }
}
.container{
  padding: 1.22rem 1.12rem 1.2rem;
}
.input-textarea-wrapper{
  height: 3.84rem;
  overflow: hidden;
  .setAllLine(#E6E6E6, 0.8rem);
}
.input-textarea{
  padding: 0.38rem 0.64rem 0.38rem 0.64rem;
  width: 100%;
  height: 100%;
  border: none;
  background: #F8F8F8;
  .placeholder(#cccccc);
}
.select-area{
  display: flex;
  flex-wrap: wrap;
}
.select-option{
  position: relative;
  display: inline-block;
  margin: 0 0.64rem 0.64rem 0;
  padding: 0.38rem 0.64rem 0.38rem 0.64rem;
  font-size: 0.56rem;
  height: 1.6rem; // 上下padding加上font-size*line-height计算出来的，是为了border-box
  box-sizing: border-box;
  &.active{
    border-radius: 2rem;
    @media screen and (-webkit-min-device-pixel-ratio: 2) {
      border-radius: 4rem;
    }
    background: linear-gradient(to right, #ffb83c 0%, #ff9b2c 100%);
    color: #FFFFFF;
    box-shadow: 0 8px 5px -5px rgba(255, 142, 43, 0.2);
  }
  &.inactive{
    background: #FFFFFF;
    color: #333333;
    .setAllLine(#E6E6E6, 2rem);
  }
}
</style>
