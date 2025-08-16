import dotenv from 'dotenv';

dotenv.config();

type Entity = any; // Legacy Sequelize model

type AllOptions = {
  currentPage?: number;
  limit?: number;
  offset?: number;
  order?: string;
  all?: boolean;
};

class Resolver {
  private entity: Entity;

  constructor(entity: Entity) {
    this.entity = entity;
  }

  find(id: number | string) {
    return this.entity.findOne({ where: { id: id } }).then((items: unknown) => items);
  }

  all(options?: AllOptions) {
    const hasNameField = Object.getOwnPropertyNames(this.entity.rawAttributes).indexOf('name') == 1;
    const defaults = {
      perPage: Number(process.env.APP_PERPAGE),
      limit: Number(process.env.APP_PERPAGE),
      offset: 0,
    };

    Object.assign(defaults, { order: hasNameField ? 'name ASC' : options?.order });

    const settings = Object.assign({}, defaults, options || {});
    const queryOptions: Record<string, unknown> = {};

    if (!settings.all) {
      Object.assign(queryOptions, {
        limit: settings.limit,
        offset: settings.currentPage ? this.page(settings.currentPage) : settings.offset,
        order: settings.order,
      });
    }

    return this.entity.findAndCountAll(queryOptions).then((items: any) => items.rows);
  }

  create(item: Record<string, unknown>) {
    return this.entity.create(item).then((result: unknown) => result);
  }

  update(id: number | string, item: Record<string, unknown>) {
    return this.entity.update(item, { where: { id: id } }).then(() => this.find(id));
  }

  page(pageNumber: number) {
    return Number(process.env.APP_PERPAGE) * pageNumber;
  }

  destroy(id: number | string) {
    return this.entity.update({ enable: false }, { where: { id: id } }).then(() => this.find(id));
  }
}

export default Resolver;
