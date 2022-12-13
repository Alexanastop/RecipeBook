import { Action } from "@ngrx/store";
import { AuthUser } from "src/app/shared/models/authUser.model";
import { User } from "src/app/shared/models/user.model";

export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICATE_SUCCESS = '[Auth] AUTHENTICATE Success';
export const AUTHENTICATE_FAIL = '[Auth] Login Fail';
export const LOGOUT = '[Auth] Logout';
export const SIGNUP_START = '[Auth] Signup Start';
export const CLEAR_ERROR = '[Auth] Clear Error';

export class LoginStart implements Action {
    readonly type = LOGIN_START;

    constructor(public payload: User) {}
}

export class AuthenticateSuccess implements Action {
    readonly type = AUTHENTICATE_SUCCESS;

    constructor(public payload: AuthUser) {}
}

export class AuthenticateFail implements Action {
    readonly type = AUTHENTICATE_FAIL;
  
    constructor(public payload: string) {}
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class SignupStart implements Action {
    readonly type = SIGNUP_START;

    constructor(public payload: User) {}
}

export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
}

export type AuthActions =
| AuthenticateSuccess 
| Logout 
| LoginStart
| AuthenticateFail
| SignupStart
| ClearError;