import { InjectRepository } from '@nestjs/typeorm';
import { Command, Console, createSpinner } from 'nestjs-console';
import { map } from 'p-iteration';
import { Repository } from 'typeorm';
import { Category } from '../entities/Category';

@Console()
export class CategoryCommandService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  @Command({
    command: 'create-categories',
  })
  async create(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating categories');
    await this.make();
    spin.succeed('created');
  }

  async make() {
    await this.categoryRepository
      .create({
        id: 1,
        name: 'Aktualności',
        alias: 'aktualnosci',
      })
      .save();
  }
}
