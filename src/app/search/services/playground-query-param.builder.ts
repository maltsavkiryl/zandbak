import { Address } from "../../shared/models/address.interface";

export class PlayGroundsQueryBuilder {

  private query: string = "";
  private functions: string[] = [];

  addFunctions(functions: string[]): PlayGroundsQueryBuilder {
    if (functions.length > 0) {
      this.functions = functions;
      this.query += `?where=functies like "${functions.concat(", ")}"`;
    }
    return this;
  }

  addLimit(limit: number): PlayGroundsQueryBuilder {
    if (limit !== null) {
      if (this.query == "") {
        this.query += `?limit=${limit}`;
      } else {
        this.query += `&limit=${limit}`;
      }
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
