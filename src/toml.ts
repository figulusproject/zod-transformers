import { parse } from "smol-toml";
import { z } from "zod";
import { resolveMessage, type TransformOptions } from "./core.js";

export interface TomlStringOptions extends TransformOptions {}

export function tomlString<T extends z.ZodType<any, any>>(
  inner: T,
  opts?: TomlStringOptions,
) {
  return z
    .string()
    .transform((raw, ctx) => {
      try {
        return parse(raw);
      } catch (err) {
        ctx.addIssue(
          resolveMessage(
            opts,
            raw,
            "invalid_toml",
            `Invalid TOML: ${err instanceof Error ? err.message : String(err)}`,
          ),
        );
        return z.NEVER;
      }
    })
    .pipe(inner);
}
