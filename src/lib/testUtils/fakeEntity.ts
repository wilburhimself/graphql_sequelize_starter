import type { Entity } from '../resolver';

export type FakeRow = { id: number | string } & Record<string, unknown>;

export function makeEntity(initial: FakeRow[] = []): Entity<FakeRow> & { _store: FakeRow[] } {
  const store = initial.map((r) => ({ ...r })) as FakeRow[];
  return {
    _store: store,
    rawAttributes: { id: {}, name: {} },
    findOne: async ({ where: { id } }: { where: { id: number | string } }) =>
      store.find((r) => r.id === id) ?? null,
    findAndCountAll: async () => ({ rows: store }),
    create: async (item: Partial<FakeRow>) => {
      const next = { ...item } as FakeRow;
      store.push(next);
      return next;
    },
    update: async (
      item: Partial<FakeRow>,
      { where: { id } }: { where: { id: number | string } },
    ) => {
      const idx = store.findIndex((r) => r.id === id);
      if (idx >= 0) store[idx] = { ...store[idx], ...item } as FakeRow;
      return [1];
    },
  } as unknown as Entity<FakeRow> & { _store: FakeRow[] };
}

export function makeEntityNoName(initial: FakeRow[] = []): Entity<FakeRow> & { _store: FakeRow[] } {
  const store = initial.map((r) => ({ ...r })) as FakeRow[];
  return {
    _store: store,
    rawAttributes: { id: {} },
    findOne: async ({ where: { id } }: { where: { id: number | string } }) =>
      store.find((r) => r.id === id) ?? null,
    findAndCountAll: async () => ({ rows: store }),
    create: async (item: Partial<FakeRow>) => {
      const next = { ...item } as FakeRow;
      store.push(next);
      return next;
    },
    update: async (
      item: Partial<FakeRow>,
      { where: { id } }: { where: { id: number | string } },
    ) => {
      const idx = store.findIndex((r) => r.id === id);
      if (idx >= 0) store[idx] = { ...store[idx], ...item } as FakeRow;
      return [1];
    },
  } as unknown as Entity<FakeRow> & { _store: FakeRow[] };
}
