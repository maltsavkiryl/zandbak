import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { Address } from "../../../shared/models/address.interface";
import { debounceTime, Subject } from "rxjs";

@Component({
  selector: "zandbak-filter-bar",
  templateUrl: "./filter-bar.component.html",
  styleUrls: ["./filter-bar.component.scss"]
})
export class FilterBarComponent implements OnInit, AfterViewInit {
  @ViewChild("mapSearchField") searchField: ElementRef;
  @Input() rangeInKm: any;
  @Input() allFunctions: any;
  @Input() loading: boolean;

  @Input() set address(address: Address) {
    if (this.searchField) {
      this.searchField.nativeElement.value = address.name;
    }
  }

  selectedFunctions: any;

  @Output() userCurrentPositionRequested = new EventEmitter<void>();
  @Output() rangeSelectionChanged = new EventEmitter<number>();
  @Output() functionsSelectionChanged = new EventEmitter<string[]>();
  @Output() addressChanged = new EventEmitter<Address>();

  rangeSelectionSubject: Subject<any> = new Subject();

  ngOnInit(): void {
    this.rangeSelectionSubject
      .pipe(debounceTime(300))
      .subscribe(() => {
          this.rangeSelectionChanged.emit(this.rangeInKm);
        }
      );
  }

  getUserCurrentPosition() {
    this.userCurrentPositionRequested.emit();
  }

  onFunctionsSelectionChanged() {
    this.functionsSelectionChanged.emit(this.selectedFunctions);
  }

  onRangeSelectChange($event: any) {
    this.rangeSelectionSubject.next($event);
  }

  ngAfterViewInit(): void {
    const searchBox = new google.maps.places.SearchBox(this.searchField.nativeElement);
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places) {
        const place = places[0];
        this.addressChanged.emit({
          name: place.formatted_address || "",
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0
        });
        this.searchField.nativeElement.value = place.formatted_address;
      }
    });
  }
}
