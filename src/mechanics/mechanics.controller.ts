import { Controller, Get, Post, Body, Patch, Param, UseInterceptors } from '@nestjs/common';
import { MechanicsService } from './mechanics.service.js';
import { CreateMechanicDto } from './dto/create-mechanic.dto.js';
import { UpdateMechanicDto } from './dto/update-mechanic.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../users/enums/role.enum.js';
import { MechanicStatus } from './enums/mechanic-status.enum.js';
import { StatusTextInterceptor } from '../common/interceptors/status-text.interceptor.js';

@Controller('mechanics')
@UseInterceptors(StatusTextInterceptor)
export class MechanicsController {
  constructor(private readonly mechanicsService: MechanicsService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createMechanicDto: CreateMechanicDto) {
    return await this.mechanicsService.create(createMechanicDto);
  }

  @Get()
  async findAll() {
    return await this.mechanicsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.mechanicsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateMechanicDto: UpdateMechanicDto) {
    return await this.mechanicsService.update(id, updateMechanicDto);
  }

  @Patch(':id/activate')
  @Roles(Role.ADMIN)
  async activate(@Param('id') id: string) {
    return await this.mechanicsService.changeStatus(id, MechanicStatus.ACTIVE);
  }

  @Patch(':id/inactivate')
  @Roles(Role.ADMIN)
  async deactivate(@Param('id') id: string) {
    return await this.mechanicsService.changeStatus(id, MechanicStatus.INACTIVE);
  }
}
