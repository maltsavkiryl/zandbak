import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { Address } from "../../../shared/models/address.interface";

@Component({
  selector: "zandbak-search-bar",
  template:
    `
      <div class="p-fluid text-field-wrapper">
        <span class="p-input-icon-left">
          <i *ngIf="!loading" class="pi pi-map-marker" id="location" style="cursor: pointer;"
             (click)="getUserCurrentPosition()"></i>
          <i *ngIf="loading" class="pi pi-spin pi-spinner"></i>
          <input #mapSearchField type="text" [placeholder]="textFieldPlaceHolder" pInputText
                 (click)="onSearchFieldClick()" />
        </span>
      </div>
    `,
  styleUrls: ["./search-bar.component.scss"]
})
export class SearchBarComponent implements AfterViewInit {
  @ViewChild("mapSearchField") searchField: ElementRef;

  @Input() loading: boolean;
  @Input() textFieldPlaceHolder: string;
  @Input() set address(address: Address) {
    if (this.searchField && address.name) {
      this.searchField.nativeElement.value = address.name;
    }
  }

  @Output() userCurrentPositionRequested = new EventEmitter<void>();
  @Output() searchFieldClicked = new EventEmitter<void>();
  @Output() addressSelected = new EventEmitter<Address>();

  getUserCurrentPosition() {
    this.userCurrentPositionRequested.emit();
  }

  onSearchFieldClick() {
    this.searchFieldClicked.emit();
  }

  ngAfterViewInit(): void {
    const searchBox = new google.maps.places.SearchBox(this.searchField.nativeElement);

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places) {
        const place = places[0];
        const address: Address = {
          name: place.formatted_address || "",
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0
        };
        this.addressSelected.emit(address);
      }
    });
  }
}
