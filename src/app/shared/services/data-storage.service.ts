import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { Subject } from "rxjs";

import { RecipeService } from "src/app/recipes/services/recipe.service";
import { Recipe } from "src/app/recipes/recipe.model";
import { AuthService } from "src/app/auth/services/auth.service";
import { AuthUser } from "../models/authUser.model";


@Injectable({providedIn: 'root'})
export class DataStorageService {
  recipesChanged = new Subject<Recipe[]>();
  user = AuthUser;

  constructor(
    private http: HttpClient, 
    private recipeService: RecipeService, 
    private authService: AuthService) {        
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
            this.recipeService.setRecipes(recipes);
          })
      );
  }
}