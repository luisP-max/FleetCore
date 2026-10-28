import { IsNotEmpty, IsString, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { VehicleStatus } from '../enums/vehicle-status.enum.js';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  plate: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsNumber()
  @Min(0)
  mileage: number;

  @IsEnum(VehicleStatus)
  status: VehicleStatus;
}
