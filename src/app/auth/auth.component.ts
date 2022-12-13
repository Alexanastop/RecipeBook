import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";

import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/directives/placeholder/placeHolder.directive";
import { User } from "../shared/models/user.model";
import { AuthService } from "./services/auth.service";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";

@Component({
    selector: '',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy{
    @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;
    isLogginMode = true;
    isLoading = false;
    error = null;
    private storeSubscription: Subscription;
    private closeSubscription: Subscription;

    constructor(
        private authService: AuthService, 
        private router: Router,
        private store: Store<fromApp.AppState>
       ) {}

    ngOnInit() {
        this.storeSubscription = this.store.select('auth')
        .pipe(
            map(authState => {
                this.isLoading = authState.loading;
                this.error = authState.authError;
                return authState.user;
            })).subscribe(
            (authUser) => {
                if(authUser) {
                    this.isLoading = false;
                    console.log(authUser);
                    this.router.navigate(['/recipes']);
                }

                if(this.error) {
                    this.showErrorAlert(this.error);
                }
            }
        );
    }
        
    onSwitchMode() {
        this.isLogginMode = !this.isLogginMode;
    }
    
    onSubmit(form: NgForm) {
        if(form.valid) {
            let user = new User(
                form.value.email,
                form.value.password 
            );   

            this.isLoading = true;                
                this.authService.checkSignupOrLogin(user, this.isLogginMode);
            
            console.log(form);
            form.reset();
        }
    }
    
    onHandleError(){
        this.store.dispatch(
            new AuthActions.ClearError()
       )
    }    
    
    showErrorAlert(error: string) {
        this.error = error;
        this.alertHost.viewContainerRef.clear();
        
        const componentRef = this.alertHost.viewContainerRef.createComponent(AlertComponent);
        
        componentRef.instance.message = this.error;
        this.closeSubscription = componentRef.instance.close.subscribe(() => {
            this.closeSubscription.unsubscribe();
            this.alertHost.viewContainerRef.clear();
        });
    }

    ngOnDestroy() {
        this.storeSubscription.unsubscribe();
        if (this.closeSubscription) {
            this.closeSubscription.unsubscribe();
        }
    }
}
