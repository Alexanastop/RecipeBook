import { Injectable } from "@angular/core";
import { 
    ActivatedRouteSnapshot, 
    Resolve, 
    RouterStateSnapshot
 } from "@angular/router";
 import { Actions, ofType } from "@ngrx/effects";
 import { Store } from "@ngrx/store";

 import * as fromApp from "../../store/app.reducer";
 import * as RecipesActions from "../store/recipes.actions"; 
 import { Recipe } from "../recipe.model";
import { map, switchMap, take } from "rxjs/operators";
import { of } from "rxjs";
 
 @Injectable({ providedIn: 'root' })
 export class RecipesResolverService implements Resolve<Recipe[]> {
   constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions) {}
 
   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) { 
    return this.store.select('recipes')
      .pipe(
        take(1),
        map(recipeState => {
          return recipeState.recipes;
        }),
        switchMap(recipes => {
          if(recipes.length === 0) {
            this.store.dispatch(new RecipesActions.FetchRecipes());
            return this.actions$.pipe(
              ofType(RecipesActions.SET_RECIPES), 
              take(1));
          } else {
            return of(recipes);
          }
        })
      );

   }
 }