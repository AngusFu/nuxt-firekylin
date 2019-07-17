<template>
  <embeding :src="src" :ratio="ratio"></embeding>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      tid: null,
      ratio: 2.8
    }
  },
  methods: {
    resize (e) {
      const iframe = this.$el.querySelector('iframe')
      if (e.source === iframe.contentWindow) {
        const h = e.data.match(/\d+$/)[0]
        this.ratio = iframe.clientWidth / h
        console.log('resize')
      }
    },
    doResize (e) {
      setTimeout(this.tid)
      this.tid = setTimeout(() => {
        this.resize(e)
      }, 150)
    }
  },
  mounted () {
    this.doResize = this.doResize.bind(this)
    window.addEventListener('message', this.doResize)
  },
  destoryed () {
    window.removeEventListener('message', this.doResize)
  }
}
</script>
