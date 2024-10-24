import {
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  IsPositive,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsInt()
  @IsPositive()
  age: number;

  @IsString()
  country: string;

  @IsString()
  district: string;

  @IsString()
  role: string;
}
