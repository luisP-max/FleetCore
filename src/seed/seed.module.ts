import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service.js';
import { User } from '../users/entities/user.entity.js';
import { Vehicle } from '../vehicles/entities/vehicle.entity.js';
import { Mechanic } from '../mechanics/entities/mechanic.entity.js';
import { Workshop } from '../workshops/entities/workshop.entity.js';
import { Maintenance } from '../maintenances/entities/maintenance.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      Vehicle, 
      Mechanic, 
      Workshop, 
      Maintenance
    ]),
  ],
  controllers: [],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
