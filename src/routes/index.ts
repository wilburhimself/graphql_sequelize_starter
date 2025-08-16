import { Router } from 'express';
import graphqlHTTP from 'express-graphql';
import schema from '../entities';

const routes = Router();

routes.use(
  '/',
  graphqlHTTP({
    schema,
    rootValue: globalThis,
    graphiql: true,
  }),
);

export default routes;
