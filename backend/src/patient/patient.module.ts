import { Logger, Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientDao } from './dao/patient.dao';
import { Patient, PatientSchema } from './schemas/patient.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema}])
  ],
  controllers: [PatientController],
  providers: [PatientService, Logger, PatientDao]
})
export class PatientModule {}
