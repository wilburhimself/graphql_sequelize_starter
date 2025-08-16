import buildMutation from './mutation';
import type { Entity } from './resolver';

function makeEntity(initial: Array<Record<string, any>> = []): Entity & {
  _store: Array<Record<string, any>>;
} {
  const store = initial.map((r) => ({ ...r }));
  return {
    _store: store,
    rawAttributes: { id: {}, name: {} },
    findOne: async ({ where: { id } }: any) => store.find((r) => r.id === id) ?? null,
    findAndCountAll: async () => ({ rows: store }),
    create: async (item: any) => {
      store.push(item);
      return item;
    },
    update: async (item: any, { where: { id } }: any) => {
      const idx = store.findIndex((r) => r.id === id);
      if (idx >= 0) store[idx] = { ...store[idx], ...item };
      return [1];
    },
  } as unknown as Entity & { _store: Array<Record<string, any>> };
}

describe('buildMutation', () => {
  test('create mutation resolves to created entity', async () => {
    const model = makeEntity();
    const fields = buildMutation('User', {} as unknown, {} as unknown, model);
    const field = (fields as any).createUser;
    const created = await field.resolve(null, { input: { id: 1, name: 'A' } });
    expect(created).toEqual({ id: 1, name: 'A' });
  });

  test('update mutation returns updated entity', async () => {
    const model = makeEntity([{ id: 1, name: 'A' }]);
    const fields = buildMutation('User', {} as unknown, {} as unknown, model);
    const field = (fields as any).updateUser;
    const updated = await field.resolve(null, { id: 1, input: { name: 'B' } });
    expect(updated).toEqual({ id: 1, name: 'B' });
  });

  test('destroy mutation disables entity and returns it', async () => {
    const model = makeEntity([{ id: 1, name: 'A' }]);
    const fields = buildMutation('User', {} as unknown, {} as unknown, model);
    const field = (fields as any).destroyUser;
    const destroyed = await field.resolve(null, { id: 1 });
    expect(destroyed).toEqual({ id: 1, name: 'A', enable: false });
  });
});
