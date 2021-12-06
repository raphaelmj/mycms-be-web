import { Injectable } from '@nestjs/common';
import { ArticleService } from '../../../services/article/article.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../../../entities/Article';
import { PageQuery } from '../../../interfaces/web/page-query.interface';
import { PartialsPageData } from '../../../interfaces/web/partials-page-data.interface';

@Injectable()
export class ArticleWebService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private articleService: ArticleService,
  ) {}

  async getArticlesPages(
    query: PageQuery,
    categoryId?: number,
  ): Promise<PartialsPageData<Article>> {
    return await this.articleService.getArticlesPages(query, categoryId);
  }

  async getArticleByAlias(alias: string): Promise<Article> {
    return await this.articleRepository.findOne({
      where: { alias, status: true },
    });
  }
}
