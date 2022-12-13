import { Injectable, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { User } from "src/app/shared/models/user.model";
import * as fromApp from "../../store/app.reducer";
import * as AuthActions from "../../auth/store/auth.actions";

export interface AuthResponseData {
//   kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService implements OnDestroy {
    private tokenExpirationTimer: any;
    private storeSubscription: Subscription;

    constructor(
        private store: Store<fromApp.AppState>) {}   
    
    checkSignupOrLogin(user: User, isLogginMode: boolean) {
        if(isLogginMode) {
            this.store.dispatch(
                new AuthActions.LoginStart(user)
            );
        } else {
            this.store.dispatch(
                new AuthActions.SignupStart(user)
            );
        }

        this.storeSubscription = this.store.select('auth').subscribe(
            authState => {
                console.log(authState.authError);
            }
        );
    }

    setLogoutTimer(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(new AuthActions.Logout());
        }, expirationDuration)
    }

    clearLogoutTimer() {
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }

    ngOnDestroy() {
        this.storeSubscription.unsubscribe();
    }
}

