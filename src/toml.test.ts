import { describe, expect, it } from "vitest";
import { z } from "zod";
import { tomlString } from "./toml.js";

describe("tomlString", () => {
  const schema = tomlString(z.object({ hello: z.enum(["world", "earth"]) }));

  it("parses and validates well-formed TOML", () => {
    const result = schema.safeParse('hello = "world"');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual({ hello: "world" });
  });

  it("rejects malformed TOML", () => {
    const result = schema.safeParse("hello = ");
    expect(result.success).toBe(false);
  });

  it("rejects TOML that doesn't match the inner schema", () => {
    const result = schema.safeParse('hello = "mars"');
    expect(result.success).toBe(false);
  });
});
