import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { LoggingService } from '../services/logging.service';
import { Ingredient } from '../shared/models/ingredient.model';
import * as fromShoppingList from "./store/shopping-list.reducer";
import * as ShoppingListActions from "./store/shopping-list.actions";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
  
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  // ingredients: Ingredient[];
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  private ingredientChangeSubscription: Subscription;

constructor(
  private logginService: LoggingService,
  private store: Store<fromShoppingList.AppState>
  ) {}

ngOnInit() {
  this.ingredients = this.store.select('shoppingList');
      this.logginService.printLog('Hello from ShoppinListComponent ngOnInit!');
    }
    
    onEditItem(id: number) {
      // this.shoppingListService.startedEditing.next(id);
      this.store.dispatch(new ShoppingListActions.StartEdit(id));
    }

    ngOnDestroy() {
      // this.ingredientChangeSubscription.unsubscribe();
    }

}
