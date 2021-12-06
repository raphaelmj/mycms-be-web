import { InjectRepository } from '@nestjs/typeorm';
import { Command, Console, createSpinner } from 'nestjs-console';
import { map } from 'p-iteration';
import { Repository } from 'typeorm';
import { Article } from '../entities/Article';
import * as fs from 'fs';
import * as slug from 'slug';
import { Category } from '../entities/Category';
import * as moment from 'moment';

@Console()
export class ArticleCommandService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  @Command({
    command: 'create-articles',
  })
  async create(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating categories');
    await this.make();
    spin.succeed('created');
  }

  @Command({
    command: 'create-custom-articles',
  })
  async createCustom(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating categories');
    await this.makeCustom();
    spin.succeed('created');
  }

  @Command({
    command: 'create-articles-aliases-id-int',
  })
  async createAliases(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating categories');
    const articles = await this.makeAliases();
    fs.writeFileSync(
      process.cwd() + '/jsons/articles.json',
      JSON.stringify(articles),
    );
    spin.succeed('created');
  }

  @Command({
    command: 'articles-dates-to-published',
  })
  async datePublished(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating categories');
    const articles = await this.makePublished();
    fs.writeFileSync(
      process.cwd() + '/jsons/articles.json',
      JSON.stringify(articles),
    );
    spin.succeed('created');
  }

  @Command({
    command: 'articles-status',
  })
  async statusMake(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating categories');
    const articles = await this.makeStatuses();
    fs.writeFileSync(
      process.cwd() + '/jsons/articles.json',
      JSON.stringify(articles),
    );
    spin.succeed('created');
  }

  async make() {
    const articles: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/articles.json',
    );
    const articlesList: Array<Record<any, any>> = JSON.parse(
      articles.toString(),
    );
    const category: Category = await this.categoryRepository.findOne(1);
    const articlesEntities = await this.articleRepository.create(articlesList);
    await map(articlesEntities, async (ent) => {
      ent.category = category;
      await ent.save();
    });
  }

  async makeCustom() {
    const articles: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/custom-articles.json',
    );
    const articlesList: Array<Record<any, any>> = JSON.parse(
      articles.toString(),
    );
    const articlesEntities = await this.articleRepository.create(articlesList);
    await map(articlesEntities, async (ent) => {
      await ent.save();
    });
  }

  async makeAliases() {
    const articles: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/articles.json',
    );
    const articlesList: Array<Record<any, any>> = JSON.parse(
      articles.toString(),
    );
    articlesList.forEach((inv, i) => {
      articlesList[i]['id'] = parseInt(articlesList[i]['id']);
      articlesList[i]['alias'] =
        slug(articlesList[i]['title']) + '-' + articlesList[i]['id'];
      articlesList[i]['leftContent'] = articlesList[i]['leftContent']
        ? articlesList[i]['leftContent']
        : '';
      articlesList[i]['rightContent'] = articlesList[i]['rightContent']
        ? articlesList[i]['rightContent']
        : '';
    });
    return articlesList;
  }

  makePublished() {
    const articles: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/articles.json',
    );
    const articlesList: Array<Record<any, any>> = JSON.parse(
      articles.toString(),
    );
    articlesList.forEach((art, i) => {
      articlesList[i]['publishedAt'] = moment(art.date).format(
        'YYYY-MM-DD hh:mm:ss',
      );
      const { date, ...rest } = articlesList[i];
      articlesList[i] = rest;
    });
    return articlesList;
  }

  makeStatuses() {
    const articles: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/articles.json',
    );
    const articlesList: Array<Record<any, any>> = JSON.parse(
      articles.toString(),
    );
    articlesList.forEach((art, i) => {
      articlesList[i]['status'] = true;
    });
    return articlesList;
  }
}
