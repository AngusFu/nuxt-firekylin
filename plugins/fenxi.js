// SEE https://zh.nuxtjs.org/faq/google-analytics/
import Vue360Analysis from 'vue-fx'

export default ({ app: { router }, store }) => {
  Vue360Analysis(router, 99407)
}
