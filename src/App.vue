<template>
  <div>
    <div class="calendar-wrapper">
      <span class="calendar-icon"></span>
      <p class="calendar-text" @click="showDateTimePicker">{{datetime | datetimeFormat}}</p>
      <span class="arrow"></span>
    </div>
    <ul class="trans-wrapper">
      <li v-for="item in trans" :class="{trans: item.style == null , 'trans-seperator': item.style === 'seperator'}">
        <template v-if="item.style === 'seperator'"></template>
        <template v-else>
          <span class="trans-name">{{item.name}}</span>
          <span class="trans-value">{{item.value || '--'}}</span>
        </template>
      </li>
    </ul>
    <p class="tip" v-if="walletType === '4' || walletType === '5'">手续费由第三方支付（微信支付、支付宝）收取</p>
  </div>
</template>

<script>
import jsapi from '@/core/base/jsapi'
import Loading from '@/components/base/loading'
import Api from '@/core/service/service'
import util from '@/core/base/util'
import moment from 'moment'
moment.locale('zh-cn')

export default {
  name: 'app',
  data () {
    return {
      loadingTimer: null,
      datetime: '',
      isJsapiReady: false,
      walletType: '',
      apiName: '',
      trans: []
    }
  },
  watch: {
    datetime () {
      this.fetchData()
    },
    walletType (value) {
      this.datetime = moment().startOf('day').subtract(1, 'days')
      switch (value) {
        case '2':
          this.apiName = 'queryEAAttendanceMoneyResult'
          this.trans.push({
            name: '考勤红包共发出'
          })
          break
        case '4':
          this.apiName = 'queryEACollectMoneyResult'
          this.trans.push({
            name: '收款金额'
          }, {
            name: '收款笔数'
          }, {
            name: '手续费'
          })
          break
        case '5':
          this.apiName = 'queryEAOrderAccountTransResult'
          this.trans.push({
            name: '订单金额'
          }, {
            name: '订单笔数'
          }, {
            name: '手续费'
          }, {
            style: 'seperator'
          }, {
            name: '退款金额'
          }, {
            name: '退款笔数'
          }, {
            name: '退手续费'
          })
          break
      }
    }
  },
  filters: {
    datetimeFormat (value) {
      if (!value) return ''
      return value.format('YYYY年MM月DD日 dddd')
    }
  },
  methods: {
    showDateTimePicker () {
      if (util.device.pc) { // pc端调试用
        this.datetime = this.datetime.clone().subtract(1, 'days')
        return
      }
      if (!this.isJsapiReady) return
      FSOpen.widget.showDateTimePicker({
        dateType: 'day',
        defaultValue: this.datetime.format('YYYY-MM-DD'),
        onSuccess: resp => {
          this.datetime = moment(resp.value)
        }
      })
    },
    fetchData () {
      var func = Api[this.apiName]
      this.showLoading(false)
      func && func({
        data: {
          beginTime: this.datetime.valueOf(),
          endTime: this.datetime.endOf('day').valueOf()
        },
        always: () => { this.closeLoading(false) }
      }, {
        abortLast: true
      }).then((result) => {
        let trans = [].concat(this.trans)
        switch (this.walletType) {
          case '2':
            trans[0].value = util.cent2yuan(result.innerAmount) + '元，' + result.innerNum + '个'
            break
          case '4':
            trans[0].value = util.dealYuanToThousand(util.cent2yuan(result.amount)) + '元'
            trans[1].value = util.dealNumToThousand(result.count) + '笔'
            trans[2].value = util.dealYuanToThousand(util.cent2yuan(result.feeAmount)) + '元'
            break
          case '5':
            trans[0].value = util.dealYuanToThousand(util.cent2yuan(result.orderAmount)) + '元'
            trans[1].value = util.dealNumToThousand(result.orderNum) + '笔'
            trans[2].value = util.dealYuanToThousand(util.cent2yuan(result.feeAmount)) + '元'
            trans[4].value = util.dealYuanToThousand(util.cent2yuan(result.refundAmount)) + '元'
            trans[5].value = util.dealNumToThousand(result.refundNum) + '笔'
            trans[6].value = util.dealYuanToThousand(util.cent2yuan(result.feeRefundAmount)) + '元'
            break
        }
        this.trans = trans
      })
    },
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
    }
  },
  created () {
    this.walletType = util.getQuery('wallet_type')
  },
  mounted () {
    jsapi().then(() => {
      this.isJsapiReady = true
      if (process.env.NODE_ENV === 'development') {
        // 显示右侧菜单，比如刷新、分享链接，可以方便调试
        FSOpen.webview.navbar.showMenu({
          menuList: [
            'service:favorite',
            'share:toConversation',
            'share:toFeed',
            'separator',
            'share:toWXFriend',
            'separator', // 分隔符，可根据需要多次使用
            'page:refresh',
            'page:copyURL',
            'page:generateQR',
            'page:openWithBrowser'
          ]
        })
      }
    })
  }
}
</script>

<style lang="less">
@import '~@/assets/style/all';

.calendar-wrapper{
  position: relative;
  padding: 0 0.6rem 0 0.66rem;
  height: 1.76rem;
  display: flex;
  align-items: center;
  background: @white;
  &::after{
    .setBottomLine();
  }
}
.calendar-icon{
  display: inline-block;
  .square(0.88rem);
  background: no-repeat center;
  .img-retina(@img-calendar,@img-calendar2x,0.88rem,0.88rem);
}
.calendar-text{
  flex: 1;
  margin-left: 0.64rem;
  line-height: 1;
  font-size: 0.56rem;
  color: #999999;
}
.arrow{
  display: inline-block;
  .size(0.48rem,0.28rem);
  background: no-repeat center;
  .img-retina(@img-bottom-arrow, @img-bottom-arrow2x, 0.48rem,0.28rem);
}
.trans-wrapper{
  list-style: none;
  padding: 0.08rem 0;
  background: @white;
}
.trans{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 0.9rem;
  margin: 0.72rem 0.6rem 0.72rem 0.66rem;
  line-height: 1;
  font-size: 0.64rem;
}
.trans-seperator{
  margin: 0 0.6rem 0 0.66rem;
  height: 1px;
  background: #EEEEEE;
  transform-origin: 0 100%;
  transform: scaleY(0.5);
}
.trans-name{
  color: #999999;
}
.trans-value{
  color: #666666;
}
.tip{
  margin: 0.34rem 0 0 0.54rem;
  font-size: 0.48rem;
  color: #BFBFBF;
}
</style>
