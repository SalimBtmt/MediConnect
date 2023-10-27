import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Doctor } from "../schemas/doctor.schema";
import { Model } from "mongoose";
import { Observable, from, map } from "rxjs";
import { CreateDoctorDto } from "../dto/create-doctor.dto";
import { UpdateDoctorDto } from "../dto/update-doctor.dto";

@Injectable()
export class DoctorDao {

    constructor(
        @InjectModel(Doctor.name)
        private readonly _doctorModel: Model<Doctor>
    ) {}

    find = (): Observable<Doctor[]> =>
        from(this._doctorModel.find({})).pipe(map((doctor) => [].concat(doctor)));

    findById = (id: string): Observable<Doctor | void> =>
        from(this._doctorModel.findById(id));
    
      /**
       * Check if doctor already exists with index and add it in people list
       *
       * @param {CreateDoctorDto} doctor to create
       *
       * @return {Observable<Doctor>}
       */
      save = (doctor: CreateDoctorDto): Observable<Doctor> =>
        from(new this._doctorModel(doctor).save());
    
      /**
       * Update a doctor in people list
       *
       * @param {string} id
       * @param {UpdateDoctorDto} doctor
       *
       * @return {Observable<Doctor | void>}
       */
      findByIdAndUpdate = (
        id: string,
        doctor: UpdateDoctorDto,
      ): Observable<Doctor | void> =>
        from(
          this._doctorModel.findByIdAndUpdate(id, doctor, {
            new: true,
            runValidators: true,
          }),
        );
    
      /**
       * Delete a doctor in people list
       *
       * @param {string} id
       *
       * @return {Observable<Doctor | void>}
       */
      findByIdAndRemove = (id: string): Observable<Doctor | void> =>
        from(this._doctorModel.findByIdAndRemove(id));
}