import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { MaintenanceType } from '../enums/maintenance-type.enum.js';
import { MaintenanceStatus } from '../enums/maintenance-status.enum.js';
import { Vehicle } from '../../vehicles/entities/vehicle.entity.js';
import { Mechanic } from '../../mechanics/entities/mechanic.entity.js';
import { Workshop } from '../../workshops/entities/workshop.entity.js';

@Entity('maintenances')
export class Maintenance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: MaintenanceType,
  })
  type: MaintenanceType;

  @Column()
  description: string;

  @Column({ type: 'int' })
  mileage: number;

  @Column({ name: 'scheduled_date', type: 'timestamp' })
  scheduledDate: Date;

  @Column({
    type: 'enum',
    enum: MaintenanceStatus,
    default: MaintenanceStatus.SCHEDULED,
  })
  status: MaintenanceStatus;

  @Column({ name: 'work_done', nullable: true })
  workDone: string;

  @Column({ name: 'final_cost', type: 'decimal', precision: 10, scale: 2, nullable: true })
  finalCost: number;

  @Column({ name: 'finished_at', type: 'timestamp', nullable: true })
  finishedAt: Date;

  @Column({ name: 'final_mileage', type: 'int', nullable: true })
  finalMileage: number;

  // Relations
  @ManyToOne(() => Vehicle, { eager: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => Mechanic, { eager: true })
  @JoinColumn({ name: 'mechanic_id' })
  mechanic: Mechanic;

  @ManyToOne(() => Workshop, { eager: true })
  @JoinColumn({ name: 'workshop_id' })
  workshop: Workshop;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
