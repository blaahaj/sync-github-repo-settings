import { isDeepStrictEqual } from "node:util";

import type { Pairing } from "../gatherInformation/index.js";
import type { LocalSuggestions, RemoteActions } from "./types.js";

export const calculateActions = (
  pairings: readonly { readonly name: string; readonly pairing: Pairing }[],
): {
  readonly localSuggestions: LocalSuggestions;
  readonly remoteActions: RemoteActions;
} => {
  const localSuggestions: LocalSuggestions = {
    addLocal: [],
    removeLocal: [],
  };

  const remoteActions: RemoteActions = {
    setDescription: [],
    setArchived: [],
    setVisibility: [],
    setTopics: [],
  };

  for (const { name, pairing } of pairings) {
    if (!pairing.remote) {
      localSuggestions.removeLocal.push(pairing.local);
    } else if (!pairing.local) {
      localSuggestions.addLocal.push({
        name,
        description: pairing.remote.description ?? null,
        isArchived: pairing.remote.isArchived,
        visibility: pairing.remote.visibility,
        topics: pairing.remote.repositoryTopics,
      });
    } else {
      const { local, remote } = pairing;

      // updateRepository
      if (local.description !== (remote.description ?? null))
        remoteActions.setDescription.push({
          remote,
          oldValue: remote.description ?? null,
          newValue: local.description,
        });

      // archiveRepository, unarchiveRepository
      if (local.isArchived !== remote.isArchived)
        remoteActions.setArchived.push({
          remote,
          oldValue: remote.isArchived,
          newValue: local.isArchived,
        });

      // Mutation doesn't seem to be available via the graph. So we use REST instead:
      // PATCH https://api.github.com/repos/blaahaj/jobnet HTTP/1.1
      // Authorization: token XXX
      // {"visibility": ...}

      // Or just the `gh` command line:
      // gh repo edit --visibility PRIVATE --accept-visibility-change-consequences
      if (local.visibility !== remote.visibility)
        remoteActions.setVisibility.push({
          remote,
          oldValue: remote.visibility,
          newValue: local.visibility,
        });

      // updateTopics
      if (!isDeepStrictEqual(local.topics, remote.repositoryTopics))
        remoteActions.setTopics.push({
          remote,
          oldValue: remote.repositoryTopics,
          newValue: local.topics,
        });
    }
  }

  return {
    localSuggestions,
    remoteActions,
  };
};
