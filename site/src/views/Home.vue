<template>
  <div class="home">
    <auto-complete class="autocomplete"/>
  </div>
</template>

<script>
import AutoComplete from '@/components/AutoComplete.vue';

export default {
  components: { AutoComplete }
}
</script>

<style lang="less" scoped>
  .autocomplete { width: 80vw; }
</style>
