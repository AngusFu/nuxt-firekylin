<template>
  <article class="post tags">
    <h1 class="title">标签</h1>
    <div class="entry-content">
      <section>
        <nuxt-link
          v-for="tag in tags"
          :key="tag.name"
          :to="`/tag/${tag.pathname}`"
          :data-tag="tag.name"
        >{{tag.name}} ({{tag.count}})</nuxt-link>
      </section>
    </div>
  </article>
</template>

<script>
  export default {
    head () {
      return {
        title: '标签'
      }
    },
    data () {
      return {
        tags: require('../data/tags.json')
      }
    }
  }
</script>
