import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";

import { Ingredient } from "src/app/shared/models/ingredient.model";
import * as ShoppingListActions from "src/app/shopping-list/store/shopping-list.actions";
import { Recipe } from "../recipe.model";
import * as fromShoppingList from "../../shopping-list/store/shopping-list.reducer";

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     0,
  //     'Pancake Recipe',
  //     'This is a recipe about pancakes',
  //     'https://images.twinkl.co.uk/tw1n/image/private/t_630_eco/image_repo/4e/7b/au-t2-e-5093-pancake-recipe-english_ver_5.avif',
  //     [
  //       new Ingredient('Bread', 1),
  //       new Ingredient('Black Chocolate', 1),
  //       new Ingredient ('Eggs', 3)
  //     ]),
  //     new Recipe(
  //       1,
  //       'Putanesca Recipe', 
  //       'This is a pasta recipe about Putanesca',
  //       'https://images.immediate.co.uk/production/volatile/sites/30/2013/05/Puttanesca-fd5810c.jpg',
  //       [
  //         new Ingredient('Pasta', 1),
  //         new Ingredient('Cheese', 3)
  //       ]),
  //       new Recipe(
  //         2,
  //         'Putanesca Recipe', 
  //         'This is a pasta recipe about Putanesca',
  //         'https://images.immediate.co.uk/production/volatile/sites/30/2013/05/Puttanesca-fd5810c.jpg',
  //         [
  //           new Ingredient('Pasta', 1),
  //           new Ingredient('Cheese', 3)
  //         ]),
  //         new Recipe(
  //           3,
  //           'Putanesca Recipe', 
  //           'This is a pasta recipe about Putanesca',
  //           'https://images.immediate.co.uk/production/volatile/sites/30/2013/05/Puttanesca-fd5810c.jpg',
  //           [
  //             new Ingredient('Pasta', 1),
  //             new Ingredient('Cheese', 3)
  //           ])
  //         ];
          
          constructor(
            private store: Store<fromShoppingList.AppState>
          ) {}
          
          getRecipes() {
            return this.recipes.slice();
          }
          
          setRecipes(recipes: Recipe[]) {
            this.recipes = recipes;
            this.recipesChanged.next(this.recipes.slice())
          }

          getRecipe(id: number) {
            const recipe = this.recipes.find(
              (recipe) => {
                return recipe.id === id;
              }
              );
              
              return recipe;
            }
            
            addIngredientsToShoppingList(ingredients: Ingredient[]) {
              // this.shoppingListService.addIngredients(ingredients);
              this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
            }
            
            addRecipe(id: number, newRecipe: Recipe) {
              newRecipe.id = id;
              this.recipes.push(newRecipe);
              this.recipesChanged.next(this.recipes.slice());
            }
            
            updateRecipe(id: number, recipe: Recipe) {
              recipe.id = id;
              this.recipes[id] = recipe;
              this.recipesChanged.next(this.recipes.slice());
            }
            
            getNewRecipeId() {
              return this.recipes.length;
            }
            
            deleteRecipe(id: number) {
              this.recipes.splice(id, 1);
              this.recipesChanged.next(this.recipes.slice())
            }

            deleteIngredient(recipeId: number, ingredientId: number) {
              this.recipes[recipeId].ingredients.splice(ingredientId, 1);
              this.recipesChanged.next(this.recipes.slice());
            }
          }