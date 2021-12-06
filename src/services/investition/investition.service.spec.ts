import { Test, TestingModule } from '@nestjs/testing';
import { InvestitionService } from './investition.service';

describe('InvestitionService', () => {
  let service: InvestitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestitionService],
    }).compile();

    service = module.get<InvestitionService>(InvestitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
