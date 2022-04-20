<template>
  <div id="page-post">
    <article class="post detail">
      <div class="meta">
        <div class="date">{{post.create_time}}</div>
      </div>
      <h1 class="title">{{post.title}}</h1>
      <div class="entry-content">
        <blockquote v-if="post.translation">
          <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            原文作者:
            <a target="_blank" :href="post.translation.social">{{post.translation.author}}</a>
            <br />原文地址:
            <a target="_blank" :href="post.translation.from">{{post.translation.from}}</a>
            <br />译文地址:
            <a target="_blank" :href="permLink">{{permLink}}</a>
            <br />本文由
            <a target="_blank" :href="this.$config.site_url">{{this.$config.site_owner}}</a> 翻译，转载请保留此声明。
            <br />著作权属于原作者，本译文仅用于学习、研究和交流目的，请勿用于商业目的。
          </p>
        </blockquote>
        <slot></slot>
      </div>
    </article>
    <nav class="pagination" v-if="prevPost.title || nextPost.title">
      <nuxt-link
        v-if="prevPost.title"
        :to="`/post/${prevPost.pathname}`"
        :title="prevPost.title"
        class="prev"
      >&laquo; {{ prevPost.title }}</nuxt-link>
      <nuxt-link
        v-if="nextPost.title"
        :to="`/post/${nextPost.pathname}`"
        :title="nextPost.title"
        class="next"
      >{{ nextPost.title }} &raquo;</nuxt-link>
    </nav>
  </div>
</template>

<script>
export default {
  props: ["data"],
  head() {
    const { data } = this;
    return {
      title: data.title,
      meta: [
        { name: "keywords", content: data.keywords || "" },
        { name: "description", content: data.description }
      ]
    };
  },
  data() {
    const { data } = this;
    return {
      post: data,
      prevPost: data.prev,
      nextPost: data.next,
      tags: data.tags,
      permLink: this.$config.site_url + "/post/" + data.pathname
    };
  },
  methods: {
    onKeydown(e) {
      if (document.activeElement !== document.body) {
        return;
      }

      const { prevPost, nextPost } = this;
      const n = +e.keyCode;
      const item = n === 37 ? prevPost : n === 39 ? nextPost : null;
      const path = (item && item.pathname) || null;
      if (path && path !== "null") {
        this.$router.push("/post/" + path);
      }
    }
  },
  mounted() {
    document.addEventListener("keydown", this.onKeydown);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.onKeydown);
  }
};
</script>
