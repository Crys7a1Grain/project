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
      res.status(500).send({ err });
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

app.post('/api/search', (req, res) => {
  let ingredients = req.body.selectedIngredients;
  if (!Array.isArray(ingredients)) {
    return res.status(400).json({ errorMessage: 'Ingredients should be an array' });
  }
  if (!ingredients.every((element) => Number.isInteger(element))) {
    return res
      .status(400)
      .json({ errorMessage: 'All elements in the array should be integers' });
  }
  ingredients = ingredients.join(',');
  console.log(ingredients);

  const sql = fs.readFileSync('query.sql', 'utf8');

  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      res.status(500).send({ err });
      return;
    }

    connection.query(sql, [ingredients], (err, results) => {
      connection.release();
      if (err) {
        console.error(err);
        res.status(500).send({ err });
        return;
      }
      if (results === undefined || results === ' ' || results.length === 0) {
        res.json({ errorMessage: 'Рецепты не найдены по данным ингредиентам.' });
      } else {
        const recipes = results.map((row) => {
          const image = row.image.toString('base64');
          return {
            id: row.id,
            name: row.name,
            description: row.description,
            image: image,
          };
        });
        console.log("recipes" + recipes);
        res.json(recipes);
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server has started at ${PORT} port`);
});
