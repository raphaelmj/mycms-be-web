import { Position } from './../entities/Position';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Position)
export class PositionRespository extends Repository<Position> {}
