<style scoped>
.aspect-ratio iframe {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: 0;
}
.aspect-ratio { 
  position: relative;
  width: 100%;
  height: 0;
  padding: 31.250% 0;
  margin-top: 15px;
  overflow: hidden;
}
</style>
<template>
  <div class="aspect-ratio" :style="{padding: paddingV + ' 0'}" :data-ratio="ratio">
    <iframe :src="src" width="100%" height="100%" scrolling="no" frameborder="0" allowfullscreen />
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    ratio: {
      type: [Number, String],
        default: 1.532
    }
  },
  computed: {
    paddingV () {
      return ((1 / this.ratio / 2) * 100).toFixed(3) + '%'
    }
  }
}
</script>
