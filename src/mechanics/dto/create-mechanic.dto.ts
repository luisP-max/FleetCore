import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MechanicStatus } from '../enums/mechanic-status.enum.js';

export class CreateMechanicDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  specialty: string;

  @IsEnum(MechanicStatus)
  status: MechanicStatus;
}
