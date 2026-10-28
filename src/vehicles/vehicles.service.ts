import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity.js';
import { CreateVehicleDto } from './dto/create-vehicle.dto.js';
import { UpdateVehicleDto } from './dto/update-vehicle.dto.js';
import { VehicleStatus } from './enums/vehicle-status.enum.js';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { plate: createVehicleDto.plate },
    });
    
    if (existingVehicle) {
      throw new BadRequestException(`Vehicle with plate ${createVehicleDto.plate} already exists`);
    }

    const newVehicle = this.vehicleRepository.create(createVehicleDto);
    return await this.vehicleRepository.save(newVehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return await this.vehicleRepository.find();
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async findByPlate(plate: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({ where: { plate } });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with plate ${plate} not found`);
    }
    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    
    if (updateVehicleDto.plate && updateVehicleDto.plate !== vehicle.plate) {
      const plateCollision = await this.vehicleRepository.findOne({
        where: { plate: updateVehicleDto.plate },
      });
      if (plateCollision) {
        throw new BadRequestException(`Vehicle with plate ${updateVehicleDto.plate} already exists`);
      }
    }

    const updatedVehicle = Object.assign(vehicle, updateVehicleDto);
    return await this.vehicleRepository.save(updatedVehicle);
  }

  async softDelete(id: string): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    vehicle.status = VehicleStatus.INACTIVE; 
    return await this.vehicleRepository.save(vehicle);
  }
}
