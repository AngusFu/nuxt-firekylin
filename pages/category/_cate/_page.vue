<template>
  <collection :data="posts" type="cate" />
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
