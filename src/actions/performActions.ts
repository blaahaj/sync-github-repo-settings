import { type Either, isRight, left, right } from "effect/Either";
import * as s from "effect/Schema";

import type { ConfigRepository } from "../config/index.js";
import type { R } from "../gatherInformation/index.js";
import type { GitHubGraphClient, QueryResult } from "../github/index.js";
import {
  setArchivedMutation,
  setDescriptionMutation,
  setTopicsMutation,
  setUnarchivedMutation,
} from "./mutations.js";
import type { RemoteActions } from "./types.js";

const expectedError = s.Struct({
  type: s.String,
  message: s.String,
});

export const performActions = async ({
  owner,
  remoteActions,
  clientProvider,
  dryRun,
  acceptVisibilityChangeConsequences,
}: {
  readonly owner: string;
  readonly remoteActions: RemoteActions;
  readonly clientProvider: () => Promise<GitHubGraphClient>;
  readonly dryRun: boolean;
  readonly acceptVisibilityChangeConsequences: boolean;
}): Promise<Either<void, true>> => {
  const dryRunTag = dryRun ? " [DRY RUN]" : "";
  let sawError = false;

  const showGraphErrors = <T>(resp: QueryResult<T>) => {
    for (const error of resp.errors ?? []) {
      const decoded = s.decodeUnknownEither(expectedError)(error);
      sawError ||= true;

      if (isRight(decoded)) {
        console.error(`ERROR: ${decoded.right.type} ${decoded.right.message}`);
      } else {
        console.error(`ERROR: ${JSON.stringify(error)}`);
      }
    }
  };

  let client: GitHubGraphClient | undefined;

  for (const item of remoteActions.setArchived.filter((t) => !t.newValue)) {
    console.info(`INFO:${dryRunTag} Unarchiving '${item.remote.name}'`);

    if (!dryRun) {
      client ||= await clientProvider();

      const resp = await client.execute(setUnarchivedMutation, {
        repositoryId: item.remote.id,
      });
      showGraphErrors(resp);
    }
  }

  for (const item of remoteActions.setDescription) {
    // FIXME: can't do this to an archived repository

    console.info(
      `INFO:${dryRunTag} Changing description of '${item.remote.name}' from ${JSON.stringify(item.oldValue)} to ${JSON.stringify(item.newValue)}`,
    );

    if (!dryRun) {
      client ||= await clientProvider();
      const resp = await client.execute(setDescriptionMutation, {
        repositoryId: item.remote.id,
        description: item.newValue,
      });
      showGraphErrors(resp);
    }
  }

  for (const item of remoteActions.setVisibility) {
    // FIXME: can't do this to an archived repository
    await performSetVisibility(item);
  }

  for (const item of remoteActions.setTopics) {
    // This *can* be done even when the repo is archived

    await performSetTopics(item);
  }

  await performArchivals();

  return sawError ? left(true) : right(undefined);

  async function performArchivals() {
    for (const item of remoteActions.setArchived.filter((t) => t.newValue)) {
      console.info(`INFO:${dryRunTag} Archiving '${item.remote.name}'`);

      if (!dryRun) {
        client ||= await clientProvider();

        const resp = await client.execute(setArchivedMutation, {
          repositoryId: item.remote.id,
        });
        showGraphErrors(resp);
      }
    }
  }

  async function performSetTopics(item: {
    readonly remote: R;
    readonly oldValue: ConfigRepository["topics"];
    readonly newValue: ConfigRepository["topics"];
  }) {
    console.info(
      `INFO:${dryRunTag} Changing topics of '${item.remote.name}' from ${JSON.stringify(item.oldValue)} to ${JSON.stringify(item.newValue)}`,
    );

    if (!dryRun) {
      client ||= await clientProvider();
      const resp = await client.execute(setTopicsMutation, {
        repositoryId: item.remote.id,
        topicNames: [...item.newValue],
      });
      showGraphErrors(resp);
    }
  }

  async function performSetVisibility(item: {
    readonly remote: R;
    readonly oldValue: ConfigRepository["visibility"];
    readonly newValue: ConfigRepository["visibility"];
  }) {
    if (acceptVisibilityChangeConsequences) {
      console.info(
        `INFO:${dryRunTag} Changing visibility of '${item.remote.name}' from ${JSON.stringify(item.oldValue)} to ${JSON.stringify(item.newValue)}`,
      );

      if (!dryRun) {
        const resp = await fetch(
          `https://api.github.com/repos/${owner}/${item.remote.name}`,
          {
            method: "PATCH",
            headers: {
              Accept:
                "application/vnd.github.merge-info-preview+json, application/vnd.github.nebula-preview",
              Authorization: `token ${process.env.GITHUB_TOKEN}`,
              "Content-Type": "application/json; charset=utf-8",
              "User-Agent": `blaahaj/messing-with-github-graphql`,
            },
            body: Buffer.from(
              JSON.stringify({ visibility: item.newValue }),
              "utf-8",
            ),
          },
        );

        const body = await resp
          .json()
          .catch((err: unknown) => `(not a JSON body: ${err})`);

        if (resp.status >= 400 && resp.status <= 599) {
          console.error(
            `ERROR: got response ${resp.status} ${resp.statusText} ${JSON.stringify(body)}`,
          );
          sawError = true;
        }
      }
    } else {
      console.info(
        `WARN: Declining to change visibility of '${item.remote.name}' from ${JSON.stringify(item.oldValue)} to ${JSON.stringify(item.newValue)}`,
      );
      console.info(
        `INFO: To allow visibility changes to be applied, add the '--accept-visibility-change-consequences' option`,
      );
    }
  }
};
