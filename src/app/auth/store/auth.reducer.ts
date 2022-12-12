import { AuthUser } from "src/app/shared/models/authUser.model";
import * as AuthActions from "./auth.actions";

export interface State {
    user: AuthUser
}


const initialState: State ={
    user: null
};


export function authReducer(
    state = initialState, 
    action: AuthActions.AuthActions
) {
    switch (action.type) {
        case AuthActions.LOGIN:
            const user = action.payload;
            return {
                ...state,
                user: user
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