import { Action } from "@ngrx/store";
import { Recipe } from "../recipe.model";


export const SET_RECIPES = '[Recipes] Set Recipes';
export const FETCH_RECIPES = '[Recipes] Fetch Recipes';
// export const ADD_RECIPE = '[Recipe] Add Recipe';
// export const DELETE_RECIPE = '[Recipe] Delete Recipe';

export class SetRecipes implements Action {
    readonly type = SET_RECIPES;
    
    constructor(public payload: Recipe[]) {}
}

export class FetchRecipes implements Action {
    readonly type = FETCH_RECIPES;
}

// export class AddRecipe implements Action {
//     readonly type = ADD_RECIPE;
    
//     constructor(public payload: Recipe[]) {}
// }

export type RecipesActions = 
| SetRecipes
| FetchRecipes
// | AddRecipe;