# Sequelize GraphQL Starter #

Generate a GraphQL server with queries and mutations for each of the entities in your application model.

### Config ###

Before using create a `.env` file in the root directory of your project. Copy the following example and substitute accordingly for the minimum setup needed to run the starter.

```
DB_USER=database user
DB_PASSSWORD=database password
DB_DATABASE=database name
DB_HOST=database host
DB_PORT=database port
DB_DIALECT=database dialect (mysql, postgres, etc ...)

APP_PORT=3000
APP_PERPAGE=10 (default page size in query)
```  

### Usage ###

For each entity in your application you must create a directory in `src/entities`. In this case we are going to use a `Post` entity, so we create a `posts` directory. This directory contains 3 files: 

**`model.js`:** Is a `sequelize` model. It is used to define the entity data model and the model's operations.

```
import Sequelize from "sequelize";
import db from "../../lib/database";

const Post = db.define("Post", 
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'name'
    },
  
    introduction: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'introduction'
    },
  
    body: {
      type: Sequelize.TEXT,
      field: 'body'
    },
  }, {
    tableName: 'posts',
    timestamps: false
  }
);

export default Post;
```

**`input.js`:** The definition of the `GraphQLInputType` for the entity.

```
import buildInput from '../../lib/input';
import Model from './model';

export default buildInput(Model);
```

**`type.js`:** The definition of the `GraphQLObjectType` for the entity.
```
import Model from './model';
import buildType from '../../lib/type';

let CountryType = buildType(Model);
export default CountryType;
```

With this setup we can run with 

```
npm start
```

And visit `http://localhost:3000`