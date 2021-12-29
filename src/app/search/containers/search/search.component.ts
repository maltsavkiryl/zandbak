import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { PlaygroundsService } from "../../../shared/services/playgrounds/playgrounds.service";
import { Observable, tap } from "rxjs";
import { PlayGround } from "../../../shared/models/playground.interface";
import { GoogleMap } from "@angular/google-maps";
import { LocationService } from "../../../shared/services/location/location.service";
import { Address } from "../../../shared/models/address.interface";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap) map: GoogleMap;
  @ViewChild("mapSearchField") searchField: ElementRef;

  playGroundList$: Observable<PlayGround[]>;
  selectedFunctions: string[] = [];
  allFunctions: string[] = [];
  rangeInKm: number = 10;
  address: Address;
  markers: { position: { lat: number, lng: number } }[] = [];
  loading: boolean;

  constructor(private activatedRoute: ActivatedRoute, private playGroundService: PlaygroundsService, private locationService: LocationService) {
  }

  ngOnInit(): void {
    this.initFunctions();

    this.activatedRoute.queryParamMap.subscribe((queryParams) => {
      if (queryParams.get("name") && queryParams.get("lat") && queryParams.get("lng")) {
        this.address = {
          name: queryParams.get("name") || "",
          lat: parseFloat(queryParams.get("lat") || "0"),
          lng: parseFloat(queryParams.get("lng") || "0")
        };
      }
      this.getPlayGrounds();
    });
  }

  private initFunctions() {
    this.playGroundService.getAllFunctions().subscribe(value => {
      this.allFunctions = value;
    });
  }

  onSearchButtonClick(): void {
    if (this.selectedFunctions.length == 0) {
      console.log("Gelieven een functie aan te duiden.");
    } else {
      this.getPlayGrounds();
    }
  }

  ngAfterViewInit(): void {
    const searchBox = new google.maps.places.SearchBox(this.searchField.nativeElement);

    if (this.address.name) {
      this.searchField.nativeElement.value = this.address.name;
    }

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
      console.log("places changed");
      this.getPlayGrounds();
    });
  }

  getPlayGrounds(): void {
    this.loading = true;
    this.playGroundList$ = this.playGroundService.getPlayGrounds(this.selectedFunctions ?? [], this.address, this.rangeInKm).pipe(
      tap((playGrounds) => {
        this.fitMapToBounds(playGrounds);
        this.addMarkers(playGrounds);
        this.loading = false;
      })
    );
  }

  onRangeSelectChange(): void {
    this.getPlayGrounds();
  }

  getUserCurrentPosition(): void {
    this.loading = true;
    this.locationService.getAddress().subscribe((address) => {
      this.searchField.nativeElement.value = address.name;
      this.address = address;
      this.getPlayGrounds();
    });
  }

  onFunctionsSelectionChanged(): void {
    this.getPlayGrounds();
  }

  onAddressChanged($event: any): void {
    console.log($event.target.value);
  }

  private fitMapToBounds(playGrounds: PlayGround[]) {
    const bounds = new google.maps.LatLngBounds();
    playGrounds.forEach((playGround) => {
      bounds.extend({
        lat: playGround.fields.geo_point_2d.lat,
        lng: playGround.fields.geo_point_2d.lon
      });
    });
    if (playGrounds.length > 0) {
      this.map.fitBounds(bounds);
    }
  }

  private addMarkers(playGrounds: PlayGround[]) {
    this.markers = [];
    playGrounds.forEach((playGround) => {
      this.markers.push({
        position: {
          lat: playGround.fields.geo_point_2d.lat,
          lng: playGround.fields.geo_point_2d.lon
        }
      });
    });
  }
}
