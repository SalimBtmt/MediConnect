import {
    IsBoolean,
    IsEmail,
    IsInstance,
    IsDate,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    ValidateNested,
  } from 'class-validator';
import { Type } from 'class-transformer';
import { PersonAddressDto } from 'src/common/dto/person-address.dto';

export class UpdateConsultationDto {

  @IsDate()
  @IsNotEmpty()
  dateStart: string;

  @IsDate()
  @IsNotEmpty()
  dateEnd: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  motive: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  prescription: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  patientId: string;

}