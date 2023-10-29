import { Exclude, Expose, Type } from 'class-transformer'
import { PersonAddressEntity } from '../../common/entities/person-address.entity';
import { Doctor } from '../schemas/doctor.schema';

@Exclude()
export class DoctorEntity {
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
    specialty: string;

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
    username: string;
    
    @Expose()
    @Type(() => String)
    password: string;
    

      /**
   * Class constructor
   *
   * @param partial data to insert in object instance
   */
  constructor(partial: Partial<Doctor>) {
    Object.assign(this, partial);
  }
}