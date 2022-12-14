// import { Injectable } from "@angular/core";
// import { Store } from "@ngrx/store";
// import { Subject } from "rxjs";

// import { Ingredient } from "src/app/shared/models/ingredient.model";
// import * as ShoppingListActions from "src/app/shopping-list/store/shopping-list.actions";
// import { Recipe } from "../recipe.model";
// import * as fromApp from "../../store/app.reducer";

// @Injectable()
// export class RecipeService {
//   recipesChanged = new Subject<Recipe[]>();
//   private recipes: Recipe[] = [];
          
// constructor(
//   private store: Store<fromApp.AppState>
// ) {}

// getRecipes() {
//   return this.recipes.slice();
// }

// setRecipes(recipes: Recipe[]) {
//   this.recipes = recipes;
//   this.recipesChanged.next(this.recipes.slice())
// }

// getRecipe(id: number) {
//   return this.recipes[id];
//   }
  
//   addIngredientsToShoppingList(ingredients: Ingredient[]) {
//     // this.shoppingListService.addIngredients(ingredients);
//     this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
//   }
  
//   addRecipe(id: number, newRecipe: Recipe) {
//     this.recipes.push(newRecipe);
//     this.recipesChanged.next(this.recipes.slice());
//   }
  
//   updateRecipe(id: number, recipe: Recipe) {
//     this.recipes[id] = recipe;
//     this.recipesChanged.next(this.recipes.slice());
//   }
  
//   getNewRecipeId() {
//     return this.recipes.length;
//   }
  
//   deleteRecipe(id: number) {
//     this.recipes.splice(id, 1);
//     this.recipesChanged.next(this.recipes.slice())
//   }

//   deleteIngredient(recipeId: number, ingredientId: number) {
//     this.recipes[recipeId].ingredients.splice(ingredientId, 1);
//     this.recipesChanged.next(this.recipes.slice());
//   }
// }