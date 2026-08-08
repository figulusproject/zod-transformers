import { z } from "zod";
import { resolveMessage, type TransformOptions } from "./core.js";

export interface JsonStringOptions extends TransformOptions {}

export function jsonString<T extends z.ZodType<any, any>>(
  inner: T,
  opts?: JsonStringOptions,
) {
  return z
    .string()
    .transform((raw, ctx) => {
      try {
        return JSON.parse(raw);
      } catch {
        ctx.addIssue(resolveMessage(opts, raw, "invalid_json", "Invalid JSON"));
        return z.NEVER;
      }
    })
    .pipe(inner);
}
