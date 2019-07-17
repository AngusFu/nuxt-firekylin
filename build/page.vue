<template>
  <article class="post page">
    <h1 class="title">{{title}}</h1>
    <div class="entry-content">
__MARKDOWN__
    </div>
    <gitalk v-if="useComment" />
  </article>
</template>
<script>
  const config = __CONFIG__
  export default {
    head () {
      const desc = config.desc || config.decription
      return {
        title: config.title,
        meta: [{ name: 'description', content: desc || '' }]
      }
    },
    data () {
      return {
        title: config.title,
        useComment: !!config.comment
      }
    },
    mounted () {
      this.$fixCode()
    }
  }
</script>
