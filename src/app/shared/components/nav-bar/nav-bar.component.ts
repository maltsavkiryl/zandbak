import { Component, Input } from "@angular/core";

@Component({
  selector: "zandbak-nav-bar",
  template:
    `
      <div style="height: 80px">

        <p-menubar [model]="items" [style]="{'height' :'80px'}">
          <ng-template pTemplate="start">
            <img [routerLink]="['/home']" src="assets/logo/zandbak_logo_border_white.png" style="cursor: pointer"
                 height="35"
                 class="p-mr-2 p-ml-3">
          </ng-template>
        </p-menubar>
      </div>`
})
export class NavBarComponent {
  @Input() items: any;

}
