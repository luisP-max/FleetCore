import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { WorkshopStatus } from '../enums/workshop-status.enum.js';

export class CreateWorkshopDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(WorkshopStatus)
  status: WorkshopStatus;
}
