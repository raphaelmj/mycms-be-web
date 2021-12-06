import { Article } from './../entities/Article';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Article)
export class ArticleRespository extends Repository<Article> {}
