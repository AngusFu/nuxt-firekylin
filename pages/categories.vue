<template>
  <article class="post tags">
    <h1 class="title">分类</h1>
    <div class="entry-content">
      <section>
        <nuxt-link
          v-for="cate in cates"
          :key="cate.name"
          :to="`/category/${cate.pathname}`"
          :data-tag="cate.name"
        >{{cate.name}} ({{cate.count}})</nuxt-link>
      </section>
    </div>
  </article>
</template>

<script>
  export default {
    data () {
      return {
        cates: require('../data/cates.json')
      }
    }
  }
</script>
