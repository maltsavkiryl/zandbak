import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
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
    this.navigateToSearch();
  }

  private navigateToSearch(): void {
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
}
