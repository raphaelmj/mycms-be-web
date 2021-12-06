import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../../entities/Page';
import { Repository } from 'typeorm';
import { PageDataUpdateDto } from '../../dto/page-data-update.dto';
import { Contact } from '../../entities/Contact';
import { Office } from '../../entities/Office';
import { Category } from '../../entities/Category';
import { Variant } from '../../entities/Variant';
import { Department } from '../../entities/Department';
import { Article } from '../../entities/Article';
import { VariantService } from '../variant/variant.service';
import { UnpinDto } from '../../dto/Unpin.dto';
import { PinDto } from '../../dto/pin.dto';
import { Popup } from '../../entities/Popup';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(Office)
    private officeRepository: Repository<Office>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Popup)
    private popupRepository: Repository<Popup>,
    private variantsService: VariantService,
  ) {}

  async all(relations: string[] = []): Promise<Page[]> {
    return await this.pageRepository.find({
      relations,
      order: {
        ordering: 'ASC',
      },
    });
  }

  async updatePage(body: PageDataUpdateDto) {
    const data: Record<any, unknown> = <any>body.page;
    await this.pageRepository.update(body.page.id, data);
    const page: Page = await this.pageRepository.findOne(body.page.id);
    const contact = await this.contactRepository.findOne({
      id: body.associations.contactId,
    });
    page.contact = contact ? contact : null;

    const office = await this.officeRepository.findOne({
      id: body.associations.officeId,
    });
    page.office = office ? office : null;

    const category = await this.categoryRepository.findOne({
      id: body.associations.categoryId,
    });
    page.category = category ? category : null;

    const article = await this.articleRepository.findOne({
      id: body.associations.articleId,
    });
    page.article = article ? article : null;

    const departments = await this.departmentRepository.findByIds(
      body.associations.departmentIds,
    );
    page.departments = departments;

    const variants = await this.variantRepository.findByIds(
      body.associations.variantIds,
    );
    page.variants = variants;
    await page.save();
    await this.variantsService.variantPathChange(variants, page);
    return await this.pageRepository.findOne(body.page.id);
  }

  async updatePagesSlidesLogo(
    imageTitle: string,
    id: number,
    noImage: boolean,
    currentLogo: string,
  ): Promise<Page> {
    const page = await this.pageRepository.findOne(id);
    if (currentLogo) {
      page.slides['imageTitle'] = currentLogo;
    }
    if (imageTitle) {
      page.slides['imageTitle'] = imageTitle;
    }
    if (noImage) {
      page.slides['imageTitle'] = 'null';
    }
    await page.save();
    return await this.pageRepository.findOne(id);
  }

  async updatePagesSlidesList(
    slides: { slide: string; logo: string }[],
    id: number,
  ): Promise<Page> {
    const page = await this.pageRepository.findOne(id);
    page.slides['slideList'] = slides;
    await page.save();
    return await this.pageRepository.findOne(id);
  }

  async addPageSlide(imageUri: string, id: number): Promise<Page> {
    const page = await this.pageRepository.findOne(id);
    if (imageUri) {
      if (!page.slides['imageTitle']) {
        page.slides['imageTitle'] = 'null';
      }
      if (!page.slides['slideList']) {
        page.slides['slideList'] = [];
      }
      page.slides['slideList'].push({ slide: imageUri, logo: null });
      await page.save();
    }
    return await this.pageRepository.findOne(id);
  }

  async updateOnePageSlide(
    imageUri: string,
    id: number,
    index: number,
  ): Promise<Page> {
    const page = await this.pageRepository.findOne(id);
    if (imageUri) {
      if (!page.slides['imageTitle']) {
        page.slides['imageTitle'] = 'null';
      }
      if (!page.slides['slideList']) {
        page.slides['slideList'] = [];
      }
      page.slides['slideList'][index].logo = imageUri;
      await page.save();
    }
    return await this.pageRepository.findOne(id);
  }

  async updateOnePageSlideImage(
    imageUri: string,
    id: number,
    index: number,
  ): Promise<Page> {
    const page = await this.pageRepository.findOne(id);
    if (imageUri) {
      if (!page.slides['imageTitle']) {
        page.slides['imageTitle'] = 'null';
      }
      if (!page.slides['slideList']) {
        page.slides['slideList'] = [];
      }
      page.slides['slideList'][index].slide = imageUri;
      await page.save();
    }
    return await this.pageRepository.findOne(id);
  }

  async unpinPopup(unpinDto: UnpinDto): Promise<any> {
    const page: Page = await this.pageRepository.findOne(unpinDto.entityId, {
      relations: ['popups'],
    });
    page.popups = page.popups.filter((p) => {
      return p.id !== unpinDto.popup.id;
    });
    return await page.save();
  }

  async pinPopup(pinDto: PinDto): Promise<any> {
    const page: Page = await this.pageRepository.findOne(pinDto.entityId, {
      relations: ['popups'],
    });
    const popup: Popup = await this.popupRepository.findOne(pinDto.id);
    page.popups.push(popup);
    return await page.save();
  }
}
