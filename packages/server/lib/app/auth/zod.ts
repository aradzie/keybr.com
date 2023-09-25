import { type Pipe } from "@fastr/controller";
import { BadRequestError } from "@fastr/errors";
import { isConstructor, type Newable } from "@fastr/lang";
import { type ZodError, type ZodType } from "zod";

export type Report = ((error: ZodError) => never) | Newable<Error>;

export const zod = (
  schema: ZodType,
  report: Report = BadRequestError,
): Pipe => {
  return (ctx, value) => {
    const result = schema.safeParse(value);
    if (result.success) {
      return result.data;
    } else {
      if (isConstructor(report)) {
        throw new report();
      }
      if (typeof report === "function") {
        report(result.error);
      }
      throw new BadRequestError();
    }
  };
};
