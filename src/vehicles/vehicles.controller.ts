import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { VehiclesService } from './vehicles.service.js';
import { CreateVehicleDto } from './dto/create-vehicle.dto.js';
import { UpdateVehicleDto } from './dto/update-vehicle.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../users/enums/role.enum.js';
import { StatusTextInterceptor } from '../common/interceptors/status-text.interceptor.js';

@Controller('vehicles')
@UseInterceptors(StatusTextInterceptor)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return await this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  async findAll() {
    return await this.vehiclesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.vehiclesService.findOne(id);
  }

  @Get('plate/:plate')
  async findByPlate(@Param('plate') plate: string) {
    return await this.vehiclesService.findByPlate(plate);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return await this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    return await this.vehiclesService.softDelete(id);
  }
}
