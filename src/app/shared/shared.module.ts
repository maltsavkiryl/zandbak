import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { ButtonModule } from "primeng/button";
import { RouterModule } from "@angular/router";
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenubarModule } from "primeng/menubar";
import { SharedModule as primeNgShared } from "primeng/api";

@NgModule({
  declarations: [
    PageNotFoundComponent,
    NavBarComponent,
    FooterComponent
  ],
  exports: [
    FooterComponent,
    NavBarComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule,
    MenubarModule,
    primeNgShared
  ]
})
export class SharedModule {
}
