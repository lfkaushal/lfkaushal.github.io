import express from 'express';

import config from './config';

import routes from './routes';
import { AppDataSource } from './data-source';

const app = express();

app.use(routes);

const main = async () => {
  try {
    await AppDataSource.initialize();
    app.listen(config.serverPort);
    console.log(`Server listening on port: ${config.serverPort}`);
  } catch (error) {
    throw new Error(error as string);
  }
};

main();
