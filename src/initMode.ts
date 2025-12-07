import { mkdir } from "node:fs/promises";

import { type Either, left, right } from "effect/Either";
import writeFileAtomic from "write-file-atomic";
import * as yaml from "yaml";

import type { LocalSuggestions } from "./actions/index.js";
import type { ConfigSchema } from "./config/configSchema.js";
import type { L } from "./gatherInformation/types.js";

export const initMode = async ({
  owner,
  configDir,
  locals,
  localSuggestions,
}: {
  owner: string;
  configDir: string;
  locals: readonly L[];
  localSuggestions: LocalSuggestions;
}): Promise<Either<void, true>> => {
  if (locals.length > 0) {
    console.error(
      `ERROR: --init was specified but there is already some configuration present under ${configDir}`,
    );
    return left(true);
  }

  const newConfig: ConfigSchema = {
    owner,
    repositories: localSuggestions.addLocal,
  };
  const textContent = yaml.stringify(newConfig, { directives: true });
  const targetFile = `${configDir}/repositories.yaml`;

  await mkdir(configDir, { recursive: true });
  await writeFileAtomic(targetFile, textContent, "utf-8");

  const count = newConfig.repositories.length;
  console.info(
    `INFO: created ${targetFile} with ${count === 1 ? "1 repository" : `${count} repositories`}`,
  );

  return right(undefined);
};
