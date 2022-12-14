import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, map } from "rxjs/operators";

import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipes.actions'

@Injectable()
export class RecipeEffects {
    
    fetchRecipes$ = createEffect(() => this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
          return this.http.get<Recipe[]>(
            'https://ng-course-recipe-book-bb32e-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
          );
        }),
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        map(recipes => {
          return new RecipesActions.SetRecipes(recipes);
        })
      )
    );

    constructor(
        private actions$: Actions,
        private http: HttpClient) {}
    
       
}