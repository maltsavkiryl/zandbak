import { Component, OnInit } from "@angular/core";

@Component({
  selector: "zandbak-footer",
  template: `
    <div class="footer">
      <div>Kiryl Maltsav x Wisemen</div>
    </div>
  `,
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
