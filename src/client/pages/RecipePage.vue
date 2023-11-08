<template>
  <div>
    <AppHeader />
    <div class="main">
      <div class="container">
        <div class="main-content">
          <img
            class="recipe-image"
            :src="'data:image/jpg;base64'"
            alt=""
          />
          <div class="content-box">
            <p class="item-name"></p>
            <p class="item-description recipe-margin"></p>

            <p class="ingredients-title">Ингредиенты на 3 порции:</p>
            <ul class="ingredient-list">
              <!-- <% recipe.ingredients.forEach((ingredient) => { %> -->
              <li class="ingredient-item">
                <!-- <%= ingredient.name %> - <%= ingredient.volume %> -->
              </li>
            </ul>

            <p class="instructions-title">Инструкция приготовления:</p>
            <p class="item-instruction"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../components/ErrorDisplay.vue';
import ErrorDisplay from '../components/ErrorDisplay.vue';

</script>

<style scoped></style>
