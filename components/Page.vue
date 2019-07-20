<template>
  <article class="post page">
    <h1 class="title">{{title}}</h1>
    <div class="entry-content">
      <slo></slo>
    </div>
    <gitalk v-if="useComment" />
  </article>
</template>

<script>
export default {
  props: ["config"],
  head() {
    const { config } = this;
    const desc = config.desc || config.decription;
    return {
      title: config.title,
      meta: [{ name: "description", content: desc || "" }]
    };
  },
  computed: {
    title() {
      return this.config.title;
    },
    useComment() {
      return !!this.config.comment;
    }
  }
};
</script>
