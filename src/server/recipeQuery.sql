SELECT r.id,
  r.name,
  r.description,
  r.image,
  r.instructions
FROM recipes AS r
WHERE r.id = ?