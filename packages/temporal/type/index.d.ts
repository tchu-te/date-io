declare module "@date-io/type" {
  import { Temporal } from "proposal-temporal";

  export type DateType = Temporal.PlainDateTime;
}
