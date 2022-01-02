import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Playground } from "../../../shared/models/playground.interface";
import { Marker } from "../../models/marker.interface";

@Component({
  selector: "zandbak-playground-list",
  templateUrl: "./playground-list.component.html",
  styleUrls: ["./playground-list.component.scss"]
})
export class PlaygroundListComponent {
  @Input() playgrounds: Playground[];
  @Input() totalResults: number;
  @Input() loading: boolean;

  @Output() paginationChanged = new EventEmitter<any>();
  @Output() playGroundSelected = new EventEmitter<Playground>();

  selectedPlayGround: Playground | undefined;

  onPlayGroundCardClick(playGround: Playground): void {
    if (this.selectedPlayGround === playGround) {
      this.selectedPlayGround = undefined;
    } else {
      this.selectedPlayGround = playGround;
    }
    this.playGroundSelected.emit(this.selectedPlayGround);
  }

  onPageChange($event: any) {
    this.paginationChanged.emit($event);
  }
}
