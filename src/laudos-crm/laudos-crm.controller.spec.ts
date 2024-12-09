import { Test, TestingModule } from '@nestjs/testing';
import { LaudosCrmController } from './laudos-crm.controller';
import { LaudosCrmService } from './laudos-crm.service';

describe('LaudosCrmController', () => {
  let controller: LaudosCrmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LaudosCrmController],
      providers: [LaudosCrmService],
    }).compile();

    controller = module.get<LaudosCrmController>(LaudosCrmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
