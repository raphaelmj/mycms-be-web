import { Investition } from './../entities/Investition';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Investition)
export class InvestitionRespository extends Repository<Investition> {}
