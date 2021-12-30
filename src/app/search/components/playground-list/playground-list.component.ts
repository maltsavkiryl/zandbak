import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PlayGround } from "../../../shared/models/playground.interface";
import { LazyLoadEvent } from "primeng/api";

@Component({
  selector: "zandbak-playground-list",
  templateUrl: "./playground-list.component.html",
  styleUrls: ["./playground-list.component.scss"]
})
export class PlaygroundListComponent {
  @Input() playGrounds: PlayGround[] | null;
  @Input() totalResults: number;

  @Output() lazyLoadPlayGroundsChanged = new EventEmitter<number>();
  @Output() playGroundSelected = new EventEmitter<PlayGround>();

  selectedPlayGround: PlayGround;

  onLazyLoadPlayGrounds($event: any): void {
    console.log($event);
    this.lazyLoadPlayGroundsChanged.emit($event.first  + $event.rows);
  }

  onPlayGroundCardClick(playGround: PlayGround): void {
    this.selectedPlayGround = playGround;
    this.playGroundSelected.emit(playGround);
  }
}
