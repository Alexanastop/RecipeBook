import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { LoggingService } from '../services/logging.service';
import { Ingredient } from '../shared/models/ingredient.model';
import { ShoppingListService } from './services/shopping-list.service';

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
  private shoppingListService: ShoppingListService, 
  private logginService: LoggingService,
  private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
  ) {}

ngOnInit() {
  this.ingredients = this.store.select('shoppingList');
  // this.ingredients = this.shoppingListService.getIngredients();
  // this.ingredientChangeSubscription = this.shoppingListService.ingredientsChanged
  // .subscribe(
  //   (ingredients: Ingredient[]) => {
  //     this.ingredients = ingredients;
  //   }
  //   );

      this.logginService.printLog('Hello from ShoppinListComponent ngOnInit!');
    }
    
    onEditItem(id: number) {
      this.shoppingListService.startedEditing.next(id);
    }

    ngOnDestroy() {
      // this.ingredientChangeSubscription.unsubscribe();
    }

}
