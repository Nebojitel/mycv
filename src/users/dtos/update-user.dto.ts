import { IsEmail, isString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsEmail()
  @IsOptional()
  password: string;
}
