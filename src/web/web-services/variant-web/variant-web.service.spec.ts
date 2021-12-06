import { Test, TestingModule } from '@nestjs/testing';
import { VariantWebService } from './variant-web.service';

describe('VariantWebService', () => {
  let service: VariantWebService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VariantWebService],
    }).compile();

    service = module.get<VariantWebService>(VariantWebService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
