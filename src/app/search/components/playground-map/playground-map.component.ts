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
  private currentAddress: Address;

  @Input() set mapMarkers(markers: Marker[]) {
    this.markers = markers;
    this.fitMapToBounds(markers);
  }

  @Input() set address(address: Address) {
    this.currentAddress = address;
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
    if (markers.length == 0) {
      return;
    }

    if (this.currentAddress.name == undefined) {
      const bounds = new google.maps.LatLngBounds();
      this.map.googleMap?.getBounds()?.union(bounds);
      markers.forEach((marker) => {
        bounds.extend({
          lat: marker.position.lat,
          lng: marker.position.lng
        });
      });
      this.map.fitBounds(bounds);
      if(this.markers.length == 1){
        this.map.googleMap?.setZoom(18);
      }
    }
  }
}
