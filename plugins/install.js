import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

// components
import Pagination from '../components/pagination.vue'
import Collection from '../components/collection.vue'
import Embeding from '../components/embeding.vue'
import Caniuse from '../components/caniuse.vue'
import GitalkComment from '../components/gitalk.vue'

// eslint-disable-next-line
import config from 'json-loader!yaml-loader!../config.yaml'

const protocol = typeof location === 'undefined' ? 'http:' : window.location.protocol
const siteURL = protocol + '//' + config.hostname
config.site_url = siteURL

Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
  attempt: 1,
  lazyComponent: true
})
Vue.component('pagination', Pagination)
Vue.component('collection', Collection)
Vue.component('embeding', Embeding)
Vue.component('caniuse', Caniuse)
Vue.component('gitalk', GitalkComment)

Vue.prototype.$gitalkConfig = config.gitalk

// 注入配置
Vue.prototype.$config = Object.freeze(config)

// 添加方法
Vue.prototype.$fixCode = function () {
  // 临时措施  2017-09-10
  // Vue SSR text escape 导致
  // https://github.com/vuejs/vue/commit/172dbf9faf4cb71dff72c77fdfe80fa1932d1ba3
  // 已修复 等待版本发布
  const preAreas = [...this.$el.querySelectorAll('textarea.pre-area')]
  preAreas.forEach((elem) => {
    const pre = document.createElement('pre')
    pre.innerHTML = decodeURIComponent(elem.value)
    elem.parentNode.insertBefore(pre, elem)
    elem.parentNode.removeChild(elem)
  })

  const codespanAreas = [...this.$el.querySelectorAll('textarea.codespan')]
  codespanAreas.forEach((elem) => {
    const span = document.createElement('code')
    span.textContent = elem.value
    elem.parentNode.insertBefore(span, elem)
    elem.parentNode.removeChild(elem)
  })
}
