import type { L, Pairing, R } from "./types.js";

type WriteablePairing =
  | {
      local: L | undefined;
      remote: R;
    }
  | { local: L; remote: undefined };

export const matchLocalsWithRemotes = (
  locals: readonly L[],
  remotes: readonly R[],
): readonly {
  readonly name: string;
  readonly pairing: Pairing;
}[] => {
  const localsByName = new Map<string, L>();
  for (const local of locals) {
    localsByName.set(local.name, local);
  }

  const remotesByName = new Map<string, R>();
  for (const remote of remotes) {
    remotesByName.set(remote.name, remote);
  }

  const pairings = new Map<string, WriteablePairing>();

  for (const local of locals) {
    pairings.set(local.name, { local, remote: undefined });
  }

  for (const remote of remotes) {
    const item = pairings.get(remote.name);

    if (item) item.remote = remote;
    else pairings.set(remote.name, { local: undefined, remote });
  }

  return [...pairings.entries()]
    .map(([name, pairing]) => ({
      name,
      pairing,
    }))
    .toSorted((a, b) => a.name.localeCompare(b.name));
};
