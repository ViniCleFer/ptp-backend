import { Test, TestingModule } from '@nestjs/testing';
import { LaudosCrmService } from './laudos-crm.service';

describe('LaudosCrmService', () => {
  let service: LaudosCrmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LaudosCrmService],
    }).compile();

    service = module.get<LaudosCrmService>(LaudosCrmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
