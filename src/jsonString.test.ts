import { describe, expect, it } from "vitest";
import { z } from "zod";
import { jsonString } from "./jsonString.js";

describe("jsonString", () => {
  const schema = jsonString(z.object({ hello: z.enum(["world", "earth"]) }));

  it("parses and validates well-formed JSON", () => {
    const result = schema.safeParse('{"hello":"world"}');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual({ hello: "world" });
  });

  it("rejects malformed JSON", () => {
    const result = schema.safeParse("{not json");
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0]?.message).toBe("Invalid JSON");
  });

  it("rejects JSON that doesn't match the inner schema", () => {
    const result = schema.safeParse('{"hello":"mars"}');
    expect(result.success).toBe(false);
  });

  it("supports a custom message", () => {
    const custom = jsonString(z.array(z.string()), { message: "bad json" });
    const result = custom.safeParse("nope");
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0]?.message).toBe("bad json");
  });
});
