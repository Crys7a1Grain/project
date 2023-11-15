const express = require('express');
const mariadb = require('mariadb/callback');
const fs = require('fs');
require('dotenv').config();

const pool = mariadb.createPool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
});

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/api/ingredients-and-categories', (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) {
      console.error(err);
      res.status(500).json({ errorMessage: err });
      return;
    }

    conn.query('SELECT * FROM ingredients', (err, ingredients) => {
      if (err) {
        conn.release();
        console.error(err);
        res.status(500).send({ err });
        return;
      }

      conn.query('SELECT * FROM ingredient_categories', (err, categories) => {
        conn.release();

        if (err) {
          console.error(err);
          res.status(500).send({ err });
          return;
        }

        res.send([ingredients, categories]);
      });
    });
  });
});

app.post('/api/search', async (req, res) => {
  try {
    const ingredients = req.body.selectedIngredients;
    console.log(ingredients);
    if (!Array.isArray(ingredients)) {
      return res
        .status(400)
        .json({ errorMessage: 'Ingredients should be an array' });
    }
    if (!ingredients.every((element) => !isNaN(element))) {
      return res
        .status(400)
        .json({ errorMessage: 'All elements in the array should be numbers' });
    }

    pool.getConnection((err, conn) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: err });
      }

      const searchQuery = fs.readFileSync('./src/server/query.sql', 'utf8');
      conn.query(searchQuery, [ingredients], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ errorMessage: err });
        }

        if (!result || result.length === 0) {
          return res.json({
            errorMessage: 'Рецепты не найдены по данным ингредиентам.',
          });
        }

        const recipes = result.map((row) => ({
          id: row.id,
          name: row.name,
          description: row.description,
          image: row.image.toString('base64'),
        }));
        res.json(recipes);
      });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ errorMessage: `Произошла ошибка на сервере: ${error.message}` });
  }
});

app.get('/api/recipe/:recipeId', async (req, res) => {
  const param = req.params.recipeId;
  const recipeId = parseInt(param, 10);
  console.log(recipeId);

  try {
    pool.getConnection((err, conn) => {
      if (err) {
        console.error(err);
        res.status(500).json({ errorMessage: err });
        return;
      }

      const recipeQuery = fs.readFileSync('./src/server/recipeQuery.sql', 'utf8');
      conn.query(recipeQuery, [recipeId], (err, recipeResult) => {
        conn.release();
        if (err) {
          console.error(err);
          res.status(500).json({ errorMessage: err });
          return;
        }
        console.log(recipeResult);
        data = recipeResult[0];

        const ingredientsQuery = fs.readFileSync(
          './src/server/ingredientsQuery.sql',
          'utf8',
        );

        conn.query(ingredientsQuery, [recipeId], (error, ingredientsResult) => {
          if (ingredientsResult) {
            const recipe = {
              id: data.id,
              name: data.name,
              description: data.description,
              image: data.image.toString('base64'),
              instructions: data.instructions,
              ingredients: ingredientsResult.map((result) => ({
                name: result.ingredient_name,
                volume: result.volume,
              })),
            };
            res.json(recipe);
          } else {
            res.status(404).json({ errorMessage: 'Рецепт не найден;' + error });
          }
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: 'Произошла ошибка на сервере;' + error });
  }
});

app.get('/api/recipes', (req, res) => {
  try {
    pool.getConnection((err, conn) => {
      if (err) {
        console.error(err);
        res.status(500).json({ errorMessage: err });
        return;
      }

      const recipesQuery = 'SELECT * FROM recipes';
      conn.query(recipesQuery, (err, recipesResult) => {
        conn.release();
        if (err) {
          console.error(err);
          res.status(500).json({ errorMessage: err });
          return;
        }

        //console.log(recipesResult); нормально выводит рецепты.
        if (recipesResult) {
          const recipes = recipesResult.map((row) => {
            return {
              id: row.id,
              name: row.name,
              description: row.description,
              image: row.image.toString("base64"),
            };
          });
          res.json(recipes);
        } else {
          res.status(404).json({ errorMessage: 'Рецепт не найден;' + err });
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: 'Произошла ошибка на сервере;' + error });
  }
});

app.listen(PORT, () => {
  console.log(`Server has started at ${PORT} port`);
});
