<template>
  <article class="post archive">
    <h1 class="title">归档</h1>
    <div class="entry-content" v-for="item in data" :key="item.yearMonth">
      <h3>{{item.yearMonth}} ({{item.data.length}})</h3>
      <ul>
        <li v-for="post in item.data" :key="post.yearMonth">
          <nuxt-link :to="`/post/${post.pathname}`" :title="post.title">
            {{post.title}}
          </nuxt-link>
          <span class="date">{{post.create_time}}</span>
        </li>
      </ul>
    </div>
  </article>
</template>

<script>
  import archives from '../data/archives.json'
  export default {
    head: function() {
      return {
        title: "归档"
      }
    },
    data () {
      return {
        data: archives
      }
    }
  }
</script>