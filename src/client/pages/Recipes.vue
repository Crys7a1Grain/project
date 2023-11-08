<template>
  <div>
    <AppHeader />
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';
import AppHeader from '../components/AppHeader.vue';

defineComponent({
  components: {
    AppHeader,
  },
});
</script>

<style scoped>

</style>