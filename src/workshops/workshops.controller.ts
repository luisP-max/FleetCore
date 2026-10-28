import { Controller, Get, Post, Body, Patch, Param, UseInterceptors } from '@nestjs/common';
import { WorkshopsService } from './workshops.service.js';
import { CreateWorkshopDto } from './dto/create-workshop.dto.js';
import { UpdateWorkshopDto } from './dto/update-workshop.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../users/enums/role.enum.js';
import { WorkshopStatus } from './enums/workshop-status.enum.js';
import { StatusTextInterceptor } from '../common/interceptors/status-text.interceptor.js';

@Controller('workshops')
@UseInterceptors(StatusTextInterceptor)
export class WorkshopsController {
  constructor(private readonly workshopsService: WorkshopsService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createWorkshopDto: CreateWorkshopDto) {
    return await this.workshopsService.create(createWorkshopDto);
  }

  @Get()
  async findAllActive() {
    return await this.workshopsService.findAllActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.workshopsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateWorkshopDto: UpdateWorkshopDto) {
    return await this.workshopsService.update(id, updateWorkshopDto);
  }

  @Patch(':id/activate')
  @Roles(Role.ADMIN)
  async activate(@Param('id') id: string) {
    return await this.workshopsService.changeStatus(id, WorkshopStatus.ACTIVE);
  }

  @Patch(':id/inactivate')
  @Roles(Role.ADMIN)
  async deactivate(@Param('id') id: string) {
    return await this.workshopsService.changeStatus(id, WorkshopStatus.INACTIVE);
  }
}
