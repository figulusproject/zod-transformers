import { z } from "zod";
import { resolveMessage, type TransformOptions } from "./core.js";

export interface ExistingPathOptions extends TransformOptions {
  exists: (path: string) => boolean;
  /** Case-insensitive, without the leading dot (e.g. ["json", "yaml"]). */
  extensions?: string[];
}

export function existingPath(opts: ExistingPathOptions) {
  return z.string().superRefine((arg, ctx) => {
    if (!opts.exists(arg)) {
      ctx.addIssue(
        resolveMessage(
          opts,
          arg,
          "not_found",
          `No file/directory found at '${arg}'`,
        ),
      );
      return;
    }
    const extensions = opts.extensions;
    if (
      extensions &&
      !extensions.some((ext) =>
        arg.toLowerCase().endsWith(`.${ext.toLowerCase()}`),
      )
    ) {
      ctx.addIssue(
        resolveMessage(
          opts,
          arg,
          "bad_extension",
          `Expected one of: ${extensions.join(", ")}`,
        ),
      );
    }
  });
}
