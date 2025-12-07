import * as yaml from "yaml";

import type { ConfigSchema } from "../config/index.js";
import type { LocalSuggestions } from "./types.js";

export const showSuggestions = async (
  localSuggestions: LocalSuggestions,
  owner: string,
) => {
  for (const add of localSuggestions.addLocal) {
    console.info(
      `INFO: No local config for repository '${add.name}', consider adding it`,
    );
  }

  for (const local of localSuggestions.removeLocal) {
    console.info(
      `INFO: Local config exists for non-existent repository '${local.name}', consider removing it`,
    );
  }

  if (localSuggestions.addLocal.length > 0) {
    const suggestAdd: ConfigSchema = {
      owner,
      repositories: localSuggestions.addLocal,
    };
    console.info("INFO: Consider adding:");
    console.log(yaml.stringify(suggestAdd, { directives: true }));
  }
};
