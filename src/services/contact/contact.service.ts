import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Contact } from '../../entities/Contact';
import { ContactDto } from '../../dto/contact.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { InvestitionService } from '../investition/investition.service';
import { DepartmentService } from '../department/department.service';
import { OfficeService } from '../office/office.service';
import { VariantService } from '../variant/variant.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private investitionService: InvestitionService,
    private departmentService: DepartmentService,
    private officeService: OfficeService,
    private variantService: VariantService,
  ) {}

  async all(relations: string[] = []): Promise<Contact[]> {
    return await this.contactRepository.find({ relations });
  }

  async getById(id: number): Promise<Contact> {
    return await this.contactRepository.findOne(id);
  }

  async update(contact: ContactDto): Promise<Contact> {
    await this.contactRepository.update(
      contact.id,
      <QueryDeepPartialEntity<Contact>>(<unknown>contact),
    );
    return await this.contactRepository.findOne(contact.id, {
      relations: ['variants', 'pages'],
    });
  }

  async create(contact: ContactDto): Promise<Contact> {
    const newContact: Contact = await this.contactRepository.create(
      <DeepPartial<Contact>>(<unknown>contact),
    );
    await newContact.save();
    return await this.contactRepository.findOne(newContact.id, {
      relations: ['variants', 'pages'],
    });
  }

  async delete(id: number) {
    await this.investitionService.removeAddedContact(id);
    await this.departmentService.removeAddedContact(id);
    await this.officeService.removeAddedContact(id);
    await this.variantService.removeAddedContact(id);
    return await this.contactRepository.delete(id);
  }
}
