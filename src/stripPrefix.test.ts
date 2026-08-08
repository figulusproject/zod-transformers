import { describe, expect, it } from "vitest";
import { stripPrefix } from "./stripPrefix.js";

describe("stripPrefix", () => {
  it("strips a required prefix", () => {
    const result = stripPrefix("/things/").safeParse("/things/123");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("123");
  });

  it("rejects a missing required prefix", () => {
    const result = stripPrefix("/things/").safeParse("123");
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0]?.message).toBe(
        'Expected value to start with "/things/"',
      );
  });

  it("passes the value through unchanged when the prefix is optional and absent", () => {
    const schema = stripPrefix("XX", { required: false });
    const result = schema.safeParse("123");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("123");
  });

  it("still strips an optional prefix when present", () => {
    const schema = stripPrefix("XX", { required: false });
    const result = schema.safeParse("XX123");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("123");
  });

  it("supports a custom message", () => {
    const schema = stripPrefix("/things/", { message: "no prefix" });
    const result = schema.safeParse("123");
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0]?.message).toBe("no prefix");
  });
});
