import { describe, expect, it } from "vitest";
import { z } from "zod";
import { yamlString } from "./yaml.js";

describe("yamlString", () => {
  const schema = yamlString(z.object({ hello: z.enum(["world", "earth"]) }));

  it("parses and validates well-formed YAML", () => {
    const result = schema.safeParse("hello: world");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual({ hello: "world" });
  });

  it("rejects malformed YAML", () => {
    const result = schema.safeParse("hello: [unclosed");
    expect(result.success).toBe(false);
  });

  it("rejects YAML that doesn't match the inner schema", () => {
    const result = schema.safeParse("hello: mars");
    expect(result.success).toBe(false);
  });
});
