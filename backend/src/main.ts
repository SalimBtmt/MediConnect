import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common'
import { AppModule } from './app.module';
import { 
  FastifyAdapter, 
  NestFastifyApplication 
} from '@nestjs/platform-fastify';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule, 
    new FastifyAdapter({ logger: true })
    );
  await app.listen(3000);
  Logger.log('Application served at http://localhost:3000', 'bootstrap');
}

bootstrap();
