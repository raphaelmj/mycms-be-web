import { Contact } from './Contact';
import { Department } from './Department';
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToMany,
  JoinTable,
  OneToMany,
  Column,
  ManyToOne,
} from 'typeorm';
import { Page } from './Page';
import { Variant } from './Variant';
import { Investition } from './Investition';

@Entity()
export class Office extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  alias: string;

  @Column({ type: 'varchar', length: 255 })
  subTitle: string;

  @Column({ type: 'text' })
  phones: string;

  @Column({ type: 'text' })
  emails: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'text' })
  hours: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 7, scale: 2, nullable: true })
  mapLat: number;

  @Column({ type: 'decimal', precision: 7, scale: 2, nullable: true })
  mapLng: number;

  @Column({ type: 'text' })
  mapFiles: string;

  @Column({ type: 'text' })
  mainMapFiles: string;

  @Column({ type: 'text' })
  contactsSections: string;

  @Column({ type: 'boolean', default: false })
  main: boolean;

  @Column({ type: 'int', nullable: true })
  ordering: number;

  @ManyToMany((type) => Department, (department) => department.offices)
  departments: Department[];

  @ManyToMany((type) => Investition, (investition) => investition.offices)
  investitions: Investition[];

  @OneToMany((type) => Page, (page) => page.office, {})
  pages?: Page[];

  @ManyToOne((type) => Variant, (variant) => variant.variant, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  variant?: Variant;
}
