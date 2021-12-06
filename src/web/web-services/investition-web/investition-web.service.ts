import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investition } from '../../../entities/Investition';
import { map } from 'p-iteration';
import {
  InvestDynamicData,
  InvestsDynamicData,
} from '../../../interfaces/web/data-view-pack.interface';
import { Page } from '../../../entities/Page';
import { Variant } from '../../../entities/Variant';
import { VariantWebService } from '../variant-web/variant-web.service';
import { ContactWebService } from '../contact-web/contact-web.service';
import { ContactElement } from '../../../interfaces/contact-element.interface';
import { WebContactElement } from '../../../interfaces/web/web-contact-element.interface';

@Injectable()
export class InvestitionWebService {
  constructor(
    @InjectRepository(Investition)
    private investitionRepository: Repository<Investition>,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    private variantWebService: VariantWebService,
    private contactWebService: ContactWebService,
  ) {}

  async getByMap(ids: number[]): Promise<Investition[]> {
    const ents: Investition[] = [];
    await map(ids, async (id, i) => {
      const investition: Investition = await this.investitionRepository.findOne(
        { where: { id, status: true } },
      );
      if (investition) {
        ents.push(investition);
      }
    });
    return ents;
  }

  async getInvestionsByVariantPath(
    variantPath: string,
    page: Page,
  ): Promise<InvestsDynamicData> {
    const currentVariant: Variant = await this.variantRepository.findOne({
      where: { path: variantPath },
    });
    if (!currentVariant) {
      return null;
    }
    const contactsSections: WebContactElement[] = await this.contactWebService.getContactGroups(
      (currentVariant.contactsSections as unknown) as ContactElement[],
    );
    const invests: Investition[] = await this.getByMap(
      <number[]>(<unknown>currentVariant.investitionsMap),
    );
    const pageVariants: Variant[] = await this.variantWebService.getPageVariants(
      page.id,
    );
    return {
      invests,
      currentVariant,
      pageVariants,
      contactsSections,
    };
  }

  async getInvestitionByAlias(alias: string): Promise<InvestDynamicData> {
    const investData: Investition = await this.investitionRepository.findOne(
      {
        alias,
      },
      { relations: ['offices', 'variants'] },
    );
    if (!investData) {
      return null;
    }
    const contacts: WebContactElement[] = await this.contactWebService.getContactGroups(
      (investData.contacts as unknown) as ContactElement[],
    );
    return { investData, contacts };
  }
}
