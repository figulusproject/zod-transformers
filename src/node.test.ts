import { describe, expect, it } from "vitest";
import { existingPath } from "./existingPath.js";
import { nodeFileExists } from "./node.js";

describe("nodeFileExists", () => {
  it("wires up to existingPath against the real filesystem", () => {
    const schema = existingPath({ exists: nodeFileExists });
    expect(schema.safeParse(import.meta.filename).success).toBe(true);
    expect(schema.safeParse("/definitely/does/not/exist.json").success).toBe(
      false,
    );
  });
});
