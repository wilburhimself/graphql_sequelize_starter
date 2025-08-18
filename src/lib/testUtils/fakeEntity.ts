import type { PrismaDelegate } from '../resolver';

export type FakeRow = { id: number | string } & Record<string, unknown>;

export function makeEntity(initial: FakeRow[] = []): PrismaDelegate<FakeRow> & { _store: FakeRow[] } {
  const store = initial.map((r) => ({ ...r })) as FakeRow[];
  return {
    _store: store,
    findUnique: async ({ where: { id } }: { where: { id: number | string } }) =>
      store.find((r) => r.id === id) ?? null,
    findMany: async ({ skip, take, orderBy }: { skip?: number; take?: number; orderBy?: any }) => {
      let rows = [...store];
      if (orderBy && typeof orderBy === 'object') {
        const [[field, dir]] = Object.entries(orderBy);
        rows.sort((a, b) => {
          const av = a[field] as any;
          const bv = b[field] as any;
          if (av === bv) return 0;
          const cmp = av > bv ? 1 : -1;
          return String(dir).toLowerCase() === 'desc' ? -cmp : cmp;
        });
      }
      if (typeof skip === 'number') rows = rows.slice(skip);
      if (typeof take === 'number') rows = rows.slice(0, take);
      return rows as FakeRow[];
    },
    create: async ({ data }: { data: Partial<FakeRow> }) => {
      const next = { ...data } as FakeRow;
      store.push(next);
      return next;
    },
    update: async ({ where: { id }, data }: { where: { id: number | string }; data: Partial<FakeRow> }) => {
      const idx = store.findIndex((r) => r.id === id);
      if (idx >= 0) store[idx] = { ...store[idx], ...data } as FakeRow;
      return store[idx] as FakeRow;
    },
  } as unknown as PrismaDelegate<FakeRow> & { _store: FakeRow[] };
}

// Kept for compatibility in tests; same as makeEntity but without any expectation of a `name` field
export function makeEntityNoName(initial: FakeRow[] = []): PrismaDelegate<FakeRow> & { _store: FakeRow[] } {
  return makeEntity(initial) as PrismaDelegate<FakeRow> & { _store: FakeRow[] };
}
