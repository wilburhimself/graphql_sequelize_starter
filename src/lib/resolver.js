import dotenv from 'dotenv'
dotenv.config();

class Resolver {
  constructor(entity) {
    this.entity = entity;
  }

  find(id) {
    return this.entity.findOne({where: {id: id}}).then((items) => {
      return items;
    });
  }

  all(options) {
    let shouldOrder = Object.getOwnPropertyNames(this.entity.rawAttributes).indexOf("name") == 1;
    let defaults = {
      perPage: process.env.APP_PERPAGE,
      limit: process.env.APP_PERPAGE,
      offset: 0,
    };

    Object.assign(defaults, {
      order: shouldOrder ? 'name ASC' : options.order
    });

    let settings = Object.assign({}, defaults, options || {});
    let queryOptions = {};

    if (!settings.all) {
      Object.assign(queryOptions, {
        limit: settings.limit,
        offset: settings.currentPage ? this.page(settings.currentPage) : settings.offset,
        order: settings.order,
      });
    }

    return this.entity.findAndCountAll(queryOptions).then((items) => {
      return items.rows;
    });
  }

  create(item) {
    return this.entity.create(item).then((result) => {
      return result;
    });
  }

  update(id, item) {
    return this.entity.update(item, {where: {id: id}}).then(() => {
      return this.find(id);
    });
  }

  page(pageNumber) {
    return config.perPage * pageNumber
  }

  destroy(id) {
    return this.entity.update({enable: false}, {where: {id: id}}).then(() => {
      return this.find(id);
    });
  }


};
export default Resolver;
