import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { HttpInterceptor } from '../interceptors/http.interceptor';
import { DoctorService } from './doctor.service';
import { Observable } from 'rxjs';
import { Doctor } from './schemas/doctor.schema';
import { DoctorEntity } from './entities/doctor.entity';

@Controller('doctor')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(HttpInterceptor)
export class DoctorController {

    constructor(private readonly _doctorService: DoctorService) {}

    @Get()
    findAll(): Observable<DoctorEntity[] | void> {
        return this._doctorService.findAll();
    }
}