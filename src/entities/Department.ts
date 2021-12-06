import { Office } from './Office';
import { Contact } from './Contact';
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToMany,
  JoinTable,
  Column,
  OneToMany,
} from 'typeorm';
import { Page } from './Page';
import { DepartmentType } from '../enums/department-type.enum';
import { Popup } from './Popup';

@Entity()
export class Department extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  alias: string;

  @Column({
    type: 'enum',
    enum: [
      DepartmentType.main,
      DepartmentType.commercial,
      DepartmentType.buyArea,
      DepartmentType.investManagment,
      DepartmentType.sellOfficeList,
      DepartmentType.contactsSections,
      DepartmentType.pressOffice,
    ],
    default: DepartmentType.contactsSections,
  })
  viewType: DepartmentType;

  @Column({ type: 'text' })
  params: string;

  @Column({ type: 'boolean', default: false })
  main: boolean;

  @ManyToMany((type) => Office, (office) => office.departments)
  @JoinTable({ name: 'department_office' })
  offices: Office[];

  @ManyToMany((type) => Page, (page) => page.departments)
  pages: Page[];

  @OneToMany((type) => Page, (page) => page.department, {})
  pagesOne?: Page[];

  @Column({ type: 'text' })
  contactsSections: string;

  @Column({ type: 'text' })
  officesMap: string;

  @Column({ type: 'int', nullable: true })
  ordering: number;

  @Column({ type: 'boolean', default: false })
  showOnPage: boolean;

  @Column({ type: 'varchar', length: 200, nullable: true })
  metaTitle: string;

  @Column({ type: 'text' })
  metaKeywords: string;

  @Column({ type: 'text' })
  metaDescription: string;

  @ManyToMany((type) => Popup, (popup) => popup.departments)
  @JoinTable({ name: 'popup_department' })
  popups: Popup[];
}
