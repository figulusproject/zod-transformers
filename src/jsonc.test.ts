import { describe, expect, it } from "vitest";
import { z } from "zod";
import { jsoncString, stripJsonc } from "./jsonc.js";

describe("stripJsonc", () => {
  it("parses plain JSON", () => {
    expect(stripJsonc('{"a":1}')).toEqual({ a: 1 });
  });

  it("strips line and block comments", () => {
    const raw = `{
      // a comment
      "a": 1, /* also a comment */
      "b": 2
    }`;
    expect(stripJsonc(raw)).toEqual({ a: 1, b: 2 });
  });

  it("strips trailing commas", () => {
    expect(stripJsonc('{"a":1,"b":2,}')).toEqual({ a: 1, b: 2 });
  });

  it("leaves comment-like substrings inside strings alone", () => {
    expect(stripJsonc('{"a":"// not a comment"}')).toEqual({
      a: "// not a comment",
    });
  });
});

describe("jsoncString", () => {
  const schema = jsoncString(z.object({ hello: z.enum(["world", "earth"]) }), {
    parse: stripJsonc,
  });

  it("parses and validates well-formed JSONC", () => {
    const result = schema.safeParse('{\n  // a comment\n  "hello": "world"\n}');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual({ hello: "world" });
  });

  it("rejects malformed input", () => {
    const result = schema.safeParse("{not jsonc");
    expect(result.success).toBe(false);
  });

  it("rejects input that doesn't match the inner schema", () => {
    const result = schema.safeParse('{"hello":"mars"}');
    expect(result.success).toBe(false);
  });
});
