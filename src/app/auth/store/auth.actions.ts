import { Action } from "@ngrx/store";
import { AuthUser } from "src/app/shared/models/authUser.model";

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export class Login implements Action {
    readonly type = LOGIN;

    constructor(public payload: AuthUser) {}
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export type AuthActions = Login | Logout;