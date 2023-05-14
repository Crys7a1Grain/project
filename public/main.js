const ingredientsList = document.querySelectorAll(".ingredient");
const searchForm = document.getElementById("search-form");
const selectedIngredients = ["44", "45", "46"];
const preselectedIngredients = ["44", "45", "46"];
const searchResult = document.querySelector(".myList");
const clearButton = document.querySelector(".clearButton");

function openRecipePage(recipeId) {
  window.open(`/recipe/${recipeId}`, "_blank");
}

document.addEventListener("DOMContentLoaded", function () {
  selectedIngredients.forEach(function (ingredientId) {
    const ingredientElement = document.querySelector(
      `.ingredient[data-id="${ingredientId}"]`
    );
    ingredientElement.classList.add("selected");
  });
});

clearButton.addEventListener("click", (event) => {
  event.preventDefault();
  // очищаем массив выбранных ингредиентов
  selectedIngredients.length = 0;
  // снимаем выделение со всех выбранных ингредиентов
  ingredientsList.forEach((ingredient) => {
    ingredient.classList.remove("selected");
  });

  preselectedIngredients.forEach((ingredient) => {
    selectedIngredients.push(ingredient);
  });

  // Повторно выделяем ингредиенты из preselectedIngredients
  preselectedIngredients.forEach(function (ingredientId) {
    const ingredientElement = document.querySelector(
      `.ingredient[data-id="${ingredientId}"]`
    );
    ingredientElement.classList.add("selected");
  });
});

ingredientsList.forEach((ingredient) => {
  ingredient.addEventListener("click", () => {
    ingredient.classList.toggle("selected");
    const ingredientId = ingredient.dataset.id;
    if (selectedIngredients.includes(ingredientId)) {
      // проверяет наличие ингридиента(айди) в массивае
      selectedIngredients.splice(
        // если находит такой ингридиент, то удаляет его, находя по индексу
        selectedIngredients.indexOf(ingredientId),
        1 //удаляет 1 ингридиент.
      );
    } else {
      selectedIngredients.push(ingredientId);
    }
  });
});

const dataToServer = { ingredients: selectedIngredients };

searchForm.addEventListener("click", (event) => {
  event.preventDefault();
  fetch("/search", {
    method: "POST",
    body: JSON.stringify(dataToServer), //преобразуем в строку JSON
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(function (data) {
      if (data.message) {
        searchResult.innerHTML = "";
        const message = document.createElement("p");
        message.textContent = data.message;
        searchResult.appendChild(message);
      } else {
        console.log(data);

        searchResult.innerHTML = "";

        const fragment = document.createDocumentFragment();

        data.forEach((recipe) => {
          const item = document.createElement("div");
          item.classList.add("item");

          const image = document.createElement("img");
          image.classList.add("item-image");
          image.src = "data:image/jpg;base64," + recipe.image;

          const box = document.createElement("div");
          box.classList.add("item-box");

          const name = document.createElement("p");
          name.classList.add("item-name");
          name.textContent = recipe.name;

          const description = document.createElement("p");
          description.classList.add("item-description");
          description.textContent = recipe.description;

          const recipeButton = document.createElement("button");
          recipeButton.classList.add("item-button");
          //recipeButton.onclick = openRecipePage(recipe.id);
          recipeButton.onclick = function() {
            openRecipePage(recipe.id);
          };
          recipeButton.textContent = "Посмотреть рецепт";

          item.appendChild(image);
          item.appendChild(box);
          box.appendChild(name);
          box.appendChild(description);
          box.appendChild(recipeButton);

          fragment.appendChild(item);
        });
        searchResult.appendChild(fragment);
      }

      // const listItems = data.map((item) => {
      //   const li = document.createElement("li");
      //   li.textContent = item.name;
      //   return li;
      // });
      // listItems.forEach((li) => {
      //   searchResult.appendChild(li);
      // });
    })
    .catch(function (error) {
      console.log("error", error);
    });

  // event.preventDefault();
  // const url = "/?ingredients=" + selectedIngredients.join(",");
  // window.location.href = url;
});
