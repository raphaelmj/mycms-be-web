import { InjectRepository } from '@nestjs/typeorm';
import { Command, Console, createSpinner } from 'nestjs-console';
import { map } from 'p-iteration';
import { Repository } from 'typeorm';
import { Investition } from '../entities/Investition';
import * as fs from 'fs';
import { Office } from '../entities/Office';
import { imageSize } from 'image-size';
import * as slug from 'slug';
import { parse } from 'node-html-parser';
import {
  CustomTableElement,
  CustomTableElementStateName,
} from '../interfaces/investition.interface';
import { ImageElement } from '../interfaces/image-element.interface';

@Console()
export class InvestitionCommandService {
  constructor(
    @InjectRepository(Investition)
    private investitionRepository: Repository<Investition>,
    @InjectRepository(Office)
    private officeRepository: Repository<Office>,
  ) {}

  @Command({
    command: 'create-investitions',
  })
  async create(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating investitions');
    await this.make();
    spin.succeed('created');
  }

  @Command({
    command: 'investitions-pin-contacts',
  })
  async pinContacts(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating investitions');
    const invests = await this.getAndPinContacts();
    fs.writeFileSync(
      process.cwd() + '/jsons/investitions.json',
      JSON.stringify(invests),
    );
    spin.succeed('created');
  }

  @Command({
    command: 'galleries-refactor',
  })
  async pinOffices(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating investitions');
    const invests = await this.refactorGalleries();
    fs.writeFileSync(
      process.cwd() + '/jsons/investitions.json',
      JSON.stringify(invests),
    );
    spin.succeed('created');
  }

  @Command({
    command: 'link-invest-refactor',
  })
  async linksChange(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating investitions');
    const invests = await this.refactorLinks();
    fs.writeFileSync(
      process.cwd() + '/jsons/investitions.json',
      JSON.stringify(invests),
    );
    spin.succeed('created');
  }

  @Command({
    command: 'invests-merge',
  })
  async merge(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating investitions');
    const invest = await this.mergeInv();
    fs.writeFileSync(
      process.cwd() + '/jsons/investitions-merge.json',
      JSON.stringify(invest),
    );
    spin.succeed('created');
  }

  @Command({
    command: 'invests-aliases',
  })
  async aliases(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating investitions');
    const invests = await this.makeAliases();
    fs.writeFileSync(
      process.cwd() + '/jsons/investitions.json',
      JSON.stringify(invests),
    );
    spin.succeed('created');
  }

  @Command({
    command: 'invest-maps-more',
  })
  async mapsMore() {
    const spin = createSpinner();
    spin.start('creating investitions');
    const invests = await this.makeMapFiles();
    fs.writeFileSync(
      process.cwd() + '/jsons/investitions.json',
      JSON.stringify(invests),
    );
    spin.succeed('created');
  }

  @Command({
    command: 'invest-progress-gallery-intro-image',
  })
  async introProgressImage() {
    const spin = createSpinner();
    spin.start('creating investitions');
    const invests = await this.makeProgressGallery();
    fs.writeFileSync(
      process.cwd() + '/jsons/investitions.json',
      JSON.stringify(invests),
    );
    spin.succeed('created');
  }

  @Command({
    command: 'invest-bool-custom-table',
  })
  async makeBoolCustomLabel() {
    const spin = createSpinner();
    spin.start('creating investitions');
    const invests = await this.makeBoolCustomLabelData();
    fs.writeFileSync(
      process.cwd() + '/jsons/investitions.json',
      JSON.stringify(invests),
    );
    spin.succeed('created');
  }

  @Command({
    command: 'find-images-sizes',
    options: [
      {
        flags: '-fp, --fullpath <fpValue>',
        required: false,
      },
    ],
  })
  async findImagesSizes(options?: { fullpath: '1' }) {
    const spin = createSpinner();
    const images =
      '/img/komercyjne/9A1A7733-1.jpg;/img/komercyjne/9A1A7695.jpg;/img/komercyjne/9A1A7705.jpg;/img/komercyjne/9A1A7679.jpg;/img/komercyjne/9A1A7684.jpg;/img/komercyjne/9A1A7686.jpg;/img/komercyjne/9A1A7699.jpg;/img/komercyjne/9A1A7712.jpg;/img/komercyjne/9A1A7715.jpg;/img/komercyjne/9A1A7721.jpg';
    const imagesArray = images.split(';');
    const imagesArraySizes = [];
    spin.start('creating find-sizes');

    await map(imagesArray, async (img) => {
      let prePath = '';
      if (!options.fullpath || options.fullpath !== '1') {
        prePath = '/img/inwestycje/';
      }
      const imagePath = prePath + img;
      const size = imageSize(process.cwd() + '/static' + imagePath);
      imagesArraySizes.push({
        src: imagePath,
        type: 'image',
        sizeString: size.width + 'x' + size.height,
      });
    });

    console.log(JSON.stringify(imagesArraySizes));

    spin.succeed('created');
  }

