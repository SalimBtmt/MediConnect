import { Exclude, Expose, Type } from 'class-transformer'
import { Consultation } from '../schemas/consultation.schema';
import { PersonAddressEntity } from 'src/common/entities/person-address.entity';

@Exclude()
export class ConsultationEntity {
    @Expose()
    @Type(() => String)
    id: string;

    @Expose()
    @Type(() => String)
    dateStart: string;

    @Expose()
    @Type(() => String)
    dateEnd: string;

    @Expose()
    @Type(() => String)
    motive: string;

    @Expose()
    @Type(() => String)
    comment: string;

    @Expose()
    @Type(() => String)
    prescription: string;

    @Expose()
    @Type(() => String)
    patientId: string;

      /**
   * Class constructor
   *
   * @param partial data to insert in object instance
   */
  constructor(partial: Partial<Consultation>) {
    Object.assign(this, partial);
  }
}