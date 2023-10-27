import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoctorModule } from './doctor/doctor.module';
import * as Config from 'config';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [
    DoctorModule,
    PatientModule,
    MongooseModule.forRoot(Config.get<string>('mongodb.uri'))
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
