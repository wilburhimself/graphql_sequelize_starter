import { Router } from 'express';
import { createYoga } from 'graphql-yoga';
import schema from '../schema';

const routes = Router();

// Mount Yoga at /graph
const yoga = createYoga({ schema, graphqlEndpoint: '/graph', maskedErrors: false });
routes.use(yoga.graphqlEndpoint, yoga);

export default routes;
