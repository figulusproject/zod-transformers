import { describe, expect, it } from "vitest";
import { existingPath } from "./existingPath.js";

const fakeFs = new Set(["/config.json", "/notes.txt"]);
const exists = (path: string) => fakeFs.has(path);

describe("existingPath", () => {
  it("accepts a path the injected exists() reports as present", () => {
    const result = existingPath({ exists }).safeParse("/config.json");
    expect(result.success).toBe(true);
  });

  it("rejects a path the injected exists() reports as absent", () => {
    const result = existingPath({ exists }).safeParse("/missing.json");
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0]?.message).toBe(
        "No file/directory found at '/missing.json'",
      );
  });

  it("enforces an extension allowlist case-insensitively", () => {
    const schema = existingPath({ exists, extensions: ["json"] });
    expect(schema.safeParse("/config.json").success).toBe(true);
    expect(schema.safeParse("/notes.txt").success).toBe(false);
  });

  it("supports a custom message", () => {
    const schema = existingPath({ exists, message: "gone" });
    const result = schema.safeParse("/missing.json");
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.message).toBe("gone");
  });
});
