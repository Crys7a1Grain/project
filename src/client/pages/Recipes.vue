<template>
  <div>
    <AppHeader />
    <div class="main">
      <div class="container">
        <div class="main-content">
          <h1 class="main-title">Список рецептов</h1>
          <div class="item" v-if="recipes" v-for="recipe in recipes">
            <img
              class="item-image"
              :src="'data:image/jpg;base64,' + recipe.image"
              alt="recipe image"
            />
            <div class="box">
              <p class="item-name">{{ recipe.name }}</p>
              <p class="item-description">{{ recipe.description }}</p>
              <button
                class="item-button"
                @click="openRecipePage(recipe.id)"
              >
                Посмотреть рецепт
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import ErrorDisplay from '../components/ErrorDisplay.vue';

defineComponent({
  components: {
    AppHeader,
    ErrorDisplay,
  },
});

interface IRecipe {
  id: number;
  name: string;
  description: string;
  image: string;
}

const recipes = ref<IRecipe[]>();

const fetchRecipesData = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/recipes');
    const recipesJSONParsed = await response.json();
    recipes.value = recipesJSONParsed;
  } catch (error) {
    console.error(error);
  }
};

onBeforeMount(async () => {
  await fetchRecipesData();
});

const openRecipePage = (recipeId: number) => {
  const recipeUrl = `http://localhost:5173/recipe/${recipeId}`;
  window.open(recipeUrl, '_blank');
};
</script>

<style scoped></style>
