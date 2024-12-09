import { Test, TestingModule } from '@nestjs/testing';
import { FormsPtpService } from './forms-ptp.service';

describe('FormsPtpService', () => {
  let service: FormsPtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormsPtpService],
    }).compile();

    service = module.get<FormsPtpService>(FormsPtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
