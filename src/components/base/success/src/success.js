import Vue from 'vue';
import Loading from './success.vue';

const Indicator = Vue.extend(Loading);
let toastInstance;
let toastTimer;

let instance;
let timer;

export default {
  toast(options = {}) {
    let duration = options.duration || 3000;
    if (!toastInstance) {
      toastInstance = new Indicator({
        el: document.createElement('div'),
      });
    }
    if (toastInstance.visible) return;
    toastInstance.type = 'toast';
    toastInstance.text = typeof options === 'string' ? options : options.text || '加载中..';
    document.body.appendChild(toastInstance.$el);
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    Vue.nextTick(() => {
      toastInstance.visible = true;
      toastTimer = setTimeout(() => {
        this.visible = false;
        if (toastInstance.$el) {
          toastInstance.$el.style.display = 'none';
        }
        options.afterClose && options.afterClose(); // 回调事件钩子
      }, duration);
    });
  },

  open(options = {}) {
    if (!instance) {
      instance = new Indicator({
        el: document.createElement('div'),
      });
    }
    if (instance.visible) return;
    instance.text = typeof options === 'string' ? options : options.text || '加载中..';
    document.body.appendChild(instance.$el);
    if (timer) {
      clearTimeout(timer);
    }

    Vue.nextTick(() => {
      instance.visible = true;
    });
  },

  close() {
    if (instance) {
      Vue.nextTick(() => {
        instance.visible = false;
        timer = setTimeout(() => {
          if (instance.$el) {
            instance.$el.style.display = 'none';
          }
        }, 200);
      });
    }
  },
};
