import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
  } from '@nestjs/common';
  import { find, findIndex, from, Observable, of, throwError } from 'rxjs';
  import {
    catchError,
    defaultIfEmpty,
    filter,
    map,
    mergeMap,
    tap,
  } from 'rxjs/operators';
import { Doctor } from './doctor.types';
import { DoctorDao } from './dao/doctor.dao';
import { DoctorEntity } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PatientEntity } from 'src/patient/entities/patient.entity';
import { PatientService } from 'src/patient/patient.service';
import { ConsultationService } from 'src/consultation/consultation.service';

@Injectable()
export class DoctorService {

    constructor(
        private readonly _doctorDao: DoctorDao,
        private readonly _patientService: PatientService,
        private readonly _consultationService: ConsultationService
        ) {}

    findAll = (): Observable<DoctorEntity[] | void> =>
        this._doctorDao.find().pipe(
            filter(Boolean),
            map((doctor) => (doctor || []).map((doctor) => new DoctorEntity(doctor))),
            defaultIfEmpty(undefined)
        )

    /**
     * Returns randomly one doctor of the list
     *
     * @returns {Observable<DoctorEntity | void>}
     */
    findRandom = (): Observable<DoctorEntity | void> =>
        this._doctorDao.find().pipe(
            filter((doctor) => !!doctor && !!doctor.length),
            map((doctor) => doctor[Math.round(Math.random() * doctor.length)]),
            map((doctor) => new DoctorEntity(doctor)),
            defaultIfEmpty(undefined),
    );

    /**
     * Returns one doctor of the list matching id in parameter
     *
     * @param {string} id of the doctor
     *
     * @returns {Observable<DoctorEntity>}
     */
    findOne = (id: string): Observable<DoctorEntity> =>
    this._doctorDao.findById(id).pipe(
        catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
        ),
        mergeMap((doctor) =>
        !!doctor
            ? of(new DoctorEntity(doctor))
            : throwError(
                () => new NotFoundException(`Doctor with id '${id}' not found`),
            ),
        ),
    );

    /**
     * Check if doctor already exists and add it in doctors list
     *
     * @param doctor to create
     *
     * @returns {Observable<DoctorEntity>}
     */
    create = (doctor: CreateDoctorDto): Observable<DoctorEntity> =>
    this._prepareNewDoctor(doctor).pipe(
        mergeMap((newPreparedDoctor: CreateDoctorDto) =>
        this._doctorDao.save(newPreparedDoctor),
        ),
        catchError((e) =>
        e.code === 11000
            ? throwError(
                () =>
                new ConflictException(
                    `Doctor with lastname '${doctor.lastname}' and firstname '${doctor.firstname}' already exists`,
                ),
            )
            : throwError(() => new UnprocessableEntityException(e.message)),
        ),
        map((doctorCreated) => new DoctorEntity(doctorCreated)),
    );

    /**
     * Update a doctor in doctors list
     *
     * @param {string} id of the doctor to update
     * @param doctor data to update
     *
     * @returns {Observable<DoctorEntity>}
     */
    update = (id: string, doctor: UpdateDoctorDto): Observable<DoctorEntity> =>
    this._doctorDao.findByIdAndUpdate(id, doctor).pipe(
        catchError((e) =>
        e.code === 11000
            ? throwError(
                () =>
                new ConflictException(
                    `Doctor with lastname '${doctor.lastname}' and firstname '${doctor.firstname}' already exists`,
                ),
            )
            : throwError(() => new UnprocessableEntityException(e.message)),
        ),
        mergeMap((doctorUpdated) =>
        !!doctorUpdated
            ? of(new DoctorEntity(doctorUpdated))
            : throwError(
                () => new NotFoundException(`Doctor with id '${id}' not found`),
            ),
        ),
    );

    /**
     * Deletes one doctor in doctors list
     *
     * @param {string} id of the doctor to delete
     *
     * @returns {Observable<void>}
     */
    delete = (id: string): Observable<void> =>
    this._doctorDao.findByIdAndRemove(id).pipe(
        catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
        ),
        mergeMap((doctorDeleted) =>
        !!doctorDeleted
            ? of(undefined)
            : throwError(
                () => new NotFoundException(`Doctor with id '${id}' not found`),
            ),
        ),
    );

    /**
     * Add doctor with good data in doctors list
     *
     * @param doctor to add
     *
     * @returns {Observable<Doctor>}
     *
     * @private
     */
    private _prepareNewDoctor = (
        doctor: CreateDoctorDto,
    ): Observable<CreateDoctorDto> =>
        of({
        ...doctor,
        birthDate: this._parseDate('01/01/2000').toString(),
    });

    /**
     * Function to parse date and return timestamp
     *
     * @param {string} date to parse
     *
     * @returns {number} timestamp
     *
     * @private
     */
    private _parseDate = (date: string): number => {
        const dates = date.split('/');
        return new Date(dates[2] + '/' + dates[1] + '/' + dates[0]).getTime();
    };

    getPatients = (id: string): Observable<PatientEntity[] | void> =>
    this._patientService.findAllByDoctorId(id).pipe()
}
