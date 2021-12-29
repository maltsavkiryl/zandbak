import { Component, Input, ViewChild } from "@angular/core";
import { GoogleMap } from "@angular/google-maps";
import { Address } from "../../../shared/models/address.interface";
import { Marker } from "../../models/marker.interface";

@Component({
  selector: "zandbak-playground-map",
  templateUrl: "./playground-map.component.html"
})
export class PlaygroundMapComponent {
  @ViewChild(GoogleMap) map: GoogleMap;

  @Input() set fitToBounds(fitToBounds: boolean) {
    this.fitGoogleMapToBounds = fitToBounds;
  }

  @Input() set mapMarkers(markers: Marker[]) {
    this.markers = markers;
    if (this.fitGoogleMapToBounds) {
      this.fitMapToBounds(markers);
    }
  }

  @Input() set address(address: Address) {
    this.centerMapOnAddress(address);
  }

  private fitGoogleMapToBounds: boolean;
  markers: Marker[] = [];

  private centerMapOnAddress(address: Address): void {
    if (this.map && address) {
      this.map.googleMap?.setCenter({
        lat: address.lat,
        lng: address.lng
      });
      this.map.googleMap?.setZoom(16);
    }
  }

  private fitMapToBounds(markers: Marker[]): void {
    const bounds = new google.maps.LatLngBounds();
    markers.forEach((marker) => {
      bounds.extend({
        lat: marker.position.lat,
        lng: marker.position.lng
      });
    });
    if (markers.length > 0) {
      this.map.fitBounds(bounds);
    }
  }

}
