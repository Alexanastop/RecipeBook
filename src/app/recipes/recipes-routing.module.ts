import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/services/auth.guard";

import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesComponent } from "./recipes.component";
import { RecipeResolverService } from "./services/recipe-resolver.service";
import { RecipesResolverService } from "./services/recipes-resolver.service";

const routes: Routes = [
    { 
        path: '',
        component: RecipesComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: RecipeStartComponent },
            { path: 'new', component: RecipeEditComponent },
            { 
                path: ':id', 
                component: RecipeDetailComponent,
                resolve: {recipe: RecipeResolverService, RecipesResolverService}
            },
            { 
                path: ':id/edit', 
                component: RecipeEditComponent, 
                resolve: {recipe: RecipeResolverService, RecipesResolverService}
            }
        ]
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipesRoutingModule{

}