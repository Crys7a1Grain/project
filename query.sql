select
  r.*
from
  recipes r
where
  r.id in (
select
  t1.id_recipes
from (
select
  ri.id_recipes, count(*) rc
from
  recipe_ingredients ri
group by
  ri.id_recipes
) t1
inner join (
select
  ri.id_recipes, count(*) rc
from
  recipe_ingredients ri
where
  ri.id_ingredients in (?)
group by
  ri.id_recipes
) t2 on t2.id_recipes = t1.id_recipes
where
  t1.rc = t2.rc
)
order by r.id