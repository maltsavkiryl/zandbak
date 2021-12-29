import { LatLng } from "./latlng.interface";

export interface Field {
  naam: string;
  functies: string;
  geo_point_2d: LatLng;
}
