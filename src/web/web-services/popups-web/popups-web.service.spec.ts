import { Test, TestingModule } from '@nestjs/testing';
import { PopupsWebService } from './popups-web.service';

describe('PopupsWebService', () => {
  let service: PopupsWebService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PopupsWebService],
    }).compile();

    service = module.get<PopupsWebService>(PopupsWebService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
