const ingredientsList = document.querySelectorAll(".ingredient");
const selectedIngredients = ["44", "45", "46"];
const searchResult = document.getElementById("myList");
const clearButton = document.querySelector("#clearButton");

clearButton.addEventListener("click", (event) => {
  event.preventDefault();
  // очищаем массив выбранных ингредиентов
  selectedIngredients.length = 0;
  // снимаем выделение со всех выбранных ингредиентов
  ingredientsList.forEach((ingredient) => {
    ingredient.classList.remove("selected");
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

const searchForm = document.getElementById("search-form");
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

      console.log(data);

      searchResult.innerHTML = "";

      data.forEach((recipe) => {
        const item = document.createElement('div');
        item.classList.add("item");

        const image = document.createElement('img');
        image.src = "data:image/jpg;base64," + recipe.image;
        image.classList.add("item-image");

        const name = document.createElement('p');
        name.classList.add("item-name");
        name.textContent = recipe.name;

        const description = document.createElement('p');
        description.classList.add("item-description");
        description.textContent = recipe.description;

        item.appendChild(image);
        item.appendChild(name);
        item.appendChild(description);
        searchResult.appendChild(item);
      })

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
