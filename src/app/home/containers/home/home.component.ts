import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { LocationService } from "../../../shared/services/location.service";
import { Router } from "@angular/router";
import { Address } from "../../../shared/models/address.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("mapSearchField") searchField: ElementRef;
  private address: Address;
  loading: boolean;
  textFieldPlaceHolder: string;

  private subscriptions$ = new Subject<void>();

  constructor(private locationService: LocationService, private router: Router) {
  }

  ngOnInit(): void {
    this.getUserCurrentPosition();
  }

  getUserCurrentPosition(): void {
    this.loading = true;
    this.textFieldPlaceHolder = "Locatie ophalen...";
    this.locationService.getAddress()
      .pipe(takeUntil(this.subscriptions$))
      .subscribe((address) => {
        this.searchField.nativeElement.value = address.name;
        this.address = address;
        this.loading = false;
        this.textFieldPlaceHolder = "Geef een locatie in...";
      });
  }

  ngAfterViewInit(): void {
    const searchBox = new google.maps.places.SearchBox(this.searchField.nativeElement);

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places) {
        const place = places[0];
        this.address = {
          name: place.formatted_address || "",
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0
        };
      }
    });
  }

  onSearchButtonClick(): void {
    if (this.address) {
      this.router.navigate(["/search"], {
        queryParams: {
          ...this.address
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.unsubscribe();
  }

  onSearchFieldClick() {
    this.subscriptions$.next();
    this.loading = false;
    this.textFieldPlaceHolder = "Geef een locatie in...";
  }
}
