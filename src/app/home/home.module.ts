import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./containers/home/home.component";
import { HomeRoutingModule } from "./home-routing.module";
import { GoogleMapsModule } from "@angular/google-maps";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { InputTextModule } from "primeng/inputtext";

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, GoogleMapsModule, CardModule, ButtonModule, RippleModule, InputTextModule]
})
export class HomeModule {
}
