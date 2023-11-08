<template>
  <div>
    <header class="header">
      <div class="container">
        <div class="header-content">
          <router-link to="/" class="title header-title">Поиск рецептов по ингредиентам</router-link>
          <router-link to="/recipes/" class="title header-title">Рецепты</router-link>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped>

</style>