import { Test, TestingModule } from '@nestjs/testing';
import { NoticeWebService } from './notice-web.service';

describe('NoticeWebService', () => {
  let service: NoticeWebService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoticeWebService],
    }).compile();

    service = module.get<NoticeWebService>(NoticeWebService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
