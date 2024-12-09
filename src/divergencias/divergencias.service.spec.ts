import { Test, TestingModule } from '@nestjs/testing';
import { DivergenciasService } from './divergencias.service';

describe('DivergenciasService', () => {
  let service: DivergenciasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DivergenciasService],
    }).compile();

    service = module.get<DivergenciasService>(DivergenciasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
