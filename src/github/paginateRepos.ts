import { getPage } from "./getPage.js";
import type { GitHubGraphClient } from "./gitHubGraphClient.js";
import type { RepositoryItem } from "./types.js";

export const paginateRepos = async (
  client: GitHubGraphClient,
  opts: {
    readonly owner: string;
    readonly first: number;
    readonly firstTopics: number;
  },
): Promise<RepositoryItem[]> => {
  let after: string | null | undefined;
  const out: RepositoryItem[] = [];

  while (true) {
    const page = await getPage(client, { ...opts, after });
    out.push(...page.nodes);
    if (!page.pageInfo.hasNextPage) break;
    after = page.pageInfo.endCursor;
  }

  return out;
};
