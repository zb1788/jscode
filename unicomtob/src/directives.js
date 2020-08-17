import Vue from 'vue'
Vue.directive('uploadWidth',{
    bind(el, binding, vnode){
        const target = el.querySelector('.van-uploader__upload');
        target.style.width = '100%'
    }
})