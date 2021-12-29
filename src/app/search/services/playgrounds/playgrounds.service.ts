import { Inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { PlayGround } from "../../../shared/models/playground.interface";
import { HttpClient } from "@angular/common/http";
import { Address } from "../../../shared/models/address.interface";

@Injectable({
  providedIn: "root"
})
export class PlaygroundsService {

  constructor(private http: HttpClient, @Inject("BASE_HOST_URL") private baseHostUrl: string) {
  }

  getPlaygrounds(): Observable<PlayGround[]> {
    return this.http.get<any>(`${this.baseHostUrl}/records`).pipe(
      map((results) => results["records"].map((value: any) => value["record"])));
  }

  getAllPlayGroundFunctions(): Observable<string[]> {
    return this.http.get<any>(`${this.baseHostUrl}/aggregates?select=&group_by=functies`).pipe(
      map((value) => {
        return value["aggregations"]
          .flatMap((value: any) => value["functies"].split(",").map((item: string) => item.trim()))
          .filter(this.onlyUnique);
      }));
  }

  private onlyUnique(value: any, index: number, self: any) {
    return self.indexOf(value) === index;
  }

  getPlayGrounds(functions: string[], address: Address, rangeInKm: number, limit: number): Observable<{ total: number; result: PlayGround[] }> {
    let query = new PlayGroundsQueryBuilder()
      .addFunctions(functions)
      .addLocation(address, rangeInKm)
      .addLimit(limit)
      .build();

    return this.http.get<any>(`${this.baseHostUrl}/records${query}`).pipe(
      map((response) => {
        return {
          total: response["total_count"],
          result: response["records"].map((value: any) => value["record"])
        };
      }));
  }
}

export class PlayGroundsQueryBuilder {

  private query: string = "?where=";
  private functions: string[] = [];

  addFunctions(functions: string[]): PlayGroundsQueryBuilder {
    if (functions.length > 0) {
      this.functions = functions;
      this.query += `functies like "${functions.concat(", ")}"`;
    }
    return this;
  }

  addLimit(limit: number): PlayGroundsQueryBuilder {
    if (limit !== null) {
      this.query += `&limit=${limit}`;
    }
    return this;
  }

  addLocation(address: Address, rangeInKm: number): PlayGroundsQueryBuilder {
    if (address && address?.lat !== null && address?.lng !== null && rangeInKm !== null) {
      if (this.functions.length > 0) {
        this.query += `and `;
      }
      this.query += `distance(geo_point_2d, geom'POINT(${address.lng} ${address.lat})', ${rangeInKm}km)`;
    }
    return this;
  }

  build(): string {
    return this.query;
  }

}
