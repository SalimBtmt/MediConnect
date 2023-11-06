import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import * as Config from 'config';
import { AppConfig } from './app.types';
import * as fastifyCookie from 'fastify-cookie'; // Add this line

async function bootstrap(config: AppConfig) {
  const cors = require('cors');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  await app.register(fastifyCookie);
  await app.listen(config.port, config.host);
  Logger.log(
    `Application served at http://${config.host}:${config.port}`,
    'bootstrap',
  );

  app.use(
    cors([
      'http://0.0.0.0:4200',
      'http://127.0.0.1:4200',
      'http://localhost:4200',
    ]),
  );
}

bootstrap(Config.get<AppConfig>('server'));
