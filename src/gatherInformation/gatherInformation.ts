import { type Either, left, right } from "effect/Either";

import {
  calculateActions,
  type LocalSuggestions,
  type RemoteActions,
} from "../actions/index.js";
import { readConfig } from "../config/index.js";
import { readFromGitHub } from "../github/index.js";
import { assertUniqueLocalNames } from "./assertUniqueLocalNames.js";
import { assertUniqueRemoteNames } from "./assertUniqueRemoteNames.js";
import { matchLocalsWithRemotes } from "./matchLocalsWithRemotes.js";
import type { L } from "./types.js";

export const gatherInformation = async ({
  owner,
  configDir,
}: {
  owner: string;
  configDir: string;
}): Promise<
  Either<
    {
      readonly locals: readonly L[];
      // readonly remotes: readonly R[];
      readonly localSuggestions: LocalSuggestions;
      readonly remoteActions: RemoteActions;
    },
    true
  >
> => {
  const locals = await readConfig(configDir);
  if ((await assertUniqueLocalNames(locals)).sawError) return left(true);

  const remotes = await readFromGitHub(owner);
  if ((await assertUniqueRemoteNames(remotes)).sawError) return left(true);

  const pairings = matchLocalsWithRemotes(locals, remotes);
  const { localSuggestions, remoteActions } = calculateActions(pairings);

  return right({
    locals,
    // remotes,
    localSuggestions,
    remoteActions,
  });
};
