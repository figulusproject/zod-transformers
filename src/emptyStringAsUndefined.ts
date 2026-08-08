import { z } from "zod";

export function emptyStringAsUndefined<T extends z.ZodType>(inner: T) {
  return z.union([
    z
      .string()
      .length(0)
      .transform(() => undefined),
    inner,
  ]);
}
