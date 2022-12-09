import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/models/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

const initialState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 4),
        new Ingredient('Bananas', 5),
        new Ingredient('Potatoes', 2)
    ]
};

export function shoppingListReducer(
    state = initialState, 
    action: ShoppingListActions.ShoppingListActions
)   {
    switch(action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [
                    ...state.ingredients,
                    action.payload
                ]
            };
            case ShoppingListActions.ADD_INGREDIENTS:
                return {
                    ...state,
                    ingredients: [
                        ...state.ingredients,
                        ...action.payload
                    ]
                };
        default:    
            return state;
    }
}