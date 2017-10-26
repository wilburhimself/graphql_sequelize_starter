import GraphqlHTTP from 'express-graphql';
import schema from '../api';

const routes = require('express').Router();

routes.use('/', GraphqlHTTP({
  schema: schema,
  rootValue: global,
  graphiql: true,
}));

export default routes;
