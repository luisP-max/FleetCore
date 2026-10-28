import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Maintenance } from './entities/maintenance.entity.js';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto.js';
import { UpdateMaintenanceStatusDto } from './dto/update-status.dto.js';
import { MaintenanceStatus } from './enums/maintenance-status.enum.js';
import { VehiclesService } from '../vehicles/vehicles.service.js';
import { MechanicsService } from '../mechanics/mechanics.service.js';
import { WorkshopsService } from '../workshops/workshops.service.js';
import { VehicleStatus } from '../vehicles/enums/vehicle-status.enum.js';
import { MechanicStatus } from '../mechanics/enums/mechanic-status.enum.js';
import { WorkshopStatus } from '../workshops/enums/workshop-status.enum.js';

@Injectable()
export class MaintenancesService {
  constructor(
    @InjectRepository(Maintenance)
    private readonly maintenanceRepository: Repository<Maintenance>,
    private readonly vehiclesService: VehiclesService,
    private readonly mechanicsService: MechanicsService,
    private readonly workshopsService: WorkshopsService,
  ) {}

  async create(createMaintenanceDto: CreateMaintenanceDto): Promise<Maintenance> {
    const vehicle = await this.vehiclesService.findOne(createMaintenanceDto.vehicleId);
    const mechanic = await this.mechanicsService.findOne(createMaintenanceDto.mechanicId);
    const workshop = await this.workshopsService.findOne(createMaintenanceDto.workshopId);

    // Business Rules Validation
    if (vehicle.status === VehicleStatus.INACTIVE) {
      throw new BadRequestException('Cannot assign a maintenance to an INACTIVE vehicle');
    }
    if (mechanic.status === MechanicStatus.INACTIVE) {
      throw new BadRequestException('Cannot assign an INACTIVE mechanic');
    }
    if (workshop.status === WorkshopStatus.INACTIVE) {
      throw new BadRequestException('Cannot assign an INACTIVE workshop');
    }
    if (createMaintenanceDto.mileage < vehicle.mileage) {
      throw new BadRequestException(`Mileage cannot be lower than the vehicle's current mileage (${vehicle.mileage})`);
    }

    // Check if vehicle already has an active maintenance
    const activeVehicleMaint = await this.maintenanceRepository.findOne({
      where: [
        { vehicle: { id: vehicle.id }, status: MaintenanceStatus.SCHEDULED },
        { vehicle: { id: vehicle.id }, status: MaintenanceStatus.IN_PROGRESS },
      ],
    });
    if (activeVehicleMaint) {
      throw new BadRequestException('This vehicle already has an active maintenance job');
    }

    // Check if mechanic already has an active maintenance
    const activeMechanicMaint = await this.maintenanceRepository.findOne({
      where: [
        { mechanic: { id: mechanic.id }, status: MaintenanceStatus.SCHEDULED },
        { mechanic: { id: mechanic.id }, status: MaintenanceStatus.IN_PROGRESS },
      ],
    });
    if (activeMechanicMaint) {
      throw new BadRequestException('This mechanic is already assigned to an active maintenance job');
    }

    const newMaintenance = this.maintenanceRepository.create({
      ...createMaintenanceDto,
      vehicle,
      mechanic,
      workshop,
      status: MaintenanceStatus.SCHEDULED,
    });

    return await this.maintenanceRepository.save(newMaintenance);
  }

  async findAll(): Promise<Maintenance[]> {
    return await this.maintenanceRepository.find();
  }

  async findActive(): Promise<Maintenance[]> {
    return await this.maintenanceRepository.find({
      where: [
        { status: MaintenanceStatus.SCHEDULED },
        { status: MaintenanceStatus.IN_PROGRESS },
      ],
    });
  }

  async findByVehicle(vehicleId: string): Promise<Maintenance[]> {
    return await this.maintenanceRepository.find({
      where: { vehicle: { id: vehicleId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findByMechanic(mechanicId: string): Promise<Maintenance[]> {
    return await this.maintenanceRepository.find({
      where: { mechanic: { id: mechanicId } },
    });
  }

  async updateStatus(id: string, dto: UpdateMaintenanceStatusDto): Promise<Maintenance> {
    const maintenance = await this.maintenanceRepository.findOne({
        where: { id },
        relations: {
          vehicle: true,
        },
      });

    if (!maintenance) {
      throw new NotFoundException(`Maintenance job with ID ${id} not found`);
    }

    const currentStatus = maintenance.status;
    const nextStatus = dto.status;

    // Strict state transitions protection rules
    if (currentStatus === MaintenanceStatus.COMPLETED) {
      throw new BadRequestException('A COMPLETED maintenance job cannot be modified');
    }
    if (currentStatus === MaintenanceStatus.CANCELLED) {
      throw new BadRequestException('A CANCELLED maintenance job cannot be reactivated');
    }

    // Automation of state changes updates on Vehicle availability status
    if (nextStatus === MaintenanceStatus.IN_PROGRESS) {
      maintenance.status = MaintenanceStatus.IN_PROGRESS;
      await this.vehiclesService.update(maintenance.vehicle.id, { status: VehicleStatus.IN_MAINTENANCE });
    }

    if (nextStatus === MaintenanceStatus.CANCELLED) {
      maintenance.status = MaintenanceStatus.CANCELLED;
      await this.vehiclesService.update(maintenance.vehicle.id, { status: VehicleStatus.AVAILABLE });
    }

    if (nextStatus === MaintenanceStatus.COMPLETED) {
      if (!dto.workDone || !dto.finalCost || !dto.finishedAt || !dto.finalMileage) {
        throw new BadRequestException('Missing mandatory closure parameters to complete this maintenance');
      }
      if (dto.finalMileage < maintenance.vehicle.mileage) {
        throw new BadRequestException('Final mileage cannot be lower than the starting mileage');
      }

      maintenance.status = MaintenanceStatus.COMPLETED;
      maintenance.workDone = dto.workDone;
      maintenance.finalCost = dto.finalCost;
      maintenance.finishedAt = new Date(dto.finishedAt);
      maintenance.finalMileage = dto.finalMileage;

      // Update vehicle back to available and update its total mileage log
      await this.vehiclesService.update(maintenance.vehicle.id, {
        status: VehicleStatus.AVAILABLE,
        mileage: dto.finalMileage,
      });
    }

    return await this.maintenanceRepository.save(maintenance);
  }
}
