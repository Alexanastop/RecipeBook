import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit{
  id: number;
  recipe: Recipe;
  editMode = false;
  recipeForm: FormGroup;
  
  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router ) {}

  ngOnInit() {
    // this.route.data
    // .subscribe(
    //   (data: Data) => {
    //     this.recipe = data['recipe'];
    //     this.editMode = this.recipe?.id != null;
    //     this.initForm();
    //   }
    // );
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
    const newId = this.recipeService.getNewRecipeId();
    // const newRecipe = new Recipe(
    //   id,
    //   this.recipeForm.value['name'], 
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'], 
    //   this.recipeForm.value['ingredients']
    // );

    if(this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(newId, this.recipeForm.value);
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

  private initForm() {
    let recipe: Recipe;
    let recipeIngredients = new FormArray([]);
    
    if(this.editMode) {
      recipe = this.recipeService.getRecipe(this.id);   
      if(recipe['ingredients']) {
        for(let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*/)
              ])
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipe?.name, Validators.required),
      'imagePath': new FormControl(recipe?.imagePath, Validators.required),
      'description': new FormControl(recipe?.description, Validators.required),
      'ingredients': recipeIngredients
    });
  }
}
