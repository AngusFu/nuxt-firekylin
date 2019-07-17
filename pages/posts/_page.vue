<template>
<collection :data="posts" />
</template>
<script>
export default {
  data () {
    return {
      posts: require('../../data/posts.json')
    }
  }
}
</script>
