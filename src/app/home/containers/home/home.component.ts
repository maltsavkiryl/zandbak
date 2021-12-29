import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LocationService } from "../../../shared/services/location/location.service";
import { Router } from "@angular/router";
import { Address } from "../../../shared/models/address.interface";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild("mapSearchField") searchField: ElementRef;
  private address: Address;

  constructor(private locationService: LocationService, private router: Router) {
  }

  ngOnInit(): void {
    // this.getUserCurrentPosition();
  }

  getUserCurrentPosition(): void {
    this.locationService.getAddress().subscribe((address) => {
      this.searchField.nativeElement.value = address.name;
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
}
