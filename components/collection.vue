<template>
  <section id="page-index">
    <h1 v-if="tag" class="intro">标签 <nuxt-link :to="`/tag/${tag}`">{{tag}}</nuxt-link> 下的文章</h1>
    <h1 v-if="cate" class="intro">分类 <nuxt-link :to="`/category/${cate}`">{{cate}}</nuxt-link> 下的文章</h1>

    <article v-for="post in posts" :key="post.title" class="post">
      <div class="meta">
        <div>
          <template v-if="post.user">
            <span class="author">
              {{ post.user }}
            </span>
            <span> 发布于 </span>
          </template>
          <span class="date">{{post.create_time}}</span>
        </div>
        <!--<div class="comment">
          <a :href="`/post/${post.pathname}#comments`">{{post.comment_num}} comments</a>
        </div>-->
      </div>

      <h1 class="title">
        <nuxt-link :to="`/post/${post.pathname}`">{{post.title}}</nuxt-link>
      </h1>

      <div class="entry-content">
        <div class="summary" v-html="post.summary"></div>
        <p class="more">
          <nuxt-link :to="`/post/${post.pathname}`">阅读全文 »</nuxt-link>
        </p>
      </div>
    </article>
    <pagination :pagination="pagination" v-if="pagination"/>
  </section>
</template>

<script>
  import pagination from './pagination'

  export default {
    components: {
      pagination
    },
    props: {
      data: {
        type: Array,
        require: true
      },
      type: {
        type: String
      }
    },
    head () {
      if (this.title) {
        return {
          title: this.title
        }
      }
      return {}
    },
    data () {
      let posts
      let path = ''
      let title = ''
      const params = this.$route.params

      if (this.type === 'cate') {
        posts = this.data.filter(post => post.category && post.category === params.cate)
        path = '/category/' + params.cate + '/'
        title = '分类: ' + params.cate
      } else if (this.type === 'tag') {
        posts = this.data.filter(post => post.tags.indexOf(params.tag) > -1)
        path = '/tag/' + params.tag + '/'
        title = '标签: ' + params.tag
      } else {
        posts = this.data
        path = '/posts/'
      }

      const pageSize = this.$config.page_size || 10
      const totalPages = Math.ceil(posts.length / pageSize)
      const index = (params.page || 1) - 1
      const currentPage = index + 1
  
      return {
        tag: params.tag,
        cate: params.cate,
        title,
        posts: posts.slice(pageSize * index, pageSize * currentPage),
        pagination: {
          currentPage,
          totalPages,
          path
        }
      }
    },
    mounted () {
      this.$fixCode()
    }
  }
</script>
