<template>
  <div class="error">
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  props: {
    errorMessage: String,
  },
};
</script>

<style scoped>
</style>