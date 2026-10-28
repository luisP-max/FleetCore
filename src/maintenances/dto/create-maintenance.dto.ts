import { IsEnum, IsNotEmpty, IsString, IsNumber, IsDateString, IsUUID, Min } from 'class-validator';
import { MaintenanceType } from '../enums/maintenance-type.enum.js';

export class CreateMaintenanceDto {
  @IsEnum(MaintenanceType)
  @IsNotEmpty()
  type: MaintenanceType;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  mileage: number;

  @IsDateString()
  @IsNotEmpty()
  scheduledDate: string;

  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;

  @IsUUID()
  @IsNotEmpty()
  mechanicId: string;

  @IsUUID()
  @IsNotEmpty()
  workshopId: string;
}
