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
import { Consultation } from './consultation.types';
import { ConsultationDao } from './dao/consultation.dao';
import { ConsultationEntity } from './entities/consultation.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';

@Injectable()
export class ConsultationService {

    private _consultation: Consultation[];

    constructor(private readonly _consultationDao: ConsultationDao) {}

    findAll = (): Observable<ConsultationEntity[] | void> =>
        this._consultationDao.find().pipe(
            filter(Boolean),
            map((consultation) => (consultation || []).map((consultation) => new ConsultationEntity(consultation))),
            defaultIfEmpty(undefined)
        )

    /**
     * Returns randomly one consultation of the list
     *
     * @returns {Observable<ConsultationEntity | void>}
     */
    findRandom = (): Observable<ConsultationEntity | void> =>
        this._consultationDao.find().pipe(
            filter((consultation) => !!consultation && !!consultation.length),
            map((consultation) => consultation[Math.round(Math.random() * consultation.length)]),
            map((consultation) => new ConsultationEntity(consultation)),
            defaultIfEmpty(undefined),
    );

    /**
     * Returns one consultation of the list matching id in parameter
     *
     * @param {string} id of the consultation
     *
     * @returns {Observable<ConsultationEntity>}
     */
    findOne = (id: string): Observable<ConsultationEntity> =>
    this._consultationDao.findById(id).pipe(
        catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
        ),
        mergeMap((consultation) =>
        !!consultation
            ? of(new ConsultationEntity(consultation))
            : throwError(
                () => new NotFoundException(`Consultation with id '${id}' not found`),
            ),
        ),
    );

    /**
     * Check if consultation already exists and add it in consultations list
     *
     * @param consultation to create
     *
     * @returns {Observable<ConsultationEntity>}
     */
    create = (consultation: CreateConsultationDto): Observable<ConsultationEntity> =>
    this._prepareNewConsultation(consultation).pipe(
        mergeMap((newPreparedConsultation: CreateConsultationDto) =>
        this._consultationDao.save(newPreparedConsultation),
        ),
        catchError((e) => throwError(() => new UnprocessableEntityException(e.message))),
        map((consultationCreated) => new ConsultationEntity(consultationCreated)),
    );

    /**
     * Update a consultation in consultations list
     *
     * @param {string} id of the consultation to update
     * @param consultation data to update
     *
     * @returns {Observable<ConsultationEntity>}
     */
    update = (id: string, consultation: UpdateConsultationDto): Observable<ConsultationEntity> =>
    this._consultationDao.findByIdAndUpdate(id, consultation).pipe(
        catchError((e) => throwError(() => new UnprocessableEntityException(e.message))),
        mergeMap((consultationUpdated) =>
        !!consultationUpdated
            ? of(new ConsultationEntity(consultationUpdated))
            : throwError(
                () => new NotFoundException(`Consultation with id '${id}' not found`),
            ),
        ),
    );

    /**
     * Deletes one consultation in consultations list
     *
     * @param {string} id of the consultation to delete
     *
     * @returns {Observable<void>}
     */
    delete = (id: string): Observable<void> =>
    this._consultationDao.findByIdAndRemove(id).pipe(
        catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
        ),
        mergeMap((consultationDeleted) =>
        !!consultationDeleted
            ? of(undefined)
            : throwError(
                () => new NotFoundException(`Consultation with id '${id}' not found`),
            ),
        ),
    );

    /**
     * Finds index of array for current consultation
     *
     * @param {string} id of the consultation to find
     *
     * @returns {Observable<number>}
     *
     * @private
     */
    private _findConsultationIndexOfList = (id: string): Observable<number> =>
    from(this._consultation).pipe(
        findIndex((consultation: Consultation) => consultation.id === id),
        mergeMap((index: number) =>
        index > -1
            ? of(index)
            : throwError(
                () => new NotFoundException(`Consultation with id '${id}' not found`),
            ),
    ),
  );

    /**
     * Add consultation with good data in consultations list
     *
     * @param consultation to add
     *
     * @returns {Observable<Consultation>}
     *
     * @private
     */
    private _prepareNewConsultation = (
        consultation: CreateConsultationDto,
    ): Observable<CreateConsultationDto> =>
        of({
        ...consultation,
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
}
