import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SearchComponent } from "./containers/search/search.component";
import { SearchRoutingModule } from "./search-routing.module";
import { GoogleMapsModule } from "@angular/google-maps";
import { MultiSelectModule } from "primeng/multiselect";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { SliderModule } from "primeng/slider";

@NgModule({
  declarations: [SearchComponent],
  imports: [SearchRoutingModule, CommonModule, GoogleMapsModule, MultiSelectModule, FormsModule, ButtonModule, CardModule, InputTextModule, SliderModule]
})
export class SearchModule {
}
