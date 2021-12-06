import { Page } from './Page';
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  ManyToMany,
} from 'typeorm';
import { Variant } from './Variant';
import { Department } from './Department';
import { Investition } from './Investition';

@Entity()
export class Popup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  name: string;

  @Column({ type: 'text', nullable: true })
  popupData: any;

  @Column({ type: 'boolean', default: false })
  showEveryWhere: boolean;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @ManyToMany((type) => Page, (page) => page.popups)
  pages: Page[];

  @ManyToMany((type) => Variant, (variant) => variant.popups)
  variants: Variant[];

  @ManyToMany((type) => Department, (department) => department.popups)
  departments: Department[];

  @ManyToMany(
    (type) => Investition,
    (investition: Investition) => investition.popups,
  )
  investitions: Investition[];
}
