import { Component, OnDestroy, OnInit } from "@angular/core";
import { PlaygroundService } from "../../services/playground.service";
import { catchError, EMPTY, map, Observable, Subject, switchMap, takeUntil } from "rxjs";
import { Playground } from "../../../shared/models/playground.interface";
import { Address } from "../../../shared/models/address.interface";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Marker } from "../../models/marker.interface";
import { Circle } from "../../../shared/models/circle.interface";

const DEFAULT_ADDRESS: Address = {
  name: undefined,
  lat: 51.0597468,
  lng: 3.6855079
};

const DEFAULT_LIMIT: number = 20;
const DEFAULT_OFFSET: number = 0;

@Component({
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit, OnDestroy {
  playgrounds: Playground[] = [];
  markers: Marker[] = [];
  totalResults: number = 0;
  loading: boolean = true;
  selectedPlayGround: Playground;
  mapCircle: Circle;

  private subscriptions$ = new Subject<void>();
  private rangeInKm: number;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private playGroundService: PlaygroundService) {
  }

  ngOnInit(): void {
    this.initQueryParamListenerForPlaygrounds();
  }

  onPlayGroundSelected(playGround: Playground): void {
    this.selectedPlayGround = playGround;
  }

  private initQueryParamListenerForPlaygrounds(): void {
    this.activatedRoute.queryParamMap.pipe(
      switchMap((queryParams) => {
        this.loading = true;
        return this.getPlayGrounds(queryParams);
      }),
      takeUntil(this.subscriptions$),
      map((response) => {
        this.totalResults = response.totalResults;
        return response.result;
      }),
      catchError(() => {
        this.loading = false;
        return EMPTY;
      })).subscribe(playgrounds => {
      this.setMarkers(playgrounds);
      this.playgrounds = playgrounds;
      this.loading = false;
    });
  }

  private getPlayGrounds(queryParams: ParamMap): Observable<any> {
    const rangeInKm: number = parseInt(queryParams.get("range") || "0");
    const address: Address = {
      name: queryParams.get("name") || DEFAULT_ADDRESS.name,
      lat: parseFloat(queryParams.get("lat") || DEFAULT_ADDRESS.lat.toString()),
      lng: parseFloat(queryParams.get("lng") || DEFAULT_ADDRESS.lng.toString())
    };
    const selectedFunctions: string[] = queryParams.get("selectedFunctions")?.split(",") || [];
    this.mapCircle = { lat: address.lat, lng: address.lng, radius: rangeInKm * 1000 };
    const paginationLimit = parseInt(queryParams.get("limit") || DEFAULT_LIMIT.toString());
    const paginationOffset = parseInt(queryParams.get("offset") || DEFAULT_OFFSET.toString());

    return this.playGroundService.getPlaygrounds(selectedFunctions, address, rangeInKm, paginationLimit, paginationOffset);
  }

  private setMarkers(playgrounds: Playground[]): void {
    this.markers = playgrounds.map((playGround) => ({
      position: {
        lat: playGround.fields.geo_point_2d.lat,
        lng: playGround.fields.geo_point_2d.lon
      }
    }));
  }

  onPaginationChanged(event: any): void {
    this.router.navigate(["/search"], {
      queryParams: {
        "limit": event.rows,
        "offset": event.page * event.rows
      },
      queryParamsHandling: "merge"
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.unsubscribe();
  }
}
