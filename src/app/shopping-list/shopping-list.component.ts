import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { LoggingService } from '../services/logging.service';
import { Ingredient } from '../shared/models/ingredient.model';
import * as ShoppingListActions from "./store/shopping-list.actions";
import * as fromApp from "../store/app.reducer";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
  
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  private ingredientChangeSubscription: Subscription;

constructor(
  private logginService: LoggingService,
  private store: Store<fromApp.AppState>
  ) {}

ngOnInit() {
  this.ingredients = this.store.select('shoppingList');
      this.logginService.printLog('Hello from ShoppinListComponent ngOnInit!');
    }
    
    onEditItem(id: number) {
      this.store.dispatch(new ShoppingListActions.StartEdit(id));
    }
}
