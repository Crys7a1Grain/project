<template>
  <div class="main">
    <div class="container">
      <div class="column1">
        <div class="form">
          <button class="clearButton form-button" @click="clearForm">
            Очистить
          </button>

          <form id="search-form" @submit.prevent="search">
            <input
              v-for="ingredient in ingredients"
              :key="ingredient.id"
              type="hidden"
              name="ingredients[]"
              :value="ingredient.id"
            />
            <button class="form-button" type="submit">Найти</button>
          </form>
        </div>
        <ErrorDisplay
          v-if="errorText.type === 'ingredients-error'"
          :errorMessage="errorText.message"
        />
        <div v-for="category in categories" :key="category.id" class="category">
          <p class="category-name">{{ category.name }}</p>
          <div class="divider"></div>
          <div class="wrapper">
            <div
              v-for="ingredient in ingredientsByCategory(category.id)"
              :key="ingredient.id"
            >
              <div
                v-if="ingredient.category_id === category.id"
                class="ingredient"
                :data-id="ingredient.id"
                :class="{ selected: selectedIngredients.includes(ingredient.id) }"
                @click="toggleSelection($event)"
              >
                {{ ingredient.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column2">
        <h3 class="results">Результаты поиска:</h3>
        <ul class="myList">
          <ErrorDisplay
            v-if="errorText.type === 'server-error'"
            :errorMessage="errorText.message"
          />
          <div
            class="item"
            v-if="recipes"
            v-for="recipe in recipes"
            :key="recipe.id"
          >
            <img
              class="item-image"
              :src="'data:image/jpeg;base64,' + recipe.image"
              alt="recipe image"
            />
            <div class="item-box">
              <div class="item-name">{{ recipe.name }}</div>
              <div class="item-description">{{ recipe.description }}</div>
              <button class="item-button" @click="openRecipePage(recipe.id)">
                Посмотреть рецепт
              </button>
            </div>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, onBeforeMount } from 'vue';
import ErrorDisplay from './ErrorDisplay.vue';

interface Ingredient {
  id: number;
  name: string;
  category_id: number;
}
interface Category {
  id: number;
  name: string;
}

const ingredients = ref<Ingredient[]>([]);
const categories = ref<Category[]>([]);

const selectedIngredients: number[] = [44, 45, 46];
const preselectedIngredients: number[] = [44, 45, 46];

interface IError {
  type: string | null;
  message: string | null;
}

interface IRecipe {
  id: number;
  name: string;
  description: string;
  image: string;
}

const recipes = ref<IRecipe[]>([]);

const errorText = ref<IError>({ type: null, message: null });
const dataLoaded: Ref<boolean> = ref(false);

const fetchIngredientsAndCategories = async () => {
  try {
    const response = await fetch(
      'http://localhost:8080/api/ingredients-and-categories',
    );
    if (response.ok) {
      const data = await response.json();
      ingredients.value = data[0];
      categories.value = data[1];
      dataLoaded.value = true;
    } else {
      console.error('Ошибка загрузки данных с сервера');
      errorText.value.type = 'ingredients-error';
      errorText.value.message = 'Произошла ошибка при загрузке данных с сервера.';
    }
  } catch (error) {
    console.error('Произошла ошибка:', error);
    errorText.value.type = 'ingredients-error';
    errorText.value.message = 'Произошла неизвестная ошибка. Сервер не доступен.';
  }
};

onBeforeMount(fetchIngredientsAndCategories);

const ingredientsByCategory = (categoryId: number) => {
  return ingredients.value.filter(
    (ingredient) => ingredient.category_id === categoryId,
  );
};

const toggleSelection = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  target.classList.toggle('selected');
  const ingredientId = target.dataset.id;
  if (ingredientId != null) {
    const numberId = parseInt(ingredientId, 10);
    if (selectedIngredients.includes(numberId)) {
      // проверяет наличие ингридиента(айди) в массивае
      selectedIngredients.splice(
        // если находит такой ингридиент, то удаляет его, находя по индексу
        selectedIngredients.indexOf(numberId),
        1, //удаляет 1 ингридиент.
      );
    } else {
      selectedIngredients.push(numberId);
    }
  }
};

const clearForm = () => {
  // Очищаем массив выбранных ингредиентов
  selectedIngredients.length = 0;

  // Снимаем выделение со всех выбранных ингредиентов
  const ingredientElements = document.querySelectorAll('.ingredient.selected');
  ingredientElements.forEach((element) => {
    element.classList.remove('selected');
  });

  // Повторно заносим ингредиенты из preselectedIngredients
  preselectedIngredients.forEach((ingredient) => {
    selectedIngredients.push(ingredient);
  });

  // Повторно выделяем ингредиенты из preselectedIngredients
  preselectedIngredients.forEach(function (ingredientId) {
    const ingredientElement = document.querySelector(
      `.ingredient[data-id="${ingredientId}"]`,
    );
    if (ingredientElement) {
      ingredientElement.classList.add('selected');
    }
  });
};

const search = async () => {
  try {
    errorText.value = { type: null, message: null };
    recipes.value = [];
    const response = await fetch('http://localhost:8080/api/search', {
      method: 'POST',
      body: JSON.stringify({ selectedIngredients }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      errorText.value.type = 'server-error';
      errorText.value.message =
        'Произошла неизвестная ошибка. Данные не были отправлены на сервер.';
    }
    const data = await response.json();
    if (data.errorMessage) {
      console.error('Произошла ошибка:', data.errorMessage);
      errorText.value.type = 'server-error';
      errorText.value.message = `Произошла ошибка на сервере: ${data.errorMessage}`;
    } else {
      recipes.value = data;
      console.log('Данные с сервера:', recipes.value);
    }
  } catch (error) {
    console.error('Произошла ошибка:', error);
    errorText.value.type = 'server-error';
    errorText.value.message =
      'Произошла неизвестная ошибка. Данные не были отправлены на сервер.';
  }
};

const openRecipePage = (recipeId: number) => {
  const recipeUrl = `http://localhost:5173/recipe/${recipeId}`;
  window.open(recipeUrl, '_blank');
};
</script>

<style scoped></style>
