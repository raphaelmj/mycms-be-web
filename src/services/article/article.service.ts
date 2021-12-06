import { ArticleDto } from './../../dto/article.dto';
import { ArticleQueryDto } from './../../dto/article-query.dto';
import { Article } from './../../entities/Article';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Like, Not, Repository } from 'typeorm';
import * as config from 'config';
import * as slug from 'slug';
import { PageQuery } from '../../interfaces/web/page-query.interface';
import { PartialsPageData } from '../../interfaces/web/partials-page-data.interface';
import { Category } from '../../entities/Category';

const paginationConfig: { limit: number } = config.get('pagination');

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async all(relations: string[] = []): Promise<Article[]> {
    return await this.articleRepository.find({ relations });
  }

  async findMany(
    params: ArticleQueryDto,
  ): Promise<{ elements: Article[]; total: number; qp: ArticleQueryDto }> {
    const query = { where: {} };
    let skip = 0;
    if (params.phrase) query.where['title'] = Like(`%${params.phrase}%`);
    const totalQuery = Object.assign({}, query);
    if (params.page) {
      const page = Number(params.page);
      skip =
        page > 0 ? (page - 1) * paginationConfig.limit : paginationConfig.limit;
    } else {
      params.page = '1';
    }
    query['skip'] = skip;
    query['take'] = paginationConfig.limit;
    query['order'] = { publishedAt: 'DESC' };
    query['relations'] = ['category'];

    const total = await this.articleRepository.count(totalQuery);
    const elements: Article[] = await this.articleRepository.find(query);

    return { elements, total, qp: params };
  }

  async findManyPublic(
    params: ArticleQueryDto,
  ): Promise<{ elements: Article[]; total: number; qp: ArticleQueryDto }> {
    const query = { where: {} };
    let skip = 0;
    if (params.phrase) query.where['title'] = Like(`%${params.phrase}%`);
    const totalQuery = Object.assign({}, query);
    if (params.page) {
      const page = Number(params.page);
      skip =
        page > 0 ? (page - 1) * paginationConfig.limit : paginationConfig.limit;
    } else {
      params.page = '1';
    }
    query.where['status'] = true;
    query['skip'] = skip;
    query['take'] = paginationConfig.limit;
    query['order'] = { publishedAt: 'DESC' };

    const total = await this.articleRepository.count(totalQuery);
    const elements: Article[] = await this.articleRepository.find(query);

    return { elements, total, qp: params };
  }

  async create(
    body: ArticleDto,
    image: string,
    categoryId: number,
    noImage: boolean,
  ): Promise<Article> {
    const alias = slug(body.title, { lower: true });
    const isExists = await this.isAliasExits(alias);
    let art: ArticleDto = <ArticleDto>(<unknown>body);
    if (!art.image) {
      const { image, ...rest } = art;
      art = <ArticleDto>(<unknown>rest);
    }
    if (image) {
      art.image = image;
    }
    if (isExists) {
      art.alias = null;
      const nart: Article = await this.articleRepository.create(art).save();
      nart.alias = nart.alias + '-' + nart.id;
      await nart.save();
      return nart;
    } else {
      art.alias = alias;
      const article = await this.articleRepository.create(art).save();
      if (categoryId) {
        const category = await this.categoryRepository.findOne(categoryId);
        article.category = category;
        await article.save();
      } else {
        article.category = null;
        await article.save();
      }
      return article;
    }
  }

  async update(
    body: ArticleDto,
    image: string,
    categoryId: number,
    noImage: boolean,
  ) {
    const alias = slug(body.title, { lower: true });
    const isExists = await this.isAliasExits(alias, true, body.id);
    let art: ArticleDto = Object.assign({}, body);
    if (!art.image) {
      const { image, ...rest } = art;
      art = <ArticleDto>(<unknown>rest);
    }
    if (image) {
      art.image = image;
    }
    if (noImage) {
      art.image = '/img/news_noimg.png';
    }
    if (isExists) {
      art.alias = alias + '-' + body.id;
    } else {
      art.alias = alias;
    }
    await this.articleRepository.update(body.id, art);
    const article: Article = await this.articleRepository.findOne(body.id, {
      relations: ['category'],
    });
    if (categoryId) {
      const category = await this.categoryRepository.findOne(categoryId);
      article.category = category;
      await article.save();
    } else {
      article.category = null;
      await article.save();
    }
    return await this.articleRepository.findOne(body.id);
  }

  async isAliasExits(
    alias: string,
    except = false,
    id?: number,
  ): Promise<boolean> {
    if (except) {
      const c = await this.articleRepository.count({
        where: { alias, id: Not(id) },
      });
      return c > 0;
    } else {
      const c = await this.articleRepository.count({ where: { alias } });
      return c > 0;
    }
  }

  async updateField(id: number, value: any, field: string) {
    const article = await this.articleRepository.findOne(id);
    article[field] = value;
    await article.save();
    return article;
  }

  async delete(id: number) {
    return await this.articleRepository.delete(id);
  }

  async getArticlesPages(
    query: PageQuery,
    categoryId?: number,
  ): Promise<PartialsPageData<Article>> {
    let page = 1;
    let skip = 0;
    const take = paginationConfig.limit;
    if (query?.page) {
      page = Number(query.page);
    }
    if (page) {
      skip = (page - 1) * paginationConfig.limit;
    }
    const total = await this.articleRepository.count({ status: true });
    const where: any = {
      status: true,
    };
    if (categoryId) {
      where.category = {
        id: categoryId,
      };
    }
    const articles: Article[] = await this.articleRepository.find({
      where,
      order: { publishedAt: 'DESC' },
      skip,
      take,
    });
    return { results: articles, page, total };
  }
}
