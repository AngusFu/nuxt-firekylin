<template>
  <collection :data="posts" />
</template>
<script>
import posts from "../data/posts.json";

export default {
  data() {
    return { posts };
  },
};
</script>
