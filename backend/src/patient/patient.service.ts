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
import { Patient } from './patient.types';
import { PatientDao } from './dao/patient.dao';
import { PatientEntity } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {

    private _patient: Patient[];

    constructor(private readonly _patientDao: PatientDao) {}

    findAll = (): Observable<PatientEntity[] | void> =>
        this._patientDao.find().pipe(
            filter(Boolean),
            map((patient) => (patient || []).map((patient) => new PatientEntity(patient))),
            defaultIfEmpty(undefined)
        )

    /**
     * Returns randomly one patient of the list
     *
     * @returns {Observable<PatientEntity | void>}
     */
    findRandom = (): Observable<PatientEntity | void> =>
        this._patientDao.find().pipe(
            filter((patient) => !!patient && !!patient.length),
            map((patient) => patient[Math.round(Math.random() * patient.length)]),
            map((patient) => new PatientEntity(patient)),
            defaultIfEmpty(undefined),
    );

    /**
     * Returns one patient of the list matching id in parameter
     *
     * @param {string} id of the patient
     *
     * @returns {Observable<PatientEntity>}
     */
    findOne = (id: string): Observable<PatientEntity> =>
    this._patientDao.findById(id).pipe(
        catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
        ),
        mergeMap((patient) =>
        !!patient
            ? of(new PatientEntity(patient))
            : throwError(
                () => new NotFoundException(`Patient with id '${id}' not found`),
            ),
        ),
    );

    /**
     * Check if patient already exists and add it in patients list
     *
     * @param patient to create
     *
     * @returns {Observable<PatientEntity>}
     */
    create = (patient: CreatePatientDto): Observable<PatientEntity> =>
    this._prepareNewPatient(patient).pipe(
        mergeMap((newPreparedPatient: CreatePatientDto) =>
        this._patientDao.save(newPreparedPatient),
        ),
        catchError((e) =>
        e.code === 11000
            ? throwError(
                () =>
                new ConflictException(
                    `Patient with lastname '${patient.lastname}' and firstname '${patient.firstname}' already exists`,
                ),
            )
            : throwError(() => new UnprocessableEntityException(e.message)),
        ),
        map((patientCreated) => new PatientEntity(patientCreated)),
    );

    /**
     * Update a patient in patients list
     *
     * @param {string} id of the patient to update
     * @param patient data to update
     *
     * @returns {Observable<PatientEntity>}
     */
    update = (id: string, patient: UpdatePatientDto): Observable<PatientEntity> =>
    this._patientDao.findByIdAndUpdate(id, patient).pipe(
        catchError((e) =>
        e.code === 11000
            ? throwError(
                () =>
                new ConflictException(
                    `Patient with lastname '${patient.lastname}' and firstname '${patient.firstname}' already exists`,
                ),
            )
            : throwError(() => new UnprocessableEntityException(e.message)),
        ),
        mergeMap((patientUpdated) =>
        !!patientUpdated
            ? of(new PatientEntity(patientUpdated))
            : throwError(
                () => new NotFoundException(`Patient with id '${id}' not found`),
            ),
        ),
    );

    /**
     * Deletes one patient in patients list
     *
     * @param {string} id of the patient to delete
     *
     * @returns {Observable<void>}
     */
    delete = (id: string): Observable<void> =>
    this._patientDao.findByIdAndRemove(id).pipe(
        catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
        ),
        mergeMap((patientDeleted) =>
        !!patientDeleted
            ? of(undefined)
            : throwError(
                () => new NotFoundException(`Patient with id '${id}' not found`),
            ),
        ),
    );

    /**
     * Finds index of array for current patient
     *
     * @param {string} id of the patient to find
     *
     * @returns {Observable<number>}
     *
     * @private
     */
    private _findPatientIndexOfList = (id: string): Observable<number> =>
    from(this._patient).pipe(
        findIndex((patient: Patient) => patient.id === id),
        mergeMap((index: number) =>
        index > -1
            ? of(index)
            : throwError(
                () => new NotFoundException(`Patient with id '${id}' not found`),
            ),
    ),
  );

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

    /**
     * Add patient with good data in patients list
     *
     * @param patient to add
     *
     * @returns {Observable<Patient>}
     *
     * @private
     */
    private _prepareNewPatient = (
        patient: CreatePatientDto,
    ): Observable<CreatePatientDto> =>
        of({
        ...patient,
        birthDate: this._parseDate('01/01/2000').toString(),
    });
   

    findAllByDoctorId = (doctorId : string) : Observable<PatientEntity[] | void> =>
    this._patientDao.findByDoctorId(doctorId).pipe(
        filter(Boolean),
        map((patients) => (patients || []).map((patient) => new PatientEntity(patient))),
        defaultIfEmpty(undefined)
    )
}
