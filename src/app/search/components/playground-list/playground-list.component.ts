import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Playground } from "../../../shared/models/playground.interface";

@Component({
  selector: "zandbak-playground-list",
  templateUrl: "./playground-list.component.html",
  styleUrls: ["./playground-list.component.scss"]
})
export class PlaygroundListComponent {
  @Input() playgrounds: Playground[];
  @Input() totalResults: number;
  @Input() loading: boolean;
  @Input() selectedPlayground: Playground | undefined;

  @Output() paginationChanged = new EventEmitter<any>();
  @Output() playGroundSelected = new EventEmitter<Playground>();

  onPlayGroundCardClick(playGround: Playground): void {
    if (this.selectedPlayground === playGround) {
      this.selectedPlayground = undefined;
    } else {
      this.selectedPlayground = playGround;
    }
    this.playGroundSelected.emit(this.selectedPlayground);
  }

  onPageChange($event: any) {
    this.paginationChanged.emit($event);
  }
}
