<template>
  <transition :name="prefixCls">
    <div :class="prefixCls" v-show="visible">
      <div :class="`${prefixCls}-wrapper`" :style="{ 'padding': type!=='toast' ? '20px' : '10px' }">
        <spinner :size="size" v-if="type!=='toast'" :style="{ 'margin-bottom': type!=='toast' ? '5px' : '0px' }">
        </spinner>
        <span :class="`${prefixCls}-text`" v-show="text":style="{ 'margin-top': type!=='toast' ? '5px' : '0px' }">{{ text }}</span>
      </div>
      <div :class="`${prefixCls}-mask`" @touchmove.stop.prevent></div>
    </div>
  </transition>
</template>

<script>
  import Spinner from '../../spinner';

  export default {
    components: {
      Spinner,
    },

    props: {
      text: String,
      type: String,
      size: {
        type: Number,
        default: 36,
      },
    },

    data() {
      return {
        prefixCls: 'hmb-loading',
        visible: false,
      };
    },
  };
</script>

<style lang="less">
@loadingPrefixCls: hmb-loading;

.@{loadingPrefixCls} {
  transition: opacity .2s linear;

  &-wrapper {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    box-sizing: border-box;
    text-align: center;
  }

  &-text {
    display: block;
    color: #fff;
    text-align: center;
    font-size: 16px;
  }

  &-spin {
    display: inline-block;
    text-align: center;
  }

  &-mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    background: transparent;
  }

  &-enter-active,
  &-leave-active {
    transition: opacity 0.5s
  }

  &-enter,
  &-leave-active {
    opacity: 0;
  }
}
</style>
