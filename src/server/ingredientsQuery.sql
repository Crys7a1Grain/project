SELECT i.name AS ingredient_name,
  ri.volume
FROM recipe_ingredients AS ri
  JOIN ingredients AS i ON ri.id_ingredients = i.id
WHERE ri.id_recipes = ?