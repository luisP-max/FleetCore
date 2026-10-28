import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString, Min } from 'class-validator';
import { MaintenanceStatus } from '../enums/maintenance-status.enum.js';

export class UpdateMaintenanceStatusDto {
  @IsEnum(MaintenanceStatus)
  @IsNotEmpty()
  status: MaintenanceStatus;

  @IsString()
  @IsOptional()
  workDone?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  finalCost?: number;

  @IsDateString()
  @IsOptional()
  finishedAt?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  finalMileage?: number;
}