  @Command({
    command: 'parse-html-tables',
    options: [
      {
        flags: '-hp, --htmlpath <htmlPath>',
        required: false,
      },
    ],
  })
  async parseHtmlTables(options?: { htmlpath: string }) {
    if (options.htmlpath) {
      const pathSplit = options.htmlpath.split('/');
      const htmlBuffer: Buffer = fs.readFileSync(
        process.cwd() + options.htmlpath,
      );
      const htmlString: string = htmlBuffer.toString();
      const root = parse(htmlString);
      const table: CustomTableElement[] = [];
      [...root.querySelectorAll('>div')].forEach((element) => {
        const { building, localName } = this.parseFirst(element);

        const { state, firm } = this.parseSecond(element);

        const area: string = this.parseThird(element);

        const { situaPlan, buildingLocation, plan } = this.parseFourth(element);

        table.push({
          building,
          localName,
          state: {
            stateName: state,
            firm: firm,
          },
          area,
          infoAssets: {
            situaPlan: this.pathToImageElement(situaPlan),
            buildingLocation: this.pathToImageElement(buildingLocation),
            plan: this.pathToImageElement(plan),
          },
        });
      });
      // console.log(table, pathSplit[pathSplit.length - 1]);
      fs.writeFileSync(
        process.cwd() + '/jsons/' + pathSplit[pathSplit.length - 1] + '.json',
        JSON.stringify(table),
      );
    }
  }

  parseFirst(element): { building?: string; localName: string } {
    const child = element.querySelector('div:nth-child(1)');
    const html1 = child.innerHTML;
    const data: { building?: string; localName: string } = {
      localName: '',
    };
    if (
      element.querySelector('div:nth-child(1)').innerHTML.indexOf('BUDYNEK') !==
      -1
    ) {
      data.building = child.querySelector('span:nth-child(1)')?.innerHTML;
      data.localName = child.querySelector('span:nth-child(3)')?.innerHTML;
    } else {
      data.localName = html1.replace(/<[^>]*>?/gm, '');
    }
    return data;
  }

  parseSecond(element): { state: CustomTableElementStateName; firm: string } {
    const child = element.querySelector('div:nth-child(2)');
    const data: { state: CustomTableElementStateName; firm: string } = {
      state: CustomTableElementStateName.free,
      firm: '',
    };
    data.state =
      child
        .querySelector('span:nth-child(1)')
        ?.innerHTML.indexOf('WYNAJĘTY') !== -1
        ? CustomTableElementStateName.rent
        : CustomTableElementStateName.free;
    data.firm = child.querySelector('span:nth-child(2)')?.innerHTML;
    return data;
  }

  parseThird(element): string {
    const child = element.querySelector('div:nth-child(3)');
    child.querySelector('b:nth-child(1)');
    return child.querySelector('b:nth-child(1)').innerHTML;
  }

  parseFourth(
    element,
  ): {
    situaPlan?: string;
    buildingLocation: string;
    plan: string;
  } {
    const data: {
      situaPlan?: string;
      buildingLocation: string;
      plan: string;
    } = {
      buildingLocation: '',
      plan: '',
    };
    const child = element.querySelector('div:nth-child(4)');
    if (child.querySelectorAll('a').length === 2) {
      data.buildingLocation = child
        .querySelector('a:nth-child(1)')
        .getAttribute('href');
      data.plan = child.querySelector('a:nth-child(2)').getAttribute('href');
    } else if (child.querySelectorAll('a').length === 3) {
      data.situaPlan = child
        .querySelector('a:nth-child(1)')
        .getAttribute('href');
      data.buildingLocation = child
        .querySelector('a:nth-child(2)')
        .getAttribute('href');
      data.plan = child.querySelector('a:nth-child(3)').getAttribute('href');
    }
    return data;
  }

