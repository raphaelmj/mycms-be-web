import { Test, TestingModule } from '@nestjs/testing';
import { ArticleWebService } from './article-web.service';

describe('ArticleWebService', () => {
  let service: ArticleWebService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleWebService],
    }).compile();

    service = module.get<ArticleWebService>(ArticleWebService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
