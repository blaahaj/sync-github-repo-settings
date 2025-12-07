import type { RepositoryItemWithFlattenedTopics } from "../github/index.js";

export const assertUniqueRemoteNames = async (
  remotes: readonly RepositoryItemWithFlattenedTopics[],
): Promise<{ sawError: boolean }> => {
  const countByName = remotes.reduce(
    (acc, item) => ({
      ...acc,
      [item.name]: (acc[item.name] ?? 0) + 1,
    }),
    {} as Record<string, number>,
  );

  const duplicateNames = Object.entries(countByName)
    .filter(([_name, count]) => count > 1)
    .toSorted((a, b) => a[0].localeCompare(b[0]));

  if (duplicateNames.length > 0) {
    for (const [name, _count] of duplicateNames) {
      console.error(
        `ERROR: Multiple GitHub repositories found named '${name}'`,
      );
    }
    return { sawError: true };
  }

  return { sawError: false };
};
