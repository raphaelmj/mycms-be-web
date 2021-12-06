import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from '../../../entities/Contact';
import { Repository } from 'typeorm';
import { Department } from '../../../entities/Department';
import { Office } from '../../../entities/Office';
import { ContactPageData } from '../../../interfaces/web/contact-page-data.interface';
import { DepartmentType } from '../../../enums/department-type.enum';
import { ContactElement } from '../../../interfaces/contact-element.interface';
import { WebContactElement } from '../../../interfaces/web/web-contact-element.interface';
import { map } from 'p-iteration';
import { PersonElement } from '../../../interfaces/person-element.interface';
import { WebPersonElement } from '../../../interfaces/web/web-person-element.interface';

@Injectable()
export class ContactWebService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Office)
    private officeRepository: Repository<Office>,
  ) {}

  async getContactGroups(
    contactElements: ContactElement[] = [],
  ): Promise<WebContactElement[]> {
    const webContactGroups: WebContactElement[] = [];
    await map(contactElements, async (c, i) => {
      webContactGroups[i] = {
        name: c.name,
        persons: await this.findContactGroupsPersons(c.persons),
      };
    });
    return webContactGroups;
  }

  async findContactGroupsPersons(
    personElements: PersonElement[],
  ): Promise<WebPersonElement[]> {
    const webPersonElements: WebPersonElement[] = [];
    await map(personElements, async (p, i) => {
      webPersonElements[i] = {
        customRole: p.customRole,
        showForm: p.showForm,
        data: await this.contactRepository.findOne(p.id),
      };
    });
    return webPersonElements;
  }
}
