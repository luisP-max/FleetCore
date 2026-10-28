import { Module } from '@nestjs/common';
import { MaintenancesService } from './maintenances.service.js';
import { MaintenancesController } from './maintenances.controller.js';

@Module({
  providers: [MaintenancesService],
  controllers: [MaintenancesController]
})
export class MaintenancesModule {}
