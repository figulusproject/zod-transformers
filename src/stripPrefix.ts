import { z } from "zod";
import { resolveMessage, type TransformOptions } from "./core.js";

export interface StripPrefixOptions extends TransformOptions {
  /** Whether the prefix must be present. Defaults to true. */
  required?: boolean;
}

export function stripPrefix(prefix: string, opts?: StripPrefixOptions) {
  const required = opts?.required ?? true;
  return z.string().transform((arg, ctx) => {
    if (!arg.startsWith(prefix)) {
      if (!required) return arg;
      ctx.addIssue(
        resolveMessage(
          opts,
          arg,
          "missing_prefix",
          `Expected value to start with "${prefix}"`,
        ),
      );
      return z.NEVER;
    }
    return arg.slice(prefix.length);
  });
}
