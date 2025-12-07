import type { ConfigRepository } from "../config/index.js";
import type { L, R } from "../gatherInformation/index.js";

export interface LocalSuggestions {
  readonly removeLocal: L[];
  readonly addLocal: ConfigRepository[];
}

export interface RemoteActions {
  readonly setDescription: {
    readonly remote: R;
    readonly oldValue: ConfigRepository["description"];
    readonly newValue: ConfigRepository["description"];
  }[];
  readonly setArchived: {
    readonly remote: R;
    readonly oldValue: ConfigRepository["isArchived"];
    readonly newValue: ConfigRepository["isArchived"];
  }[];
  readonly setVisibility: {
    readonly remote: R;
    readonly oldValue: ConfigRepository["visibility"];
    readonly newValue: ConfigRepository["visibility"];
  }[];
  readonly setTopics: {
    readonly remote: R;
    readonly oldValue: ConfigRepository["topics"];
    readonly newValue: ConfigRepository["topics"];
  }[];
}
