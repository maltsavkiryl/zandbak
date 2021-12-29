import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PlayGround } from "../../../shared/models/playground.interface";

@Component({
  selector: "zandbak-playground-list",
  templateUrl: "./playground-list.component.html",
  styleUrls: ["./playground-list.component.scss"]
})
export class PlaygroundListComponent {
  @Input() playGrounds: PlayGround[] | null;
  @Input() totalResults: number;

  @Output() loadPlayGroundsChanged = new EventEmitter<number>();

  loadPlayGround($event: any) {
    this.loadPlayGroundsChanged.emit($event.first + $event.rows);
  }
}
