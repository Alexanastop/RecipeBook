import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import * as AuthActions from './auth.actions';
import { AuthUser } from 'src/app/shared/models/authUser.model';
import { environment } from 'environments/environment';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (responseData: AuthResponseData) => {
  const hours = responseData.expiresIn ? +responseData.expiresIn * 1000 : 3600 * 1000;
  const expirationDate = new Date(
      new Date().getTime() + hours
  );

  const user = new AuthUser(
      responseData.email,
      responseData.localId, 
      responseData.idToken, 
      expirationDate
  );

  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess(user);
}

const handleError = (errorResponse) => {
  let errorMessage = 'An unknown error occurred!';

  if(errorResponse?.error || errorResponse?.error?.error) {

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
  } else {
      return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}

  authSignup$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignupStart) => {
        return this.http
        .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + 
                environment.firebaseAPIKey,
            {
                email: signupAction.payload.email,
                password: signupAction.payload.password,
                returnSecurityToken: true
            }
        ) .pipe(
          map(responseData => handleAuthentication(responseData)),
          catchError(errorResponse => handleError(errorResponse))
        );
      })
    )
  );

  authLogin? = createEffect(() => this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(
            'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' +
              environment.firebaseAPIKey,
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true
            }
          )
          .pipe(
            map(responseData => handleAuthentication(responseData)),
            catchError(errorResponse => handleError(errorResponse))
          );
      })
    )
  );

  authRedirect$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
      tap(() => 
        this.router.navigate(['/'])
      )
    ),
    { dispatch: false }
  );

  authLogout$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      tap(() => 
        localStorage.removeItem('userData')
      )
    ),
    { dispatch: false }
  );

  autoLogin$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const user = JSON.parse( localStorage.getItem('userData'));
        if(user) {
            const loadedUser = new AuthUser(
                user.email,
                user.id,
                user._token,
                user._tokenExpirationDate
            )
      
            if(loadedUser.token) {
              return new AuthActions.AuthenticateSuccess(loadedUser);
            }
        } 

        return { type: 'DUMMY' };
      })
    )
  ); 
}
