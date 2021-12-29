import { Injectable } from "@angular/core";
import { Observable, switchMap } from "rxjs";
import { LatLng } from "../../models/latlng.interface";
import { Address } from "../../models/address.interface";

@Injectable({
  providedIn: "root"
})
export class LocationService {

  getAddress(): Observable<Address> {
    return this.getUserCurrentPosition().pipe(
      switchMap(value => this.getAddressFromUserLocation(value))
    );
  }

  getUserCurrentPosition(): Observable<LatLng> {
    return new Observable((subscriber) => {
      navigator.geolocation.getCurrentPosition(resp => {
          subscriber.next({
            lon: resp.coords.longitude, lat: resp.coords.latitude
          });
        },
        err => {
          subscriber.error(err);
        });
    });
  }

  private getAddressFromUserLocation(userLocation: LatLng): Promise<Address> {
    const location = new google.maps.LatLng(userLocation.lat, userLocation.lon);
    const geocoder = new google.maps.Geocoder();

    return geocoder.geocode({ location: location }).then(value => {
      return {
        name: value.results[0].formatted_address,
        lat: userLocation.lat,
        lng: userLocation.lon
      };
    });
  }
}
