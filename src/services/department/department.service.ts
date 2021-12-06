import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Department } from '../../entities/Department';
import { FieldUpdateDto } from '../../dto/field-update.dto';
import { DepartmentDto } from '../../dto/department.dto';
import * as slug from 'slug';
import { Office } from '../../entities/Office';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { map } from 'p-iteration';
import { ContactElement } from '../../interfaces/contact-element.interface';
import { IdsDto } from '../../dto/ids.dto';
import { UnpinDto } from '../../dto/Unpin.dto';
import { Variant } from '../../entities/Variant';
import { PinDto } from '../../dto/pin.dto';
import { Popup } from '../../entities/Popup';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Office)
    private officeRepository: Repository<Office>,
    @InjectRepository(Variant)
    private popupsRepository: Repository<Popup>,
  ) {}

  async all(relations: string[] = []): Promise<Department[]> {
    return await this.departmentRepository.find({
      relations,
      order: { ordering: 'ASC' },
    });
  }

  async updateField(body: FieldUpdateDto) {
    const update = {};
    update[body.field] = body.value;
    await this.departmentRepository.update(body.id, update);
    return await this.departmentRepository.findOne(body.id);
  }

  async setMain(id: string): Promise<Department> {
    await this.departmentRepository.update(
      { id: Not(Number(id)) },
      { main: false },
    );
    await this.departmentRepository.update(Number(id), { main: true });
    return await this.departmentRepository.findOne(Number(id));
  }

  async update(department: DepartmentDto) {
    const alias: string = slug(`${department.name}`, {
      lower: true,
    });
    const isAliasExits: boolean = await this.isAliasExits(
      alias,
      true,
      department.id,
    );
    if (isAliasExits) {
      await this.departmentRepository.update(
        department.id,
        <QueryDeepPartialEntity<Department>>(<unknown>department),
      );
      const createdObject: Department = await this.departmentRepository.findOne(
        department.id,
      );
      createdObject.alias = `${createdObject.alias}-${createdObject.id}`;
      const offices: Office[] = await this.officeRepository.findByIds(
        department.officesMap,
      );
      createdObject.offices = offices;
      await createdObject.save();
    } else {
      department.alias = alias;
      await this.departmentRepository.update(
        department.id,
        <QueryDeepPartialEntity<Department>>(<unknown>department),
      );
      const createdObject: Department = await this.departmentRepository.findOne(
        department.id,
      );
      const offices: Office[] = await this.officeRepository.findByIds(
        department.officesMap,
      );
      createdObject.offices = offices;
      await createdObject.save();
    }
    return await this.departmentRepository.findOne(department.id, {
      relations: ['offices'],
    });
  }

  async create(department: DepartmentDto) {
    const alias: string = slug(`${department.name}`, {
      lower: true,
    });
    const isAliasExits: boolean = await this.isAliasExits(alias, false);
    if (isAliasExits) {
      const createdObject: Department = await this.departmentRepository.create(
        <Department>(<unknown>department),
      );
      createdObject.alias = `${createdObject.alias}-${createdObject.id}`;
      const offices: Office[] = await this.officeRepository.findByIds(
        department.officesMap,
      );
      createdObject.offices = offices;
      await createdObject.save();
      department.id = createdObject.id;
    } else {
      department.alias = alias;
      const createdObject: Department = await this.departmentRepository.create(
        <Department>(<unknown>department),
      );
      const offices: Office[] = await this.officeRepository.findByIds(
        department.officesMap,
      );
      createdObject.offices = offices;
      await createdObject.save();
      department.id = createdObject.id;
    }
    return await this.departmentRepository.findOne(department.id, {
      relations: ['offices'],
    });
  }

  async isAliasExits(
    alias: string,
    except = false,
    id?: number,
  ): Promise<boolean> {
    if (except) {
      const c = await this.departmentRepository.count({
        where: { alias, id: Not(id) },
      });
      return c > 0;
    } else {
      const c = await this.departmentRepository.count({ where: { alias } });
      return c > 0;
    }
  }

  async removeAddedContact(id: number) {
    const departments: Department[] = await this.departmentRepository.find();
    await map(departments, async (element) => {
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
    return await this.departmentRepository.delete(id);
  }

  async updateOrder(ids: IdsDto) {
    await map(ids.ids, async (id, i) => {
      await this.departmentRepository.update(id, { ordering: i + 1 });
    });
    return await this.departmentRepository.find({
      order: { ordering: 'ASC' },
    });
  }

  async unpinPopup(unpinDto: UnpinDto): Promise<any> {
    const page: Department = await this.departmentRepository.findOne(
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
    const page: Department = await this.departmentRepository.findOne(
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
