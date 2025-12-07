# messing-with-github-graphql

Though this really needs a better name, something like:

"GitHub repos IAC"

(which makes me suspect that Terraform et al already do this. Whatever.)

## Setup

Install tools as per `.tool-versions`.

Then:

```shell
pnpm clean
pnpm install
pnpm build
pnpm test
```

## Usage

Make sure that your GitHub API token is in the `GITHUB_TOKEN` environment variable.

Decide which GitHub owner (user or organisation) you want to run the tool for.
In this readme, we'll assume that the `GITHUB_OWNER` environment variable contains that.

## First time

```shell
pnpm start --init $GITHUB_OWNER
```

This generates a local config for that owner, to match whatever is currently in GitHub.

## Making a change

Edit `./etc/${GITHUB_OWNER}/repositories.yaml` and make a change.

For example, to add a topic to a repository, the change might look like:

```diff
-     topics: []
+     topics:
+       - game
```

To see how the local config differs from what's in GitHub, run the tool in dry-run mode:

```shell
pnpm start --dry-run $GITHUB_OWNER
```

which might show something like:

```text
INFO: [DRY RUN] Changing topics of 'my-repo-name' from [] to ["game"]
```

To actually apply the changes, re-run without `--dry-run`:

```shell
pnpm start $GITHUB_OWNER
```
