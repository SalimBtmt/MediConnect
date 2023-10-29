import { Exclude, Expose, Type } from 'class-transformer'
import { Patient } from '../schemas/patient.schema';
import { PersonAddressEntity } from 'src/common/entities/person-address.entity';

@Exclude()
export class PatientEntity {
    @Expose()
    @Type(() => String)
    id: string;

    @Expose()
    @Type(() => String)
    firstname: string;

    @Expose()
    @Type(() => String)
    lastname: string;

    @Expose()
    @Type(() => String)
    birthDate: string;

    @Expose()
    @Type(() => String)
    email: string;

    @Expose()
    @Type(() => String)
    phone: string;

    @Expose()
    @Type(() => PersonAddressEntity)
    address: PersonAddressEntity;

    @Expose()
    @Type(() => String)
    bloodtype: string;

    @Expose()
    @Type(() => String)
    doctor: string;


      /**
   * Class constructor
   *
   * @param partial data to insert in object instance
   */
  constructor(partial: Partial<Patient>) {
    Object.assign(this, partial);
  }
}