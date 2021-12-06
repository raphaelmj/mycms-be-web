import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Investition } from '../../entities/Investition';
import { Variant } from '../../entities/Variant';
import { map } from 'p-iteration';
import { FieldUpdateDto } from '../../dto/field-update.dto';
import { InvestitionBodyDto } from '../../dto/investition-body.dto';
import { CroppedImageService } from '../cropped-image/cropped-image.service';
import { InvestitionDto } from '../../dto/investition.dto';
import { ImageElement } from '../../interfaces/image-element.interface';
import { Office } from '../../entities/Office';
import * as slug from 'slug';
import { VariantService } from '../variant/variant.service';
import { Department } from '../../entities/Department';
import { ContactElement } from '../../interfaces/contact-element.interface';
import { UnpinDto } from '../../dto/Unpin.dto';
import { PinDto } from '../../dto/pin.dto';
import { Popup } from '../../entities/Popup';

export interface InvestitionImages {
  imageFull: string;
  imageList: string;
  imageLogo: string;
  mapFiles: {
    lessFile: ImageElement;
    moreFile: ImageElement;
  };
}

@Injectable()
export class InvestitionService {
  constructor(
    @InjectRepository(Investition)
    private investitionRepository: Repository<Investition>,
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
    private readonly croppedImageService: CroppedImageService,
    private readonly variantService: VariantService,
    @InjectRepository(Variant)
    private popupsRepository: Repository<Popup>,
  ) {}

  async all(relations: string[] = []): Promise<Investition[]> {
    return await this.investitionRepository.find({ relations });
  }

  async getByIds(ids: number[]): Promise<Investition[]> {
    const investitions: Investition[] = [];
    await map(ids, async (id, i) => {
      const investition: Investition = await this.investitionRepository.findOne(
        id,
      );
      investitions[i] = investition;
    });
    return investitions;
  }

  async findByVariant(
    variantId: number,
    relations: string[] = [],
  ): Promise<Investition[]> {
    if (variantId && variantId != 0) {
      const variant = await this.variantRepository.findOne(variantId, {
        relations: ['investitions'],
      });
      return await map(
        variant.investitions,
        async (inv) =>
          await this.investitionRepository.findOne(inv.id, { relations }),
      );
    } else {
      return await this.investitionRepository.find({ relations });
    }
  }

  async create(
    investition: InvestitionDto,
    variantIds: number[],
    officeIds: number[],
    investitionImages?: InvestitionImages,
  ) {
    if (investitionImages) {
      investition = this.investitionImagesSet(investition, investitionImages);
    }
    const alias: string = slug(`${investition.name}-${investition.city}`, {
      lower: true,
    });
    const isAliasExits: boolean = await this.isAliasExits(alias, false);

    if (isAliasExits) {
      const investitionObject: Investition = await this.investitionRepository.create(
        <Investition>(<unknown>investition),
      );
      investitionObject.alias = `${investitionObject.alias}-${investitionObject.id}`;
      await investitionObject.save();
    } else {
      investition.alias = alias;
      const investitionObject: Investition = await this.investitionRepository.create(
        <Investition>(<unknown>investition),
      );
      const variants = await this.variantRepository.findByIds(variantIds);
      const offices = await this.officeRepository.findByIds(officeIds);
      investitionObject.variants = variants;
      investitionObject.offices = offices;
      await investitionObject.save();
      await this.variantService.investitionToVariantMap(
        investitionObject.id,
        variants,
      );
      return await this.investitionRepository.findOne(investitionObject.id, {
        relations: ['offices', 'variants'],
      });
    }
  }

  async update(
    investition: InvestitionDto,
    variantIds: number[],
    officeIds: number[],
    investitionImages?: InvestitionImages,
  ) {
    if (investitionImages) {
      investition = this.investitionImagesSet(investition, investitionImages);
    }
    let alias: string = slug(`${investition.name}-${investition.city}`, {
      lower: true,
    });
    const isAliasExits: boolean = await this.isAliasExits(
      alias,
      true,
      investition.id,
    );

    if (isAliasExits) {
      alias += `=${investition.id}`;
      investition.alias = alias;
    }

    await this.investitionRepository.update(investition.id, <any>investition);
    const investitionObject: Investition = await this.investitionRepository.findOne(
      investition.id,
    );
    const variants = await this.variantRepository.findByIds(variantIds);
    const offices = await this.officeRepository.findByIds(officeIds);
    investitionObject.variants = variants;
    investitionObject.offices = offices;
    await investitionObject.save();
    await this.variantService.investitionToVariantMap(investition.id, variants);
    await this.variantService.updateInvestitionMaps(investition.id);
    return await this.investitionRepository.findOne(investition.id, {
      relations: ['offices', 'variants'],
    });
  }

