import { InjectRepository } from '@nestjs/typeorm';
import { Command, Console, createSpinner } from 'nestjs-console';
import { map } from 'p-iteration';
import { Repository } from 'typeorm';
import { Message } from '../entities/Message';
import * as fs from 'fs';
import * as slug from 'slug';

@Console()
export class MessageCommandService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  @Command({
    command: 'create-messages',
  })
  async create(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating categories');
    await this.make();
    spin.succeed('created');
  }

  @Command({
    command: 'refactor-messages-json',
  })
  async createAliases(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating categories');
    const Messages = await this.refactor();
    fs.writeFileSync(
      process.cwd() + '/jsons/messages.json',
      JSON.stringify(Messages),
    );
    spin.succeed('created');
  }

  async make() {
    const messages: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/messages.json',
    );
    const messagesList: Array<Record<any, any>> = JSON.parse(
      messages.toString(),
    );
    const messagesEntities = await this.messageRepository.create(messagesList);
    await map(messagesEntities, async (ent) => {
      await ent.save();
    });
  }

  async refactor() {
    const messages: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/messages.json',
    );
    const messagesList: Array<Record<any, any>> = JSON.parse(
      messages.toString(),
    );
    messagesList.forEach((inv, i) => {
      messagesList[i]['id'] = i + 1;
      messagesList[i]['createdAt'] = messagesList[i]['create_at'];
      messagesList[i]['linkedInfo'] = JSON.parse(messagesList[i]['pages']).map(
        (page) => {
          return {
            name: page.name,
            link: page.link.replace('http://www.napollo.pl/', '/'),
          };
        },
      );
      const { image, params, create_at, pages, ...rest } = messagesList[i];
      messagesList[i] = rest;
    });
    return messagesList;
  }
}
