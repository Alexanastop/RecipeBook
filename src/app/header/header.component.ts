import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from '../auth/services/auth.service';
import { DataStorageService } from '../shared/services/data-storage.service';
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authUserSubscription: Subscription;

  constructor(
    private dataStorage: DataStorageService, 
    private store: Store<fromApp.AppState>) { }
  
  ngOnInit() {
    this.authUserSubscription = this.store
    .select('auth')
    .pipe(map(authState => authState.user))
    .subscribe(
        user => {
        this.isAuthenticated = !!user;
    });

    this.dataStorage.fetchRecipes().subscribe();
  }

  onSaveData() {
    this.dataStorage.storeRecipes();
  }

  onFetchData() {
    this.dataStorage.fetchRecipes().subscribe();
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy() {
    this.authUserSubscription.unsubscribe();
  }
}