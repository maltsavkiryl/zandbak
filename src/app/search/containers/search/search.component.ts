import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { PlaygroundsService } from "../../services/playgrounds/playgrounds.service";
import { map, Subject, takeUntil, tap } from "rxjs";
import { PlayGround } from "../../../shared/models/playground.interface";
import { LocationService } from "../../../shared/services/location/location.service";
import { Address } from "../../../shared/models/address.interface";
import { ActivatedRoute } from "@angular/router";
import { Marker } from "../../models/marker.interface";

const DEFAULT_RANGE: number = 3;
const DEFAULT_ADDRESS: Address = {
  name: "",
  lat: 51.0597468,
  lng: 3.6855079
};

@Component({
  templateUrl: "./search.component.html"
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {
  playGroundFunctions: string[] = [];
  playGroundList: PlayGround[];
  rangeInKm: number = DEFAULT_RANGE;
  address: Address = DEFAULT_ADDRESS;
  markers: Marker[] = [];
  totalResults: number = 0;
  loading: boolean = true;
  paginationLimit: number = 20;
  fitToBounds: boolean = false;

  private selectedPlayGroundFunctions: string[] = [];
  private subscriptions$ = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute, private playGroundService: PlaygroundsService, private locationService: LocationService) {
  }

  ngOnInit(): void {
    this.getAllPlayGroundFunctions();
    this.getPlayGrounds();
  }

  ngAfterViewInit(): void {
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.subscriptions$))
      .subscribe((queryParams) => {
        if (queryParams.get("name") && queryParams.get("lat") && queryParams.get("lng")) {
          this.fitToBounds = false;
          this.setAddress(queryParams.get("name"), queryParams.get("lat"), queryParams.get("lng"));
          this.rangeInKm = 3;
        }
        this.getPlayGrounds();
      });
  }

  onRangeSelectChange(rangeInKm: number): void {
    this.rangeInKm = rangeInKm;
    this.fitToBounds = true;
    this.getPlayGrounds();
  }

  onFunctionsSelectionChanged(selectedPlayGroundFunctions: string[]): void {
    this.selectedPlayGroundFunctions = selectedPlayGroundFunctions;
    this.fitToBounds = true;
    this.getPlayGrounds();
  }

  private getPlayGrounds(): void {
    this.loading = true;
    this.playGroundService.getPlayGrounds(this.selectedPlayGroundFunctions ?? [], this.address, this.rangeInKm, this.paginationLimit).pipe(
      takeUntil(this.subscriptions$),
      tap((response) => {
        this.addMarkers(response.result);
        this.totalResults = response.total;
      }),
      map((response) => response.result)
    ).subscribe(playGrounds => {
      this.loading = false;
      this.playGroundList = playGrounds;
    });
  }

  getUserCurrentPosition(): void {
    this.loading = true;
    this.locationService.getAddress()
      .pipe(takeUntil(this.subscriptions$))
      .subscribe((address) => {
        this.fitToBounds = false;
        this.address = address;
        this.getPlayGrounds();
      });
  }

  private getAllPlayGroundFunctions(): void {
    this.playGroundService.getAllPlayGroundFunctions()
      .pipe(takeUntil(this.subscriptions$))
      .subscribe(playGroundFunctions => {
        this.playGroundFunctions = playGroundFunctions;
      });
  }

  private addMarkers(playGrounds: PlayGround[]): void {
    this.markers = playGrounds.map((playGround) => ({
      position: {
        lat: playGround.fields.geo_point_2d.lat,
        lng: playGround.fields.geo_point_2d.lon
      }
    }));
  }

  private setAddress(name: string | null, lat: string | null, lng: string | null): void {
    this.address = {
      name: name || DEFAULT_ADDRESS.name,
      lat: lat ? parseFloat(lat) : DEFAULT_ADDRESS.lat,
      lng: lng ? parseFloat(lng) : DEFAULT_ADDRESS.lng
    };
  }

  loadPlayGrounds(limit: number): void {
    if (limit > this.paginationLimit) {
      this.paginationLimit = limit;
      this.getPlayGrounds();
    }
  }

  onAddressChanged(address: Address): void {
    this.fitToBounds = false;
    this.address = address;
    this.rangeInKm = 3;
    this.getPlayGrounds();
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.unsubscribe();
  }

}
