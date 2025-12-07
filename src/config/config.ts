import { readdir, readFile } from "node:fs/promises";

import { remapErrno } from "@blaahaj/remap-errno";
import { decodeUnknownSync } from "effect/Schema";
import { parse } from "yaml";

import { type ConfigRepository, ConfigSchema } from "./configSchema.js";

const safeReaddir = remapErrno((name) => readdir(name), { ENOENT: null });

export const readConfig = async (
  configDir: string,
): Promise<readonly ConfigRepository[]> => {
  const names = (await safeReaddir(configDir).then((v) => v ?? []))
    .toSorted()
    .filter((name) => name.endsWith(".yaml"));

  const parts = await Promise.all(
    names.map(async (filename) => {
      const yamlText = await readFile(`${configDir}/${filename}`, "utf-8");
      return decodeUnknownSync(ConfigSchema)(parse(yamlText));
    }),
  );

  return parts.flatMap((part) => part.repositories);
};
