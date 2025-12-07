import { type Either, right } from "effect/Either";

import {
  type LocalSuggestions,
  performActions,
  type RemoteActions,
  showSuggestions,
} from "./actions/index.js";
import { getClient } from "./github/readFromGitHub.js";

export const normalMode = async ({
  owner,
  localSuggestions,
  remoteActions,
  dryRun,
  acceptVisibilityChangeConsequences,
}: {
  owner: string;
  localSuggestions: LocalSuggestions;
  remoteActions: RemoteActions;
  dryRun: boolean;
  acceptVisibilityChangeConsequences: boolean;
}): Promise<Either<void, true>> => {
  if (
    localSuggestions.addLocal.length === 0 &&
    localSuggestions.removeLocal.length === 0 &&
    remoteActions.setArchived.length === 0 &&
    remoteActions.setDescription.length === 0 &&
    remoteActions.setVisibility.length === 0 &&
    remoteActions.setTopics.length === 0
  ) {
    console.info("INFO: nothing to do");
    return right(undefined);
  }

  await showSuggestions(localSuggestions, owner);

  return await performActions({
    owner,
    remoteActions,
    clientProvider: getClient,
    dryRun: dryRun,
    acceptVisibilityChangeConsequences,
  });
};
