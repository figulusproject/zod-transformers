import { describe, expect, it } from "vitest";
import { z } from "zod";
import { emptyStringAsUndefined } from "./emptyStringAsUndefined.js";

describe("emptyStringAsUndefined", () => {
  const schema = emptyStringAsUndefined(z.coerce.number().int()).optional();

  it("passes a non-empty value through the inner schema", () => {
    const result = schema.safeParse("42");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(42);
  });

  it("treats an empty string as undefined", () => {
    const result = schema.safeParse("");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBeUndefined();
  });

  it("still rejects an invalid non-empty value", () => {
    const result = schema.safeParse("not-a-number");
    expect(result.success).toBe(false);
  });
});
