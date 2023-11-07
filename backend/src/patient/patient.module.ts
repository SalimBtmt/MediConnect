import { Logger, Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientDao } from './dao/patient.dao';
import { Patient, PatientSchema } from './schemas/patient.schema';
import { ConsultationModule } from 'src/consultation/consultation.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema}]),
    ConsultationModule
  ],
  controllers: [PatientController],
  providers: [PatientService, Logger, PatientDao],
  exports: [PatientService]
})
export class PatientModule {}
