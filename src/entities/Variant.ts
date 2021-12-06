import { Investition } from './Investition';
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Page } from './Page';
import { Office } from './Office';
import { Contact } from './Contact';
import { Popup } from './Popup';

@Entity()
export class Variant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  alias: string;

  @Column({ type: 'varchar', length: 500, unique: true, nullable: true })
  path: string;

  @Column({ type: 'varchar', length: 500 })
  linkName: string;

  @Column({ type: 'text' })
  color: string;

  @Column({ type: 'text' })
  leftDescription: string;

  @Column({ type: 'text' })
  rightDescription: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  banner: string;

  @Column({ type: 'text' })
  params: string;

  @Column({ type: 'int', nullable: true })
  ordering: number;

  @Column({ type: 'text', nullable: true })
  link: string;

  @Column({ type: 'text' })
  contactsSections: string;

  @Column({ type: 'text' })
  investitionsMap: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  metaTitle: string;

  @Column({ type: 'text' })
  metaKeywords: string;

  @Column({ type: 'text' })
  metaDescription: string;

  @OneToMany((type) => Variant, (variant) => variant.variant, {})
  variants?: Variant[];

  @OneToMany((type) => Office, (office) => office.variant, {})
  offices?: Office[];

  @ManyToMany((type) => Contact, (contact) => contact.variants)
  @JoinTable({ name: 'variant_contact' })
  contacts: Contact[];

  @ManyToOne((type) => Variant, (variant) => variant.variant, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  variant?: Variant;

  @ManyToMany((type) => Investition, (investition) => investition.variants)
  @JoinTable({ name: 'variant_investition' })
  investitions: Investition[];

  @ManyToOne((type) => Page, (page) => page.variants, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  page?: Page;

  @ManyToMany((type) => Popup, (popup) => popup.variants)
  @JoinTable({ name: 'popup_variant' })
  popups: Popup[];
}
