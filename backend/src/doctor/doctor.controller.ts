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
import { DoctorService } from './doctor.service';
import { Observable } from 'rxjs';
import { Doctor } from './schemas/doctor.schema';
import { DoctorEntity } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { HandlerParams } from 'src/common/validators/handler-params';
import { PatientEntity } from 'src/patient/entities/patient.entity';

@Controller('doctor')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(HttpInterceptor)
export class DoctorController {

    constructor(private readonly _doctorService: DoctorService) {}

    @Get()
    findAll(): Observable<DoctorEntity[] | void> {
        return this._doctorService.findAll();
    }

    @Get('random')
    findRandom(): Observable<DoctorEntity | void> {
        return this._doctorService.findRandom();
    }


    @Get(':id')
    findOne(@Param() params: HandlerParams): Observable<DoctorEntity> {
        return this._doctorService.findOne(params.id);
    }

    @Post()
    create(@Body() createDoctorDto: CreateDoctorDto): Observable<DoctorEntity> {
        return this._doctorService.create(createDoctorDto);
    }


    @Put(':id')
    update(
        @Param() params: HandlerParams,
        @Body() updateDoctorDto: UpdateDoctorDto,
    ): Observable<DoctorEntity> {
        return this._doctorService.update(params.id, updateDoctorDto);
    }


    @Delete(':id')
        delete(@Param() params: HandlerParams): Observable<void> {
        return this._doctorService.delete(params.id);
  }

    @Get(':id/patients')
    findPatients(@Param() params: HandlerParams): Observable<PatientEntity[] | void> {
        return this._doctorService.getPatientsByDoctorId(params.id);
    } 
}