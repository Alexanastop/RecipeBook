import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { AuthUser } from "src/app/shared/models/authUser.model";
import { User } from "src/app/shared/models/user.model";

interface AuthResponseData {
//   kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    errorOccured = new Subject<string>();
    authUser = new BehaviorSubject<AuthUser>(null);
    authObs: Observable<AuthResponseData>;
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {        
    }
    
    checkSignupOrLogin(user: User, isLogginMode: boolean) {
        if(isLogginMode){
            this.authObs = this.login(user);
        } else {
            this.authObs = this.signup(user);
        }

        this.authObs.subscribe(
            responseData => {
                console.log(responseData);
            }
            , (errorMessage) => {
                this.errorOccured.next(errorMessage);
            }
        );
    }

    signup(user: User) {
        return this.http
            .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDzX43W1MeGomY0xAOMmi0GvTStXTI20ho',
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
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDzX43W1MeGomY0xAOMmi0GvTStXTI20ho',
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
                this.authUser.next(loadedUser);
                const expirationDuration = new Date(user._tokenExpirationDate).getTime() - new Date().getTime();
                this.autoLogout(expirationDuration);
            }  

        } else {
            return;
        }
    }

    logout() {
        this.authUser.next(null);
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

        this.authUser.next(user);
        this.autoLogout(hours);
        localStorage.setItem('userData', JSON.stringify(user));
    }
}
