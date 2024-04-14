import { createContext, useContext } from "react";
import { type PhoneticModel } from "./phoneticmodel.ts";

export const PhoneticModelContext = createContext<PhoneticModel>(null!);

export function usePhoneticModel(): PhoneticModel {
  const value = useContext(PhoneticModelContext);
  if (value == null) {
    throw new Error(
      process.env.NODE_ENV !== "production"
        ? "PhoneticModelContext is missing"
        : undefined,
    );
  }
  return value;
}
