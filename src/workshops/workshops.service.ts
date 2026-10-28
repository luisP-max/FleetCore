import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workshop } from './entities/workshop.entity.js';
import { CreateWorkshopDto } from './dto/create-workshop.dto.js';
import { UpdateWorkshopDto } from './dto/update-workshop.dto.js';
import { WorkshopStatus } from './enums/workshop-status.enum.js';

@Injectable()
export class WorkshopsService {
  constructor(
    @InjectRepository(Workshop)
    private readonly workshopRepository: Repository<Workshop>,
  ) {}

  async create(createWorkshopDto: CreateWorkshopDto): Promise<Workshop> {
    const newWorkshop = this.workshopRepository.create(createWorkshopDto);
    return await this.workshopRepository.save(newWorkshop);
  }

  async findAllActive(): Promise<Workshop[]> {
    return await this.workshopRepository.find({
      where: { status: WorkshopStatus.ACTIVE },
    });
  }

  async findOne(id: string): Promise<Workshop> {
    const workshop = await this.workshopRepository.findOne({ where: { id } });
    if (!workshop) {
      throw new NotFoundException(`Workshop with ID ${id} not found`);
    }
    return workshop;
  }

  async update(id: string, updateWorkshopDto: UpdateWorkshopDto): Promise<Workshop> {
    const workshop = await this.findOne(id);
    const updatedWorkshop = Object.assign(workshop, updateWorkshopDto);
    return await this.workshopRepository.save(updatedWorkshop);
  }

  async changeStatus(id: string, status: WorkshopStatus): Promise<Workshop> {
    const workshop = await this.findOne(id);
    workshop.status = status;
    return await this.workshopRepository.save(workshop);
  }
}
