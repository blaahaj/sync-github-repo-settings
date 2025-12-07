import type { GitHubGraphClient } from "./gitHubGraphClient.js";
import { hyfQ2 } from "./hyfQ2.js";
import type { RepositoryItem } from "./types.js";

export const fillOutTopicsForMany = async (
  client: GitHubGraphClient,
  repos: readonly RepositoryItem[],
  fetchSize: number,
): Promise<RepositoryItem[]> => {
  const out: RepositoryItem[] = [];
  for (const repo of repos) {
    out.push(await fillOutTopicsForOne(client, repo, fetchSize));
  }
  return out;
};

export const fillOutTopicsForOne = async (
  client: GitHubGraphClient,
  repo: RepositoryItem,
  fetchSize: number,
): Promise<RepositoryItem> => {
  if (!repo.repositoryTopics.pageInfo.hasNextPage) return repo;

  let after: string | null | undefined =
    repo.repositoryTopics.pageInfo.endCursor;

  const outputTopics = [...(repo.repositoryTopics.nodes ?? [])];

  while (true) {
    const moreTopics = await client.execute(hyfQ2, {
      name: repo.name,
      owner: repo.owner.login,
      first: fetchSize,
      after,
    });

    const t = moreTopics.data?.repository?.repositoryTopics;
    if (!t) break;

    outputTopics.push(...(t.nodes ?? []));

    if (!t.pageInfo?.hasNextPage) break;
    after = t.pageInfo.endCursor;
  }

  return {
    ...repo,
    repositoryTopics: {
      ...repo.repositoryTopics,
      nodes: outputTopics,
    },
  };
};
