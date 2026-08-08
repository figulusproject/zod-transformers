import { describe, expect, it } from "vitest";
import { numberString } from "./numberString.js";

describe("numberString", () => {
  it("parses a plain number", () => {
    const result = numberString().safeParse("42.5");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(42.5);
  });

  it("rejects a non-numeric value", () => {
    const result = numberString().safeParse("nope");
    expect(result.success).toBe(false);
  });

  it("enforces integer when requested", () => {
    const schema = numberString({ integer: true });
    expect(schema.safeParse("3.5").success).toBe(false);
    expect(schema.safeParse("3").success).toBe(true);
  });

  it("enforces min/max", () => {
    const schema = numberString({ min: 0, max: 10 });
    expect(schema.safeParse("-1").success).toBe(false);
    expect(schema.safeParse("11").success).toBe(false);
    expect(schema.safeParse("5").success).toBe(true);
  });

  it("passes the reason to a custom message function", () => {
    const schema = numberString({
      integer: true,
      message: (raw, reason) => `${reason}: ${raw}`,
    });
    const result = schema.safeParse("3.5");
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0]?.message).toBe("not_integer: 3.5");
  });
});
