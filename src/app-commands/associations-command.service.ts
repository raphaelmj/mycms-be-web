import { InjectRepository } from '@nestjs/typeorm';
import { Command, Console, createSpinner } from 'nestjs-console';
import { map } from 'p-iteration';
import { Repository } from 'typeorm';
import { Category } from '../entities/Category';
import { Article } from '../entities/Article';
import { Investition } from '../entities/Investition';
import { Variant } from '../entities/Variant';
import { Department } from '../entities/Department';
import { Office } from '../entities/Office';
import { Contact } from '../entities/Contact';
import { Message } from '../entities/Message';
import { Page } from '../entities/Page';
import * as fs from 'fs';

@Console()
export class AssociationsCommandService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Investition)
    private investitionRepository: Repository<Investition>,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Office)
    private officeRepository: Repository<Office>,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
  ) {}

  @Command({
    command: 'make-associations',
  })
  async create(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating associations');
    await this.make();
    spin.succeed('created');
  }

  @Command({
    command: 'make-meta',
  })
  async createMeta(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating meta');
    const articles = await this.makeArticlesMeta();
    fs.writeFileSync(
      process.cwd() + '/jsons/articles.json',
      JSON.stringify(articles),
    );
    const variants = await this.makeVariantsMeta();
    fs.writeFileSync(
      process.cwd() + '/jsons/variants.json',
      JSON.stringify(variants),
    );
    const departments = await this.makeDepartmentsMeta();
    fs.writeFileSync(
      process.cwd() + '/jsons/departments.json',
      JSON.stringify(departments),
    );
    const investitions = await this.makeInvestitionsMeta();
    fs.writeFileSync(
      process.cwd() + '/jsons/investitions.json',
      JSON.stringify(investitions),
    );
    spin.succeed('created');
  }

  async make() {
    await this.departments();
    await this.variants();
    await this.investitions();
    await this.pages();
  }

  async departments() {
    const departments: Department[] = await this.departmentRepository.find({});
    await map(departments, async (dep, i) => {
      if (dep.officesMap.length > 0) {
        const arrayO: Array<number> = <Array<number>>(<unknown>dep.officesMap);
        const whereArrayO: Array<{
          id: number;
        }> = arrayO.map((d) => {
          return {
            id: d,
          };
        });

        const offices: Office[] = await this.officeRepository.find({
          where: whereArrayO,
        });
        dep.offices = offices;
      }
      // if (dep.contactsMap.length > 0) {
      //   const arrayC: Array<number> = <Array<number>>(<unknown>dep.contactsMap);
      //   const whereArrayC: Array<{
      //     id: number;
      //   }> = arrayC.map((c) => {
      //     return {
      //       id: c,
      //     };
      //   });
      //
      //   const contacts: Contact[] = await this.contactRepository.find({
      //     where: whereArrayC,
      //   });
      //
      //   dep.contacts = contacts;
      // }
      await dep.save();
    });
    const page: Page = await this.pageRepository.findOne({ where: { id: 4 } });
    const deps: Department[] = await this.departmentRepository.findByIds([
      1,
      2,
      3,
      4,
      5,
    ]);
    page.departments = deps;
    await this.pageRepository.save(page);
  }

  async variants() {
    const variants: Variant[] = await this.variantRepository.find();
    await map(variants, async (variant) => {
      const investitions: Investition[] = await this.investitionRepository.findByIds(
        <number[]>(<unknown>variant.investitionsMap),
      );
      variant.investitions = investitions;
      await variant.save();
    });
    const variant: Variant = await this.variantRepository.findOne(7);
    const contacts: Contact[] = await this.contactRepository.findByIds([16]);
    variant.contacts = contacts;
    await variant.save();
  }

  async investitions() {
    const assocs = [
      { invId: 19, offId: 1 },
      { invId: 20, offId: 2 },
      { invId: 28, offId: 3 },
      { invId: 29, offId: 4 },
      { invId: 30, offId: 7 },
      { invId: 31, offId: 8 },
    ];
    await map(assocs, async (a) => {
      const invest: Investition = await this.investitionRepository.findOne(
        a.invId,
      );
      const office: Office = await this.officeRepository.findOne(a.offId);
      invest.offices = [office];
      await invest.save();
    });
  }
  async pages() {
    const assocs = [
      { pageId: 9, artId: 283 },
      { pageId: 11, artId: 281 },
      { pageId: 8, artId: 282 },
      { pageId: 3, departmentId: 6 },
      { pageId: 2, categoryId: 1 },
      { pageId: 5, variantIds: [1, 2, 3] },
      { pageId: 6, variantIds: [4, 5, 6] },
      { pageId: 7, variantIds: [7, 8] },
    ];
    await map(assocs, async (a) => {
      const page: Page = await this.pageRepository.findOne(a.pageId);
      if (a.artId) {
        const article: Article = await this.articleRepository.findOne(a.artId);
        page.article = article;
      }
      if (a.departmentId) {
        const department: Department = await this.departmentRepository.findOne(
          a.departmentId,
        );
        page.department = department;
      }
      if (a.categoryId) {
        const category: Category = await this.categoryRepository.findOne(
          a.categoryId,
        );
        page.category = category;
      }
      if (a.variantIds) {
        const variants: Variant[] = await this.variantRepository.findByIds(
          a.variantIds,
        );
        page.variants = variants;
      }
      await this.pageRepository.save(page);
    });
  }

  async makeArticlesMeta() {
    const articles: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/articles.json',
    );
    const articlesList: Array<Record<any, any>> = JSON.parse(
      articles.toString(),
    );
    articlesList.forEach((inv, i) => {
      articlesList[i]['metaTitle'] = '';
      articlesList[i]['metaKeywords'] = '';
      articlesList[i]['metaDescription'] = '';
    });
    return articlesList;
  }

  async makeVariantsMeta() {
    const elements: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/variants.json',
    );
    const elementsList: Array<Record<any, any>> = JSON.parse(
      elements.toString(),
    );
    elementsList.forEach((inv, i) => {
      elementsList[i]['metaTitle'] = '';
      elementsList[i]['metaKeywords'] = '';
      elementsList[i]['metaDescription'] = '';
    });
    return elementsList;
  }

  async makeDepartmentsMeta() {
    const elements: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/departments.json',
    );
    const elementsList: Array<Record<any, any>> = JSON.parse(
      elements.toString(),
    );
    elementsList.forEach((inv, i) => {
      elementsList[i]['metaTitle'] = '';
      elementsList[i]['metaKeywords'] = '';
      elementsList[i]['metaDescription'] = '';
    });
    return elementsList;
  }

  async makeInvestitionsMeta() {
    const elements: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/investitions.json',
    );
    const elementsList: Array<Record<any, any>> = JSON.parse(
      elements.toString(),
    );
    elementsList.forEach((inv, i) => {
      elementsList[i]['metaTitle'] = '';
      elementsList[i]['metaKeywords'] = '';
      elementsList[i]['metaDescription'] = '';
    });
    return elementsList;
  }
}
