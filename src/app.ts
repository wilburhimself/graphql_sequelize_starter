import http from 'http';
import express, { Router } from 'express';
import cors from 'cors';
import routes from './routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.options('/graph', cors());
app.use(cors());

app.use('/', routes as unknown as Router);

const port = (process.env.PORT || process.env.APP_PORT || 3000) as number | string;
const server = http.createServer(app);
server.listen(port, () => {
  const address = server.address();
  const printed = typeof address === 'string' ? address : address?.port;
  console.log(`Started on port ${printed}`);
});

export default app;
