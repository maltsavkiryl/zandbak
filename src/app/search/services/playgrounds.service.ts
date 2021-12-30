import { Inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { PlayGround } from "../../shared/models/playground.interface";
import { HttpClient } from "@angular/common/http";
import { Address } from "../../shared/models/address.interface";
import { PlayGroundsQueryBuilder } from "./playground-query-param.builder";

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
