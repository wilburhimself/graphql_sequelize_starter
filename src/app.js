import http from 'http';
import express from 'express';
import cors from 'cors';
import routes from './routes';

import dotenv from 'dotenv'
dotenv.config();

let app = express();
app.server = http.createServer(app);
app.options('/graph', cors());
app.use(cors());

app.use('/', routes);

app.server.listen(process.env.PORT || process.env.APP_PORT);
console.log(`Started on port ${app.server.address().port}`);
