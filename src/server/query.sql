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
  ri.id_ingredients in (44,45,46,2,5,6,17,24,36,38,39,47,65,66,67,76,81,68,83,88,92,3,4,14,19,26,43,29,48,73,51,49,74,75,79,100,52,27,30,56,57,12,15,54,58,64,28,85,86,91,96,97,71,77,8,42,63,72,62,61,60,1,20,11,32,40,16,84,69,95,89,41,98,7,34,90,9,10,18,21,22,50,31,25,80,94)
group by
  ri.id_recipes
) t2 on t2.id_recipes = t1.id_recipes
where
  t1.rc = t2.rc
)
order by r.id