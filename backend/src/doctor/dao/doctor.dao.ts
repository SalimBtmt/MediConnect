import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Doctor } from "../schemas/doctor.schema";
import { Model } from "mongoose";
import { Observable, from, map } from "rxjs";

@Injectable()
export class DoctorDao {

    constructor(
        @InjectModel(Doctor.name)
        private readonly _doctorModel: Model<Doctor>
    ) {}

    find = (): Observable<Doctor[]> =>
        from(this._doctorModel.find({})).pipe(map((doctor) => [].concat(doctor)));


}