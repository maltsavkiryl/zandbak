import { Field } from "./field.interface";

export interface Playground {
  id: string;
  size: number;
  fields: Field;
}
