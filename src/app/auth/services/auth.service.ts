import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { environment } from "environments/environment.prod";
import { Observable, Subject, Subscription, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { AuthUser } from "src/app/shared/models/authUser.model";
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
        private http: HttpClient, 
        private router: Router,
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

    signup(user: User) {
        return this.http
            .post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + 
                    environment.firebaseAPIKey,
                {
                    email: user.email,
                    password: user.password,
                    returnSecurityToken: true
                }
            )
            .pipe(
                catchError(this.handleError),
                tap(responseData => {
                    this.handleAuthentication(responseData);
                })
            )        
    }
        
    login(user: User) {
        return this.http
        .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + 
                environment.firebaseAPIKey,
            {
                email: user.email,
                password: user.password,
                returnSecurityToken: true
            }
        )
        .pipe(
            catchError(this.handleError),
            tap(responseData => {
                this.handleAuthentication(responseData);
            })
        )        
    }

    autoLogin() {
        const user = JSON.parse( localStorage.getItem('userData'));
        if(user) {
            const loadedUser = new AuthUser(
                user.email,
                user.idToken,
                user._token,
                user._tokenExpirationDate
            )

            if(loadedUser.token) {
                this.store.dispatch(new AuthActions.AuthenticateSuccess(loadedUser));
                const expirationDuration = 
                    new Date(user._tokenExpirationDate).getTime() - 
                    new Date().getTime();
                this.autoLogout(expirationDuration);
            }
        } else {
            return;
        }
    }

    logout() {
        this.store.dispatch(new AuthActions.Logout());
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration)
    }

    ngOnDestroy() {
        this.storeSubscription.unsubscribe();
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = '';

        if(errorResponse?.error || errorResponse?.error?.error){
            console.log(errorResponse);
            
            switch (errorResponse.error.error.message) {
                case 'EMAIL_EXISTS':
                    errorMessage = 'This email already exists!';
                    break;
                case 'OPERATION_NOT_ALLOWED':
                    errorMessage = 'This operation is not allowed!';
                    break;
                case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                    errorMessage = 'Too many attempts, please try again later!';
                    break;
                case 'EMAIL_NOT_FOUND':
                    errorMessage = 'Email not found!';
                    break;
                case 'INVALID_PASSWORD':
                    errorMessage = 'Inalid password!';
                    break;
                case 'USER_DISABLED':
                    errorMessage = 'This useris disabled!';
                    break;                    
                default:
                    errorMessage = 'Something went wrong, please try again later!';
            }
        }
        else {
            return throwError(errorResponse);
        }

        return throwError(errorMessage);
    }

    private handleAuthentication(responseData: AuthResponseData) {
        const hours = responseData.expiresIn ? +responseData.expiresIn * 1000 : 3600 * 1000;
        const expirationDate = new Date(
            new Date().getTime() + hours);
        const user = new AuthUser(
            responseData.email, 
            responseData.localId, 
            responseData.idToken, 
            expirationDate
        );
        
        this.store.dispatch(new AuthActions.AuthenticateSuccess(user));
        this.autoLogout(hours);
        localStorage.setItem('userData', JSON.stringify(user));
    }
}

