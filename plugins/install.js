import Vue from "vue";
import VueLazyload from "vue-lazyload";

// components
import Post from "../components/Post.vue";
import Page from "../components/Page.vue";
import Pagination from "../components/pagination.vue";
import Collection from "../components/collection.vue";
import Embeding from "../components/embeding.vue";
import Caniuse from "../components/caniuse.vue";

// eslint-disable-next-line
import config from "json-loader!yaml-loader!../config.yaml";

const protocol =
  typeof location === "undefined" ? "http:" : window.location.protocol;
const siteURL = protocol + "//" + config.hostname;
config.site_url = siteURL;

Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading:
    "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
  attempt: 1,
  lazyComponent: true
});

Vue.component("post", Post);
Vue.component("page", Page);
Vue.component("pagination", Pagination);
Vue.component("collection", Collection);
Vue.component("embeding", Embeding);
Vue.component("caniuse", Caniuse);

Vue.prototype.$gitalkConfig = config.gitalk;

// 注入配置
Vue.prototype.$config = Object.freeze(config);
