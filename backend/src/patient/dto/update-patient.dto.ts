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

export class UpdatePatientDto {
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

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
    bloodtype: string;
}