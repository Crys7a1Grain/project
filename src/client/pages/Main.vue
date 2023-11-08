<template>
  <div>
    <AppHeader />
    <IngredientsList />
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import IngredientsList from '../components/IngredientsList.vue';

defineComponent({
  components: {
    AppHeader,
    IngredientsList,
  },
});
</script>

<style scoped></style>
