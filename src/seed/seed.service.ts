import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { Vehicle } from '../vehicles/entities/vehicle.entity.js';
import { Mechanic } from '../mechanics/entities/mechanic.entity.js';
import { Workshop } from '../workshops/entities/workshop.entity.js';
import { Maintenance } from '../maintenances/entities/maintenance.entity.js';
import { Role } from '../users/enums/role.enum.js';
import { VehicleStatus } from '../vehicles/enums/vehicle-status.enum.js';
import { MechanicStatus } from '../mechanics/enums/mechanic-status.enum.js';
import { WorkshopStatus } from '../workshops/enums/workshop-status.enum.js';
import { MaintenanceType } from '../maintenances/enums/maintenance-type.enum.js';
import { MaintenanceStatus } from '../maintenances/enums/maintenance-status.enum.js';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Vehicle) private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Mechanic) private readonly mechanicRepository: Repository<Mechanic>,
    @InjectRepository(Workshop) private readonly workshopRepository: Repository<Workshop>,
    @InjectRepository(Maintenance) private readonly maintenanceRepository: Repository<Maintenance>,
  ) {}

  private encodePassword(password: string): string {
    return Buffer.from(password).toString('base64');
  }

  async onModuleInit() {
    console.log(' Initializing automatic database population...');
    const result = await this.runSeed();
    console.log(` ${result}`);
  }

  async runSeed(): Promise<string> {
    const adminEmail = 'admin@fleetcore.com';
    let adminUser = await this.userRepository.findOne({ where: { email: adminEmail } });
    if (!adminUser) {
      adminUser = this.userRepository.create({
        email: adminEmail,
        password: this.encodePassword('AdminPassword123!'),
        role: Role.ADMIN,
      });
      await this.userRepository.save(adminUser);
    }

    const tech1Email = 'tech1@fleetcore.com';
    let tech1 = await this.userRepository.findOne({ where: { email: tech1Email } });
    if (!tech1) {
      tech1 = this.userRepository.create({
        email: tech1Email,
        password: this.encodePassword('TechPassword123!'),
        role: Role.TECHNICIAN,
      });
      await this.userRepository.save(tech1);
    }

    const tech2Email = 'tech2@fleetcore.com';
    let tech2 = await this.userRepository.findOne({ where: { email: tech2Email } });
    if (!tech2) {
      tech2 = this.userRepository.create({
        email: tech2Email,
        password: this.encodePassword('TechPassword456!'),
        role: Role.TECHNICIAN,
      });
      await this.userRepository.save(tech2);
    }

    let activeWorkshop = await this.workshopRepository.findOne({ where: { name: 'Main HQ Workshop' } });
    if (!activeWorkshop) {
      activeWorkshop = this.workshopRepository.create({
        name: 'Main HQ Workshop',
        address: '123 Industrial Ave',
        status: WorkshopStatus.ACTIVE,
      });
      await this.workshopRepository.save(activeWorkshop);
    }

    let inactiveWorkshop = await this.workshopRepository.findOne({ where: { name: 'Old Town Garage' } });
    if (!inactiveWorkshop) {
      inactiveWorkshop = this.workshopRepository.create({
        name: 'Old Town Garage',
        address: '456 Rust Road',
        status: WorkshopStatus.INACTIVE,
      });
      await this.workshopRepository.save(inactiveWorkshop);
    }

    let mech1 = await this.mechanicRepository.findOne({ where: { email: 'john.doe@fleetcore.com' } });
    if (!mech1) {
      mech1 = this.mechanicRepository.create({
        name: 'John Doe',
        email: 'john.doe@fleetcore.com',
        specialty: 'Engines',
        status: MechanicStatus.ACTIVE,
      });
      await this.mechanicRepository.save(mech1);
    }

    let mech2 = await this.mechanicRepository.findOne({ where: { email: 'jane.smith@fleetcore.com' } });
    if (!mech2) {
      mech2 = this.mechanicRepository.create({
        name: 'Jane Smith',
        email: 'jane.smith@fleetcore.com',
        specialty: 'Brakes',
        status: MechanicStatus.ACTIVE,
      });
      await this.mechanicRepository.save(mech2);
    }

    let mech3 = await this.mechanicRepository.findOne({ where: { email: 'bob.rust@fleetcore.com' } });
    if (!mech3) {
      mech3 = this.mechanicRepository.create({
        name: 'Bob Rust',
        email: 'bob.rust@fleetcore.com',
        specialty: 'Suspension',
        status: MechanicStatus.INACTIVE,
      });
      await this.mechanicRepository.save(mech3);
    }

    let v1 = await this.vehicleRepository.findOne({ where: { plate: 'ABC123' } });
    if (!v1) {
      v1 = this.vehicleRepository.create({
        plate: 'ABC123',
        brand: 'Chevrolet',
        model: 'NPR',
        year: 2022,
        mileage: 45000,
        status: VehicleStatus.AVAILABLE,
      });
      await this.vehicleRepository.save(v1);
    }

    let v2 = await this.vehicleRepository.findOne({ where: { plate: 'XYZ789' } });
    if (!v2) {
      v2 = this.vehicleRepository.create({
        plate: 'XYZ789',
        brand: 'Hino',
        model: 'Dutro',
        year: 2021,
        mileage: 62000,
        status: VehicleStatus.AVAILABLE,
      });
      await this.vehicleRepository.save(v2);
    }

    let v3 = await this.vehicleRepository.findOne({ where: { plate: 'MNT456' } });
    if (!v3) {
      v3 = this.vehicleRepository.create({
        plate: 'MNT456',
        brand: 'Kenworth',
        model: 'T800',
        year: 2020,
        mileage: 120000,
        status: VehicleStatus.IN_MAINTENANCE,
      });
      await this.vehicleRepository.save(v3);
    }

    let v4 = await this.vehicleRepository.findOne({ where: { plate: 'INC999' } });
    if (!v4) {
      v4 = this.vehicleRepository.create({
        plate: 'INC999',
        brand: 'International',
        model: 'WorkStar',
        year: 2018,
        mileage: 250000,
        status: VehicleStatus.INACTIVE,
      });
      await this.vehicleRepository.save(v4);
    }

    const existingMaintenances = await this.maintenanceRepository.find();
    if (existingMaintenances.length === 0) {
      const completedMaint = this.maintenanceRepository.create({
        type: MaintenanceType.PREVENTIVE,
        description: 'Routine oil and filters change',
        mileage: 40000,
        scheduledDate: new Date('2026-09-15T08:00:00Z'),
        status: MaintenanceStatus.COMPLETED,
        workDone: 'Replaced synthetic oil and air/oil filters',
        finalCost: 350.00,
        finishedAt: new Date('2026-09-15T12:00:00Z'),
        finalMileage: 40150,
        vehicle: v1,
        mechanic: mech1,
        workshop: activeWorkshop,
      });
      await this.maintenanceRepository.save(completedMaint);

      const inProgressMaint = this.maintenanceRepository.create({
        type: MaintenanceType.CORRECTIVE,
        description: 'Clutch kit replacement transmission system overhaul',
        mileage: 120000,
        scheduledDate: new Date(),
        status: MaintenanceStatus.IN_PROGRESS,
        vehicle: v3,
        mechanic: mech2,
        workshop: activeWorkshop,
      });
      await this.maintenanceRepository.save(inProgressMaint);
    }

    return 'Database seeding execution completed successfully without duplicates.';
  }
}
