// SEE https://zh.nuxtjs.org/faq/google-analytics/
import Vue360Analysis from "vue-fx";

export default ({ app: { router }, store }) => {
  if (
    typeof document !== "undefined" &&
    /debug/.test(document.cookie) === false
  ) {
    Vue360Analysis(router, 99407);
  }
};
