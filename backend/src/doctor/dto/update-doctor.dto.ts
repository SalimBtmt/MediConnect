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
import { PersonAddressDto } from './person-address.dto';
import { Type } from 'class-transformer';

export class UpdateDoctorDto {
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    specialty: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsPhoneNumber('FR')
    phone: string;

    @IsOptional()
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