import { Injectable } from '@nestjs/common';
import { Doctor } from './doctor.types';
import { DoctorDao } from './dao/doctor.dao';
import { Observable, defaultIfEmpty, filter, map } from 'rxjs';
import { DoctorEntity } from './entities/doctor.entity';

@Injectable()
export class DoctorService {

    private _doctor: Doctor[];

    constructor(private readonly _doctorDao: DoctorDao) {}

    findAll = (): Observable<DoctorEntity[] | void> =>
        this._doctorDao.find().pipe(
            filter(Boolean),
            map((doctor) => (doctor || []).map((doctor) => new DoctorEntity(doctor))),
            defaultIfEmpty(undefined)
        )
}
