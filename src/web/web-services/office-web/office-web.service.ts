import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Office } from '../../../entities/Office';
import { map } from 'p-iteration';
import { ContactWebService } from '../contact-web/contact-web.service';
import { WebContactElement } from '../../../interfaces/web/web-contact-element.interface';
import { OfficeData } from '../../../interfaces/web/office-data.interface';
import { ContactElement } from '../../../interfaces/contact-element.interface';

@Injectable()
export class OfficeWebService {
  constructor(
    @InjectRepository(Office)
    private officeRepository: Repository<Office>,
    private contactWebService: ContactWebService,
  ) {}

  async getOfficesByIds(ids: number[]) {
    const offices: Office[] = [];
    await map(ids, async (id, i) => {
      offices[i] = await this.officeRepository.findOne(id);
    });
    return offices;
  }

  async getMainOffice(): Promise<Office> {
    return await this.officeRepository.findOne({ main: true });
  }

  async getOfficesFullDataByIds(ids: number[]) {
    const officesData: OfficeData[] = [];
    await map(ids, async (id, i) => {
      officesData[i] = {
        data: await this.officeRepository.findOne(id),
        contactGroups: [],
      };
    });

    await map(officesData, async (dataElement, i) => {
      officesData[
        i
      ].contactGroups = await this.contactWebService.getContactGroups(
        <ContactElement[]>(<unknown>dataElement.data.contactsSections),
      );
    });

    return officesData;
  }
}
