import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Request,
    UseInterceptors,
  } from '@nestjs/common';
import { HttpInterceptor } from '../interceptors/http.interceptor';
import { PatientService } from './patient.service';
import { HandlerParams } from '../common/validators/handler-params';
import { Observable } from 'rxjs';
import { Patient } from './schemas/patient.schema';
import { PatientEntity } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ConsultationEntity } from 'src/consultation/entities/consultation.entity';

@Controller('patient')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(HttpInterceptor)
export class PatientController {

    constructor(private readonly _patientService: PatientService) {}

    @Get()
    findAll(): Observable<PatientEntity[] | void> {
        return this._patientService.findAll();
    }

    @Get('random')
    findRandom(): Observable<PatientEntity | void> {
        return this._patientService.findRandom();
    }


    @Get(':id')
    findOne(@Param() params: HandlerParams): Observable<PatientEntity> {
        return this._patientService.findOne(params.id);
    }

    @Post()
    create(@Body() createPatientDto: CreatePatientDto): Observable<PatientEntity> {
        return this._patientService.create(createPatientDto);
    }


    @Put(':id')
    update(
        @Param() params: HandlerParams,
        @Body() updatePatientDto: UpdatePatientDto,
    ): Observable<PatientEntity> {
        return this._patientService.update(params.id, updatePatientDto);
    }


    @Delete(':id')
        delete(@Param() params: HandlerParams): Observable<void> {
        return this._patientService.delete(params.id);
  }


    @Get('doctor/:id')
    findAllByDoctorId(@Param() params: HandlerParams): Observable<PatientEntity[] | void> {
        return this._patientService.findAllByDoctorId(params.id);
    }

    @Get(':id/consultations')
    findConsultations(@Param() params: HandlerParams): Observable<ConsultationEntity[] | void> {
        return this._patientService.getConsultationsByPatientId(params.id);
    }

    @Get('doctor/:id/ids')
    findAllIdsByDoctorId(@Param() params: HandlerParams): Observable<string[]> {
        return this._patientService.findAllIdsByDoctorId(params.id);
    }

    
}