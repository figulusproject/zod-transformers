import { parse } from "yaml";
import { z } from "zod";
import { resolveMessage, type TransformOptions } from "./core.js";

export interface YamlStringOptions extends TransformOptions {}

export function yamlString<T extends z.ZodType<any, any>>(
  inner: T,
  opts?: YamlStringOptions,
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
            "invalid_yaml",
            `Invalid YAML: ${err instanceof Error ? err.message : String(err)}`,
          ),
        );
        return z.NEVER;
      }
    })
    .pipe(inner);
}
