import type { GitHubGraphClient } from "./gitHubGraphClient.js";
import { hyfQ1 } from "./hyfQ1.js";

export const getPage = async (
  client: GitHubGraphClient,
  opts: {
    readonly owner: string;
    readonly first: number;
    readonly after: string | null | undefined;
    readonly firstTopics: number;
  },
) => {
  const queryResult = await client.execute(hyfQ1, opts);

  const pageInfo = queryResult.data?.repositoryOwner?.repositories.pageInfo;
  const nodes = queryResult.data?.repositoryOwner?.repositories.nodes;

  return {
    queryResult,
    pageInfo: {
      hasNextPage: pageInfo?.hasNextPage,
      endCursor: pageInfo?.endCursor,
    } as const,
    nodes: (nodes ?? []).filter((n) => n !== null),
  };
};
