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
import { take } from "rxjs/operators";
 
 @Injectable({ providedIn: 'root' })
 export class RecipesResolverService implements Resolve<Recipe[]> {
   constructor(private store: Store<fromApp.AppState>,
    private actions$: Actions) {}
 
   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) { 
    this.store.dispatch(new RecipesActions.FetchRecipes());
    return this.actions$.pipe(
      ofType(RecipesActions.SET_RECIPES), 
      take(1));
   }
 }