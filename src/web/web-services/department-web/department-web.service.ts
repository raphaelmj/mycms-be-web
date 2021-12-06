import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { map } from 'p-iteration';
import { Department } from '../../../entities/Department';
import { ContactWebService } from '../contact-web/contact-web.service';
import { ContactElement } from '../../../interfaces/contact-element.interface';
import { OfficeData } from '../../../interfaces/web/office-data.interface';
import { OfficeWebService } from '../office-web/office-web.service';
import {
  DepartmentData,
  DepartmentDynamicData,
} from '../../../interfaces/web/data-view-pack.interface';
import { Page } from '../../../entities/Page';
import { ContactPageData } from '../../../interfaces/web/contact-page-data.interface';
import { Office } from '../../../entities/Office';
import { DepartmentType } from '../../../enums/department-type.enum';

@Injectable()
export class DepartmentWebService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Office)
    private officeRepository: Repository<Office>,
    private contactWebService: ContactWebService,
    private officeWebService: OfficeWebService,
  ) {}

  async getByMap(ids: number[]): Promise<Department[]> {
    const ents: Department[] = [];
    await map(ids, async (id, i) => {
      ents[i] = await this.departmentRepository.findOne(id);
    });
    return ents;
  }

  async getDepartmentDataByAlias(
    alias: string,
    onlyContact = true,
  ): Promise<DepartmentData> {
    const where = { alias };
    if (onlyContact) {
      where['showOnPage'] = true;
    }
    const department: Department = await this.departmentRepository.findOne({
      where: where,
    });
    if (!department) {
      return null;
    }
    return await this.getDepartmentData(department);
  }

  async getDepartmentDataById(id: number) {
    const department: Department = await this.departmentRepository.findOne(id);
    return await this.getDepartmentData(department);
  }

  async getDepartmentData(department: Department) {
    const contactGroups = await this.contactWebService.getContactGroups(
      <ContactElement[]>(<unknown>department.contactsSections),
    );
    const departmentOffices: OfficeData[] = await this.officeWebService.getOfficesFullDataByIds(
      <number[]>(<unknown>department.officesMap),
    );
    return { department, contactGroups, departmentOffices };
  }

  async findContactPageData(page: Page): Promise<ContactPageData> {
    const mainDepartment: Department = await this.findMainDepartment();
    const otherDepartments: Department[] = await this.findOtherDepartments();
    const mainOffice: Office = await this.officeRepository.findOne({
      main: true,
    });

    let mainDepartmentData: DepartmentData;
    if (mainDepartment) {
      mainDepartmentData = await this.getDepartmentDataByAlias(
        mainDepartment.alias,
      );
    }

    return {
      mainOffice,
      mainDepartmentData,
      otherDepartments,
    };
  }

  async findMainDepartment(): Promise<Department> {
    const department: Department = await this.departmentRepository.findOne({
      main: true,
    });
    return department;
  }

  async findOtherDepartments(): Promise<Department[]> {
    return await this.departmentRepository.find({
      where: {
        main: false,
        showOnPage: true,
      },
      order: {
        ordering: 'ASC',
      },
    });
  }

  async getDepartmentByViewType(viewType: DepartmentType): Promise<Department> {
    return await this.departmentRepository.findOne({ where: { viewType } });
  }
}
