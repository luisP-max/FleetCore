import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mechanic } from './entities/mechanic.entity.js';
import { CreateMechanicDto } from './dto/create-mechanic.dto.js';
import { UpdateMechanicDto } from './dto/update-mechanic.dto.js';
import { MechanicStatus } from './enums/mechanic-status.enum.js';

@Injectable()
export class MechanicsService {
  constructor(
    @InjectRepository(Mechanic)
    private readonly mechanicRepository: Repository<Mechanic>,
  ) {}

  async create(createMechanicDto: CreateMechanicDto): Promise<Mechanic> {
    const existingMechanic = await this.mechanicRepository.findOne({
      where: { email: createMechanicDto.email },
    });

    if (existingMechanic) {
      throw new BadRequestException(`Mechanic with email ${createMechanicDto.email} already registered`);
    }

    const newMechanic = this.mechanicRepository.create(createMechanicDto);
    return await this.mechanicRepository.save(newMechanic);
  }

  async findAll(): Promise<Mechanic[]> {
    return await this.mechanicRepository.find();
  }

  async findOne(id: string): Promise<Mechanic> {
    const mechanic = await this.mechanicRepository.findOne({ where: { id } });
    if (!mechanic) {
      throw new NotFoundException(`Mechanic with ID ${id} not found`);
    }
    return mechanic;
  }

  async update(id: string, updateMechanicDto: UpdateMechanicDto): Promise<Mechanic> {
    const mechanic = await this.findOne(id);

    if (updateMechanicDto.email && updateMechanicDto.email !== mechanic.email) {
      const emailCollision = await this.mechanicRepository.findOne({
        where: { email: updateMechanicDto.email },
      });
      if (emailCollision) {
        throw new BadRequestException(`Mechanic with email ${updateMechanicDto.email} already exists`);
      }
    }

    const updatedMechanic = Object.assign(mechanic, updateMechanicDto);
    return await this.mechanicRepository.save(updatedMechanic);
  }

  async changeStatus(id: string, status: MechanicStatus): Promise<Mechanic> {
    const mechanic = await this.findOne(id);
    mechanic.status = status;
    return await this.mechanicRepository.save(mechanic);
  }
}
