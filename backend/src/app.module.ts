import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoctorModule } from './doctor/doctor.module';
import * as Config from 'config';

@Module({
  imports: [
    DoctorModule,
    MongooseModule.forRoot(Config.get<string>('mongodb.uri'))
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
