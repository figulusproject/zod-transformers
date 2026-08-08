import { z } from "zod";
import { resolveMessage, type TransformOptions } from "./core.js";

export interface JsoncStringOptions extends TransformOptions {
  parse: (raw: string) => unknown;
}

export function jsoncString<T extends z.ZodType<any, any>>(
  inner: T,
  opts: JsoncStringOptions,
) {
  return z
    .string()
    .transform((raw, ctx) => {
      try {
        return opts.parse(raw);
      } catch (err) {
        ctx.addIssue(
          resolveMessage(
            opts,
            raw,
            "invalid_jsonc",
            `Invalid JSONC: ${err instanceof Error ? err.message : String(err)}`,
          ),
        );
        return z.NEVER;
      }
    })
    .pipe(inner);
}

// Adapted from tiny-jsonc (MIT, Copyright (c) 2023-present Fabio Spampinato).
// Full license text in THIRD_PARTY_NOTICES.md.
const stringOrCommentRe = /("(?:\\?[^])*?")|(\/\/.*)|(\/\*[^]*?\*\/)/g;
const stringOrTrailingCommaRe = /("(?:\\?[^])*?")|(,\s*)(?=]|})/g;

export function stripJsonc(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return JSON.parse(
      raw
        .replace(stringOrCommentRe, "$1")
        .replace(stringOrTrailingCommaRe, "$1"),
    );
  }
}
