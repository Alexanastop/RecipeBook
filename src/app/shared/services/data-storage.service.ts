import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { Subject } from "rxjs";
import { Store } from "@ngrx/store";

import { RecipeService } from "src/app/recipes/services/recipe.service";
import { Recipe } from "src/app/recipes/recipe.model";
import { AuthUser } from "../models/authUser.model";
import * as fromApp from "../../store/app.reducer";
import * as RecipesActions from "../../recipes/store/recipes.actions";


@Injectable({providedIn: 'root'})
export class DataStorageService {
  recipesChanged = new Subject<Recipe[]>();
  user = AuthUser;

  constructor(
    private http: HttpClient, 
    private recipeService: RecipeService, 
    private store: Store<fromApp.AppState>) {        
  }

  storeRecipes() {
      const recipes = this.recipeService.getRecipes();
      this.http
          .put(
              'https://ng-course-recipe-book-bb32e-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
              recipes)
          .subscribe(response => {
              console.log(response);
          });
  }

  fetchRecipes() {   
    return this.http
      .get<Recipe[]>(
        'https://ng-course-recipe-book-bb32e-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'        
      )
      .pipe(
          map(recipes => {
            return recipes.map(recipe => {
              return {
                ...recipe,
                ingredients: recipe.ingredients ? recipe.ingredients : []
              };
            });
          }),
          tap(recipes => {
            this.store.dispatch(new RecipesActions.SetRecipes(recipes));
          })
      );
  }
}