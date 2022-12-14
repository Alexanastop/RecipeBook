import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import * as fromApp from "../../store/app.reducer";
import * as RecipesActions from "../../recipes/store/recipes.actions";
import { Subscription } from 'rxjs-compat';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy{
  id: number;
  recipe: Recipe;
  editMode = false;
  recipeForm: FormGroup;
  private storeSubscription: Subscription;
  
  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState> ) {}
              
              ngOnInit() {    
                this.route.params
                .subscribe(
                  (params: Params) => {
                    this.id = +params['id'];
                    this.editMode = params['id'] != null;
                    this.initForm();
                  }
                  );
                }
                
                onSubmit() {                   
                  if(this.editMode) {
                    this.store.dispatch(
                      new RecipesActions.UpdateRecipe({ 
                        id: this.id, 
                        newRecipe: this.recipeForm.value 
                      })
                      );
                    } else {
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value));
    }
    
    this.onCancel();
  }
  
  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*/)
        ])
      })
      );
    }
    
    onCancel() {
      this.router.navigate(['../'], {relativeTo:this.route});
    }
    
    onDeleteIngredient(id: number){
      (<FormArray>this.recipeForm.get('ingredients')).removeAt(id);
    }

    ngOnDestroy() {
      if(this.storeSubscription) {
        this.storeSubscription.unsubscribe();
      }
    }
    
    private initForm() {
      let recipeTobeEdited: Recipe;
      let recipeIngredients = new FormArray([]);
      
      if (this.editMode) {
      // const recipe = this.recipeService.getRecipe(this.id);
      this.storeSubscription = this.store
      .select('recipes')
      .pipe(
        map(recipeState => {
          return recipeState.recipes.find((recipe, index) => {
            recipeTobeEdited = recipe;
            return index === this.id;
          });
        })
        )
        .subscribe(recipe => {
          if (recipe['ingredients']) {
            for (let ingredient of recipe.ingredients) {
              recipeIngredients.push(
                new FormGroup({
                  name: new FormControl(ingredient.name, Validators.required),
                  amount: new FormControl(ingredient.amount, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/)
                  ])
                })
                );
              }
            }
          });
        }
        
        this.recipeForm = new FormGroup({
          'name': new FormControl(recipeTobeEdited?.name, Validators.required),
          'imagePath': new FormControl(recipeTobeEdited?.imagePath, Validators.required),
          'description': new FormControl(recipeTobeEdited?.description, Validators.required),
          'ingredients': recipeIngredients
        });
      }    
    }
    