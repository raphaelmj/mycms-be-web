import { EntityRepository, Repository } from 'typeorm';
import { Popup } from '../entities/Popup';

@EntityRepository(Popup)
export class PopupRepository extends Repository<Popup> {}
