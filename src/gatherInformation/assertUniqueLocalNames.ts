import type { ConfigRepository } from "../config/index.js";

export const assertUniqueLocalNames = async (
  locals: readonly ConfigRepository[],
): Promise<{ sawError: boolean }> => {
  const countByName = locals.reduce(
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
      console.error(`ERROR: Multiple configs found for '${name}'`);
    }
    return { sawError: true };
  }

  return { sawError: false };
};
