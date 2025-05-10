import { ErrorRespObject } from "./types";

export const vaccines: string[] = ["pfizer shield", "covishield", "covaxin"];

export const classes: string[] = Array.from(
  { length: 12 },
  (_, i) => `Grade ${i + 1}`
);

export const genders: string[] = ["Male", "Female"];

export const unknownErrorObj: ErrorRespObject = {
  error_string: "Unknown Error",
  message_string: "An unknown error occurred",
};
