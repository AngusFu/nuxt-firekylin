<template>
  <div></div>
</template>

<script>
  import assign from 'object-assign'
  Object.assign = assign

  export default {
    props: {
      tags: Array
    },
    methods: {
      renderComment (Gitalk) {
        const id = location.pathname.replace(/\/$/, '')
        const gitalk = new Gitalk(
          assign({ id }, this.$gitalkConfig)
        )
        gitalk.render(this.$el)
      }
    },
    mounted () {
      import(/* webpackChunkName: "gitalk-bundle" */'gitalk/dist/gitalk.js').then(Gitalk => {
        this.renderComment(Gitalk)
      })
    }
  }
</script>
