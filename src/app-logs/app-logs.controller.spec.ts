import { Test, TestingModule } from '@nestjs/testing';
import { AppLogsController } from './app-logs.controller';
import { AppLogsService } from './app-logs.service';

describe('AppLogsController', () => {
  let controller: AppLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppLogsController],
      providers: [AppLogsService],
    }).compile();

    controller = module.get<AppLogsController>(AppLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
