import { Component, OnInit } from "@angular/core";

@Component({
  selector: "zandbak-footer",
  template: `
    <div class="footer">
      <img src="assets/images/zandbak_footer.png" height="15px"/>
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
