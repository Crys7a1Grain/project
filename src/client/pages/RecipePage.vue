<template>
  <div>
    <AppHeader />
    <div class="main">
      <div class="container">
        <div class="main-content" v-if="recipe">
          <img
            class="recipe-image"
            :src="`data:image/jpg;base64,${recipe.image}`"
            alt="recipe image"
          />
          <div class="content-box">
            <p class="item-name">{{ recipe.name }}</p>
            <p class="item-description recipe-margin">{{ recipe.description }}</p>
            <p class="ingredients-title">Ингредиенты на 3 порции:</p>
            <ul class="ingredient-list">
              <li class="ingredient-item" v-for="ingredient in recipe.ingredients">
                {{ ingredient.name }} - {{ ingredient.volume }}
              </li>
            </ul>

            <p class="instructions-title">Инструкция приготовления:</p>
            <p
              class="item-instruction"
              v-for="[id, instruction] in Object.entries(
                getSentences(recipe.instructions),
              ).map(([id, instruction]) => [parseInt(id) + 1, instruction])"
              :key="id"
            >
              {{ id }}. {{ instruction }}
            </p>
          </div>
        </div>
        <ErrorDisplay v-if="errorText.message" :errorMessage="errorText.message" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, defineComponent } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import ErrorDisplay from '../components/ErrorDisplay.vue';

defineComponent({
  components: {
    AppHeader,
    ErrorDisplay,
  },
});

interface recipe {
  name: string;
  description: string;
  image: string;
  ingredients: ingredient[];
  instructions: string;
}
interface ingredient {
  name: string;
  volume: string;
}

const recipe = ref<recipe | null>(null);

const recipeIdProp = defineProps(['recipeId']);
const recipeId = ref(recipeIdProp.recipeId);
console.log('recipeId = ' + recipeId.value);

interface IError {
  type: string | null;
  message: string | null;
}

const errorText = ref<IError>({ type: null, message: null });

const fetchRecipeData = async () => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/recipe/${recipeId.value}`,
    );
    if (response.ok) {
      const data = await response.json();
      recipe.value = data;
      if (recipe.value) {
        recipe.value.instructions = recipe.value.instructions.replace(/\\n/g, '');
        recipe.value.instructions = recipe.value.instructions.replace(/ \n/g, '');
      }
    } else {
      console.error('Ошибка загрузки данных с сервера');
      errorText.value.message = 'Произошла ошибка при загрузке данных с сервера.';
    }
  } catch (error) {
    console.error('Произошла ошибка:', error);
    errorText.value.message = 'Произошла неизвестная ошибка. Сервер не доступен.';
  }
};

const getSentences = (text: string) => {
  const sentenceRegex = /[^.!?]*[.!?]/g;
  const sentences = text.match(sentenceRegex);
  return sentences ? sentences.map((sentence) => sentence.trim()) : [];
};

onBeforeMount(async () => {
  await fetchRecipeData();
});
</script>

<style scoped></style>
