import { Test, TestingModule } from '@nestjs/testing';
import { PageDataFinderService } from './page-data-finder.service';

describe('PageDataFinderService', () => {
  let service: PageDataFinderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PageDataFinderService],
    }).compile();

    service = module.get<PageDataFinderService>(PageDataFinderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
