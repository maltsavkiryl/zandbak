import { Address } from "../../shared/models/address.interface";

export class PlaygroundsQueryBuilder {

  private query: string = "?where=";
  private functions: string[] = [];

  addFunctions(functions: string[]): PlaygroundsQueryBuilder {
    if (functions.length > 0) {
      this.functions = functions;
      this.query += `functies like "${functions.concat(", ")}"`;
    }
    return this;
  }

  addPagination(limit: number, offset: number): PlaygroundsQueryBuilder {
    if (limit !== null) {
      this.query += `&limit=${limit}`;
    }
    if (offset !== null) {
      this.query += `&offset=${offset}`;
    }
    return this;
  }

  addLocation(address: Address, rangeInKm: number): PlaygroundsQueryBuilder {
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
