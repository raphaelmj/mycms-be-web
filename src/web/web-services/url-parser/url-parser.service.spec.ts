import { Test, TestingModule } from '@nestjs/testing';
import { UrlParserService } from './url-parser.service';

describe('UrlParserService', () => {
  let service: UrlParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlParserService],
    }).compile();

    service = module.get<UrlParserService>(UrlParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
