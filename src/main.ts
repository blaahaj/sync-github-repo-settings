import { isLeft, left } from "effect/Either";

import { parseCli } from "./cli.js";
import { gatherInformation } from "./gatherInformation/index.js";
import { initMode } from "./initMode.js";
import { normalMode } from "./normalMode.js";

const main = async () => {
  const { opts, owner } = parseCli(process.argv);
  const configDir = `${opts.configDir}/${owner}`;

  const info = await gatherInformation({ owner, configDir });
  if (isLeft(info)) return left(info.left);

  return opts.init
    ? initMode({ owner, configDir, ...info.right })
    : normalMode({
        owner,
        ...opts,
        ...info.right,
      });
};

main().then(
  (r) => {
    process.exit(isLeft(r) ? 1 : 0);
  },
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
