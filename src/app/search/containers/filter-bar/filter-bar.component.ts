import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from "@angular/core";
import { Address } from "../../../shared/models/address.interface";
import { debounceTime, Subject, takeUntil } from "rxjs";
import { PlaygroundService } from "../../services/playground.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { LocationService } from "../../../shared/services/location.service";

const DEFAULT_ADDRESS: Address = {
  name: undefined,
  lat: 51.0597468,
  lng: 3.6855079
};

const DEFAULT_RANGE: number = 5;

@Component({
  selector: "zandbak-filter-bar",
  templateUrl: "./filter-bar.component.html",
  styleUrls: ["./filter-bar.component.scss"]
})
export class FilterBarComponent implements OnInit, AfterViewInit {
  @ViewChild("mapSearchField") searchField: ElementRef;

  rangeInKm: number = DEFAULT_RANGE;
  address: Address = DEFAULT_ADDRESS;
  selectedFunctions: string[];
  rangeSelectionSubject: Subject<any> = new Subject();
  allFunctions: string[] = [];
  loading: boolean;

  private subscriptions$ = new Subject<void>();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private locationService: LocationService,
              private playGroundService: PlaygroundService,
              private zone: NgZone) {
  }

  ngOnInit(): void {
    this.initRangeSelectionSubject();
    this.initFilterBar();

    this.playGroundService.getAllPlaygroundFunctions()
      .pipe(takeUntil(this.subscriptions$))
      .subscribe((functions) => this.allFunctions = functions);
  }


  ngAfterViewInit(): void {
    this.initGoogleMapsSearchBox();
  }

  private initGoogleMapsSearchBox(): void {
    const searchBox = new google.maps.places.SearchBox(this.searchField.nativeElement);

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places) {
        const place = places[0];
        if (place.formatted_address) {
          this.address = {
            name: place.formatted_address || "",
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0
          };
          this.rangeInKm = 1;
          this.zone.run(() => {
            this.updateQueryParams({
              "name": this.address.name,
              "lat": this.address.lat,
              "lng": this.address.lng,
              "range": 1
            });
          });
        }
      }
    });
  }

  private initFilterBar() {
    const queryParams = this.activatedRoute.snapshot.queryParamMap;

    this.address = {
      name: queryParams.get("name") || DEFAULT_ADDRESS.name,
      lat: parseFloat(queryParams.get("lat") || DEFAULT_ADDRESS.lat.toString()),
      lng: parseFloat(queryParams.get("lng") || DEFAULT_ADDRESS.lng.toString())
    };

    this.selectedFunctions = queryParams.get("selectedFunctions")?.split(",") || [];

    this.rangeInKm = parseInt(queryParams.get("range") || DEFAULT_RANGE.toString());

    if (this.address.name) {
      this.rangeInKm = 1;
    }

    this.updateQueryParams({
      "name": this.address.name,
      "lat": this.address.lat,
      "lng": this.address.lng,
      "range": this.rangeInKm
    });
  }

  private initRangeSelectionSubject(): void {
    this.rangeSelectionSubject
      .pipe(debounceTime(300))
      .pipe(takeUntil(this.subscriptions$))
      .subscribe(() => {
          this.updateQueryParams({
            "range": this.rangeInKm
          });
        }
      );
  }

  getUserCurrentPosition(): void {
    this.locationService.getAddress()
      .pipe(takeUntil(this.subscriptions$))
      .subscribe((address) => {
        this.address = address;
        this.updateQueryParams({
          "name": this.address.name,
          "lat": this.address.lat,
          "lng": this.address.lng
        });
      });
  }

  onFunctionsSelectionChanged(): void {
    const functions = this.selectedFunctions.join(",");
    this.updateQueryParams({
      "selectedFunctions": functions !== "" ? functions : null
    });
  }

  onRangeSelectChange(event: any): void {
    this.rangeSelectionSubject.next(event.value);
  }

  clearSearchTextField(): void {
    this.rangeInKm = DEFAULT_RANGE;
    this.updateQueryParams({
      "name": DEFAULT_ADDRESS.name,
      "lat": DEFAULT_ADDRESS.lat,
      "lng": DEFAULT_ADDRESS.lng,
      "range": this.rangeInKm
    });
    this.address.name = DEFAULT_ADDRESS.name;
  }

  onResetButtonClick(): void {
    this.rangeInKm = DEFAULT_RANGE;
    this.selectedFunctions = [];
    this.address = DEFAULT_ADDRESS;
    this.updateQueryParams({
      "name": DEFAULT_ADDRESS.name,
      "lat": DEFAULT_ADDRESS.lat,
      "lng": DEFAULT_ADDRESS.lng,
      "range": DEFAULT_RANGE,
      "selectedFunctions": null
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.unsubscribe();
  }

  private updateQueryParams(queryParams: Params): void {
    this.router.navigate(["/search"], {
      queryParams: queryParams,
      queryParamsHandling: "merge"
    });
  }
}
