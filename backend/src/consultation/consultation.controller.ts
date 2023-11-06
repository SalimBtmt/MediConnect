import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseInterceptors,
  } from '@nestjs/common';
import { HttpInterceptor } from '../interceptors/http.interceptor';
import { ConsultationService } from './consultation.service';
import { HandlerParams } from '../common/validators/handler-params';
import { Observable } from 'rxjs';
import { Consultation } from './schemas/consultation.schema';
import { ConsultationEntity } from './entities/consultation.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';

@Controller('consultation')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(HttpInterceptor)
export class ConsultationController {

    constructor(private readonly _consultationService: ConsultationService) {}

    @Get()
    findAll(): Observable<ConsultationEntity[] | void> {
        return this._consultationService.findAll();
    }

    @Get('random')
    findRandom(): Observable<ConsultationEntity | void> {
        return this._consultationService.findRandom();
    }


    @Get(':id')
    findOne(@Param() params: HandlerParams): Observable<ConsultationEntity> {
        return this._consultationService.findOne(params.id);
    }

    @Post()
    create(@Body() createConsultationDto: CreateConsultationDto): Observable<ConsultationEntity> {
        return this._consultationService.create(createConsultationDto);
    }


    @Put(':id')
    update(
        @Param() params: HandlerParams,
        @Body() updateConsultationDto: UpdateConsultationDto,
    ): Observable<ConsultationEntity> {
        return this._consultationService.update(params.id, updateConsultationDto);
    }


    @Delete(':id')
        delete(@Param() params: HandlerParams): Observable<void> {
        return this._consultationService.delete(params.id);
  }

    @Get('patient/:id')
    findAllByDoctorId(@Param('id') patientId: string): Observable<ConsultationEntity[] | void> {
        return this._consultationService.findAllByPatientId(patientId);
    }
}