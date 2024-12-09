import { Test, TestingModule } from '@nestjs/testing';
import { DivergenciasController } from './divergencias.controller';
import { DivergenciasService } from './divergencias.service';

describe('DivergenciasController', () => {
  let controller: DivergenciasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DivergenciasController],
      providers: [DivergenciasService],
    }).compile();

    controller = module.get<DivergenciasController>(DivergenciasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
