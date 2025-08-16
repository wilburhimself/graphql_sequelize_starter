import buildMutation from './mutation';
import { makeEntity } from './testUtils/fakeEntity';

describe('buildMutation', () => {
  test('create mutation resolves to created entity', async () => {
    const model = makeEntity();
    const fields = buildMutation('User', {} as unknown, {} as unknown, model);
    const view = fields as Record<string, { resolve: (parent: unknown, args: unknown) => unknown }>;
    const field = view.createUser;
    const created = (await field.resolve(null, { input: { id: 1, name: 'A' } })) as Record<
      string,
      unknown
    >;
    expect(created).toEqual({ id: 1, name: 'A' });
  });

  test('update mutation returns updated entity', async () => {
    const model = makeEntity([{ id: 1, name: 'A' }]);
    const fields = buildMutation('User', {} as unknown, {} as unknown, model);
    const view = fields as Record<string, { resolve: (parent: unknown, args: unknown) => unknown }>;
    const field = view.updateUser;
    const updated = (await field.resolve(null, { id: 1, input: { name: 'B' } })) as Record<
      string,
      unknown
    >;
    expect(updated).toEqual({ id: 1, name: 'B' });
  });

  test('destroy mutation disables entity and returns it', async () => {
    const model = makeEntity([{ id: 1, name: 'A' }]);
    const fields = buildMutation('User', {} as unknown, {} as unknown, model);
    const view = fields as Record<string, { resolve: (parent: unknown, args: unknown) => unknown }>;
    const field = view.destroyUser;
    const destroyed = (await field.resolve(null, { id: 1 })) as Record<string, unknown>;
    expect(destroyed).toEqual({ id: 1, name: 'A', enable: false });
  });
});
