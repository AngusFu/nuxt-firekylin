<template>
<collection :data="posts" type="tag" />
</template>
<script>
export default {
  data () {
    return {
      posts: require('../../../data/posts.json')
    }
  }
}
</script>
