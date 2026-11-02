import { createContext } from "react";
import { type RecorderOptions } from "./recorder.ts";

/** Disabled by default; the storage integration supplies a record sink and context. */
export const RecordingContext = createContext<RecorderOptions | null>(null);
