import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  template:
    `
      <div class="p-grid p-jc-center p-m-6">
        <div class="p-col-3 p-text-center">
          <h1>Pagina niet gevonden</h1>
          <button class="p-button" (click)="onNavigateButtonClick()">Terug naar home</button>
        </div>
      </div>
    `
})
export class PageNotFoundComponent {

  constructor(private router: Router) {
  }

  onNavigateButtonClick() {
    this.router.navigate(["home"]);
  }
}
