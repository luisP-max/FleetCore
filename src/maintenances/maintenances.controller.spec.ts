import { Test, TestingModule } from '@nestjs/testing';
import { MaintenancesController } from './maintenances.controller.js';

describe('MaintenancesController', () => {
  let controller: MaintenancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaintenancesController],
    }).compile();

    controller = module.get<MaintenancesController>(MaintenancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
