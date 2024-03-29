import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Consultation } from "../schemas/consultation.schema";
import { Model } from "mongoose";
import { Observable, from, map } from "rxjs";
import { CreateConsultationDto } from "../dto/create-consultation.dto";
import { UpdateConsultationDto } from "../dto/update-consultation.dto";

@Injectable()
export class ConsultationDao {

    constructor(
        @InjectModel(Consultation.name)
        private readonly _consultationModel: Model<Consultation>
    ) {}

    find = (): Observable<Consultation[]> => {
      return from(this._consultationModel.find({}).lean()).pipe(
        map((consultations) => Array.isArray(consultations)
          ? consultations.map((patient) => ({ ...patient, id: patient._id }))
          : [{ ...consultations, id: consultations._id }]
        )
      );
    };

    findById = (id: string): Observable<Consultation | void> =>
        from(this._consultationModel.findById(id).lean());
    
      /**
       * Check if consultation already exists with index and add it in consultation list
       *
       * @param {CreateConsultationDto} consultation to create
       *
       * @return {Observable<Consultation>}
       */
      save = (consultation: CreateConsultationDto): Observable<Consultation> =>
        from(new this._consultationModel(consultation).save());
    
      /**
       * Update a consultation in consultation list
       *
       * @param {string} id
       * @param {UpdateConsultationDto} consultation
       *
       * @return {Observable<Consultation | void>}
       */
      findByIdAndUpdate = (
        id: string,
        consultation: UpdateConsultationDto,
      ): Observable<Consultation | void> =>
        from(
          this._consultationModel.findByIdAndUpdate(id, consultation, {
            new: true,
            runValidators: true,
          }),
        );
    
      /**
       * Delete a consultation in consultation list
       *
       * @param {string} id
       *
       * @return {Observable<Consultation | void>}
       */
      findByIdAndRemove = (id: string): Observable<Consultation | void> =>
        from(this._consultationModel.findByIdAndRemove(id));
              
      findByPatientId = (someId : String) : Observable<Consultation[]> =>
      from(this._consultationModel.find({ "patientId" : someId }).lean()).pipe(map((patient) => [].concat(patient)));
}