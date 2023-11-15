import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("./src/client/pages/Main.vue"),
      meta: {
        title: 'Поиск рецептов'
      }
    },
    {
      path: "/recipes/",
      name: "recipes",
      component: () => import("./src/client/pages/Recipes.vue"),
      meta: {
        title: 'Рецепты'
      }
    },
    {
      path: '/recipe/:recipeId',
      name: 'recipe',
      component: () => import('./src/client/pages/RecipePage.vue'),
      meta: {
        dynamicTitle: true,
      },
      props: true,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.dynamicTitle) {
    try {
      const response = await fetch(`http://localhost:8080/api/recipe/${to.params.recipeId}`);
      if (response.ok) {
        const recipe = await response.json();
        console.log(recipe);
        document.title = recipe.name;
        next();
      } else {
        console.error(`Ошибка загрузки данных с сервера. Статус: ${response.status}`);
        next();
      }
    } catch (error) {
      console.error(error);
      next();
    }
  } else {
    console.log('Динамический тайтл не активирован');
    next();
  }
});

export default router;