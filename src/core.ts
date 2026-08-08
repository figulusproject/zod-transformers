export interface TransformOptions {
  /**
   * Overrides the default issue message. A string replaces it outright; a
   * function receives the raw input and, where a factory has more than one
   * failure mode, a reason code, so an override can still be dynamic.
   */
  message?: string | ((raw: string, reason?: string) => string);
}

export function resolveMessage(
  opts: TransformOptions | undefined,
  raw: string,
  reason: string,
  fallback: string,
): string {
  const message = opts?.message;
  if (typeof message === "function") return message(raw, reason);
  return message ?? fallback;
}
