import { Category } from './../entities/Category';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Category)
export class CategoryRespository extends Repository<Category> {}
