import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";
import { GoogleMap } from "@angular/google-maps";
import { Marker } from "../../models/marker.interface";
import { Circle } from "../../../shared/models/circle.interface";
import { Playground } from "../../../shared/models/playground.interface";

@Component({
  selector: "zandbak-playground-map",
  templateUrl: "./playground-map.component.html"
})
export class PlaygroundMapComponent implements AfterViewInit {
  @ViewChild(GoogleMap) map: GoogleMap;

  @Input() set mapMarkers(markers: Marker[]) {
    this.markers = markers;
  }

  @Input() set circle(circle: Circle) {
    this.mapCircle = circle;
    this.drawCircleOnMapAndCenter();
  }

  @Input() set playground(playground: Playground) {
    this.selectedPlayground = playground;
    if (this.selectedPlayground) {
      this.zoomAndCenterOnPlayground();
    } else {
      this.drawCircleOnMapAndCenter()
    }
  }

  private selectedPlayground: Playground;
  private mapCircle: Circle;
  private googleMapsCircle: google.maps.Circle;
  markers: Marker[] = [];

  ngAfterViewInit(): void {
    this.drawCircleOnMapAndCenter();
    this.zoomAndCenterOnPlayground();
  }

  private drawCircleOnMapAndCenter(): void {
    if (this.map) {
      if (this.googleMapsCircle) {
        this.googleMapsCircle.setMap(null);
      }
      this.googleMapsCircle = new google.maps.Circle({
        strokeColor: "#f69c15",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#f69c15",
        fillOpacity: 0.1,
        map: this.map.googleMap,
        center: {
          lat: this.mapCircle.lat,
          lng: this.mapCircle.lng
        },
        radius: this.mapCircle.radius
      });
      const circleBounds = this.googleMapsCircle.getBounds();
      if (circleBounds) {
        this.map.fitBounds(circleBounds, 1);
      }
    }
  }

  private zoomAndCenterOnPlayground() {
    if (this.map && this.selectedPlayground) {
      this.map.googleMap?.setCenter(
        {
          lat: this.selectedPlayground.fields.geo_point_2d.lat,
          lng: this.selectedPlayground.fields.geo_point_2d.lon
        }
      );
      this.map.googleMap?.setZoom(16);
    }
  }
}
