import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoctorModule } from './doctor/doctor.module';
import * as Config from 'config';
import { PatientModule } from './patient/patient.module';

import { AuthModule } from './auth/auth.module';
import { ConsultationModule } from './consultation/consultation.module';

@Module({
  imports: [
    DoctorModule,
    PatientModule,
    AuthModule,
    ConsultationModule,
    MongooseModule.forRoot(Config.get<string>('mongodb.uri'))
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
