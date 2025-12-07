// import * as yaml from "yaml";
import { Schema as s } from "effect";
import { nonEmptyString, NullOr } from "effect/Schema";
// import { fail, succeed } from "effect/Effect";
// import * as pr from "effect/ParseResult";

export const ConfigRepository = s.Struct({
  name: s.String.pipe(nonEmptyString()),
  description: NullOr(s.String),
  isArchived: s.Boolean,
  visibility: s.Literal("INTERNAL", "PRIVATE", "PUBLIC"),
  topics: s.Array(s.String.pipe(nonEmptyString())),
});
export type ConfigRepository = typeof ConfigRepository.Type;

export const ConfigSchema = s.Struct({
  owner: s.String.pipe(nonEmptyString()),
  repositories: s.Array(ConfigRepository),
});
export type ConfigSchema = typeof ConfigSchema.Type;

// export const ConfigSchemaAsYaml = s.String.pipe(
//   transformOrFail(ConfigSchema, {
//     decode: (fromA, _options, ast, _fromI) => {
//       try {
//         return succeed(yaml.parse(fromA));
//       } catch (err: unknown) {
//         const pi: pr.ParseIssue = new pr.Type(
//           ast,
//           fromA,
//           `YAML parsing failed: ${err instanceof Error ? err.message : "?"}`,
//         );
//         return fail(pi);
//       }
//     },
//     encode: (toI: ConfigSchema) =>
//       succeed(yaml.stringify(toI, { directives: true })),
//   }),
// );
