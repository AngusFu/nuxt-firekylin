<template>
  <div></div>
</template>

<script>
import assign from "object-assign";

export default {
  methods: {
    renderComment() {
      const id = location.pathname.replace(/\/$/, "");
      const gitalk = new window.Gitalk(assign({ id }, this.$gitalkConfig));
      gitalk.render(this.$el);
    }
  },
  mounted() {
    this.timer = setTimeout(() => {
      this.renderComment();
    }, 3000);
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  }
};
</script>
