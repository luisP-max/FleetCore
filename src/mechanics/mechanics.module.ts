import { Module } from '@nestjs/common';
import { MechanicsService } from './mechanics.service.js';
import { MechanicsController } from './mechanics.controller.js';

@Module({
  providers: [MechanicsService],
  controllers: [MechanicsController]
})
export class MechanicsModule {}
