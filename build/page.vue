<template>
  <page :config="config">__MARKDOWN__</page>
</template>

<script>
export default {
  computed: {
    config() {
      return __CONFIG__;
    }
  }
};
</script>