  async updateField(body: FieldUpdateDto): Promise<Investition> {
    const update = {};
    update[body.field] = body.value;
    await this.investitionRepository.update(body.id, update);
    return await this.investitionRepository.findOne(body.id);
  }

  async delete(id: string) {
    await this.variantService.removeFromMaps(id);
    return await this.investitionRepository.delete(id);
  }

  investitionImagesSet(
    investition: InvestitionDto,
    investitionImages: InvestitionImages,
  ): InvestitionDto {
    if (investitionImages.imageFull) {
      investition.fullImage = investitionImages.imageFull;
    }
    if (investitionImages.imageList) {
      investition.listImage = investitionImages.imageList;
    }
    if (investitionImages.imageLogo) {
      investition.logo = investitionImages.imageLogo;
    }
    investition.mapFiles = investitionImages.mapFiles;

    return investition;
  }

  async createInvestitionImages(
    body: InvestitionBodyDto,
  ): Promise<InvestitionImages> {
    const investitionImages: InvestitionImages = {
      imageFull: null,
      imageList: null,
      imageLogo: null,
      mapFiles: null,
    };

    const imageFull: string = <string>(
      await this.croppedImageService.makeCroppedImage(
        body.croppedImageFull,
        'investitions',
        'jpg',
        false,
      )
    );

    investitionImages.imageFull = imageFull ? imageFull : null;

    const imageList: string = <string>(
      await this.croppedImageService.makeCroppedImage(
        body.croppedImageList,
        'investitions',
        'jpg',
        false,
      )
    );

    investitionImages.imageList = imageList ? imageList : null;

    const imageLogo: string = <string>(
      await this.croppedImageService.makeCroppedImage(
        body.croppedImageLogo,
        'investitions-logos',
        'png',
        false,
      )
    );

    investitionImages.imageLogo = imageLogo ? imageLogo : null;

    const lessFile: ImageElement = <ImageElement>(
      await this.croppedImageService.makeCroppedImageGallery(
        body.croppedLessMap,
        'maps',
        'jpg',
        true,
      )
    );

    const moreFile: ImageElement = <ImageElement>(
      await this.croppedImageService.makeCroppedImageGallery(
        body.croppedLessMap,
        'maps',
        'jpg',
        true,
      )
    );
    investitionImages.mapFiles = {
      lessFile: lessFile
        ? lessFile
        : body.investition.mapFiles?.lessFile
        ? body.investition.mapFiles?.lessFile
        : null,
      moreFile: moreFile
        ? moreFile
        : body.investition.mapFiles?.moreFile
        ? body.investition.mapFiles?.moreFile
        : null,
    };

    return investitionImages;
  }

  async isAliasExits(
    alias: string,
    except = false,
    id?: number,
  ): Promise<boolean> {
    if (except) {
      const c = await this.investitionRepository.count({
        where: { alias, id: Not(id) },
      });
      return c > 0;
    } else {
      const c = await this.investitionRepository.count({ where: { alias } });
      return c > 0;
    }
  }

  async removeAddedContact(id: number) {
    const investitions: Investition[] = await this.investitionRepository.find();
    await map(investitions, async (inv) => {
      let contacts: ContactElement[] = <ContactElement[]>(
        (<unknown>inv.contacts)
      );
      contacts = contacts.map((contactSection) => {
        contactSection.persons = contactSection.persons.filter(
          (person) => person.id != id,
        );
        return contactSection;
      });
      inv.contacts = <any>contacts;
      await inv.save();
    });
  }

  async unpinPopup(unpinDto: UnpinDto): Promise<any> {
    const page: Investition = await this.investitionRepository.findOne(
      unpinDto.entityId,
      {
        relations: ['popups'],
      },
    );
    page.popups = page.popups.filter((p) => {
      return p.id !== unpinDto.popup.id;
    });
    return await page.save();
  }

  async pinPopup(pinDto: PinDto): Promise<any> {
    const page: Investition = await this.investitionRepository.findOne(
      pinDto.entityId,
      {
        relations: ['popups'],
      },
    );
    const popup: Popup = await this.popupsRepository.findOne(pinDto.id);
    page.popups.push(popup);
    return await page.save();
  }
}
