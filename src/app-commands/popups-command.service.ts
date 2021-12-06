import * as faker from 'faker/locale/en';
import { Command, Console, createSpinner } from 'nestjs-console';
import { join } from 'path';
import * as fs from 'fs';
import { map } from 'p-iteration';
import { PopupService } from '../services/popup/popup.service';
import { Popup } from '../entities/Popup';
import { PageService } from '../services/page/page.service';
import { Page } from '../entities/Page';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../entities/Department';
import { Variant } from '../entities/Variant';

@Console()
export class PopupsCommandService {
  constructor(
    @InjectRepository(Popup)
    private popupRepository: Repository<Popup>,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    private readonly popupService: PopupService,
    private readonly pageService: PageService,
  ) {}

  @Command({
    command: 'create-popups',
  })
  async createPopups(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating popups');

    await this.popups();

    spin.succeed('created');
  }

  async popups() {
    const buffer = fs.readFileSync(join(__dirname, '../../jsons/popups.json'));
    const data = JSON.parse(buffer.toString());

    await map(data, async (d, i) => {
      await this.createAssoc(await this.popupRepository.create(d).save());
    });
  }

  async createAssoc(popup: Popup) {
    // const variants: Variant[] = await this.variantRepository.find();
    // const departments: Department[] = await this.departmentRepository.find();
    // const pages: Page[] = await this.pageService.all();
    // const assocPages: Page[] = [];
    // const assocVariants: Variant[] = [];
    // const assocDepartments: Department[] = [];
    //
    // await map(pages, async (p, j) => {
    //   if (faker.datatype.boolean()) {
    //     assocPages.push(p);
    //   }
    // });
    //
    // await map(variants, async (v, j) => {
    //   if (faker.datatype.boolean()) {
    //     assocVariants.push(v);
    //   }
    // });
    //
    // await map(departments, async (dp, j) => {
    //   if (faker.datatype.boolean()) {
    //     assocDepartments.push(dp);
    //   }
    // });
    //
    // popup.pages = assocPages;
    // popup.variants = assocVariants;
    // popup.departments = assocDepartments;
    //
    // await popup.save();
  }
}
