import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PageViewType } from '../enums/page-view-type.enum';
import { Contact } from './Contact';
import { Office } from './Office';
import { Department } from './Department';
import { Category } from './Category';
import { Variant } from './Variant';
import { Article } from './Article';
import { Popup } from './Popup';

@Entity()
export class Page extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 200 })
  alias: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkTitle: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  path: string;

  @Column({
    type: 'enum',
    enum: [
      PageViewType.main,
      PageViewType.article,
      PageViewType.articles,
      PageViewType.doubleArticle,
      PageViewType.rodoArticle,
      PageViewType.aboutArticleMapsView,
      PageViewType.invests,
      PageViewType.contact,
      PageViewType.department,
      PageViewType.notices,
      PageViewType.blank,
    ],
    default: PageViewType.blank,
  })
  viewType: PageViewType;

  @Column({ type: 'text' })
  slides: string;

  @Column({ type: 'text' })
  config: string;

  @Column({ type: 'text' })
  pageColor: string;

  @Column({ type: 'text' })
  rightLinks: string;

  @Column({ type: 'int', nullable: true })
  ordering: number;

  @Column({ type: 'text' })
  leftPages: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  metaTitle: string;

  @Column({ type: 'text' })
  metaKeywords: string;

  @Column({ type: 'text' })
  metaDescription: string;

  @Column({ type: 'text' })
  contextMenuTop: string;

  @Column({ type: 'text' })
  contextMenuBottom: string;

  @ManyToOne((type) => Contact, (contact) => contact.pages, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  contact?: Contact;

  @ManyToOne((type) => Category, (category) => category.pages, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  category?: Category;

  @ManyToOne((type) => Article, (article) => article.pages, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  article?: Article;

  @ManyToOne((type) => Office, (office) => office.pages, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  office?: Office;

  @ManyToOne((type) => Department, (department) => department.pages, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  department?: Department;

  @OneToMany((type) => Variant, (variant) => variant.page, {})
  variants?: Variant[];

  @ManyToMany((type) => Department, (departament) => departament.pages)
  @JoinTable({ name: 'department_page' })
  departments: Department[];

  @ManyToMany((type) => Popup, (popup) => popup.pages)
  @JoinTable({ name: 'popup_page' })
  popups: Popup[];
}
