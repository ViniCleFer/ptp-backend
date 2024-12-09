import { Test, TestingModule } from '@nestjs/testing';
import { AppLogsService } from './app-logs.service';

describe('AppLogsService', () => {
  let service: AppLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppLogsService],
    }).compile();

    service = module.get<AppLogsService>(AppLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
