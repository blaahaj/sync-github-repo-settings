import type { ConfigRepository } from "../config/index.js";
import type { RepositoryItemWithFlattenedTopics } from "../github/index.js";

// local, remote
export type L = ConfigRepository;
export type R = Readonly<RepositoryItemWithFlattenedTopics>;

export type Pairing =
  | {
      readonly local: L;
      readonly remote: R;
    }
  | { readonly local: undefined; readonly remote: R }
  | { readonly local: L; readonly remote: undefined };
