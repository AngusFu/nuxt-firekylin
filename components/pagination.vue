<template>
  <nav class="pagination">
    <nuxt-link v-if="prev" :to="prev" class="prev">&laquo; 上一页</nuxt-link>
    <nuxt-link v-if="next" :to="next" class="next">下一页 &raquo;</nuxt-link>
    <div class="center">
      <nuxt-link to="/archives">博客归档</nuxt-link>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    pagination: {
      type: Object,
      required: true
    }
  },
  computed: {
    prev() {
      const p = this.pagination;
      if (p.currentPage > 1) return p.path + (p.currentPage - 1);
      return null;
    },
    next() {
      const p = this.pagination;
      if (p.currentPage < p.totalPages) return p.path + (p.currentPage + 1);
      return null;
    }
  },

  methods: {
    onKeydown(e) {
      if (document.activeElement !== document.body) {
        return;
      }
      const n = +e.keyCode;
      const { prev, next } = this;
      const path = n === 37 ? prev : n === 39 ? next : null;
      if (path) {
        this.$router.push(path);
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
