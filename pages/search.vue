<template>
<article class="post detail">
  <h1 class="title">搜索</h1>
  <div class="entry-content">
    <div id="search">
      <div style="position: relative;">
        <div class="wrapper">
          <input maxlength="80" placeholder="请输入关键字..." id="keyword" name="keyword" v-model="keyword" type="search" />
        </div>
        <input class="submit" type="submit" value="搜索" @click="search" />
      </div>
    </div>
  </div>
</article>
</template>
<script>
  export default {
    head () {
      return {
        title: '搜索'
      }
    },
    data () {
      return {
        keyword: '',
        hostname: this.$config.hostname
      }
    },
    computed : {
      url () {
        return `https://www.google.com/search?q=${this.keyword}+site%3A${this.hostname}`
      }
    },
    methods: {
      search () {
        const w = window.open('about:blank')
        w.document.write('<script>' +
          'location.href = "' + this.url +
          '"<\/scr' + 'ipt>'
        )
      }
    }
  }
</script>
