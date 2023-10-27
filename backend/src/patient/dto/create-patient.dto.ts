import {
    IsBoolean,
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

export class CreatePatientDto {
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsEmail()
    email: string;

    @IsPhoneNumber('FR')
    phone: string;

    @IsInstance(PersonAddressDto)
    @ValidateNested()
    @Type(() => PersonAddressDto)
    address: PersonAddressDto;

    @IsString()
    @IsNotEmpty()
    bloodtype: string;
}