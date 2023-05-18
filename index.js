const mariadb = require("mariadb/callback");
const express = require("express");
const fs = require("fs");

const pool = mariadb.createPool({
  host: "127.0.0.1",
  port: 3306,
  database: "recipes_finder",
  user: "root",
  password: "bitnamiwamp",
});

const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("SELECT * FROM ingredients", (err, results) => {
      connection.release(); // освободить соединение обратно в пул
      if (err) throw err;
      const ingredients = results;
      connection.query(
        "SELECT * FROM ingredient_categories",
        (err, results) => {
          if (err) throw err;
          const categories = results;
          res.render("index.ejs", {
            ingredients: ingredients,
            categories: categories,
          });
        }
      );
    });
  });
});

app.post("/search", (req, res) => {
  //console.log("req.body.ingredients = " + req.body.ingredients);
  //const ingredients = req.body.ingredients.toString().split(",").map(Number);
  const start = new Date();
  const ingredients = req.body.ingredients;
  console.log("ingredients = " + ingredients);
  const sql = fs.readFileSync("query.sql", "utf8");
  pool.getConnection((err, connection) => {
    if (err) throw err;
    //const id_recipes = results.map((row) => row.id);
    //connection.release(); // освободить соединение обратно в пул
    //if (err) throw err; //id_recipes внизу
    //const sql = `SELECT name, description, image FROM recipes WHERE id IN (?)`;
    connection.query(sql, [ingredients], (err, results) => {
      if (err) throw err;
      console.log("results = " + results);
      if (results === undefined || results === " " || results.length === 0) {
        res.json({ message: "Рецепты не найдены по данным ингредиентам." });
      } else {
        const recipes = results.map((row) => {
          const image = row.image.toString("base64");
          return {
            id: row.id,
            name: row.name,
            description: row.description,
            image: image,
          };
        });
        console.log(recipes);
        res.json(recipes); //res.send(JSON.stringify(recipes));
      }
      connection.release(); // освободить соединение обратно в пул
      const end = new Date();
      const delta = end - start;
      console.log(`request on server was served in ${delta} ms`);
    });
  });
});

app.get("/recipes", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("SELECT * FROM recipes", (err, results) => {
      if (err) throw err;
      const recipes = results.map((row) => {
        const image = row.image.toString("base64");
        return {
          id: row.id,
          name: row.name,
          description: row.description,
          image: image,
        };
      });
      connection.release(); // освободить соединение обратно в пул
      //res.json(recipes);
      res.render("recipes.ejs", { recipes: recipes });
    });
  });
});

app.get("/recipe/:id", (req, res) => {
  const recipeId = req.params.id;
  const recipeQuery = fs.readFileSync("recipeQuery.sql", "utf8");
  const ingredientsQuery = fs.readFileSync("ingredientsQuery.sql", "utf8");
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(recipeQuery, [recipeId], (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        const recipe = results[0];
        const image = recipe.image.toString("base64");

        connection.query(
          ingredientsQuery,
          [recipeId],
          (err, ingredientResults) => {
            if (err) throw err;
            const data = {
              name: recipe.name,
              description: recipe.description,
              image: image,
              instructions: recipe.instructions,
              ingredients: ingredientResults.map((result) => ({
                name: result.ingredient_name,
                volume: result.volume,
              })),
            };
            res.render("recipe.ejs", { recipe: data });
          }
        );
      } else {
        res.status(404).send("Рецепт не найден");
        return;
        //res.render("error", { message: "Рецепт не найден" });
      }
      connection.release();
    });
  });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
