import { InjectRepository } from '@nestjs/typeorm';
import { Command, Console, createSpinner } from 'nestjs-console';
import { map } from 'p-iteration';
import { Repository } from 'typeorm';
import { Variant } from '../entities/Variant';
import * as fs from 'fs';

@Console()
export class VariantCommandService {
  constructor(
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
  ) {}

  @Command({
    command: 'create-variants',
  })
  async create(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating variants');
    await this.make();
    spin.succeed('created');
  }

  async make() {
    const variants: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/variants.json',
    );
    const variantsList: Array<Record<any, unknown>> = JSON.parse(
      variants.toString(),
    );
    const variantsEntities = await this.variantRepository.create(variantsList);
    await map(variantsEntities, async (ent) => {
      await ent.save();
    });
  }
}
