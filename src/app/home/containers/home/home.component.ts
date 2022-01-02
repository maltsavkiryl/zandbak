import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { LocationService } from "../../../shared/services/location.service";
import { Router } from "@angular/router";
import { Address } from "../../../shared/models/address.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, OnDestroy {
  address: Address;
  loading: boolean;
  textFieldPlaceHolder: string;


  private subscriptions$ = new Subject<void>();

  constructor(private locationService: LocationService, private router: Router, private zone: NgZone) {
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
        this.address = address;
        this.loading = false;
        this.textFieldPlaceHolder = "Geef een locatie in...";
      });
  }

  onSearchFieldClick(): void {
    this.subscriptions$.next();
    this.loading = false;
    this.textFieldPlaceHolder = "Geef een locatie in...";
  }

  onAddressSelected(address: Address): void {
    this.address = address;
    this.navigateToSearch(address);
  }

  private navigateToSearch(address: Address): void {
    this.zone.run(() => {
      this.router.navigate(["/search"], {
        queryParams: {
          "name": address.name,
          "lat": address.lat,
          "lng": address.lng
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.next();
    this.subscriptions$.unsubscribe();
  }
}
