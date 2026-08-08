import { z } from "zod";
import { resolveMessage, type TransformOptions } from "./core.js";

export interface NumberStringOptions extends TransformOptions {
  integer?: boolean;
  min?: number;
  max?: number;
}

export function numberString(opts?: NumberStringOptions) {
  return z.string().transform((raw, ctx) => {
    const n = Number(raw);
    const reason = !Number.isFinite(n)
      ? "nan"
      : opts?.integer && !Number.isInteger(n)
        ? "not_integer"
        : opts?.min !== undefined && n < opts.min
          ? "too_small"
          : opts?.max !== undefined && n > opts.max
            ? "too_large"
            : undefined;
    if (reason) {
      ctx.addIssue(
        resolveMessage(opts, raw, reason, `Invalid number: "${raw}"`),
      );
      return z.NEVER;
    }
    return n;
  });
}
