import buildMutation from './mutation';
import { makeEntity } from './testUtils/fakeEntity';

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
