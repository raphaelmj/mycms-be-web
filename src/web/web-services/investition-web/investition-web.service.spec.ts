import { Test, TestingModule } from '@nestjs/testing';
import { InvestitionWebService } from './investition-web.service';

describe('InvestitionWebService', () => {
  let service: InvestitionWebService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestitionWebService],
    }).compile();

    service = module.get<InvestitionWebService>(InvestitionWebService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
