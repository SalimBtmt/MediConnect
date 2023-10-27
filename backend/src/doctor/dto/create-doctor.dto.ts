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
import { PersonAddressDto } from '../../common/dto/person-address.dto';
import { Type } from 'class-transformer';

export class CreateDoctorDto {
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsString()
    @IsNotEmpty()
    specialty: string;

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
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}