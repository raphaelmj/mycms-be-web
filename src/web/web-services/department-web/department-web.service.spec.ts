import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentWebService } from './department-web.service';

describe('DepartmentWebService', () => {
  let service: DepartmentWebService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartmentWebService],
    }).compile();

    service = module.get<DepartmentWebService>(DepartmentWebService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
