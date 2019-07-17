<style>
#__nuxt,
#__layout,
.wrapper {
  width: 100%;
  height: 100%;  
}
.main {
  height: 100%;
}

.main > div,
.main > section,
.main > article {
  min-height: 100%;
  margin-bottom: -81px;

  &:after {
    display: block;
    content: '';
    height: 81px;
  }
  
  border-bottom: 0;
}
.main > #footer {
  position: relative;
  z-index: 1;
  border-top: 0; 
}
</style>
<template lang="html">
<div class="wrapper">
  <nav id="sidebar" class="behavior_1">
    <div class="wrap">
      <div class="profile">
        <nuxt-link to="/">
            <img :src="logo_url" :alt="title">
        </nuxt-link>
        <span>{{title}}</span>
      </div>
      <ul class="buttons">
        <li v-for="nav in navigation" :key="nav.label">
          <nuxt-link v-if="nav.url.indexOf('http') === -1" :to="nav.url" :title="nav.label">
            <i :class="['iconfont', 'icon-' + nav.option]"></i>
            <span>&nbsp;{{nav.label}}</span>
          </nuxt-link>
          <a v-else :href="nav.url" :title="nav.label" target="_blank">
            <i :class="['iconfont', 'icon-' + nav.option]"></i>
            <span>&nbsp;{{nav.label}}</span>
          </a>
        </li>
      </ul>
    </div>

    <ul class="buttons">
      <li>
        <a v-if="github_url" :href="github_url" class="inline" rel="nofollow" target="_blank">
          <i class="iconfont icon-github-v" title="GitHub"></i>
        </a>
        <a v-if="twitter_url && twitter_url.indexOf('twitter.com') > -1" :href="twitter_url" class="inline"  rel="nofollow" target="_blank">
          <i class="iconfont icon-twitter-v" title="Twitter"></i>
        </a>
        <a v-if="twitter_url && twitter_url.indexOf('weibo.com') > -1" :href="twitter_url" class="inline"  rel="nofollow" target="_blank">
          <i class="iconfont icon-weibo" title="weibo"></i>
        </a>
        <a class="inline" href="/atom.xml" target="_blank">
          <i class="iconfont icon-rss-v" title="RSS"></i>
        </a>
        <nuxt-link class="inline" to="/search">
          <i class="iconfont icon-search" title="Search"></i>
        </nuxt-link>
      </li>
    </ul>
  </nav>
  <div id="header">
    <div class="btn-bar" @click.prevent="toggleSide"><i></i></div>
    <h1><nuxt-link to="/">{{title}}</nuxt-link></h1>
    <nuxt-link class="me" to="/about/">
      <img :src="logo_url" :alt="title">
    </nuxt-link>
  </div>

  <div id="sidebar-mask" @click.prevent="toggleSide" :style="{display: sideMaskShow ? 'block' : 'none'}"></div>

  <div id="main" class="main">
    <nuxt />
    <footer id="footer" class="inner">
      &copy; {{ currentYear }}&nbsp;-&nbsp; {{title}}
      <template v-if="miitbeian">
        <span>&nbsp;-&nbsp;</span><a target="_blank" rel="nofollow" class="external beian" href="http://www.miitbeian.gov.cn/">{{miitbeian}}</a>
      </template>
      <template v-else-if="mpsbeian">
        <span>&nbsp;-&nbsp;</span><a target="_blank" rel="nofollow" class="external beian" href="http://www.beian.gov.cn/">{{mpsbeian}}</a>
      </template>
      <template v-else>
        <span>&nbsp;-&nbsp;</span><nuxt-link to="/">{{hostname}}</nuxt-link>
      </template>
      <br />
      Powered by&nbsp;<a target="_blank" href="https://nuxtjs.org">Nuxt.js</a>&nbsp;&amp;&nbsp;<a target="_blank" rel="nofollow" class="external" href="https://firekylin.org">FireKylin</a>
    </footer>
  </div>
</div>
</template>
<script>
  export default {
    head () {
      return {
        title: '首页',
        titleTemplate: `%s | ${this.$config.title}`,
        meta: [{ name: 'description', content: this.metaDescription }]
      }
    },
    data () {
      const config = this.$config
      return {
        ...config,
        twitter_url: config.twitter_url || '',
        currentYear: new Date().getFullYear(),
        mpsbeian: config.mpsbeian || '',
        miitbeian: config.miitbeian || '',
        hostname: config.hostname || '',
        sideMaskShow: false
      }
    },
    computed: {
      metaDescription () {
        return this.$config.description
      }
    },
    methods: {
      toggleSide () {
        const SIDE_CLSN = 'side'
        const body = document.body
        if (body.className.indexOf(SIDE_CLSN) > -1) {
          body.className = body.className.replace(SIDE_CLSN, '')
          this.sideMaskShow = false
        } else {
          body.className += (' ' + SIDE_CLSN)
          this.sideMaskShow = true
        }
      }
    },
    mounted () {
      this.$fixCode()
    }
  }
</script>

