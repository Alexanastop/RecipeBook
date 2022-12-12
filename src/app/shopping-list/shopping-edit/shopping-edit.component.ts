import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/models/ingredient.model';
import * as ShoppingListActions from "../store/shopping-list.actions";
import * as fromShoppingList from "../store/shopping-list.reducer";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('shoppingEditForm') shoppingListEditForm: NgForm
  itemToBeEditedsubscription: Subscription;
  ngRxItemToBeEditedsubscription: Subscription;
  editMode = false;
  itemToBeEditedIndex: number;
  itemToBeEdited: Ingredient;

  constructor(
    private store: Store<fromShoppingList.AppState>
  ) {}
  
  ngOnInit() {
    this.ngRxItemToBeEditedsubscription = this.store.select('shoppingList').subscribe(stateData => {
      if(stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.itemToBeEdited = stateData.editedIngredient;
        this.shoppingListEditForm.setValue({
          name: this.itemToBeEdited.name,
          amount: this.itemToBeEdited.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }
  
  onSubmit(form: NgForm) {
    const value = form.value;
    const ingredientToBeSubmited = new Ingredient(value.name, value.amount);
    if (this.editMode){
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(ingredientToBeSubmited)
      );
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredientToBeSubmited));
    }
    this.onClear();
  }
  
  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
  
  ngOnDestroy() {
    this.ngRxItemToBeEditedsubscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
  
  onClear() {    
    this.editMode = false;
    this.shoppingListEditForm.reset();
  }
}
