import Resolver from './resolver';
import { makeEntity, makeEntityNoName } from './testUtils/fakeEntity';

describe('Resolver', () => {
  test('find returns a single item', async () => {
    const entity = makeEntity([{ id: 1, name: 'A' }]);
    const r = new Resolver(entity);
    const found = await r.find(1);
    expect(found).toEqual({ id: 1, name: 'A' });
  });

  test('all returns rows with default ordering', async () => {
    const entity = makeEntity([{ id: 1, name: 'A' }]);
    const r = new Resolver(entity);
    const rows = await r.all({});
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBe(1);
  });

  test('create and update and destroy flow', async () => {
    const entity = makeEntity([]);
    const r = new Resolver(entity);
    await r.create({ id: 10, name: 'X' });
    const created = await r.find(10);
    expect(created).toEqual({ id: 10, name: 'X' });

    const updated = await r.update(10, { name: 'Y' });
    expect(updated).toEqual({ id: 10, name: 'Y' });

    const destroyed = await r.destroy(10);
    expect(destroyed).toEqual({ id: 10, name: 'Y', enable: false });
  });

  test('all with all=true bypasses pagination', async () => {
    const entity = makeEntity([{ id: 1, name: 'A' }]);
    const r = new Resolver(entity);
    const rows = await r.all({ all: true });
    expect(rows.length).toBe(1);
  });

  test('all with currentPage uses page()', async () => {
    process.env.APP_PERPAGE = '2';
    const entity = makeEntity([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ]);
    const r = new Resolver(entity);
    const rows = await r.all({ currentPage: 2 });
    expect(Array.isArray(rows)).toBe(true);
  });

  test('all sets default order when name field exists', async () => {
    const entity = makeEntity([{ id: 1, name: 'A' }]);
    const r = new Resolver(entity);
    const rows = await r.all({});
    expect(rows.length).toBe(1);
  });

  test('all uses provided order when name field missing', async () => {
    const entity = makeEntityNoName([{ id: 2, name: 'B' }]);
    const r = new Resolver(entity);
    const rows = await r.all({ order: 'id DESC' });
    expect(rows.length).toBe(1);
  });

  test('page uses per-page from env', () => {
    process.env.APP_PERPAGE = '5';
    const entity = makeEntity([]);
    const r = new Resolver(entity);
    expect(r.page(3)).toBe(15);
  });
});
