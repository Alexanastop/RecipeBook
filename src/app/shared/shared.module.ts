import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AlertComponent } from "./alert/alert.component";
import { DropDownDirective } from "./directives/dropdown.directive";
import { PlaceholderDirective } from "./directives/placeholder/placeHolder.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";


@NgModule({
    declarations: [
        AlertComponent,
        LoadingSpinnerComponent,
        PlaceholderDirective,
        DropDownDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AlertComponent,
        LoadingSpinnerComponent,
        PlaceholderDirective,
        DropDownDirective,
        CommonModule
    ]
})
export class SharedModule{

}