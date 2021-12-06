import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Variant } from '../../entities/Variant';
import { map } from 'p-iteration';
import { Page } from '../../entities/Page';
import { FieldUpdateDto } from '../../dto/field-update.dto';
import { VariantDto } from '../../dto/variant.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import * as slug from 'slug';
import { ContactElement } from '../../interfaces/contact-element.interface';
import { UnpinDto } from '../../dto/Unpin.dto';
import { PinDto } from '../../dto/pin.dto';
import { Popup } from '../../entities/Popup';
import { Investition } from '../../entities/Investition';

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    @InjectRepository(Variant)
    private popupsRepository: Repository<Popup>,
    @InjectRepository(Investition)
    private investitionRepository: Repository<Investition>,
  ) {}

  async all(relations: string[] = []): Promise<Variant[]> {
    return await this.variantRepository.find({ relations });
  }

  async create(body: VariantDto): Promise<Variant> {
    body.alias = slug(body.name, { lower: true });
    const variant: Variant = this.variantRepository.create(
      (body as unknown) as Variant,
    );
    await variant.save();
    return variant;
  }

  async update(body: VariantDto): Promise<Variant> {
    const investitionsMap: number[] = body.investitionsMap.map((i) => i);
    await this.variantRepository.update(
      body.id,
      (body as unknown) as QueryDeepPartialEntity<Variant>,
    );
    const variant: Variant = await this.variantRepository.findOne(body.id);
    const investitions: Investition[] = await this.investitionRepository.findByIds(
      investitionsMap,
    );
    variant.investitions = investitions;
    await variant.save();
    return variant;
  }

  async delete(id: number) {
    return await this.variantRepository.delete(id);
  }

  async updateField(body: FieldUpdateDto): Promise<Variant> {
    const update = {};
    update[body.field] = body.value;
    await this.variantRepository.update(body.id, update);
    return await this.variantRepository.findOne(body.id);
  }

  async removeFromMaps(id) {
    const variants: Variant[] = await this.variantRepository.find();
    await map(variants, async (v) => {
      const newMap = ((v.investitionsMap as unknown) as number[]).filter(
        (iid) => iid != id,
      );
      ((v.investitionsMap as unknown) as number[]) = newMap;
      await v.save();
    });
  }

  async pageVariants(pageId: string) {
    return await this.variantRepository.find({
      order: { ordering: 'ASC' },
      where: {
        page: {
          id: Number(pageId),
        },
      },
    });
  }

  async orderUpdate(ids: number[]) {
    await map(ids, async (id, i) => {
      await this.variantRepository.update(id, {
        ordering: i + 1,
      });
    });
    return await this.variantRepository.findByIds(ids, {
      order: { ordering: 'ASC' },
    });
  }

  async investitionToVariantMap(investitionId: number, variants: Variant[]) {
    await map(variants, async (v, i) => {
      let isInMap = false;
      isInMap =
        ((v.investitionsMap as unknown) as number[]).filter((id) => {
          return id == investitionId;
        }).length > 0;
      if (!isInMap) {
        ((v.investitionsMap as unknown) as number[]).push(investitionId);
      }
      await v.save();
    });
  }

  async updateInvestitionMaps(investitionId: number) {
    const allVariants: Variant[] = await this.variantRepository.find({
      relations: ['investitions'],
    });
    await map(allVariants, async (variant, i) => {
      let isNotInAssoc = false;
      isNotInAssoc =
        variant.investitions.filter((inv) => {
          return inv.id === investitionId;
        }).length === 0;
      if (isNotInAssoc) {
        ((variant.investitionsMap as unknown) as number[]) = ((variant.investitionsMap as unknown) as number[]).filter(
          (id) => {
            return id !== investitionId;
          },
        );
      }
      await variant.save();
    });
  }

  async variantPathChange(variants: Variant[], page: Page) {
    await map(variants, async (v, i) => {
      let path = page.alias + '/' + v.alias;
      const bool: boolean = await this.checkIsPathFree(path, v.id);
      if (!bool) {
        path += `-${v.id}`;
      }
      v.path = '/' + path;
      await v.save();
    });
  }

  async removeAddedContact(id: number) {
    const variants: Variant[] = await this.variantRepository.find();
    await map(variants, async (element) => {
      let contactsSections: ContactElement[] = <ContactElement[]>(
        (<unknown>element.contactsSections)
      );
      contactsSections = contactsSections.map((contactSection) => {
        contactSection.persons = contactSection.persons.filter(
          (person) => person.id != id,
        );
        return contactSection;
      });
      element.contactsSections = <any>contactsSections;
      await element.save();
    });
  }

  async checkIsPathFree(path: string, variantId: number) {
    const count: number = await this.variantRepository.count({
      where: { id: Not(variantId), path },
    });
    return count == 0;
  }

  async unpinPopup(unpinDto: UnpinDto): Promise<any> {
    const page: Variant = await this.variantRepository.findOne(
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
    const page: Variant = await this.variantRepository.findOne(
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
