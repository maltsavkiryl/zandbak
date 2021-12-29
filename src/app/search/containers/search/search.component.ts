import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { PlaygroundsService } from "../../../shared/services/playgrounds/playgrounds.service";
import { map, Observable, Subject, takeUntil, tap } from "rxjs";
import { PlayGround } from "../../../shared/models/playground.interface";
import { GoogleMap } from "@angular/google-maps";
import { LocationService } from "../../../shared/services/location/location.service";
import { Address } from "../../../shared/models/address.interface";
import { ActivatedRoute } from "@angular/router";

const DEFAULT_ADDRESS: Address = {
  name: "",
  lat: 51.0597468,
  lng: 3.6855079
};

@Component({
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(GoogleMap) map: GoogleMap;
  @ViewChild("mapSearchField") searchField: ElementRef;

  playGroundList$: Observable<PlayGround[]>;
  selectedFunctions: string[] = [];
  allFunctions: string[] = [];
  rangeInKm: number = 3;
  address: Address = DEFAULT_ADDRESS;
  markers: { position: { lat: number, lng: number } }[] = [];
  totalResults: number = 0;
  loading: boolean = true;
  playGrounds: PlayGround[] = [];
  paginationLimit: number = 20;

  private subscriptions$ = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute, private playGroundService: PlaygroundsService, private locationService: LocationService) {
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.unsubscribe();
  }

  ngOnInit(): void {
    this.initFunctions();
  }

  ngAfterViewInit(): void {
    this.initSearchBox();

    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.subscriptions$))
      .subscribe((queryParams) => {
        if (queryParams.get("name") && queryParams.get("lat") && queryParams.get("lng")) {
          this.setAddress(queryParams.get("name"), queryParams.get("lat"), queryParams.get("lng"));
          this.centerMapOnAddress();
          this.getPlayGrounds(false);
        } else {
          this.getPlayGrounds();
        }
      });
  }

  onRangeSelectChange(): void {
    this.getPlayGrounds();
  }

  onFunctionsSelectionChanged(): void {
    this.getPlayGrounds();
  }

  private initSearchBox(): void {
    const searchBox = new google.maps.places.SearchBox(this.searchField.nativeElement);
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places) {
        const place = places[0];
        this.setAddress(place.formatted_address, place.geometry?.location?.lat().toString(), place.geometry?.location?.lng().toString());
      }
      this.centerMapOnAddress();
      this.getPlayGrounds(false);
    });
    this.searchField.nativeElement.value = this.address.name;
  }

  private centerMapOnAddress() {
    this.map.googleMap?.setCenter({
      lat: this.address.lat,
      lng: this.address.lng
    });
    this.map.googleMap?.setZoom(16);
    this.rangeInKm = 3;
  }

  private getPlayGrounds(fitMapToBounds: boolean = true): void {
    this.loading = true;
    this.playGroundService.getPlayGrounds(this.selectedFunctions ?? [], this.address, this.rangeInKm, this.paginationLimit).pipe(
      takeUntil(this.subscriptions$),
      tap((response) => {
        if (fitMapToBounds) {
          this.fitMapToBounds(response.result);
        }
        this.addMarkers(response.result);
        this.totalResults = response.total;
      }),
      map((response) => response.result)
    ).subscribe(value => {
      this.playGrounds = value;
      this.loading = false;
    });
  }


  getUserCurrentPosition(): void {
    this.loading = true;
    this.locationService.getAddress()
      .pipe(takeUntil(this.subscriptions$))
      .subscribe((address) => {
        this.searchField.nativeElement.value = address.name;
        this.address = address;
        this.getPlayGrounds();
      });
  }

  private initFunctions() {
    this.playGroundService.getAllFunctions()
      .pipe(takeUntil(this.subscriptions$))
      .subscribe(value => {
        this.allFunctions = value;
      });
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

  private setAddress(name: string | null | undefined, lat: string | null | undefined, lng: string | null | undefined) {
    this.address = {
      name: name || DEFAULT_ADDRESS.name,
      lat: lat ? parseFloat(lat) : DEFAULT_ADDRESS.lat,
      lng: lng ? parseFloat(lng) : DEFAULT_ADDRESS.lng
    };
    this.searchField.nativeElement.value = this.address.name;
  }

  loadPlayGroundsLazy($event: any) {
    const newLimit = $event.first + $event.rows;
    if (newLimit > this.paginationLimit) {
      this.paginationLimit = newLimit;
      this.getPlayGrounds();
    }
  }
}
