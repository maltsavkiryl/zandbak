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
import { VirtualScrollerModule } from "primeng/virtualscroller";
import { FilterBarComponent } from './containers/filter-bar/filter-bar.component';
import { PlaygroundListComponent } from './components/playground-list/playground-list.component';
import { PlaygroundMapComponent } from './components/playground-map/playground-map.component';
import { PaginatorModule } from "primeng/paginator";

@NgModule({
  declarations: [SearchComponent, FilterBarComponent, PlaygroundListComponent, PlaygroundMapComponent],
  imports: [SearchRoutingModule, CommonModule, GoogleMapsModule, MultiSelectModule, FormsModule, ButtonModule, CardModule, InputTextModule, SliderModule, VirtualScrollerModule, PaginatorModule]
})
export class SearchModule {
}
