import { Logger, Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Doctor, DoctorSchema } from './schemas/doctor.schema';
import { DoctorDao } from './dao/doctor.dao';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema}])
  ],
  controllers: [DoctorController],
  providers: [DoctorService, Logger, DoctorDao]
})
export class DoctorModule {}
