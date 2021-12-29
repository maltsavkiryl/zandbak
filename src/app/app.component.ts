import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MenuItem } from "primeng/api";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "Zandbak";

  items: MenuItem[] = [
    { label: "Home", routerLink: "/home" },
    { label: "Zoeken", routerLink: "/search" },
  ];

  constructor(public route: ActivatedRoute) {
  }
}
