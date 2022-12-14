import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";
import * as RecipesActions from "../recipes/store/recipes.actions";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authUserSubscription: Subscription;

  constructor(
    private store: Store<fromApp.AppState>) { }
  
  ngOnInit() {
    this.authUserSubscription = this.store
    .select('auth')
    .pipe(map(authState => authState.user))
    .subscribe(
        user => {
        this.isAuthenticated = !!user;
    });
  }

  onSaveData() {
    this.store.dispatch(new RecipesActions.StoreRecipes());
  }

  onFetchData() {
    this.store.dispatch(new RecipesActions.FetchRecipes());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy() {
    this.authUserSubscription.unsubscribe();
  }
}