import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/models/ingredient.model';
import { ShoppingListService } from '../services/shopping-list.service';
import * as ShoppingListActions from "../store/shopping-list.actions";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('shoppingEditForm') shoppingListEditForm: NgForm
  itemToBeEditedsubscription: Subscription;
  editMode = false;
  itemToBeEditedIndex: number;
  itemToBeEdited: Ingredient;

  constructor(
    private shoppingListService: ShoppingListService, 
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
  ) {}
  
  ngOnInit() {
    this.itemToBeEditedsubscription = this.shoppingListService.startedEditing
    .subscribe(
      (id: number) => {
        this.itemToBeEditedIndex = id;
        this.editMode = true;
        this.itemToBeEdited = this.shoppingListService.getIngredient(id);
        this.shoppingListEditForm.setValue({
          name: this.itemToBeEdited.name,
          amount: this.itemToBeEdited.amount
        });
      }
    );
  }
  
  onSubmit(form: NgForm) {
    const value = form.value;
    const ingredientToBeSubmited = new Ingredient(value.name, value.amount);
    if (this.editMode){
      this.shoppingListService.updateIngredient(this.itemToBeEditedIndex, ingredientToBeSubmited)
    } else {
      // this.shoppingListService.addIngredient(ingredientToBeSubmited);
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredientToBeSubmited));
    }
    this.onClear();
  }
  
  onDelete() {
    this.shoppingListService.deleteIngredient(this.itemToBeEditedIndex);
    this.onClear();
  }
  
  ngOnDestroy() {
    this.itemToBeEditedsubscription.unsubscribe();
  }
  
  onClear() {    
    this.editMode = false;
    this.shoppingListEditForm.reset();
  }
}
