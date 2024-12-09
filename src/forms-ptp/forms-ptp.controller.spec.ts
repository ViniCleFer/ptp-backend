import { Test, TestingModule } from '@nestjs/testing';
import { FormsPtpController } from './forms-ptp.controller';
import { FormsPtpService } from './forms-ptp.service';

describe('FormsPtpController', () => {
  let controller: FormsPtpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormsPtpController],
      providers: [FormsPtpService],
    }).compile();

    controller = module.get<FormsPtpController>(FormsPtpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
