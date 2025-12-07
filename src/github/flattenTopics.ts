import type { RepositoryItem } from "./types.js";

export type RepositoryItemWithFlattenedTopics = Omit<
  RepositoryItem,
  "repositoryTopics"
> & {
  readonly repositoryTopics: readonly string[];
};

export const flattenTopicsForMany = (
  repos: readonly RepositoryItem[],
): RepositoryItemWithFlattenedTopics[] => repos.map(flattenTopicsForOne);

export const flattenTopicsForOne = (
  r: RepositoryItem,
): RepositoryItemWithFlattenedTopics => ({
  ...r,
  repositoryTopics: (r.repositoryTopics.nodes ?? [])
    .map((n) => n?.topic.name)
    .filter((s) => s !== undefined),
});
