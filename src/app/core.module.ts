import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthInterceptorService } from "./auth/services/interceptor.service";

import { ShoppingListService } from "./shopping-list/services/shopping-list.service";
import { RecipeService } from "./recipes/services/recipe.service";

@NgModule({
    providers: [
        ShoppingListService,
        RecipeService, 
        {
            provide: HTTP_INTERCEPTORS, 
            useClass: AuthInterceptorService, 
            multi: true
        }
    ]
})
export class CoreModule {

}