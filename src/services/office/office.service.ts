import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Office } from '../../entities/Office';
import { FieldUpdateDto } from '../../dto/field-update.dto';
import * as slug from 'slug';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Department } from '../../entities/Department';
import { OfficeDto } from '../../dto/office.dto';
import { map } from 'p-iteration';
import { ContactElement } from '../../interfaces/contact-element.interface';

@Injectable()
export class OfficeService {
  constructor(
    @InjectRepository(Office)
    private officeRepository: Repository<Office>,
  ) {}

  async all(relations: string[] = []): Promise<Office[]> {
    return await this.officeRepository.find({ relations });
  }

  async updateField(body: FieldUpdateDto) {
    const update = {};
    update[body.field] = body.value;
    await this.officeRepository.update(body.id, update);
    return await this.officeRepository.findOne(body.id);
  }

  async setMain(id: string): Promise<Office> {
    await this.officeRepository.update(
      { id: Not(Number(id)) },
      { main: false },
    );
    await this.officeRepository.update(Number(id), { main: true });
    return await this.officeRepository.findOne(Number(id));
  }

  async update(office: OfficeDto) {
    const alias: string = slug(`${office.title}`, {
      lower: true,
    });
    const isAliasExits: boolean = await this.isAliasExits(
      alias,
      true,
      office.id,
    );
    if (isAliasExits) {
      await this.officeRepository.update(
        office.id,
        <QueryDeepPartialEntity<Department>>(<unknown>office),
      );
      const createdObject: Office = await this.officeRepository.findOne(
        office.id,
      );
      createdObject.alias = `${createdObject.alias}-${createdObject.id}`;
      await createdObject.save();
    } else {
      office.alias = alias;
      await this.officeRepository.update(
        office.id,
        <QueryDeepPartialEntity<Office>>(<unknown>office),
      );
    }
    return await this.officeRepository.findOne(office.id, {
      relations: ['departments', 'investitions', 'pages', 'variant'],
    });
  }

  async create(office: OfficeDto) {
    const alias: string = slug(`${office.title}`, {
      lower: true,
    });
    const isAliasExits: boolean = await this.isAliasExits(alias, false);
    if (isAliasExits) {
      const createdObject: Office = await this.officeRepository.create(
        <Office>(<unknown>office),
      );
      createdObject.alias = `${createdObject.alias}-${createdObject.id}`;
      await createdObject.save();
      office.id = createdObject.id;
    } else {
      office.alias = alias;
      const createdObject: Office = await this.officeRepository.create(
        <Office>(<unknown>office),
      );
      console.log(office);
      await createdObject.save();
      office.id = createdObject.id;
    }
    return await this.officeRepository.findOne(office.id, {
      relations: ['departments', 'investitions', 'pages', 'variant'],
    });
  }

  async isAliasExits(
    alias: string,
    except = false,
    id?: number,
  ): Promise<boolean> {
    if (except) {
      const c = await this.officeRepository.count({
        where: { alias, id: Not(id) },
      });
      return c > 0;
    } else {
      const c = await this.officeRepository.count({ where: { alias } });
      return c > 0;
    }
  }

  async removeAddedContact(id: number) {
    const offices: Office[] = await this.officeRepository.find();
    await map(offices, async (element) => {
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

  async delete(id: number) {
    return await this.officeRepository.delete(id);
  }
}
