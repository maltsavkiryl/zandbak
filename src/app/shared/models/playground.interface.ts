import { Field } from "./field.interface";

export interface PlayGround {
  id: string;
  size: number;
  fields: Field;
}
