import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common'
import { 
  FastifyAdapter, 
  NestFastifyApplication 
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import * as Config from 'config'
import { AppConfig } from './app.types';


async function bootstrap(config: AppConfig) {
  const cors = require('cors');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule, 
    new FastifyAdapter({ logger: true })
    );
  await app.listen(config.port, config.host);
  Logger.log(
    `Application served at http://${config.host}:${config.port}`,
    'bootstrap');

    app.use(cors({
      origin: 'http://localhost:4200', 
      
    }));
}

bootstrap(Config.get<AppConfig>('server'));
