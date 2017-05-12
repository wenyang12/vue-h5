<template>
  <div>
    <div class="header">
      <span class="close"></span>
      <p class="title">选择解绑邮箱的原因</p>
      <p class="sub-title">我们将继续改进</p>
    </div>
    <div class="container">
      <div class="select-area">
        <span class="select-option" v-for="(option, index) in selectOptions" :class="{ active: option.isActive, inactive: !option.isActive }" @click.stop.prevent="toggleSelect(index)">{{option.value}}</span>
      </div>
      <textarea class="input-textarea" placeholder="填写其他原因..." v-model.trim="otherReason" @input="validate" data-maxlength="200"></textarea>
    </div>
    <div class="footer" @click.stop.prevent="submit">确认</div>
  </div>
</template>

<script>
import Loading from '@/components/base/loading'
import util from '@/core/base/util'

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
  methods: {
    showLoading (useJsapi = true) {
      if (this.loadingTimer) return
      this.loadingTimer = setTimeout(() => {
        if (this.isJsapiReady && useJsapi) {
          FSOpen.widget.showPreloader({
            text: '加载中...'
          })
        } else {
          Loading.open('加载中...')
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
      if (value.length > maxLength) {
        $event.target.value = value.substr(0, maxLength)
      }
    },
    submit () {
      let selectOptions = []
      this.selectOptions.forEach((item) => {
        if (item.isActive) selectOptions.push(item.value)
      })
      let submitData = {
        reason: selectOptions.join('#'),
        other: util.escapeHtml(this.otherReason)
      }
      alert(JSON.stringify(submitData))
    }
  },
  mounted () {
  }
}
</script>

<style lang="less">
@import '~@/assets/style/all';

@header-height: 3.2rem;
@footer-height: 2rem;

.header,.footer{
  position: fixed;
  left: 0;
  right: 0;
}
.header{
  position: relative;
  top: 0;
  height: @header-height;
  background: url(@img-logo) no-repeat center;
  background-size: 100% 100%;
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
  bottom: 0;
  height: @footer-height;
  line-height: @footer-height;
  font-size: 0.68rem;
  color: #333333;
  text-align: center;
  &:after{
    .setTopLine(#E4E6EB);
  }
}
.container{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: @header-height 1.12rem @footer-height;
  padding: 1.22rem 0 1.2rem;
}
.input-textarea{
  width: 100%;
  height: 3.2rem;
  padding: 0.34rem 0.64rem 0.34rem 0.64rem;
  background: #F8F8F8;
  .placeholder(#cccccc);
  .setAllLine(#E6E6E6, 0.8rem);
}
.select-area{
  display: flex;
  flex-wrap: wrap;
}
.select-option{
  position: relative;
  display: inline-block;
  margin: 0 0.64rem 0.64rem 0;
  padding: 0.34rem 0.64rem 0.42rem 0.64rem;
  font-size: 0.56rem;
  &.active{
    border-radius: 2rem;
    @media screen and (-webkit-min-device-pixel-ratio: 2) {
      border-radius: 4rem;
    }
    background: linear-gradient(to right, #ffb83c 0%, #ff9b2c 100%);
    color: #FFFFFF;
    box-shadow: 0 10px 0 -5px rgba(255, 142, 43, 0.2);
  }
  &.inactive{
    background: #FFFFFF;
    color: #333333;
    .setAllLine(#E6E6E6, 2rem);
  }
}
</style>
