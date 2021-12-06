import { Page } from './../entities/Page';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Page)
export class PageRespository extends Repository<Page> {}
