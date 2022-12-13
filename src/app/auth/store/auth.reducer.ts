import { AuthUser } from "src/app/shared/models/authUser.model";
import * as AuthActions from "./auth.actions";

export interface State {
    user: AuthUser;
    authError: string;
    loading: boolean;
}


const initialState: State ={
    user: null,
    authError: null,
    loading: false
};

export function authReducer(
    state = initialState, 
    action: AuthActions.AuthActions
) {
    switch (action.type) {
        case AuthActions.LOGIN_START:           
            return {
                ...state,
                authError: null,
                loading: true
            };
        case AuthActions.LOGIN_SUCCESS:
            const user = action.payload;
            return {
                ...state,
                user: user,
                authError: null,
                loading: false
            };
        case AuthActions.LOGIN_FAIL:
            return {
                ...state,
                user: null,
                authError: action.payload,
                loading: false
            };
        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null
            };
        default:
            return state;
    }
}