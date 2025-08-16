import dotenv from 'dotenv';

dotenv.config();

type FindOneOptions = { where: { id: number | string } };
type UpdateOptions = { where: { id: number | string } };
type FindAndCountAllResult<T> = { rows: T[] };

// Minimal interface for legacy Sequelize-like model we interact with
export interface Entity<T = Record<string, unknown>> {
  rawAttributes: Record<string, unknown>;
  findOne(opts: FindOneOptions): Promise<T | null>;
  findAndCountAll(opts: Record<string, unknown>): Promise<FindAndCountAllResult<T>>;
  create(item: Partial<T>): Promise<T>;
  update(item: Partial<T>, opts: UpdateOptions): Promise<unknown>;
}

export type AllOptions = {
  currentPage?: number;
  limit?: number;
  offset?: number;
  order?: string;
  all?: boolean;
};

export type QueryOptions = Pick<AllOptions, 'currentPage' | 'limit' | 'offset' | 'order'>;

class Resolver<T extends Record<string, unknown> = Record<string, unknown>> {
  private entity: Entity<T>;

  constructor(entity: Entity<T>) {
    this.entity = entity;
  }

  find(id: number | string): Promise<T | null> {
    return this.entity.findOne({ where: { id: id } }).then((items) => items);
  }

  all(options?: AllOptions): Promise<T[]> {
    const hasNameField = Object.getOwnPropertyNames(this.entity.rawAttributes).indexOf('name') == 1;
    const defaults = {
      perPage: Number(process.env.APP_PERPAGE),
      limit: Number(process.env.APP_PERPAGE),
      offset: 0,
    };

    Object.assign(defaults, { order: hasNameField ? 'name ASC' : options?.order });

    const settings = Object.assign({}, defaults, options || {});
    const queryOptions: QueryOptions = {};

    if (!settings.all) {
      Object.assign(queryOptions, {
        limit: settings.limit,
        offset: settings.currentPage ? this.page(settings.currentPage) : settings.offset,
        order: settings.order,
      });
    }

    return this.entity.findAndCountAll(queryOptions).then((items) => items.rows);
  }

  create(item: Partial<T>): Promise<T> {
    return this.entity.create(item).then((result) => result);
  }

  update<TId extends number | string, TInput extends Partial<T>>(
    id: TId,
    item: TInput,
  ): Promise<T | null> {
    return this.entity.update(item, { where: { id: id } }).then(() => this.find(id));
  }

  page(pageNumber: number) {
    return Number(process.env.APP_PERPAGE) * pageNumber;
  }

  destroy(id: number | string): Promise<T | null> {
    return this.entity
      .update({ enable: false } as unknown as Partial<T>, { where: { id: id } })
      .then(() => this.find(id));
  }
}

export default Resolver;
