import { Office } from './../entities/Office';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Office)
export class OfficeRespository extends Repository<Office> {}
