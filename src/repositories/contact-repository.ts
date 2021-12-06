import { Contact } from './../entities/Contact';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Contact)
export class ContactRespository extends Repository<Contact> {}
