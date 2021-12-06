import { Message } from './../entities/Message';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Message)
export class MessageRespository extends Repository<Message> {}
