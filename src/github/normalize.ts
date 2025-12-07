import type { RepositoryItemWithFlattenedTopics } from "./flattenTopics.js";

export const normalizeRepositories = (
  repos: readonly RepositoryItemWithFlattenedTopics[],
): RepositoryItemWithFlattenedTopics[] =>
  repos
    .map(normalizeRepository)
    .toSorted((a, b) => a.name.localeCompare(b.name, "en-us"));

export const normalizeRepository = (
  repo: RepositoryItemWithFlattenedTopics,
): RepositoryItemWithFlattenedTopics => ({
  ...repo,
  repositoryTopics: repo.repositoryTopics.toSorted(),
});