  pathToImageElement(path: string): ImageElement | null {
    if (path) {
      const size = imageSize(process.cwd() + '/static' + path);
      return {
        src: path,
        sizeString: size.width + 'x' + size.height,
      };
    }
    return null;
  }

  async make() {
    const investitions: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/investitions.json',
    );
    const investitionsList: Array<Record<any, any>> = JSON.parse(
      investitions.toString(),
    );
    const variantsEntities = await this.investitionRepository.create(
      investitionsList,
    );
    await map(variantsEntities, async (ent) => {
      await ent.save();
    });
  }

  async getAndPinContacts() {
    const contacts: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/contacts.json',
    );
    const investitions: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/investitions.json',
    );
    const contactsList: Array<Record<any, any>> = JSON.parse(
      contacts.toString(),
    );
    let investitionsList: Array<Record<any, any>> = JSON.parse(
      investitions.toString(),
    );
    investitionsList.forEach((inv, i) => {
      investitionsList = this.findAndPin(
        inv,
        i,
        investitionsList,
        contactsList,
      );
    });
    return investitionsList;
  }

  findAndPin(invest, i, investitionsList, contactsList) {
    let parentExist = false;
    if (invest.kontakt_osoba_1 && invest.kontakt_osoba_1 != '') {
      const c = this.findContactByEmail(invest.kontakt_mail_1, contactsList);
      if (c) {
        parentExist = true;
        investitionsList[i].contacts.push({
          name: 'KONTAKT',
          persons: [
            {
              id: c.id,
              customRole: null,
            },
          ],
        });
      }
    }
    if (invest.kontakt_osoba_2 && invest.kontakt_osoba_2 != '') {
      const c = this.findContactByEmail(invest.kontakt_mail_2, contactsList);
      if (c) {
        if (parentExist) {
          investitionsList[i].contacts[0].persons.push({
            id: c.id,
            customRole: null,
          });
        } else {
          parentExist = true;
          investitionsList[i].contacts.push({
            name: 'KONTAKT',
            person: [
              {
                id: c.id,
                customRole: null,
              },
            ],
          });
        }
      }
    }
    if (invest.kontakt_osoba_3 && invest.kontakt_osoba_3 != '') {
      const c = this.findContactByEmail(invest.kontakt_mail_3, contactsList);
      if (c) {
        if (parentExist) {
          investitionsList[i].contacts[0].persons.push({
            id: c.id,
            customRole: null,
          });
        } else {
          parentExist = true;
          investitionsList[i].contacts.push({
            name: 'KONTAKT',
            person: [
              {
                id: c.id,
                customRole: null,
              },
            ],
          });
        }
      }
    }
    if (invest.najem_osoba && invest.najem_osoba != '') {
      const c = this.findContactByEmail(invest.najem_email, contactsList);
      if (c) {
        investitionsList[i].contacts.push({
          name: 'WYNAJEM',
          persons: [
            {
              id: c.id,
              customRole: null,
            },
          ],
        });
      }
    }
    if (invest.zarzadca_osoba && invest.zarzadca_osoba != '') {
      const c = this.findContactByEmail(invest.zarzadca_email, contactsList);
      if (c) {
        investitionsList[i].contacts.push({
          name: 'ZARZĄDCA',
          persons: [
            {
              id: c.id,
              customRole: null,
            },
          ],
        });
      }
    }
    return investitionsList;
  }

  findContactByEmail(email, contacts) {
    if (!email) return null;
    let contact;
    contacts.forEach((c) => {
      if (email.trim() == c.email.trim()) {
        contact = c;
      }
    });
    return contact;
  }

  async refactorGalleries() {
    const investitions: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/investitions.json',
    );
    const investitionsList: Array<Record<any, any>> = JSON.parse(
      investitions.toString(),
    );
    investitionsList.forEach((inv, i) => {
      if (inv.gallery && inv.gallery != '') {
        const images: string[] = inv.gallery.split(';');
        investitionsList[i].gallery = this.rafactorImages(images);
      } else {
        investitionsList[i].gallery = [];
      }
      if (inv.gal_bud && inv.gal_bud != '') {
        const pgallery = this.getProgressImages(inv.gal_bud);
        investitionsList[i].progressGallery = pgallery;
      } else {
        investitionsList[i].progressGallery = [];
      }
      if (inv.gal_wiz || inv.gal_wiz == '') {
        const { gal_wiz, ...wizRm } = investitionsList[i];
        investitionsList[i] = wizRm;
      }
      if (inv.gal_bud || inv.gal_bud == '') {
        const { gal_bud, ...budRm } = investitionsList[i];
        investitionsList[i] = budRm;
      }
    });
    return investitionsList;
  }

  rafactorImages(images: string[]) {
    const nimgs = [];
    images.forEach((img) => {
      if (img != '') {
        const size = imageSize(
          process.cwd() + '/static/img/inwestycje/' + img.trim(),
        );
        nimgs.push({
          src: '/img/inwestycje/' + img.trim(),
          type: 'image',
          sizeString: `${size.width}x${size.height}`,
        });
      }
    });
    return nimgs;
  }

  getProgressImages(galleryString: string) {
    const gallery = [];
    const array: string[] = galleryString.split('[[');
    array.forEach((el) => {
      if (el != '') {
        const cutStr: string[] = el.split(']]');
        const imgs = cutStr[1].split(';');
        const images = this.rafactorImages(imgs);
        gallery.push({
          name: cutStr[0],
          images,
        });
      }
    });
    return gallery;
  }

  async refactorLinks() {
    const investitions: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/investitions.json',
    );
    const investitionsList: Array<Record<any, any>> = JSON.parse(
      investitions.toString(),
    );
    investitionsList.forEach((inv, i) => {
      if (inv.link_http) {
        const { link_http, ...first } = investitionsList[i];
        investitionsList[i] = first;
        const { link_nazwa, ...second } = investitionsList[i];
        investitionsList[i] = second;
        investitionsList[i]['link'] = {
          isShow: Boolean(inv.link_http),
          link: link_http,
          name: link_nazwa,
        };
      }
    });
    return investitionsList;
  }

  mergeInv() {
    let invest = {};
    const investitions: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/investitions.json',
    );
    const investitionsList: Array<Record<any, any>> = JSON.parse(
      investitions.toString(),
    );
    investitionsList.forEach((inv, i) => {
      invest = { ...invest, ...inv };
    });
    return invest;
  }

  makeAliases() {
    const investitions: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/investitions.json',
    );
    const investitionsList: Array<Record<any, any>> = JSON.parse(
      investitions.toString(),
    );
    investitionsList.forEach((inv, i) => {
      investitionsList[i]['alias'] = slug(investitionsList[i]['name']);
    });
    return investitionsList;
  }

  makeMapFiles() {
    const investitions: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/investitions.json',
    );

    const investitionsList: Array<Record<any, any>> = JSON.parse(
      investitions.toString(),
    );

    investitionsList.forEach((inv, i) => {
      if (investitionsList[i]['mapFiles']) {
        const size = imageSize(
          process.cwd() +
            '/static' +
            investitionsList[i]['mapFiles']['moreFile'],
        );
        investitionsList[i]['mapFiles']['moreFile'] = {
          src: investitionsList[i]['mapFiles']['moreFile'],
          sizeString: `${size.width}x${size.height}`,
        };
      }
    });
    return investitionsList;
  }

  makeProgressGallery() {
    const investitions: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/investitions.json',
    );
    const investitionsList: Array<Record<any, any>> = JSON.parse(
      investitions.toString(),
    );

    investitionsList.forEach((inv, i) => {
      if (inv.progressGallery.length) {
        inv.progressGallery.map((pge, j) => {
          if (investitionsList[i].progressGallery[j].images) {
            investitionsList[i].progressGallery[j]['imageThumb'] =
              investitionsList[i].progressGallery[j].images.length > 0
                ? investitionsList[i].progressGallery[j].images[0].src
                : null;
          }
        });
      }
    });
    return investitionsList;
  }

  makeBoolCustomLabelData() {
    const investitions: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/investitions.json',
    );
    const investitionsList: Array<Record<any, any>> = JSON.parse(
      investitions.toString(),
    );

    investitionsList.forEach((inv, i) => {
      investitionsList[i].showCustomTable = false;
    });

    return investitionsList;
  }
}
