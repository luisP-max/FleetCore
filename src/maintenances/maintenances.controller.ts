import { Controller, Get, Post, Body, Patch, Param, UseInterceptors } from '@nestjs/common';
import { MaintenancesService } from './maintenances.service.js';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto.js';
import { UpdateMaintenanceStatusDto } from './dto/update-status.dto.js';
import { StatusTextInterceptor } from '../common/interceptors/status-text.interceptor.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../users/enums/role.enum.js';

@Controller('maintenances')
@UseInterceptors(StatusTextInterceptor)
export class MaintenancesController {
  constructor(private readonly maintenancesService: MaintenancesService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createMaintenanceDto: CreateMaintenanceDto) {
    return await this.maintenancesService.create(createMaintenanceDto);
  }

  @Get()
  async findAll() {
    return await this.maintenancesService.findAll();
  }

  @Get('active')
  async findActive() {
    return await this.maintenancesService.findActive();
  }

  @Get('vehicle/:vehicleId')
  async findByVehicle(@Param('vehicleId') vehicleId: string) {
    return await this.maintenancesService.findByVehicle(vehicleId);
  }

  @Get('mechanic/:mechanicId')
  async findByMechanic(@Param('mechanicId') mechanicId: string) {
    return await this.maintenancesService.findByMechanic(mechanicId);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.TECHNICIAN)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateMaintenanceStatusDto: UpdateMaintenanceStatusDto,
  ) {
    return await this.maintenancesService.updateStatus(id, updateMaintenanceStatusDto);
  }
}
