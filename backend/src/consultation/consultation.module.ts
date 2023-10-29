import { Logger, Module } from '@nestjs/common';
import { ConsultationController } from './consultation.controller';
import { ConsultationService } from './consultation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsultationDao } from './dao/consultation.dao';
import { Consultation, ConsultationSchema } from './schemas/consultation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Consultation.name, schema: ConsultationSchema}])
  ],
  controllers: [ConsultationController],
  providers: [ConsultationService, Logger, ConsultationDao]
})
export class ConsultationModule {}
