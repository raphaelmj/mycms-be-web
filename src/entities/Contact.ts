import { Office } from './Office';
import { Department } from './Department';
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToMany,
  OneToMany,
  Column,
  ManyToOne,
} from 'typeorm';
import { Page } from './Page';
import { Variant } from './Variant';

@Entity()
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  position: string;

  @Column({ type: 'varchar', length: 80 })
  email: string;

  @Column({ type: 'text' })
  phones: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', nullable: true })
  ordering: number;

  @Column({ type: 'boolean', nullable: true })
  showForm: boolean;

  @Column({ type: 'boolean', nullable: true })
  status: boolean;

  @ManyToMany((type) => Variant, (variant) => variant.contacts)
  variants: Variant[];

  @OneToMany((type) => Page, (page) => page.contact, {})
  pages?: Page[];
}
