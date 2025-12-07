import { readFile } from "node:fs/promises";

import { fillOutTopicsForMany } from "./fillOutTopics.js";
import {
  flattenTopicsForMany,
  type RepositoryItemWithFlattenedTopics,
} from "./flattenTopics.js";
import { GitHubGraphClient } from "./gitHubGraphClient.js";
import { normalizeRepositories } from "./normalize.js";
import { paginateRepos } from "./paginateRepos.js";

const REPO_FETCH_SIZE = 30;
const TOPICS_NESTED_FETCH_SIZE = 10;
const TOPICS_FILL_FETCH_SIZE = 10;

const readFromCache = async (): Promise<
  readonly RepositoryItemWithFlattenedTopics[]
> => JSON.parse(await readFile("o", "utf-8"));

export const getClient = async () => {
  const token = process.env.GITHUB_TOKEN ?? "";
  const client = new GitHubGraphClient(token);
  return client;
};

const readFromApi = async (
  owner: string,
): Promise<readonly RepositoryItemWithFlattenedTopics[]> => {
  const client = await getClient();

  const repoStubs = await paginateRepos(client, {
    owner,
    first: REPO_FETCH_SIZE,
    firstTopics: TOPICS_NESTED_FETCH_SIZE,
  });

  const repos = await fillOutTopicsForMany(
    client,
    repoStubs,
    TOPICS_FILL_FETCH_SIZE,
  );

  return flattenTopicsForMany(repos);
};

export const readFromGitHub = async (
  owner: string,
): Promise<readonly RepositoryItemWithFlattenedTopics[]> => {
  const remotes = process.env.USE_CACHE
    ? await readFromCache()
    : await readFromApi(owner);

  return normalizeRepositories(remotes);
};
