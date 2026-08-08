# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] - 2026-08-08

### Added

- `emptyStringAsUndefined`, `jsonString`, `stripPrefix`, `numberString`, `existingPath` in the core entry point.
- `zod-transformers/node`: `nodeFileExists`, a `node:fs`-backed `exists` implementation for `existingPath`.
- `zod-transformers/toml`: `tomlString`, backed by the optional `smol-toml` peer dependency.
- `zod-transformers/yaml`: `yamlString`, backed by the optional `yaml` peer dependency.
- `zod-transformers/jsonc`: `jsoncString` and `stripJsonc`.
