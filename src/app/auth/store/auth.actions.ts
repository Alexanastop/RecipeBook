import { Action } from "@ngrx/store";
import { AuthUser } from "src/app/shared/models/authUser.model";
import { User } from "src/app/shared/models/user.model";

export const LOGIN_START = '[Auth] Login Start';
export const LOGIN_SUCCESS = '[Auth] Login Success';
export const LOGIN_FAIL = '[Auth] Login Fail';
export const LOGOUT = '[Auth] Logout';

export class LoginStart implements Action {
    readonly type = LOGIN_START;

    constructor(public payload: User) {}
}

export class LoginSuccess implements Action {
    readonly type = LOGIN_SUCCESS;

    constructor(public payload: AuthUser) {}
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class LoginFail implements Action {
    readonly type = LOGIN_FAIL;
  
    constructor(public payload: string) {}
  }

export type AuthActions =
| LoginSuccess 
| Logout 
| LoginStart
| LoginFail;