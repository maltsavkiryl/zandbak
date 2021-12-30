import { Address } from "../../shared/models/address.interface";

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
