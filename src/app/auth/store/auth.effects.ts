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

@Injectable()
export class AuthEffects {
  
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
            map(responseData => {
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

              return new AuthActions.LoginSuccess(user);
            }),
            catchError(errorResponse => {
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
                  return of(new AuthActions.LoginFail(errorMessage));
              }
              return of(new AuthActions.LoginFail(errorMessage));
            })
          );
      })
    )
  );

  authSuccess$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_SUCCESS),
      tap(() => 
        this.router.navigate(['/'])
      )
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
