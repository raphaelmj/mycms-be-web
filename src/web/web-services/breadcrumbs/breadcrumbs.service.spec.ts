import { Test, TestingModule } from '@nestjs/testing';
import { BreadcrumbsService } from './breadcrumbs.service';

describe('BreadcrumbsService', () => {
  let service: BreadcrumbsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BreadcrumbsService],
    }).compile();

    service = module.get<BreadcrumbsService>(BreadcrumbsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
