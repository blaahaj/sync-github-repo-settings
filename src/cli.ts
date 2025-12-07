import { createArgument, createCommand, createOption } from "commander";

export const parseCli = (argv: readonly string[]) => {
  const cmd = createCommand("foobar")
    .addOption(
      createOption(
        "--init",
        "create an initial local config to match whatever is in GitHub",
      ).default(false),
    )
    .addOption(
      createOption(
        "--dry-run|-n",
        "show planned changes without applying them",
      ).default(false),
    )
    .addOption(
      createOption(
        "--accept-visibility-change-consequences",
        "allow visibilty changes to be applied",
      ).default(false),
    )
    .addOption(
      createOption(
        "--config-dir|-c",
        "path to the configuration directory",
      ).default("./etc"),
    )
    .addArgument(
      createArgument(
        "owner",
        "GitHub user / organization handle",
      ).argRequired(),
    )
    .parse(argv);

  const opts = cmd.opts() as {
    readonly dryRun: boolean;
    readonly init: boolean;
    readonly acceptVisibilityChangeConsequences: boolean;
    readonly configDir: string;
  };

  const owner = cmd.args[0] as string;

  return { opts, owner };
};
