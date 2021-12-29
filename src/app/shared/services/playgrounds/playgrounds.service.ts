import { Inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { PlayGround } from "../../models/playground.interface";
import { HttpClient } from "@angular/common/http";
import { Address } from "../../models/address.interface";

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

  getAllFunctions(): Observable<string[]> {
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

  getPlayGrounds(functions: string[], address: Address, rangeInKm: number): Observable<PlayGround[]> {
    // let query = `?where=distance(geo_point_2d, geom'POINT(${address.lng} ${address.lat})', ${rangeInKm}km) and functies like "${selectedFunctions.concat(', ')}"`;
    // let query = `?where=functies like "${selectedFunctions.concat(', ')}"`;
    let query = new PlayGroundsQueryBuilder()
      .addFunctions(functions)
      .addLocation(address,rangeInKm)
      .addLimit(20)
      .build();

    return this.http.get<any>(`${this.baseHostUrl}/records${query}`).pipe(
      map((results) => results["records"].map((value: any) => value["record"])));
  }

  private queryBuilder(): string {
    return "";
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
      if (this.functions.length == 0) {
        this.query += `&limit=${limit}`;
      } else {
        this.query += `&limit=100`;
      }
    }
    return this;
  }

  addLocation(address: Address, rangeInKm: number): PlayGroundsQueryBuilder {
    if (address && address?.lat !== null && address?.lng !== null && rangeInKm !== null) {
      if(this.functions.length > 0){
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
