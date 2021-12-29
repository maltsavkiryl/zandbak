import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeModule } from "./home/home.module";
import { SearchModule } from "./search/search.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { GoogleMapsModule } from "@angular/google-maps";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "../environments/environment";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MenubarModule } from "primeng/menubar";
import { SharedModule } from "./shared/shared.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    RouterModule,
    CommonModule,
    SearchModule,
    BrowserAnimationsModule,
    HttpClientModule,
    GoogleMapsModule,
    SharedModule
  ],
  providers: [
    { provide: "BASE_HOST_URL", useValue: environment.baseHostUrl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
