import { Test, TestingModule } from '@nestjs/testing';
import { OfficeWebService } from './office-web.service';

describe('OfficeWebService', () => {
  let service: OfficeWebService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfficeWebService],
    }).compile();

    service = module.get<OfficeWebService>(OfficeWebService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
