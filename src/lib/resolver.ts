import dotenv from 'dotenv';

dotenv.config();

// Minimal Prisma-style delegate interface we need
export interface PrismaDelegate<T = Record<string, unknown>> {
  findUnique(args: { where: { id: number | string } }): Promise<T | null>;
  findMany(args: { skip?: number; take?: number; orderBy?: unknown }): Promise<T[]>;
  create(args: { data: Partial<T> }): Promise<T>;
  update(args: { where: { id: number | string }; data: Partial<T> }): Promise<T>;
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
  private entity: PrismaDelegate<T>;

  constructor(entity: PrismaDelegate<T>) {
    this.entity = entity;
  }

  find(id: number | string): Promise<T | null> {
    return this.entity.findUnique({ where: { id } }).then((item) => item);
  }

  all(options?: AllOptions): Promise<T[]> {
    const perPageRaw = Number(process.env.APP_PERPAGE);
    const defaultLimit = Number.isFinite(perPageRaw) && perPageRaw > 0 ? perPageRaw : undefined;
    const defaults = {
      perPage: defaultLimit,
      limit: defaultLimit,
      offset: 0 as number | undefined,
    } as { perPage?: number; limit?: number; offset?: number };

    Object.assign(defaults, { order: options?.order });

    const settings = Object.assign({}, defaults, options || {});
    const queryOptions: QueryOptions = {};

    if (!settings.all) {
      const limit = typeof settings.limit === 'number' && settings.limit > 0 ? settings.limit : undefined;
      const offsetCandidate = settings.currentPage ? this.page(settings.currentPage) : settings.offset;
      const offset = typeof offsetCandidate === 'number' && offsetCandidate >= 0 ? offsetCandidate : undefined;
      Object.assign(queryOptions, {
        limit,
        offset,
        order: settings.order,
      });
    }

    // Translate to Prisma findMany
    const orderBy = queryOptions.order
      ? // very naive "field direction" parser: "name ASC" or "createdAt DESC"
        (() => {
          const [field, direction] = String(queryOptions.order).split(/\s+/);
          return field ? ({ [field]: (direction || 'asc').toLowerCase() } as unknown) : undefined;
        })()
      : undefined;

    return this.entity.findMany({
      skip: queryOptions.offset,
      take: queryOptions.limit,
      orderBy,
    });
  }

  create(item: Partial<T>): Promise<T> {
    return this.entity.create({ data: item }).then((result) => result);
  }

  update<TId extends number | string, TInput extends Partial<T>>(
    id: TId,
    item: TInput,
  ): Promise<T | null> {
    return this.entity.update({ where: { id }, data: item }).then(() => this.find(id));
  }

  page(pageNumber: number) {
    return Number(process.env.APP_PERPAGE) * pageNumber;
  }

  destroy(id: number | string): Promise<T | null> {
    return this.entity
      .update({ where: { id }, data: { enable: false } as unknown as Partial<T> })
      .then(() => this.find(id));
  }
}

export default Resolver;
