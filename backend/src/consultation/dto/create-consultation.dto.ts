import {
    IsBoolean,
    IsDate,
    IsEmail,
    IsInstance,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    ValidateNested,
  } from 'class-validator';
import { Type } from 'class-transformer';
import { PersonAddressDto } from 'src/common/dto/person-address.dto';

export class CreateConsultationDto {

    @IsDate()
    @IsNotEmpty()
    dateStart: string;

    @IsDate()
    @IsNotEmpty()
    dateEnd: string;

    @IsString()
    @IsNotEmpty()
    motive: string;

    @IsString()
    @IsNotEmpty()
    doctorId: string;

    @IsString()
    @IsNotEmpty()
    patientId: string;
}