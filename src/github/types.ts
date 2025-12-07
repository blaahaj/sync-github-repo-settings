import type { HyfQ1Query } from "../../generated/graphql/graphql.js";

type RO = NonNullable<HyfQ1Query["repositoryOwner"]>;
type RC = NonNullable<RO["repositories"]>;
type RNL = NonNullable<RC["nodes"]>;
export type RepositoryItem = NonNullable<RNL[number]>;
