import { Variant } from './../entities/Variant';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Variant)
export class VariantRespository extends Repository<Variant> {}
