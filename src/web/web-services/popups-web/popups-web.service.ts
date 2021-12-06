import { Injectable } from '@nestjs/common';
import { PageData } from '../../../interfaces/web/page-data.interface';
import { Popup } from '../../../entities/Popup';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DynamicView } from '../../../enums/dynamic-view.enum';
import { Variant } from '../../../entities/Variant';
import { Department } from '../../../entities/Department';
import { Investition } from '../../../entities/Investition';

@Injectable()
export class PopupsWebService {
  constructor(
    @InjectRepository(Popup)
    private popupRepository: Repository<Popup>,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Investition)
    private investitionRepository: Repository<Investition>,
  ) {}

  async findPopup(pageData: PageData): Promise<Popup | null> {
    let popup: Popup | null = await this.popupRepository.findOne({
      where: {
        showEveryWhere: true,
        status: true,
      },
    });
    if (popup) {
      return popup;
    }
    if (pageData.data.isPage) {
      if (pageData.page.popups.length > 0) {
        const activePopups = pageData.page.popups.filter((pp) => {
          return pp.status;
        });
        popup = activePopups[0];
      }
    } else {
      popup = await this.findPopupIfDynamicSite(pageData);
    }
    return popup;
  }

  async findPopupIfDynamicSite(pageData: PageData): Promise<Popup | null> {
    let popup: Popup | null = null;
    switch (pageData.data.view) {
      case DynamicView.article:
        popup = null;
        break;
      case DynamicView.notice:
        popup = null;
        break;
      case DynamicView.variant:
        const variant: Variant = await this.variantRepository.findOne({
          where: {
            id: pageData.data.dynamicData.invests.currentVariant.id,
          },
          relations: ['popups'],
        });
        const activeVP: Popup[] = variant.popups.filter((pp) => pp.status);
        if (activeVP.length > 0) {
          popup = activeVP[0];
        }
        break;
      case DynamicView.department:
        const department: Department = await this.departmentRepository.findOne({
          where: {
            id: pageData.data.dynamicData.departmentData.data.department.id,
          },
          relations: ['popups'],
        });
        const activeDP: Popup[] = department.popups.filter((pp) => pp.status);
        if (activeDP.length > 0) {
          popup = activeDP[0];
        }
        break;
      case DynamicView.invest:
        const investition: Investition = await this.investitionRepository.findOne(
          {
            where: {
              id: pageData.data.dynamicData.invest.investData.id,
            },
            relations: ['popups'],
          },
        );
        const activeIP: Popup[] = investition.popups.filter((pp) => pp.status);
        if (activeIP.length > 0) {
          popup = activeIP[0];
        }
        break;
    }
    return popup;
  }
}
