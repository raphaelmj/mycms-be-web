import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../../entities/Message';

@Injectable()
export class NoticeWebService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async all(): Promise<Message[]> {
    return await this.messageRepository.find({ order: { createdAt: 'DESC' } });
  }

  async getOneByAlias(alias: string): Promise<Message> {
    return await this.messageRepository.findOne({ where: { alias } });
  }
}
