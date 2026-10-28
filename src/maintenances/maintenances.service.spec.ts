import { Test, TestingModule } from '@nestjs/testing';
import { MaintenancesService } from './maintenances.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Maintenance } from './entities/maintenance.entity.js';
import { VehiclesService } from '../vehicles/vehicles.service.js';
import { MechanicsService } from '../mechanics/mechanics.service.js';
import { WorkshopsService } from '../workshops/workshops.service.js';
import { BadRequestException } from '@nestjs/common';
import { MaintenanceStatus } from './enums/maintenance-status.enum.js';

describe('MaintenancesService State Transitions', () => {
  let service: MaintenancesService;
  
  // Clean mock configurations satisfying type safety requirements
  const mockMaintenanceRepository = {
    findOne: () => Promise.resolve(null),
    save: (entity: any) => Promise.resolve(entity),
  };
  
  const mockVehiclesService = { 
    update: () => Promise.resolve({}) 
  };
  
  const mockMechanicsService = {};
  const mockWorkshopsService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenancesService,
        { provide: getRepositoryToken(Maintenance), useValue: mockMaintenanceRepository },
        { provide: VehiclesService, useValue: mockVehiclesService },
        { provide: MechanicsService, useValue: mockMechanicsService },
        { provide: WorkshopsService, useValue: mockWorkshopsService },
      ],
    }).compile();

    service = module.get<MaintenancesService>(MaintenancesService);
  });

  // Test 1: Block modification on COMPLETED jobs
  it('should throw BadRequestException if trying to update a COMPLETED maintenance job', async () => {
    mockMaintenanceRepository.findOne = () => Promise.resolve({
      id: 'maint-1',
      status: MaintenanceStatus.COMPLETED,
      vehicle: { id: 'vehicle-1' },
    } as any);

    await expect(
      service.updateStatus('maint-1', { status: MaintenanceStatus.IN_PROGRESS }),
    ).rejects.toThrow(BadRequestException);
  });

  // Test 2: Block modification on CANCELLED jobs
  it('should throw BadRequestException if trying to update a CANCELLED maintenance job', async () => {
    mockMaintenanceRepository.findOne = () => Promise.resolve({
      id: 'maint-2',
      status: MaintenanceStatus.CANCELLED,
      vehicle: { id: 'vehicle-1' },
    } as any);

    await expect(
      service.updateStatus('maint-2', { status: MaintenanceStatus.COMPLETED }),
    ).rejects.toThrow(BadRequestException);
  });
});
