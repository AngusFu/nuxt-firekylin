<template>
<nav class="pagination">
  <nuxt-link
    v-if="pagination.currentPage > 1"
    :to="pagination.path + (pagination.currentPage - 1)"
    class="prev"
  >&laquo; 上一页</nuxt-link>

  <nuxt-link
    v-if="pagination.currentPage < pagination.totalPages"
    :to="pagination.path + (pagination.currentPage + 1)"
    class="next"
  >下一页 &raquo;</nuxt-link>
  <div class="center"><nuxt-link to="/archives">博客归档</nuxt-link></div>
</nav>
</template>

<script>
  export default {
    props: {
      pagination: {
        type: Object,
        required: true
      }
    }
  }
</script>
