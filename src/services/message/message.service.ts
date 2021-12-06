import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Message } from '../../entities/Message';
import { MessageDto } from '../../dto/message.dto';
import * as slug from 'slug';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async all(): Promise<Message[]> {
    return await this.messageRepository.find({ order: { createdAt: 'DESC' } });
  }

  async delete(id: number) {
    return await this.messageRepository.delete(id);
  }

  async create(message: MessageDto) {
    const alias: string = slug(`${message.name}`, {
      lower: true,
    });
    const isAliasExits: boolean = await this.isAliasExits(alias, false);
    if (isAliasExits) {
      const createdObject: Message = await this.messageRepository.create(
        <Message>(<unknown>message),
      );
      await createdObject.save();
      createdObject.alias = `${alias}-${createdObject.id}`;
      await createdObject.save();
      message.id = createdObject.id;
    } else {
      message.alias = alias;
      const createdObject: Message = await this.messageRepository.create(
        <Message>(<unknown>message),
      );
      await createdObject.save();
      message.id = createdObject.id;
    }
    return await this.messageRepository.findOne(message.id);
  }

  async update(message: MessageDto) {
    const alias: string = slug(`${message.name}`, {
      lower: true,
    });
    const isAliasExits: boolean = await this.isAliasExits(
      alias,
      true,
      message.id,
    );
    console.log(message.createdAt);
    if (isAliasExits) {
      await this.messageRepository.update(
        message.id,
        <QueryDeepPartialEntity<Message>>(<unknown>message),
      );
      const createdObject: Message = await this.messageRepository.findOne(
        message.id,
      );
      createdObject.alias = `${createdObject.alias}-${createdObject.id}`;
      await createdObject.save();
    } else {
      message.alias = alias;
      await this.messageRepository.update(
        message.id,
        <QueryDeepPartialEntity<Message>>(<unknown>message),
      );
    }
    return await this.messageRepository.findOne(message.id);
  }

  async isAliasExits(
    alias: string,
    except = false,
    id?: number,
  ): Promise<boolean> {
    if (except) {
      const c = await this.messageRepository.count({
        where: { alias, id: Not(id) },
      });
      return c > 0;
    } else {
      const c = await this.messageRepository.count({ where: { alias } });
      return c > 0;
    }
  }
}
