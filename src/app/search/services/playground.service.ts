import { Inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Playground } from "../../shared/models/playground.interface";
import { HttpClient } from "@angular/common/http";
import { Address } from "../../shared/models/address.interface";
import { PlaygroundsQueryBuilder } from "./playgrounds-query.builder";

@Injectable({
  providedIn: "root"
})
export class PlaygroundService {

  constructor(private http: HttpClient, @Inject("BASE_HOST_URL") private baseHostUrl: string) {
  }

  getAllPlaygroundFunctions(): Observable<string[]> {
    return this.http.get<any>(`${this.baseHostUrl}/aggregates?select=&group_by=functies`).pipe(
      map((value) => {
        return value["aggregations"]
          .flatMap((value: any) => value["functies"].split(",").map((item: string) => item.trim()))
          .filter(this.onlyUnique);
      }));
  }

  getPlaygrounds(functions: string[], address: Address, rangeInKm: number, limit: number, offset: number): Observable<{ totalResults: number; result: Playground[] }> {
    let query = new PlaygroundsQueryBuilder()
      .addFunctions(functions)
      .addLocation(address, rangeInKm)
      .addPagination(limit, offset)
      .build();

    return this.http.get<any>(`${this.baseHostUrl}/records${query}`).pipe(
      map((response) => {
        return {
          totalResults: response["total_count"],
          result: response["records"].map((value: any) => value["record"])
        };
      }));
  }

  private onlyUnique(value: any, index: number, self: any): any {
    return self.indexOf(value) === index;
  }
}
