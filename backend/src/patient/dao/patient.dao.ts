import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Patient } from "../schemas/patient.schema";
import mongoose, { Model, ObjectId } from "mongoose";
import { Observable, from, map } from "rxjs";
import { CreatePatientDto } from "../dto/create-patient.dto";
import { UpdatePatientDto } from "../dto/update-patient.dto";


@Injectable()
export class PatientDao {
  constructor(
    @InjectModel(Patient.name)
    private readonly _patientModel: Model<Patient>,
  ) {}

  find = (): Observable<Patient[]> => {
    return from(this._patientModel.find({}).lean()).pipe(
      map((patients) => Array.isArray(patients)
        ? patients.map((patient) => ({ ...patient, id: patient._id }))
        : [{ ...patients, id: patients._id }]
      )
    );
  };
  

  findById = (id: string): Observable<Patient | void> =>
    from(this._patientModel.findById(id).lean());

  /**
   * Check if patient already exists with index and add it in patient list
   *
   * @param {CreatePatientDto} patient to create
   *
   * @return {Observable<Patient>}
   */
  save = (patient: CreatePatientDto): Observable<Patient> =>
    from(new this._patientModel(patient).save());

  /**
   * Update a patient in patient list
   *
   * @param {string} id
   * @param {UpdatePatientDto} patient
   *
   * @return {Observable<Patient | void>}
   */
  findByIdAndUpdate = (
    id: string,
    patient: UpdatePatientDto,
  ): Observable<Patient | void> =>
    from(
      this._patientModel.findByIdAndUpdate(id, patient, {
        new: true,
        runValidators: true,
      }),
    );

  /**
   * Delete a patient in patient list
   *
   * @param {string} id
   *
   * @return {Observable<Patient | void>}
   */
  findByIdAndRemove = (id: string): Observable<Patient | void> =>
    from(this._patientModel.findByIdAndRemove(id));

  findByDoctorId = (doctorId: String): Observable<Patient[]> =>
    from(this._patientModel.find({ doctorId }).lean()).pipe(
      map((patients) => Array.isArray(patients)
        ? patients.map((patient) => ({ ...patient, id: patient._id }))
        : [{ ...patients, id: patients._id }]
      )
    );

    findIdsByDoctorId = (doctorId: String): Observable<string[]> =>
    this.findByDoctorId(doctorId).pipe(
      map((patients) => patients.map((patient) => (patient._id).toString()))
    )
}
