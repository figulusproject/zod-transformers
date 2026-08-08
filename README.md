# zod-transformers

A collection of reusable Zod transform/superRefine schema factories for common patterns: empty-string coercion, stringified JSON/JSONC/TOML/YAML, prefix stripping, numeric strings, and filesystem-path validation.

## Installation

```sh
npm install zod-transformers zod
```

`zod` (v4) is a peer dependency. The core entry point has no other dependencies and makes no assumptions about the runtime.

## Usage

```ts
import { z } from "zod";
import {
  emptyStringAsUndefined,
  jsonString,
  numberString,
  stripPrefix,
} from "zod-transformers";

const ageSchema = emptyStringAsUndefined(z.coerce.number().int()).optional();
ageSchema.parse(""); // undefined
ageSchema.parse("42"); // 42

const configSchema = jsonString(z.object({ retries: z.number() }));
configSchema.parse('{"retries":3}'); // { retries: 3 }

const timeoutSchema = numberString({ integer: true, min: 0 });
timeoutSchema.parse("1000"); // 1000

const idSchema = stripPrefix("/things/");
idSchema.parse("/things/123"); // "123"
```

### `numberString`

Parses a raw string into a validated number: the same job `z.coerce.number().int().min().max()` already does. The difference is message control. Each zod check (NaN, non-integer, out of range) produces its own built-in issue message, which is awkward to restyle consistently across a chain. `numberString` runs the same checks in one transform with a single overridable `message`, tagged with a reason code (`"nan"`, `"not_integer"`, `"too_small"`, `"too_large"`) so a custom message can still tell failures apart:

```ts
numberString({
  integer: true,
  min: 0,
  message: (raw, reason) => `--timeout: ${reason} (got "${raw}")`,
});
```

It doesn't change what counts as a valid number: `numberString().parse("")` is still `0`, the same `Number("")` quirk `z.coerce.number()` has. Compose with `emptyStringAsUndefined` if an empty value should mean "absent" instead.

### Custom issue messages

The `message` option shown above isn't specific to `numberString`: every factory that can fail accepts it. A string replaces the default message outright; a function receives the raw input (and, where a factory has more than one failure mode, a reason code) for a dynamic message.

### `existingPath`

Validates that a path exists on disk. It takes the existence check as an injected function rather than importing `node:fs` itself, so the core stays runtime-agnostic. The `zod-transformers/node` entry point provides the concrete Node implementation:

```ts
import { existingPath } from "zod-transformers";
import { nodeFileExists } from "zod-transformers/node";

const configPathSchema = existingPath({
  exists: nodeFileExists,
  extensions: ["json"],
});
```

### TOML and YAML

`zod-transformers/toml` and `zod-transformers/yaml` parse a string and pipe the result into an inner schema, the same shape as `jsonString`. Their parsers (`smol-toml` and `yaml`) are optional peer dependencies, only required if you import these entry points:

```sh
npm install smol-toml   # for zod-transformers/toml
npm install yaml        # for zod-transformers/yaml
```

```ts
import { z } from "zod";
import { tomlString } from "zod-transformers/toml";
import { yamlString } from "zod-transformers/yaml";

tomlString(z.object({ name: z.string() })).parse('name = "example"');
yamlString(z.object({ name: z.string() })).parse("name: example");
```

### JSONC

`zod-transformers/jsonc` also takes its parser as an injected function, so that it can be overriden with a custom parser if needed (eg. to preserve comments instead of stripping them), or you can use the provided one, `stripJsonc`, adapted from [`tiny-jsonc`](https://www.npmjs.com/package/tiny-jsonc) (see [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)) if you'd prefer to avoid installing an extra dependency.

```ts
import { z } from "zod";
import { jsoncString, stripJsonc } from "zod-transformers/jsonc";

const schema = jsoncString(z.object({ name: z.string() }), {
  parse: stripJsonc,
});
schema.parse('{\n  // a comment\n  "name": "example",\n}');
```

## Copyright

Copyright 2026, Figulus Project.

## License

MIT
