import { Department } from '../../entities/Department';
import { Office } from '../../entities/Office';
import { DepartmentData } from './data-view-pack.interface';

export interface ContactPageData {
  mainOffice: Office;
  mainDepartmentData?: DepartmentData;
  otherDepartments: Department[];
}
