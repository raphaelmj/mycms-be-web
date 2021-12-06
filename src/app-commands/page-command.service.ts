import { InjectRepository } from '@nestjs/typeorm';
import { Command, Console, createSpinner } from 'nestjs-console';
import { map } from 'p-iteration';
import { Repository } from 'typeorm';
import { Page } from 'src/entities/Page';
import * as fs from 'fs';

@Console()
export class PageCommandService {
  constructor(
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
  ) {}

  @Command({
    command: 'create-pages',
  })
  async create(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating pages');
    await this.make();
    spin.succeed('created');
  }

  @Command({
    command: 'refactor-sliders',
  })
  async refactorS(): Promise<void> {
    const spin = createSpinner();
    spin.start('refactor-sliders');
    const pages = await this.refactorSliders();
    console.log(pages);
    fs.writeFileSync(
      process.cwd() + '/jsons/pages.json',
      JSON.stringify(pages),
    );
    spin.succeed('refactored');
  }

  async make() {
    const pages: Buffer = fs.readFileSync(process.cwd() + '/jsons/pages.json');
    const pagesList: Array<Record<any, unknown>> = JSON.parse(pages.toString());
    await map(pagesList, async (ent) => {
      await this.pageRepository.create(ent).save();
    });
  }

  async refactorSliders() {
    const pages: Buffer = fs.readFileSync(process.cwd() + '/jsons/pages.json');
    const pagesList: Array<Record<any, unknown>> = JSON.parse(pages.toString());
    await map(pagesList, async (ent, i) => {
      if (pagesList[i].slides && pagesList[i].slides['slideList']) {
        pagesList[i].slides['slideList'] = pagesList[i].slides['slideList'].map(
          (slide) => {
            return {
              slide,
              logo: null,
            };
          },
        );
      }
    });
    return pagesList;
  }
}
